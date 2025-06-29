import torch
from torch.utils.data import Dataset
from typing import List, Dict, Any
import os

from config import main_config # Убедимся, что main_config доступен

class ContractChunkDataset(Dataset):
    """
    PyTorch Dataset для чанков смарт-контрактов.
    Каждый элемент датасета представляет один чанк.
    """
    def __init__(self, 
                 chunk_list_path: str, 
                 labels_path: str,
                 original_indices_path: str = None):
        """
        Args:
            chunk_list_path (str): Путь к файлу .pt, содержащему список словарей чанков.
                                   Каждый словарь: {'input_ids': tensor, 'attention_mask': tensor}.
            labels_path (str): Путь к файлу .pt, содержащему тензор меток для каждого чанка.
            original_indices_path (str, optional): Путь к файлу .pt с исходными индексами.
                                                    Может использоваться для группировки или отладки.
        """
        super().__init__()
        
        print(f"Loading chunk list from: {chunk_list_path}")
        self.chunk_list: List[Dict[str, torch.Tensor]] = torch.load(chunk_list_path)
        
        print(f"Loading labels from: {labels_path}")
        self.labels: torch.Tensor = torch.load(labels_path)

        self.original_indices = None
        if original_indices_path and os.path.exists(original_indices_path):
            print(f"Loading original indices from: {original_indices_path}")
            self.original_indices: List[int] = torch.load(original_indices_path)
            if len(self.original_indices) != len(self.chunk_list):
                print(f"Warning: Length of original_indices ({len(self.original_indices)}) "
                      f"does not match length of chunk_list ({len(self.chunk_list)}).")
        
        if len(self.chunk_list) != self.labels.shape[0]:
            raise ValueError(f"Mismatch in number of chunks ({len(self.chunk_list)}) "
                             f"and number of labels ({self.labels.shape[0]})")
        
        print(f"Dataset loaded. Number of chunks: {len(self.chunk_list)}. Labels shape: {self.labels.shape}")

    def __len__(self) -> int:
        return len(self.chunk_list)

    def __getitem__(self, idx: int) -> Dict[str, Any]:
        """
        Возвращает один чанк и его метки.
        """
        item = self.chunk_list[idx] # Это уже словарь с 'input_ids' и 'attention_mask'
        label = self.labels[idx]
        
        output_item = {
            'input_ids': item['input_ids'].clone().detach(), # клонируем, чтобы избежать проблем с inplace операциями
            'attention_mask': item['attention_mask'].clone().detach(),
            'labels': label.clone().detach()
        }

        if self.original_indices:
            output_item['original_index'] = self.original_indices[idx]
        
        return output_item

if __name__ == '__main__':
    # Пример использования и тестирования Dataset
    # Убедитесь, что пути и имена файлов соответствуют тому, что было сохранено
    # TOKENIZER_NAME_FOR_PATH должен соответствовать тому, что использовался при сохранении
    TOKENIZER_NAME_FOR_PATH = "microsoft_codebert-base" # Пример, как он мог быть сформирован
    
    # Формируем пути к тестовым данным для примера
    # Эти пути должны указывать на реально существующие файлы, созданные на предыдущем шаге
    
    PROCESSED_DATA_DIR_CHUNKS = main_config.PROCESSED_DATA_DIR / "chunked_data"
    
    file_suffix = (f"t{main_config.MAX_TOTAL_TOKENS}_c{main_config.MODEL_CHUNK_SIZE}"
                   f"_o{main_config.CHUNK_OVERLAP}_{TOKENIZER_NAME_FOR_PATH}.pt")

    # Проверяем пути для ТРЕНИРОВОЧНЫХ данных, так как они обычно больше
    test_chunk_path = PROCESSED_DATA_DIR_CHUNKS / f"train_chunks_{file_suffix}"
    test_labels_path = PROCESSED_DATA_DIR_CHUNKS / f"train_chunk_labels_{file_suffix}"
    test_indices_path = PROCESSED_DATA_DIR_CHUNKS / f"train_original_indices_{file_suffix}"

    if not test_chunk_path.exists() or not test_labels_path.exists():
        print("ERROR: Test chunk data or labels file not found for the example.")
        print(f"Checked for chunk_list_path: {test_chunk_path}")
        print(f"Checked for labels_path: {test_labels_path}")
        print("Please ensure you have run the chunking notebook and files were saved correctly,")
        print("and update TOKENIZER_NAME_FOR_PATH if needed.")
    else:
        print("Found data files for example. Attempting to load dataset...")
        try:
            dataset = ContractChunkDataset(
                chunk_list_path=str(test_chunk_path), # pathlib -> str
                labels_path=str(test_labels_path),
                original_indices_path=str(test_indices_path) if test_indices_path.exists() else None
            )
            
            print(f"\nNumber of items in dataset: {len(dataset)}")
            
            if len(dataset) > 0:
                sample_item = dataset[0]
                print("\nSample item from dataset:")
                print(f"  Input IDs shape: {sample_item['input_ids'].shape}")
                print(f"  Attention Mask shape: {sample_item['attention_mask'].shape}")
                print(f"  Labels shape: {sample_item['labels'].shape}")
                print(f"  Labels: {sample_item['labels']}")
                if 'original_index' in sample_item:
                     print(f"  Original Index: {sample_item['original_index']}")

                # Пример использования с DataLoader
                from torch.utils.data import DataLoader
                dataloader = DataLoader(dataset, batch_size=4, shuffle=True)
                
                print("\nIterating through one batch from DataLoader:")
                for batch_idx, batch in enumerate(dataloader):
                    print(f"  Batch {batch_idx + 1}:")
                    print(f"    Input IDs batch shape: {batch['input_ids'].shape}")
                    print(f"    Attention Mask batch shape: {batch['attention_mask'].shape}")
                    print(f"    Labels batch shape: {batch['labels'].shape}")
                    if 'original_index' in batch:
                         print(f"    Original Index batch shape: {batch['original_index'].shape}")
                    break # Показываем только первый батч
            else:
                print("Dataset is empty, cannot get a sample item or create DataLoader.")

        except Exception as e:
            print(f"An error occurred while testing the dataset: {e}")
            import traceback
            traceback.print_exc() 