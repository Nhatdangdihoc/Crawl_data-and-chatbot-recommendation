import pandas as pd

# Đọc file
df = pd.read_csv("./Quần jogger nữ/data_quan_jogger_nu.csv")
df = df[df["name"].str.contains("quần jogger nữ|jogger nữ", case=False, na=False)]
df["gender"] = "Nữ"
df["category"] = "Quần jogger"

df.to_csv("./Quần jogger nữ/data_quan_jogger_nu_cleaning.csv", index=False)

