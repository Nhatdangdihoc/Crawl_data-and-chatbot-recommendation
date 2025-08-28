import pandas as pd

# Đọc file
df = pd.read_csv("./Quần tất nữ/data_quan_tat_nu.csv")
df = df[df["name"].str.contains("Quần tất nữ", case=False, na=False)]
df["gender"] = "Nữ"
df["category"] = "Quần tất"

df.to_csv("./Quần tất nữ/data_quan_tat_nu_cleaning.csv", index=False)

