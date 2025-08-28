import pandas as pd

# Đọc file
df = pd.read_csv("./Quần jogger nam/data_quan_jogger_nam.csv")
df = df[df["name"].str.contains("quần jogger nam|jogger nam", case=False, na=False)]
df["gender"] = "Nam"
df["category"] = "Quần jogger"

df.to_csv("./Quần jogger nam/data_quan_jogger_nam_cleaning.csv", index=False)

