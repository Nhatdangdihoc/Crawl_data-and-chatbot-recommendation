import pandas as pd

# Đọc file
df = pd.read_csv("./Quần thể thao nữ/data_quan_the_thao_nu.csv")
df = df[df["name"].str.contains("quần thể thao nữ|thể thao nữ|gym nữ|yoga nữ", case=False, na=False)]
df["gender"] = "Nữ"
df["category"] = "Quần thể thao"
df.to_csv("./Quần thể thao nữ/data_quan_the_thao_nu_cleaning.csv", index=False)

