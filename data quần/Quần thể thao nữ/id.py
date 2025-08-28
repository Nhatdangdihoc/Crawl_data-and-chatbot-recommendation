import requests
import csv

# Định nghĩa URL cơ bản và các header cần thiết
url = "https://tiki.vn/api/v2/products"
headers = {
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
    "cookie": "_clck=i49n3a%7C2%7Cfrg%7C0%7C1800; _ga_M8CWJCKL1X=GS1.1.1733408463.1.1.1733409905.0.0.0; _trackity=865b9efb-505d-bd38-0458-6736706abc42; TOKENS={%22access_token%22:%22W5VTwUhDCEXra0nkHBOcdQeP7L6bFo1g%22}; _fbp=fb.1.1736341521148.269980464182678002; __R=1; __iid=749; __iid=749; __su=0; __su=0; _hjSessionUser_522327=eyJpZCI6IjYwOWU2MDkxLTFmMTEtNWMzOC04NjE3LWYzYzZhOGFkNzM4NCIsImNyZWF0ZWQiOjE3MzYzNDE1MjE3OTcsImV4aXN0aW5nIjp0cnVlfQ==; __tb=0; _gcl_au=1.1.155692152.1737205846; _ga=GA1.1.1147839918.1737205842; __UF=1%252C3; delivery_zone=Vk4wNTQwMDMwMDQ=; tiki_client_id=1147839918.1737205842; _hjSession_522327=eyJpZCI6IjI0ODI0ZDU4LThhNGEtNDE1Yy04MmZiLTBhMjcxZjliM2ZlYiIsImMiOjE3Mzc1MzM0ODc0OTMsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowfQ==; __RC=23; __IP=457659822; _gcl_gs=2.1.k1$i1737536378$u165506106; _gcl_aw=GCL.1737536391.Cj0KCQiAy8K8BhCZARIsAKJ8sfTefShNR7Paamhil-UFk4cRukekD7arhNXfKusGa-gVtYAZfYpmr9AaAjkXEALw_wcB; __utm=source%3Dgoogle%7Cmedium%3Dcpc%7Ccampaign%3DSEA_NBR_GGL_PMA_DAP_ALL_VN_ALL_UNK_UNK_C.PMAX_X.21434089152_Y.167617706789_V._W.DT_A._O.CIR; __utm=source%3Dgoogle%7Cmedium%3Dcpc%7Ccampaign%3DSEA_NBR_GGL_PMA_DAP_ALL_VN_ALL_UNK_UNK_C.PMAX_X.21434089152_Y.167617706789_V._W.DT_A._O.CIR; __uif=__uid%3A6057054052883629648%7C__ui%3A1%252C3%7C__create%3A1725705405; _ga_S9GLR1RQFJ=GS1.1.1737536385.9.1.1737537589.60.0.0; amp_99d374=rW1CQzXsYvnUKMiRONLJM4...1ii6h0lfr.1ii6kv4ou.k5.oe.1cj",
    "dnt": "1",
    "referer": "https://tiki.vn/search?q=qu%E1%BA%A7n%20d%C3%A0i%20n%E1%BB%AF",
    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Google Chrome\";v=\"132\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
    "x-guest-token": "W5VTwUhDCEXra0nkHBOcdQeP7L6bFo1g"
}

# Định nghĩa tham số payload
params = {
    "limit": 40,
    "include": "advertisement",
    "is_mweb": 1,
    "aggregations": 2,
    "_v": "within_promotions",
    "trackity_id": "865b9efb-505d-bd38-0458-6736706abc42",
    "q": "Quần Thể Thao nữ",
    "page": 1
}

# Mở file CSV để ghi
with open('./Quần thể thao nữ/quan_the_thao_nu_id.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(["product_id"])  # Ghi header vào file CSV
    
    # Lấy dữ liệu từ nhiều trang
    for page in range(1, 11):
        params["page"] = page
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            products = data.get('data', [])
            for product in products:
                writer.writerow([product['id']])  # Ghi ID sản phẩm vào file CSV
        else:
            print(f"Error fetching page {page}: {response.status_code}")

print("Đã lưu các ID sản phẩm vào file quan_the_thao_id.csv")
