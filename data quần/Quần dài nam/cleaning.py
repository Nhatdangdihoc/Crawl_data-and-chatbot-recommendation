import pandas as pd

# Đọc file
df = pd.read_csv("./Quần dài nam/data_quan_dai_nam.csv")
df = df[df["name"].str.contains("quần dài nam|dài nam|Quần jean nam|jean dài", case=False, na=False)]
df["gender"] = "Nam"
df["category"] = "Quần dài"

df.to_csv("./Quần dài nam/data_quan_dai_nam_cleaning.csv", index=False)

