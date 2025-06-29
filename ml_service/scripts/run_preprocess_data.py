import sys
import os
from sklearn.model_selection import train_test_split
import pandas as pd
# Add src directory to Python path to allow direct imports
# This is a common way to structure projects for script execution
# Alternatively, install your project as a package or use relative imports carefully
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from src.data_processing.loader import load_dataset
from src.data_processing.preprocessing import preprocess_dataframe
from config import main_config

def main():
    """
    Main script to load, preprocess, split, and save the dataset.
    """
    print("--- Starting Data Preprocessing Script ---")

    # 1. Load Raw Data
    try:
        print(f"Loading raw dataset: {main_config.RAW_DATASET_FILENAME} from {main_config.RAW_DATA_DIR}")
        # Define columns to load based on config
        required_cols = [main_config.SOURCE_CODE_COLUMN, main_config.ADDRESS_COLUMN] + \
                        main_config.VULNERABILITY_COUNT_COLUMNS
        
        raw_df = load_dataset(
            filename=main_config.RAW_DATASET_FILENAME,
            data_dir=main_config.RAW_DATA_DIR,
            columns_to_load=required_cols
        )
        print(f"Successfully loaded raw data. Shape: {raw_df.shape}")
    except FileNotFoundError:
        print(f"ERROR: Raw dataset file '{main_config.RAW_DATASET_FILENAME}' not found in '{main_config.RAW_DATA_DIR}'.")
        print("Please ensure the file exists and `RAW_DATASET_FILENAME` and `VULNERABILITY_COUNT_COLUMNS` in `config/main_config.py` are correct.")
        return
    except Exception as e:
        print(f"ERROR loading raw dataset: {e}")
        return

    # 2. Preprocess Data
    print("\n--- Preprocessing Data ---")
    try:
        processed_df = preprocess_dataframe(
            raw_df,
            source_code_col=main_config.SOURCE_CODE_COLUMN,
            vulnerability_count_cols=main_config.VULNERABILITY_COUNT_COLUMNS,
            target_prefix=main_config.TARGET_COLUMN_PREFIX,
            skip_code_cleaning=True
        )
        print(f"Successfully preprocessed data. Shape: {processed_df.shape}")
        # Display new target columns for verification
        target_cols = [col for col in processed_df.columns if col.startswith(main_config.TARGET_COLUMN_PREFIX)]
        print(f"Generated target columns: {target_cols}")
        if not target_cols:
            print("WARNING: No target columns were generated. Check VULNERABILITY_COUNT_COLUMNS in config and dataset.")
            # return # Potentially exit if no targets are created
        else:
            print("Sample of target columns:")
            print(processed_df[target_cols].head())

    except Exception as e:
        print(f"ERROR during preprocessing: {e}")
        return

    # 3. Save Processed Data (Optional, but good practice)
    if not main_config.PROCESSED_DATA_DIR.exists():
        main_config.PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    processed_file_path = main_config.PROCESSED_DATA_DIR / main_config.PROCESSED_DATASET_FILENAME
    try:
        processed_df.to_csv(processed_file_path, index=False)
        print(f"\nSuccessfully saved fully processed data to: {processed_file_path}")
    except Exception as e:
        print(f"ERROR saving processed data: {e}")
        return

    # 4. Split Data into Train and Test sets
    print("\n--- Splitting Data into Train and Test Sets ---")
    try:
        # Define target columns for stratification if possible and meaningful
        # For multi-label, stratification can be complex.
        # A simple approach is to stratify on a summary column if one exists (e.g., "has_any_vulnerability")
        # Or, if one vulnerability type is dominant and critical, stratify on that.
        # For now, let's do a simple random split.
        # If you have many labels, consider using iterative splitting methods for multi-label data.
        
        # Create a unique list of target column names that were actually created
        final_target_columns = [col for col in processed_df.columns if col.startswith(main_config.TARGET_COLUMN_PREFIX)]
        
        if not final_target_columns:
            print("WARNING: No target columns found for splitting. Cannot proceed with train/test split.")
            return

        # For multi-label, simple train_test_split might not ensure label distribution.
        # Consider scikit-multilearn's iterative_train_test_split if class imbalance is severe across labels.
        # For now, a standard split:
        X = processed_df.drop(columns=final_target_columns, errors='ignore')
        y = processed_df[final_target_columns]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y,
            test_size=main_config.TEST_SET_SIZE,
            random_state=main_config.RANDOM_STATE
            # Add stratify=y_stratify_column if you have a suitable column for stratification
        )
        
        train_df = pd.concat([X_train, y_train], axis=1)
        test_df = pd.concat([X_test, y_test], axis=1)

        print(f"Training set shape: {train_df.shape}")
        print(f"Test set shape: {test_df.shape}")

        # 5. Save Train and Test Sets
        train_file_path = main_config.PROCESSED_DATA_DIR / main_config.TRAIN_DATASET_FILENAME
        test_file_path = main_config.PROCESSED_DATA_DIR / main_config.TEST_DATASET_FILENAME

        train_df.to_csv(train_file_path, index=False)
        test_df.to_csv(test_file_path, index=False)
        print(f"Successfully saved train data to: {train_file_path}")
        print(f"Successfully saved test data to: {test_file_path}")

    except Exception as e:
        print(f"ERROR during data splitting or saving: {e}")
        return

    print("\n--- Data Preprocessing Script Finished ---")

if __name__ == "__main__":
    # Create dummy directories if they don't exist for the script to run without manual setup
    # In a real scenario, these might be handled by CI/CD or project setup scripts.
    main_config.RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    main_config.PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    # Create a dummy raw dataset for the script to run if it doesn't exist
    dummy_raw_path = main_config.RAW_DATA_DIR / main_config.RAW_DATASET_FILENAME
    if not dummy_raw_path.exists():
        print(f"Creating a dummy raw dataset at {dummy_raw_path} for demonstration purposes.")
        sample_data_for_file = {
            main_config.ADDRESS_COLUMN: ['0xAAA', '0xBBB', '0xCCC', '0xDDD', '0xEEE'],
            main_config.SOURCE_CODE_COLUMN: [
                "pragma solidity ^0.8.0; contract A { /* reentrancy here */ function callOther() public { (bool success, ) = address(0x123).call{value: 1 ether}(\"\"); require(success); } }",
                "contract B { uint public x; function badArith() public { x -= 10; /* potential underflow */ } }",
                "contract C { function good() public pure returns(uint) { return 1; } }", 
                "pragma solidity 0.4.24; contract Old { function oldFunc() public { msg.sender.transfer(1 ether); /* unchecked call */ } }", 
                "/* Other issues */ contract Complex { mapping(address => uint) balances; function multiple() public { balances[msg.sender] += 1; balances[msg.sender] -= 2; } }" 
            ],
        }
        # Add vulnerability count columns based on main_config
        vuln_cols_data = {
            "# reentrancy":                 [1,0,0,0,0],
            "# unchecked_low_level_calls":  [0,0,0,1,0],
            "# arithmetic":                 [0,1,0,0,1],
            "# Other":                      [0,0,0,1,1],
            "# access_control":             [0,0,0,0,0],
            "# denial_service":             [0,0,0,0,0],
            "# time_manipulation":          [0,0,0,0,0],
        }
        # Ensure only columns defined in VULNERABILITY_COUNT_COLUMNS are added
        for col_name in main_config.VULNERABILITY_COUNT_COLUMNS:
            if col_name in vuln_cols_data:
                 sample_data_for_file[col_name] = vuln_cols_data[col_name][:5] # Ensure correct length
            else: # if a column in config is not in our sample, fill with zeros
                 sample_data_for_file[col_name] = [0,0,0,0,0]


        pd.DataFrame(sample_data_for_file).to_csv(dummy_raw_path, index=False)
        print(f"Dummy dataset '{main_config.RAW_DATASET_FILENAME}' created.")


    main() 