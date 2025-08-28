import pandas as pd

# Đọc file
df = pd.read_csv("./Quần short nam/data_quan_short_nam.csv")
df = df[df["name"].str.contains("quần short nam|short nam|ngắn nam", case=False, na=False)]
df["gender"] = "Nam"
df["category"] = "Quần short"

df.to_csv("./Quần short nam/data_quan_short_nam_cleaning.csv", index=False)

