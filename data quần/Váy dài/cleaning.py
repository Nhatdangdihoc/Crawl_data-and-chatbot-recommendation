import pandas as pd

# Đọc file
df = pd.read_csv("./Váy dài/data_vay_dai.csv")
df = df[df["name"].str.contains("dress|váy dài|váy nữ|chân váy dài", case=False, na=False)]
df["gender"] = "Nữ"
df["category"] = "Váy dài"

df.to_csv("./Váy dài/data_vay_dai_cleaning.csv", index=False)

