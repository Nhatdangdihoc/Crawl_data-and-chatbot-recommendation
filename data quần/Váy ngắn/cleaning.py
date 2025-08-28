import pandas as pd

# Đọc file
df = pd.read_csv("./Váy ngắn/data_vay_ngan.csv")
df = df[df["name"].str.contains("váy ngắn|chân váy ngắn", case=False, na=False)]
df["gender"] = "Nữ"
df["category"] = "Váy ngắn"

df.to_csv("./Váy ngắn/data_vay_ngan_cleaning.csv", index=False)

