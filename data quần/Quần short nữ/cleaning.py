import pandas as pd

# Đọc file
df = pd.read_csv("./Quần short nữ/data_quan_short_nu.csv")
df = df[df["name"].str.contains("Quần short nữ|short nữ|ngắn nữ|short nữ", case=False, na=False)]
df["gender"] = "Nữ"
df["category"] = "Quần short"

df.to_csv("./Quần short nữ/data_quan_short_nu_cleaning.csv", index=False)

