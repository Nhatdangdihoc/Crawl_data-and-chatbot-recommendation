import pandas as pd

# Đọc file
df = pd.read_csv("./Quần dài nữ/data_quan_dai_nu.csv")
df = df[df["name"].str.contains("quần dài nữ|jean nữ|jean dài|quần dài", case=False, na=False)]
df["gender"] = "Nữ"
df["category"] = "Quần dài"

df.to_csv("./Quần dài nữ/data_quan_dai_nu_cleaning.csv", index=False)

