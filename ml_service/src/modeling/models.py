import torch
import torch.nn as nn
from transformers import AutoModel, AutoConfig

from config import main_config # Для доступа к MODEL_CHUNK_SIZE, если нужно

class ContractVulnerabilityClassifier(nn.Module):
    def __init__(self, 
                 base_model_name: str = "microsoft/codebert-base", 
                 num_labels: int = 7, # Количество типов уязвимостей
                 dropout_rate: float = 0.1):
        super().__init__()
        
        self.num_labels = num_labels
        
        # Загружаем конфигурацию предобученной модели, чтобы получить размер скрытого состояния
        config = AutoConfig.from_pretrained(base_model_name)
        
        # Загружаем предобученную модель (без классификационной "головы")
        # Мы будем использовать ее для получения эмбеддингов чанков
        self.base_model = AutoModel.from_pretrained(base_model_name)
        
        # Размер выхода предобученной модели (размер эмбеддинга CLS токена)
        self.hidden_size = config.hidden_size 
        
        # Слой Dropout для регуляризации
        self.dropout = nn.Dropout(dropout_rate)
        
        # Классификационный слой
        # На вход подается эмбеддинг CLS токена (или другое агрегированное представление чанка)
        self.classifier = nn.Linear(self.hidden_size, num_labels)
        
        print(f"Model initialized with base: {base_model_name}")
        print(f"Hidden size: {self.hidden_size}")
        print(f"Number of labels: {num_labels}")

    def forward(self, input_ids: torch.Tensor, attention_mask: torch.Tensor) -> torch.Tensor:
        """
        Args:
            input_ids (torch.Tensor): Tensor of shape (batch_size, chunk_size)
            attention_mask (torch.Tensor): Tensor of shape (batch_size, chunk_size)
        
        Returns:
            torch.Tensor: Logits for each label, shape (batch_size, num_labels)
        """
        # Получаем выходы от базовой модели
        # outputs.last_hidden_state будет иметь размерность (batch_size, chunk_size, hidden_size)
        # outputs.pooler_output (если есть) обычно является представлением CLS токена,
        # прошедшим через слой Linear и Tanh. Для многих моделей (как RoBERTa/CodeBERT)
        # рекомендуется брать last_hidden_state[:, 0] (эмбеддинг CLS токена) напрямую.
        outputs = self.base_model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            return_dict=True # Возвращать выходы в виде словаря (или ModelOutput объекта)
        )
        
        # Используем представление CLS токена (первый токен в последовательности)
        # Его размерность (batch_size, hidden_size)
        cls_representation = outputs.last_hidden_state[:, 0, :] 
        # Альтернатива: outputs.pooler_output, но для RoBERTa-based моделей CLS из last_hidden_state часто лучше.
        
        # Применяем Dropout
        pooled_output = self.dropout(cls_representation)
        
        # Подаем на классификатор
        logits = self.classifier(pooled_output)
        
        return logits

if __name__ == '__main__':
    # Пример использования и тестирования модели
    
    # Определяем количество меток на основе VULNERABILITY_COUNT_COLUMNS
    # Это более надежно, чем хардкодить 7
    num_vuln_types = len(main_config.VULNERABILITY_COUNT_COLUMNS)
    print(f"Number of vulnerability types from config: {num_vuln_types}")

    model = ContractVulnerabilityClassifier(num_labels=num_vuln_types)
    
    # Создаем фиктивный батч для проверки
    batch_size = 4
    chunk_len = main_config.MODEL_CHUNK_SIZE # 512
    
    dummy_input_ids = torch.randint(0, model.base_model.config.vocab_size, (batch_size, chunk_len))
    dummy_attention_mask = torch.ones((batch_size, chunk_len), dtype=torch.long)
    
    print(f"\nDummy input_ids shape: {dummy_input_ids.shape}")
    print(f"Dummy attention_mask shape: {dummy_attention_mask.shape}")
    
    # Переводим модель в режим eval для тестирования прямого прохода (если есть dropout/batchnorm)
    model.eval() 
    with torch.no_grad(): # Не считаем градиенты
        logits_output = model(dummy_input_ids, dummy_attention_mask)
    
    print(f"\nLogits output shape: {logits_output.shape}") # Ожидаем (batch_size, num_labels)
    print(f"Sample logits output (first item): {logits_output[0]}")

    # Проверка на GPU, если доступен
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"\nTesting on device: {device}")
    model.to(device)
    dummy_input_ids = dummy_input_ids.to(device)
    dummy_attention_mask = dummy_attention_mask.to(device)

    with torch.no_grad():
        logits_output_device = model(dummy_input_ids, dummy_attention_mask)
    print(f"Logits output shape on {device}: {logits_output_device.shape}") 