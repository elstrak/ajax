import pandas as pd
import re
from typing import List, Tuple

from config import main_config # Assuming config is in the root or accessible via PYTHONPATH

def clean_solidity_code(code: str) -> str:
    """
    Basic cleaning of Solidity source code.
    - Removes single-line comments (// ...)
    - Removes multi-line comments (/* ... */)
    - Normalizes multiple whitespaces to a single space
    - Removes leading/trailing whitespace
    """
    if not isinstance(code, str):
        return "" # Or raise error, or return as is, depending on desired handling for non-str input

    # Remove single-line comments
    code = re.sub(r"//.*", "", code)
    # Remove multi-line comments
    code = re.sub(r"/\*.*?\*/", "", code, flags=re.DOTALL)
    # Normalize whitespace
    code = re.sub(r"\s+", " ", code)
    return code.strip()

def create_binary_target_labels(
    df: pd.DataFrame,
    count_columns: List[str],
    prefix: str = main_config.TARGET_COLUMN_PREFIX
) -> pd.DataFrame:
    """
    Converts vulnerability count columns to binary target labels.
    A new column is created for each vulnerability type, with 1 if count > 0, else 0.

    Args:
        df (pd.DataFrame): DataFrame containing the vulnerability count columns.
        count_columns (List[str]): List of names of the vulnerability count columns.
        prefix (str): Prefix for the new binary target columns.

    Returns:
        pd.DataFrame: DataFrame with added binary target columns.
    """
    df_processed = df.copy()
    new_target_columns = []
    for col_name in count_columns:
        if col_name not in df_processed.columns:
            print(f"Warning: Count column '{col_name}' not found in DataFrame. Skipping.")
            continue
        
        # Sanitize column name for the new target column
        # Removes '#', leading/trailing spaces, replaces other spaces with '_'
        sanitized_base_name = col_name.lstrip('# ').strip().replace(' ', '_').lower()
        target_col_name = f"{prefix}{sanitized_base_name}"
        
        # Ensure the count column is numeric, coercing errors to NaN (which will become 0)
        df_processed[col_name] = pd.to_numeric(df_processed[col_name], errors='coerce').fillna(0)
        
        df_processed[target_col_name] = (df_processed[col_name] > 0).astype(int)
        new_target_columns.append(target_col_name)
        print(f"Created target column: '{target_col_name}' from '{col_name}'")
        
    print(f"\nCreated binary target columns: {new_target_columns}")
    return df_processed

def preprocess_dataframe(
    df: pd.DataFrame,
    source_code_col: str = main_config.SOURCE_CODE_COLUMN,
    vulnerability_count_cols: List[str] = main_config.VULNERABILITY_COUNT_COLUMNS,
    target_prefix: str = main_config.TARGET_COLUMN_PREFIX,
    skip_code_cleaning: bool = True
) -> pd.DataFrame:
    """
    Applies necessary transformations:
    - Optionally cleans source code (if skip_code_cleaning is False).
    - Creates binary target labels.

    Args:
        df (pd.DataFrame): Input DataFrame.
        source_code_col (str): Name of the source code column.
        vulnerability_count_cols (List[str]): Names of vulnerability count columns.
        target_prefix (str): Prefix for new binary target columns.
        skip_code_cleaning (bool): If True, skips the source code cleaning step.

    Returns:
        pd.DataFrame: Processed DataFrame.
    """
    print("Starting preprocessing...")
    df_processed = df.copy()

    # Clean source code - conditionally skipped
    if not skip_code_cleaning:
        if source_code_col in df_processed.columns:
            print(f"Cleaning source code in column: '{source_code_col}'...")
            df_processed[source_code_col] = df_processed[source_code_col].astype(str).apply(clean_solidity_code)
            print("Source code cleaning complete.")
        else:
            print(f"Warning: Source code column '{source_code_col}' not found. Skipping cleaning.")
    else:
        print("Skipping source code cleaning as per configuration.")

    # Create binary target labels (this step is essential)
    df_processed = create_binary_target_labels(
        df_processed, # Pass the potentially modified df_processed
        count_columns=vulnerability_count_cols,
        prefix=target_prefix
    )
    
    print("Preprocessing (target label creation) complete.")
    return df_processed


if __name__ == '__main__':
    # Example Usage (assuming you have a sample CSV or can create one)
    
    # Create a dummy DataFrame for demonstration
    sample_data = {
        main_config.ADDRESS_COLUMN: ['0x123', '0x456', '0x789'],
        main_config.SOURCE_CODE_COLUMN: [
            "pragma solidity ^0.8.0; /* contract A */ contract A { uint public value; // set value \n function set(uint _v) public { value = _v; } }",
            "// contract B \n contract B { event Log(string); function problematic() public { Log(\"call\"); } }",
            "contract C { bool public flag; /* multi-line \n comment */ function check() internal view returns (bool) { return flag; } }"
        ],
        main_config.VULNERABILITY_COUNT_COLUMNS[0]: [2, 0, 1], # e.g., # reentrancy
        main_config.VULNERABILITY_COUNT_COLUMNS[1]: [0, 1, 0], # e.g., # unchecked_low_level_calls
        "non_vulnerability_column": [10,20,30] # An extra column not in VULNERABILITY_COUNT_COLUMNS
    }
    if len(main_config.VULNERABILITY_COUNT_COLUMNS) > 2:
         for col in main_config.VULNERABILITY_COUNT_COLUMNS[2:]:
              sample_data[col] = [0,0,0]


    df_sample = pd.DataFrame(sample_data)
    
    print("Original Sample DataFrame:")
    print(df_sample)
    print("\n" + "="*50 + "\n")

    # Test with skipping code cleaning (default for this run)
    processed_df_skipped_cleaning = preprocess_dataframe(
        df_sample.copy(), 
        skip_code_cleaning=True
    ) 
    print("\nProcessed DataFrame (Code Cleaning Skipped):")
    print(processed_df_skipped_cleaning)
    print("\nSource code (first entry, should be unchanged):")
    print(processed_df_skipped_cleaning[main_config.SOURCE_CODE_COLUMN].iloc[0])

    print("\n" + "="*30 + " TESTING WITH CLEANING ENABLED " + "="*30 + "\n")
    # Test with code cleaning enabled
    processed_df_with_cleaning = preprocess_dataframe(
        df_sample.copy(),
        skip_code_cleaning=False # Explicitly enable cleaning for this test
    )
    print("\nProcessed DataFrame (Code Cleaning Enabled):")
    print(processed_df_with_cleaning)
    print("\nCleaned source code (first entry):")
    print(processed_df_with_cleaning[main_config.SOURCE_CODE_COLUMN].iloc[0])
    
    print("\n" + "="*50 + "\n")
    print("Verifying target columns (from last run with cleaning):")
    target_cols_to_check = [col for col in processed_df_with_cleaning.columns if col.startswith(main_config.TARGET_COLUMN_PREFIX)]
    print(processed_df_with_cleaning[target_cols_to_check].head()) 