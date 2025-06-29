import torch
import torch.nn as nn
from torch.optim import AdamW
from torch.utils.data import DataLoader
from sklearn.metrics import precision_recall_fscore_support, accuracy_score, roc_auc_score
import numpy as np
from tqdm.auto import tqdm # Для красивых progress bar
import mlflow
import mlflow.pytorch # Для автоматического логирования моделей PyTorch
import os
from typing import Dict, List, Tuple, Any

from config import main_config
from src.modeling.models import ContractVulnerabilityClassifier # Наша модель
# dataset.py нам здесь напрямую не нужен, так как DataLoader будет передан в train_model

# Определение устройства (GPU или CPU)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {DEVICE}")

def calculate_metrics(preds: np.ndarray, labels: np.ndarray, threshold: float = 0.5) -> Dict[str, Any]:
    """
    Рассчитывает метрики для multi-label классификации.
    Предсказания (preds) - это логиты или вероятности.
    Labels - бинарные метки.
    """
    # Преобразуем логиты/вероятности в бинарные предсказания с использованием порога
    binary_preds = (preds > threshold).astype(int)
    
    # Метрики для каждого класса (precision, recall, f1, support)
    # average=None вернет метрики для каждого класса отдельно
    # average='micro', 'macro', 'weighted' для усредненных метрик
    # zero_division=0 чтобы избежать предупреждений, если какой-то класс не был предсказан или не было истинных меток
    
    precision_micro, recall_micro, f1_micro, _ = precision_recall_fscore_support(
        labels, binary_preds, average='micro', zero_division=0
    )
    precision_macro, recall_macro, f1_macro, _ = precision_recall_fscore_support(
        labels, binary_preds, average='macro', zero_division=0
    )
    accuracy = accuracy_score(labels, binary_preds) # Это exact match ratio

    metrics = {
        "accuracy_exact_match": accuracy,
        "f1_micro": f1_micro,
        "precision_micro": precision_micro,
        "recall_micro": recall_micro,
        "f1_macro": f1_macro,
        "precision_macro": precision_macro,
        "recall_macro": recall_macro,
    }

    # Попробуем рассчитать ROC AUC, если это возможно и осмысленно
    # Для ROC AUC нужны вероятности (preds), а не binary_preds
    # И он обычно рассчитывается для каждого класса отдельно в multi-label
    try:
        # Проверим, что у нас есть вариативность в метках и предсказаниях для каждого класса
        # roc_auc_score может выдать ошибку, если в каком-то классе все метки или предсказания одинаковы
        roc_auc_scores_per_class = []
        valid_classes_for_roc_auc = 0
        for i in range(labels.shape[1]): # Для каждого класса/лейбла
            if len(np.unique(labels[:, i])) > 1 and len(np.unique(preds[:, i])) > 1 :
                 # ROC AUC score требует, чтобы для каждого класса было как минимум два уникальных значения (0 и 1) в истинных метках
                 # И чтобы вероятности предсказаний тоже имели вариативность
                try:
                    class_roc_auc = roc_auc_score(labels[:, i], preds[:, i])
                    roc_auc_scores_per_class.append(class_roc_auc)
                    valid_classes_for_roc_auc +=1
                except ValueError: # Может возникнуть, если класс содержит только одно значение
                    pass # Пропускаем этот класс для ROC AUC
        
        if valid_classes_for_roc_auc > 0:
            metrics["roc_auc_macro"] = np.mean(roc_auc_scores_per_class) if roc_auc_scores_per_class else 0.0
        else:
            metrics["roc_auc_macro"] = 0.0 # Если ни для одного класса не удалось посчитать
            
    except Exception as e:
        print(f"Could not calculate ROC AUC: {e}")
        metrics["roc_auc_macro"] = 0.0
        
    return metrics

def train_epoch(
    model: ContractVulnerabilityClassifier,
    dataloader: DataLoader,
    optimizer: torch.optim.Optimizer,
    criterion: nn.Module,
    device: torch.device,
    epoch_num: int,
    num_epochs: int
) -> Tuple[float, Dict[str, Any]]:
    """Проводит одну эпоху обучения."""
    model.train()  # Переводим модель в режим обучения
    total_loss = 0.0
    all_preds = []
    all_labels = []
    
    progress_bar = tqdm(dataloader, desc=f"Epoch {epoch_num+1}/{num_epochs} [Training]", leave=False)
    
    for batch_idx, batch in enumerate(progress_bar):
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = batch['labels'].to(device)
        
        optimizer.zero_grad()  # Обнуляем градиенты
        
        logits = model(input_ids, attention_mask)  # Прямой проход
        loss = criterion(logits, labels)  # Рассчитываем потери
        
        loss.backward()  # Обратный проход (вычисление градиентов)
        optimizer.step()  # Обновляем веса модели
        
        total_loss += loss.item()
        
        # Сохраняем предсказания и метки для расчета метрик в конце эпохи
        # Переводим на CPU и в NumPy для sklearn.metrics
        # Используем sigmoid для получения вероятностей из логитов
        all_preds.append(torch.sigmoid(logits).detach().cpu().numpy())
        all_labels.append(labels.detach().cpu().numpy())

        if batch_idx % 50 == 0: # Логируем промежуточный loss
             progress_bar.set_postfix({'loss': f'{loss.item():.4f}'})
             
    avg_loss = total_loss / len(dataloader)
    
    # Объединяем предсказания и метки со всех батчей
    all_preds = np.concatenate(all_preds, axis=0)
    all_labels = np.concatenate(all_labels, axis=0)
    
    epoch_metrics = calculate_metrics(all_preds, all_labels)
    
    return avg_loss, epoch_metrics

def evaluate_epoch(
    model: ContractVulnerabilityClassifier,
    dataloader: DataLoader,
    criterion: nn.Module,
    device: torch.device,
    epoch_num: int, # Для логирования, если нужно
    num_epochs: int
) -> Tuple[float, Dict[str, Any]]:
    """Проводит одну эпоху оценки (валидации/тестирования)."""
    model.eval()  # Переводим модель в режим оценки
    total_loss = 0.0
    all_preds = []
    all_labels = []
    
    progress_bar = tqdm(dataloader, desc=f"Epoch {epoch_num+1}/{num_epochs} [Evaluating]", leave=False)
    
    with torch.no_grad():  # Отключаем вычисление градиентов
        for batch in progress_bar:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)
            
            logits = model(input_ids, attention_mask)
            loss = criterion(logits, labels)
            
            total_loss += loss.item()
            all_preds.append(torch.sigmoid(logits).cpu().numpy())
            all_labels.append(labels.cpu().numpy())
            
    avg_loss = total_loss / len(dataloader)
    all_preds = np.concatenate(all_preds, axis=0)
    all_labels = np.concatenate(all_labels, axis=0)
    
    epoch_metrics = calculate_metrics(all_preds, all_labels)
    
    return avg_loss, epoch_metrics

def train_model(
    model: ContractVulnerabilityClassifier,
    train_dataloader: DataLoader,
    val_dataloader: DataLoader, # Может быть тестовым DataLoader, если нет отдельного валидационного
    num_epochs: int = 10,
    learning_rate: float = 1e-5, # Типичное значение для дообучения трансформеров
    model_save_path: str = None, # Путь для сохранения лучшей модели
    mlflow_experiment_name: str = main_config.EXPERIMENT_NAME
) -> ContractVulnerabilityClassifier:
    """Основная функция для обучения модели."""
    
    mlflow.set_tracking_uri(main_config.MLFLOW_TRACKING_URI)
    mlflow.set_experiment(mlflow_experiment_name)
    
    with mlflow.start_run() as run:
        print(f"MLflow Run ID: {run.info.run_id}")
        mlflow.log_param("base_model_name", model.base_model.name_or_path if hasattr(model.base_model, 'name_or_path') else "custom")
        mlflow.log_param("num_epochs", num_epochs)
        mlflow.log_param("learning_rate", learning_rate)
        mlflow.log_param("batch_size", train_dataloader.batch_size)
        mlflow.log_param("train_dataset_size", len(train_dataloader.dataset))
        mlflow.log_param("val_dataset_size", len(val_dataloader.dataset))
        mlflow.log_param("device", str(DEVICE))
        # Логируем параметры чанкинга
        mlflow.log_param("max_total_tokens", main_config.MAX_TOTAL_TOKENS)
        mlflow.log_param("model_chunk_size", main_config.MODEL_CHUNK_SIZE)
        mlflow.log_param("chunk_overlap", main_config.CHUNK_OVERLAP)

        model.to(DEVICE)
        
        # Функция потерь: BCEWithLogitsLoss подходит для multi-label классификации,
        # так как она применяет Sigmoid к логитам и затем BCE Loss.
        # Она также более численно стабильна, чем Sigmoid + BCELoss по отдельности.
        criterion = nn.BCEWithLogitsLoss()
        
        optimizer = AdamW(model.parameters(), lr=learning_rate)
        
        best_val_f1_macro = -1.0 # Отслеживаем лучшую F1-macro на валидации
        
        print(f"\nStarting training for {num_epochs} epochs...")
        
        for epoch in range(num_epochs):
            print(f"\n--- Epoch {epoch+1}/{num_epochs} ---")
            
            train_loss, train_metrics = train_epoch(
                model, train_dataloader, optimizer, criterion, DEVICE, epoch, num_epochs
            )
            print(f"Train Loss: {train_loss:.4f}")
            for metric_name, metric_val in train_metrics.items():
                print(f"  Train {metric_name}: {metric_val:.4f}")
                mlflow.log_metric(f"train_{metric_name}", metric_val, step=epoch)
            mlflow.log_metric("train_loss", train_loss, step=epoch)
            
            val_loss, val_metrics = evaluate_epoch(
                model, val_dataloader, criterion, DEVICE, epoch, num_epochs
            )
            print(f"Validation Loss: {val_loss:.4f}")
            for metric_name, metric_val in val_metrics.items():
                print(f"  Validation {metric_name}: {metric_val:.4f}")
                mlflow.log_metric(f"val_{metric_name}", metric_val, step=epoch)
            mlflow.log_metric("val_loss", val_loss, step=epoch)
            
            # Сохраняем модель, если она показала лучший результат на валидации
            current_val_f1_macro = val_metrics.get("f1_macro", -1.0)
            if current_val_f1_macro > best_val_f1_macro:
                best_val_f1_macro = current_val_f1_macro
                print(f"New best validation F1-macro: {best_val_f1_macro:.4f}. Saving model...")
                if model_save_path:
                    # Убедимся, что директория существует
                    save_dir = os.path.dirname(model_save_path)
                    if save_dir and not os.path.exists(save_dir):
                        os.makedirs(save_dir, exist_ok=True)
                    torch.save(model.state_dict(), model_save_path)
                    mlflow.log_artifact(model_save_path, artifact_path="best_model")
                else: # Если путь не указан, сохраняем в артефакты MLflow
                    mlflow.pytorch.log_model(model, artifact_path="best_model_mlflow_native")
                mlflow.log_metric("best_val_f1_macro", best_val_f1_macro, step=epoch)

        print("\nTraining finished.")
        # Логируем финальную лучшую модель еще раз, если она не была сохранена в артефакты на каждой эпохе
        if model_save_path and os.path.exists(model_save_path):
             pass # Уже сохранено и залогировано как артефакт
        elif not model_save_path: # Если сохраняли только в mlflow native
             print("Final best model was logged via mlflow.pytorch.log_model.")

    return model # Возвращаем обученную (последнюю или лучшую) модель

if __name__ == '__main__':
    # Это заглушка для тестирования. Реальный запуск будет из ноутбука или отдельного скрипта.
    # Для полноценного теста здесь нужно создать dummy DataLoader'ы и модель.
    print("Trainer script. To run training, please use a dedicated script or notebook.")
    print(f"Device being used: {DEVICE}")

    # Пример быстрой проверки:
    # 1. Нужны dummy DataLoader'ы (см. dataset.py, как их создать)
    # 2. Нужен экземпляр модели
    
    # num_vuln_types = len(main_config.VULNERABILITY_COUNT_COLUMNS)
    # test_model = ContractVulnerabilityClassifier(num_labels=num_vuln_types)
    
    # Создадим очень маленькие фиктивные DataLoader'ы для проверки синтаксиса
    # В реальном тесте нужно использовать ContractChunkDataset с фиктивными данными
    
    # class DummyDataset(torch.utils.data.Dataset):
    #     def __init__(self, num_samples, chunk_size, num_labels_ds):
    #         self.num_samples = num_samples
    #         self.chunk_size = chunk_size
    #         self.num_labels_ds = num_labels_ds
    #     def __len__(self): return self.num_samples
    #     def __getitem__(self, idx):
    #         return {
    #             'input_ids': torch.randint(0, 1000, (self.chunk_size,)),
    #             'attention_mask': torch.ones((self.chunk_size,), dtype=torch.long),
    #             'labels': torch.randint(0, 2, (self.num_labels_ds,)).float()
    #         }

    # print("\n--- Running a quick syntax check for train_model ---")
    # dummy_train_ds = DummyDataset(16, main_config.MODEL_CHUNK_SIZE, num_vuln_types)
    # dummy_val_ds = DummyDataset(8, main_config.MODEL_CHUNK_SIZE, num_vuln_types)
    # dummy_train_dl = DataLoader(dummy_train_ds, batch_size=4)
    # dummy_val_dl = DataLoader(dummy_val_ds, batch_size=4)
    
    # # Путь для сохранения тестовой модели
    # test_model_save_dir = main_config.MODEL_DIR / "test_trainer_model"
    # test_model_save_dir.mkdir(parents=True, exist_ok=True)
    # test_model_save_path = test_model_save_dir / "test_model.pt"

    # try:
    #     train_model(
    #         test_model, 
    #         dummy_train_dl, 
    #         dummy_val_dl, 
    #         num_epochs=1, 
    #         learning_rate=1e-5,
    #         model_save_path=str(test_model_save_path),
    #         mlflow_experiment_name="Test Trainer Experiment"
    #     )
    #     print("Quick syntax check for train_model completed successfully.")
    # except Exception as e_train:
    #     print(f"Error during quick syntax check for train_model: {e_train}")
    #     import traceback
    #     traceback.print_exc() 