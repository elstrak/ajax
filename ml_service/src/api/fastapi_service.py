import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import torch
import os
import sys
import re
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from config import main_config
from src.modeling.models import ContractVulnerabilityClassifier
from src.feature_engineering.tokenization import get_tokenizer, tokenize_and_chunk_code

MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../models/vuln_classifier_microsoft_codebert-base_chunks_best.pt')

# Маппинг: label -> (name, description, severity, category, recommendation)
VULN_INFO = [
    {
        'name': 'Reentrancy',
        'description': 'Контракт изменяет состояние после внешнего вызова, что позволяет атакующему повторно войти в функцию.',
        'severity': 'critical',
        'category': 'Security',
        'recommendation': 'Используйте шаблон Checks-Effects-Interactions и модификатор reentrancy guard.'
    },
    {
        'name': 'Unchecked Low-level Calls',
        'description': 'Внешний вызов (call, delegatecall, send, transfer) не проверяется на успешность.',
        'severity': 'high',
        'category': 'Security',
        'recommendation': 'Проверяйте возвращаемое значение внешних вызовов и обрабатывайте ошибки.'
    },
    {
        'name': 'Arithmetic',
        'description': 'Возможны переполнение или недополнение при арифметических операциях.',
        'severity': 'medium',
        'category': 'Arithmetic',
        'recommendation': 'Используйте SafeMath или встроенные проверки overflow/underflow.'
    },
    {
        'name': 'Other',
        'description': 'Прочие уязвимости, не попавшие в основные категории.',
        'severity': 'low',
        'category': 'Other',
        'recommendation': 'Проверьте логику контракта на предмет нестандартных уязвимостей.'
    },
    {
        'name': 'Access Control',
        'description': 'Недостаточная проверка прав доступа к функциям или переменным.',
        'severity': 'high',
        'category': 'Access Control',
        'recommendation': 'Используйте модификаторы доступа (onlyOwner, etc.) и проверяйте права.'
    },
    {
        'name': 'Denial of Service',
        'description': 'Контракт может быть заблокирован из-за ошибок или особенностей логики.',
        'severity': 'high',
        'category': 'DoS',
        'recommendation': 'Проверяйте потенциальные точки отказа и избегайте циклов с внешними вызовами.'
    },
    {
        'name': 'Time Manipulation',
        'description': 'Использование блокчейн-времени (block.timestamp, now) может быть небезопасно.',
        'severity': 'medium',
        'category': 'Time',
        'recommendation': 'Не используйте время блокчейна для критических решений.'
    },
]

# Паттерны для поиска строк уязвимостей

class AnalyzeRequest(BaseModel):
    code: str

class Vulnerability(BaseModel):
    name: str
    description: str
    severity: str
    category: str
    recommendation: Optional[str]

class AnalyzeResponse(BaseModel):
    vulnerabilities: List[Vulnerability]

app = FastAPI(title="Vulnerability Classifier API")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Загрузка модели и токенизатора
try:
    model = ContractVulnerabilityClassifier(
        base_model_name="microsoft/codebert-base",
        num_labels=len(VULN_INFO)
    )
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model.to(device)
    model.eval()
    tokenizer = get_tokenizer("microsoft/codebert-base")
except Exception as e:
    print(f"Ошибка загрузки модели или токенизатора: {e}")
    model = None
    tokenizer = None

@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_code(request: AnalyzeRequest):
    code = request.code
    if not code or not isinstance(code, str) or len(code) < 5:
        raise HTTPException(status_code=400, detail="Некорректный код для анализа.")
    if model is None or tokenizer is None:
        raise HTTPException(status_code=500, detail="Модель или токенизатор не загружены.")
    try:
        # Токенизация и чанкинг
        chunks = tokenize_and_chunk_code(
            code,
            tokenizer,
            max_total_tokens=main_config.MAX_TOTAL_TOKENS,
            chunk_size=main_config.MODEL_CHUNK_SIZE,
            overlap=main_config.CHUNK_OVERLAP
        )
        if not chunks:
            return {"vulnerabilities": []}
        input_ids = torch.stack([c['input_ids'] for c in chunks]).to(device)
        attention_mask = torch.stack([c['attention_mask'] for c in chunks]).to(device)
        with torch.no_grad():
            logits = model(input_ids, attention_mask)  # (num_chunks, num_labels)
            probs = torch.sigmoid(logits).cpu().numpy()  # Вероятности для каждого класса
        threshold = 0.5
        found = (probs > threshold).max(axis=0)  # (num_labels,)
        vulnerabilities = []
        for idx, present in enumerate(found):
            if present:
                vuln = VULN_INFO[idx].copy()
                vulnerabilities.append(vuln)
        return {"vulnerabilities": vulnerabilities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка анализа: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 