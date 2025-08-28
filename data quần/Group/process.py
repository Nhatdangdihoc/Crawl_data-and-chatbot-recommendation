import os
import pandas as pd

df_list = []  
root = "./data quần"

for item in os.listdir(root):
    root1 = os.path.join(root, item)
    if os.path.isdir(root1):  
        for item1 in os.listdir(root1):
            root2 = os.path.join(root1, item1)
            if root2.endswith("cleaning.csv"):
                tmpdf = pd.read_csv(root2)
                df_list.append(tmpdf)  


df = pd.concat(df_list, ignore_index=True)

df.to_csv("./data quần/Group/tong_hop.csv", index=False)
print("Đã lưu vào tong_hop.csv")
