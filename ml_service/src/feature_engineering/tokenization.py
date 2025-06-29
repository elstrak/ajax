from transformers import AutoTokenizer
from typing import List, Union, Dict, Tuple
import pandas as pd
import torch # Используем torch для тензоров

from config import main_config

# Глобальная переменная для хранения загруженного токенизатора, чтобы не загружать его каждый раз
_tokenizer = None
_tokenizer_name = None

def get_tokenizer(tokenizer_name: str = "microsoft/codebert-base"):
    """
    Loads and returns a tokenizer. Caches the loaded tokenizer globally.

    Args:
        tokenizer_name (str): Name of the tokenizer model from Hugging Face.

    Returns:
        transformers.PreTrainedTokenizer: The loaded tokenizer.
    """
    global _tokenizer, _tokenizer_name
    if _tokenizer is not None and _tokenizer_name == tokenizer_name:
        return _tokenizer

    try:
        print(f"Loading tokenizer: {tokenizer_name}...")
        _tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
        _tokenizer_name = tokenizer_name
        print(f"Tokenizer {tokenizer_name} loaded successfully.")
        # Установим токен для паддинга, если он не установлен автоматически
        if _tokenizer.pad_token is None:
            if _tokenizer.eos_token is not None:
                _tokenizer.pad_token = _tokenizer.eos_token
                print(f"Set pad_token to eos_token: {_tokenizer.eos_token}")
            else:
                # Если нет eos_token, добавляем новый pad_token.
                # Это может потребовать изменения размера эмбеддингов модели, если мы будем обучать ее с нуля.
                # Для предобученных моделей лучше использовать существующие токены.
                # В случае CodeBERT/RoBERTa, eos_token обычно есть и используется как pad_token.
                _tokenizer.add_special_tokens({'pad_token': '[PAD]'})
                print("Added a new [PAD] token as pad_token.")

        return _tokenizer
    except Exception as e:
        print(f"Error loading tokenizer {tokenizer_name}: {e}")
        # Можно добавить фоллбэк на другой токенизатор, как в ноутбуке, или просто пробросить ошибку
        raise

def tokenize_and_chunk_code(
    code_string: str,
    tokenizer, # Передаем уже загруженный токенизатор
    max_total_tokens: int = main_config.MAX_TOTAL_TOKENS,
    chunk_size: int = main_config.MODEL_CHUNK_SIZE,
    overlap: int = main_config.CHUNK_OVERLAP
) -> List[Dict[str, torch.Tensor]]:
    """
    Tokenizes a single code string, truncates it to max_total_tokens, 
    and then splits it into chunks with overlap.
    Each chunk is padded to chunk_size.

    Args:
        code_string (str): The source code.
        tokenizer: The Hugging Face tokenizer instance.
        max_total_tokens (int): Maximum number of tokens to consider from the code string
                                before chunking.
        chunk_size (int): The target size for each chunk (e.g., model's max input size).
        overlap (int): Number of tokens to overlap between consecutive chunks.

    Returns:
        List[Dict[str, torch.Tensor]]: A list of dictionaries, where each dictionary
                                       contains 'input_ids' and 'attention_mask'
                                       for a single chunk, as PyTorch tensors.
                                       Returns an empty list if the code_string is empty or only whitespace.
    """
    if not code_string or code_string.isspace():
        return []

    # 1. Токенизировать весь код, не обрезая его пока по chunk_size
    # truncation=False, чтобы получить все токены, если их меньше max_total_tokens
    # или обрезать до max_total_tokens, если их больше
    initial_encoding = tokenizer(
        code_string,
        max_length=max_total_tokens, # Обрезаем до MAX_TOTAL_TOKENS
        truncation=True,
        padding=False, # Пока не паддим, это будет для каждого чанка
        return_attention_mask=False, # Пока не нужна общая маска
        return_tensors=None # Получаем списки ID
    )
    
    all_input_ids = initial_encoding['input_ids']

    if not all_input_ids: # Если после токенизации ничего не осталось
        return []
        
    # Убедимся, что CLS и SEP токены (если они есть) корректно обрабатываются
    # Токенизатор обычно добавляет их сам, если это его стандартное поведение
    # Для CodeBERT (RoBERTa-based): <s> (CLS) в начале, </s> (SEP) в конце
    # Мы должны сохранить эти спецтокены в каждом чанке, если это возможно и имеет смысл.
    # Простейший подход: каждый чанк будет иметь свои CLS/SEP, если мы токенизируем подстроки.
    # Альтернатива: токенизировать один раз, потом делить список ID.
    # Для простоты, давайте токенизировать один раз и делить список ID.
    # Но тогда спецтокены CLS/SEP будут только у первого/последнего "супер-чанка".
    # Это не идеально для моделей, ожидающих CLS/SEP в каждом инпуте.
    
    # Более корректный подход для чанкинга с сохранением CLS/SEP в каждом чанке:
    # Мы будем работать со списком токенов, а не ID, чтобы потом передавать их в токенизатор для каждого чанка.
    # Но это менее эффективно.
    
    # Давайте пока остановимся на разделении уже полученных `all_input_ids`.
    # Важно: `chunk_size` должно учитывать место для CLS и SEP токенов, если модель их добавляет.
    # Например, если модель добавляет 2 спец. токена, то реальная длина для кода в чанке будет chunk_size - 2.
    # Токенизатор `tokenizer()` с `padding=True` и `truncation=True` сам позаботится об этом.
    
    chunked_outputs = []
    stride = chunk_size - overlap # Шаг, с которым мы двигаемся по токенам

    if stride <= 0:
        raise ValueError("Overlap is too large for the given chunk_size. Stride must be positive.")

    # Если токенов меньше или равно chunk_size, создаем один чанк
    if len(all_input_ids) <= chunk_size:
        # Паддим этот единственный чанк до chunk_size
        padded_chunk = tokenizer(
            tokenizer.decode(all_input_ids, skip_special_tokens=False), # Декодируем, чтобы токенизатор сам добавил спецтокены, если нужно, и паддинг
            max_length=chunk_size,
            padding='max_length',
            truncation=True, # Если вдруг исходный all_input_ids был > chunk_size но <= max_total_tokens
            return_attention_mask=True,
            return_tensors='pt'
        )
        # Убедимся, что тензоры имеют правильную размерность [1, chunk_size]
        return [{
            'input_ids': padded_chunk['input_ids'].squeeze(0), 
            'attention_mask': padded_chunk['attention_mask'].squeeze(0)
        }]

    # Иначе, создаем перекрывающиеся чанки
    for i in range(0, len(all_input_ids) - overlap, stride): # - overlap чтобы последний чанк не был слишком коротким
        # Условие `len(all_input_ids) - overlap` гарантирует, что у нас есть достаточно токенов для потенциального чанка
        # если `i` будет близко к концу, то `end_idx` может выйти за пределы, но срез Python это обработает.
        
        start_idx = i
        end_idx = i + chunk_size
        
        # Берем срез токенов для текущего чанка
        current_chunk_ids = all_input_ids[start_idx:end_idx]

        # Если это последний чанк и он короче chunk_size, он будет дополнен паддингом.
        # Если он нулевой длины (маловероятно с `len(all_input_ids) - overlap`), пропускаем.
        if not current_chunk_ids:
            continue

        # Используем tokenizer для правильного паддинга и добавления спец. токенов к каждому чанку
        # Декодируем ID обратно в строку, чтобы токенизатор мог применить свою логику спец. токенов.
        # Это может быть не самым эффективным, но гарантирует правильный формат для модели.
        # `skip_special_tokens=True` при декодировании, чтобы не дублировать их, если они уже есть.
        # Потом токенизатор добавит их снова.
        # Альтернативно, можно вручную добавлять ID CLS/SEP и паддинг.
        
        # Преобразуем ID чанка обратно в строку (без спец. токенов) и снова токенизируем с паддингом
        # Это самый надежный способ убедиться, что каждый чанк имеет правильный формат (CLS, SEP, padding)
        # который ожидает модель.
        chunk_text = tokenizer.decode(current_chunk_ids, skip_special_tokens=True) # Пропускаем спец. токены при декодировании
        
        if not chunk_text.strip(): # если после декодирования только пробелы или пусто
            # это может случиться, если чанк состоял только из паддинг-токенов или спец.токенов
            continue

        chunk_encoding = tokenizer(
            chunk_text, # Токенизатор снова добавит CLS/SEP
            max_length=chunk_size,
            padding='max_length',
            truncation=True, # Обрезка до chunk_size, если chunk_text после декодирования/ре-токенизации стал длиннее
            return_attention_mask=True,
            return_tensors='pt'
        )
        
        chunked_outputs.append({
            'input_ids': chunk_encoding['input_ids'].squeeze(0), # Убираем размерность батча (1)
            'attention_mask': chunk_encoding['attention_mask'].squeeze(0)
        })
        
        # Если end_idx достиг или превысил длину all_input_ids, это был последний возможный чанк
        if end_idx >= len(all_input_ids):
            break
            
    return chunked_outputs

if __name__ == '__main__':
    # Пример использования
    sample_codes = [
        "pragma solidity ^0.8.0; contract A { uint public value; }",
        "contract B { function foo() public pure returns(uint) { return 1; } event Log(string); }",
        "very long code string..." * 1000 # Пример очень длинной строки
    ]

    # Сначала установим токенизатор по умолчанию
    default_tokenizer = get_tokenizer() # Использует "microsoft/codebert-base"
    print(f"Default tokenizer pad token: {default_tokenizer.pad_token_id} ({default_tokenizer.pad_token})")
    print(f"Default tokenizer model_max_length: {default_tokenizer.model_max_length}")


    # Используем MAX_CODE_LENGTH из конфига (4096)
    print(f"\n--- Tokenizing with MAX_CODE_LENGTH = {main_config.MAX_CODE_LENGTH} ---")
    tokenized_output = tokenize_code(sample_codes, max_length=main_config.MAX_CODE_LENGTH)

    print("Input IDs shape:", tokenized_output['input_ids'].shape)
    print("Attention Mask shape:", tokenized_output['attention_mask'].shape)
    print("Sample Input IDs (first contract):", tokenized_output['input_ids'][0, :30])
    print("Sample Attention Mask (first contract):", tokenized_output['attention_mask'][0, :30])

    print(f"\n--- Tokenizing with a shorter max_length = 10 (for truncation demo) ---")
    # Пример с короткой длиной для демонстрации обрезки
    tokenized_output_short = tokenize_code(sample_codes, max_length=10)
    print("Input IDs shape (short):", tokenized_output_short['input_ids'].shape)
    print("Sample Input IDs (third contract, truncated):", tokenized_output_short['input_ids'][2])


    # Проверка работы с Series
    print("\n--- Tokenizing pandas Series ---")
    sample_series = pd.Series(sample_codes)
    tokenized_series_output = tokenize_code(sample_series)
    print("Input IDs shape from Series:", tokenized_series_output['input_ids'].shape)

    tokenizer_instance = get_tokenizer()
    
    sample_codes_for_chunking = [
        "contract Short { uint x; }", # < chunk_size
        "pragma solidity ^0.8.0; contract MediumLengthContractExample { function getValue() public pure returns(uint) { return 100; } function setValue(uint _v) public { require(_v > 0); value = _v; } uint private value; event ValueSet(uint indexed newValue); constructor() { value = 1; } }", # ~chunk_size
        ("contract LongContract { " + "uint public valNum; function funcCallRepetitive(uint num) public { valNum = num + valNum - 2 * 3 / 1 + 777; } " * 30 + "}"), # > chunk_size, < max_total_tokens
        ("contract VeryLongContract { " + "uint public dataField; function processData(uint inputData) internal pure returns(bytes memory) { return abi.encodePacked(inputData, inputData*2, inputData*3); } " * 150 + "}") # > max_total_tokens
    ]
    
    print(f"Using: MAX_TOTAL_TOKENS={main_config.MAX_TOTAL_TOKENS}, MODEL_CHUNK_SIZE={main_config.MODEL_CHUNK_SIZE}, CHUNK_OVERLAP={main_config.CHUNK_OVERLAP}\n")

    for i, code in enumerate(sample_codes_for_chunking):
        print(f"--- Processing Code Sample {i+1} ---")
        original_tokens = tokenizer_instance.encode(code, truncation=False)
        print(f"Original code length (chars): {len(code)}")
        print(f"Original code length (tokens before any truncation): {len(original_tokens)}")
        
        chunks = tokenize_and_chunk_code(code, tokenizer_instance)
        print(f"Number of chunks generated: {len(chunks)}")
        if chunks:
            for j, chunk in enumerate(chunks):
                print(f"  Chunk {j+1}: input_ids shape: {chunk['input_ids'].shape}, attention_mask shape: {chunk['attention_mask'].shape}")
                # print(f"  Chunk {j+1} input_ids: {chunk['input_ids']}")
        else:
            print("  No chunks generated (empty or whitespace input).")
        print("-" * 30) 