import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import LabelEncoder

# Load dataset
train_data = pd.read_csv('lasik_dataset_final.csv')

print("Dataset columns:")
print(train_data.columns)
print("\nDataset shape:")
print(train_data.shape)
print("\nDataset info:")
train_data.info()

# Create a working copy
df = train_data.copy()

# Show missing values
missing_values = df.isnull().sum()
print("\nMissing values per column:")
print(missing_values)

# Define numerical columns
numerical_cols = ['age','corneal_thickness', 'pre_op_vision', 'pupil_size',
                  'dry_eye_score', 'surgeon_experience_years', 
                  'post_op_med_compliance', 'follow_up_attendance']

# Ensure numeric type and fill missing values with mean
for col in numerical_cols:
    df[col] = pd.to_numeric(df[col], errors='coerce')
    df[col].fillna(df[col].mean(), inplace=True)
    if col == 'age':
        df[col] = df[col].round(0).astype(int)

# Fill missing categorical values with mode
categorical_cols = ['gender', 'contact_lens_history', 'smoking_status',
                    'healing_quality']
for col in categorical_cols:
    df[col].fillna(df[col].mode()[0], inplace=True)

# Encode categorical columns
label_encoders = {}
encode_cols = ['gender', 'contact_lens_history', 'smoking_status',
               'surgery_type',]
for col in encode_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le
healing_map = {
    "Poor": 0,
    "Moderate": 1,
    "Good": 2,
    "Excellent": 3
}
df['healing_quality'] = df['healing_quality'].map(healing_map).astype(int)
# Ensure boolean columns are integers
df['diabetes'] = df['diabetes'].fillna(0).astype(int)
df['autoimmune_disorder'] = df['autoimmune_disorder'].fillna(0).astype(int)

df.drop(columns=['surgeon_experience_years', 'follow_up_attendance', 'autoimmune_disorder', 'diabetes','smoking_status'], inplace=True, errors='ignore')




missing_values = df.isnull().sum()
print("\nMissing values per column:")
print(missing_values)
print("\nClass distribution:")
df['healing_quality'] = df['healing_quality'].astype(int)
print(df['healing_quality'].value_counts().sort_index())
print(df.value_counts().sort_index())


df.to_csv('lasik_clean.csv', index=False)
