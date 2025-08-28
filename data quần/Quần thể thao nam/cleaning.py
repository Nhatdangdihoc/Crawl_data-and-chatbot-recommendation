import pandas as pd

# Đọc file
df = pd.read_csv("./Quần thể thao nam/data_quan_the_thao_nam.csv")
df = df[df["name"].str.contains("Quần thể thao nam|thể thao nam|Quần thể dục nam|thể dục nam|gym nam|quần gym nam", case=False, na=False)]
df["gender"] = "Nam"
df["category"] = "Quần thể thao"
df.to_csv("./Quần thể thao nam/data_quan_the_thao_nam_cleaning.csv", index=False)

