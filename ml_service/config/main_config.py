import pathlib

# Base project directory
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent

# Data paths
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# Original dataset file name (assuming CSV for now)
# Please change this if your dataset has a different name or format
RAW_DATASET_FILENAME = "smart_contracts_dataset.csv" # Пример
PROCESSED_DATASET_FILENAME = "processed_contracts.csv"
TRAIN_DATASET_FILENAME = "train_contracts.csv"
TEST_DATASET_FILENAME = "test_contracts.csv"


# Column names from the input data
SOURCE_CODE_COLUMN = "sourcecode"
ADDRESS_COLUMN = "address" # Or your specific ID column

# List of original vulnerability count columns
# IMPORTANT: Update this list with the exact names of your vulnerability count columns
VULNERABILITY_COUNT_COLUMNS = [
    "reentrancy",
    "unchecked_low_calls", 
    "arithmetic",
    "Other",
    "access_control",
    "denial_service",
    "time_manipulation",    
]

# Prefix for new binary target columns
TARGET_COLUMN_PREFIX = "vuln_"

# Derived target columns (will be created during preprocessing)
# e.g., vuln_reentrancy, vuln_unchecked_low_level_calls
# This list can be generated dynamically or specified if needed elsewhere
# TARGET_COLUMNS = [f"{TARGET_COLUMN_PREFIX}{col.lstrip('# ').replace(' ', '_').lower()}" for col in VULNERABILITY_COUNT_COLUMNS]


# Model and Experimentation related
MODEL_DIR = BASE_DIR / "models"
MODEL_OUTPUT_FILENAME = "vulnerability_detector_model.joblib" # Or .pt, .h5 etc.
LOGS_DIR = BASE_DIR / "logs"
MLFLOW_TRACKING_URI = "sqlite:///" + str(BASE_DIR / "mlflow.db") # Example for local MLflow tracking
EXPERIMENT_NAME = "SmartContractVulnerabilityDetection"

# Preprocessing parameters
MAX_TOTAL_TOKENS = 4096  # Max total tokens from a contract to consider before chunking (was MAX_CODE_LENGTH)
MODEL_CHUNK_SIZE = 512   # The size of chunks we'll feed into the base model (e.g., CodeBERT's limit)
CHUNK_OVERLAP = 64       # Number of tokens to overlap between chunks (helps maintain context)

TEST_SET_SIZE = 0.2
RANDOM_STATE = 42

# Add other configurations as needed:
# - Tokenizer paths/names
# - Embedding dimensions
# - Model hyperparameters
# - API settings 