import pandas as pd
import pathlib
from typing import List, Optional

from config import main_config # Assuming config is in the root or accessible via PYTHONPATH

def load_dataset(
    filename: str,
    data_dir: pathlib.Path = main_config.RAW_DATA_DIR,
    columns_to_load: Optional[List[str]] = None,
    nrows: Optional[int] = None
) -> pd.DataFrame:
    """
    Loads the dataset from a CSV file.

    Args:
        filename (str): Name of the CSV file.
        data_dir (pathlib.Path): Directory where the CSV file is located.
        columns_to_load (Optional[List[str]]): Specific columns to load. Loads all if None.
        nrows (Optional[int]): Number of rows to load. Loads all if None.

    Returns:
        pd.DataFrame: Loaded data.
        
    Raises:
        FileNotFoundError: If the dataset file does not exist.
        Exception: For other pandas-related read errors.
    """
    file_path = data_dir / filename
    if not file_path.exists():
        raise FileNotFoundError(f"Dataset file not found: {file_path}")
    
    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(file_path, usecols=columns_to_load, nrows=nrows)
        # Add support for other formats like .parquet if needed
        # elif filename.endswith(".parquet"):
        #     df = pd.read_parquet(file_path, columns=columns_to_load)
        else:
            raise ValueError(f"Unsupported file format for {filename}. Please use .csv.")
        
        print(f"Successfully loaded {len(df)} rows from {file_path}")
        if columns_to_load:
            print(f"Loaded columns: {list(df.columns)}")
        return df
    except Exception as e:
        print(f"Error loading dataset from {file_path}: {e}")
        raise

if __name__ == '__main__':
    # Example usage:
    try:
        # Define columns to load based on config
        required_cols = [main_config.SOURCE_CODE_COLUMN, main_config.ADDRESS_COLUMN] + \
                        main_config.VULNERABILITY_COUNT_COLUMNS
        
        # Ensure config.py is in the parent directory of src for this to work directly
        # Or adjust python path
        print(f"Attempting to load dataset: {main_config.RAW_DATASET_FILENAME}")
        print(f"From directory: {main_config.RAW_DATA_DIR}")
        print(f"Required columns: {required_cols}")

        df_contracts = load_dataset(
            filename=main_config.RAW_DATASET_FILENAME,
            columns_to_load=required_cols
            )
        print("\nDataset loaded successfully. First 5 rows:")
        print(df_contracts.head())
        print(f"\nDataset shape: {df_contracts.shape}")
        print(f"\nDataset columns: {df_contracts.columns.tolist()}")

        # Check if all required columns are present
        missing_cols = [col for col in required_cols if col not in df_contracts.columns]
        if missing_cols:
            print(f"\nWarning: The following required columns were not found in the loaded data: {missing_cols}")
            print("Please check your `VULNERABILITY_COUNT_COLUMNS` and `SOURCE_CODE_COLUMN` in `config/main_config.py`")
        else:
            print("\nAll required columns found in the dataset.")

    except FileNotFoundError:
        print(f"Error: The raw dataset file '{main_config.RAW_DATASET_FILENAME}' was not found in '{main_config.RAW_DATA_DIR}'.")
        print("Please ensure the file exists or update `RAW_DATASET_FILENAME` in `config/main_config.py`.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}") 