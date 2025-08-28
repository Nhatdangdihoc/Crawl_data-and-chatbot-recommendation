import os
import pandas as pd

df_list = []  
root = "./data áo cleaning"

for item in os.listdir(root):
    root1 = os.path.join(root, item)
    if os.path.isfile(root1) and item.endswith(".csv"): 
        df1 = pd.read_csv(root1)
        df_list.append(df1)

df_combined = pd.concat(df_list, ignore_index=True)

# Lưu DataFrame kết hợp vào file CSV mới
df_combined.to_csv("./data áo cleaning/group_ao.csv", index=False)
