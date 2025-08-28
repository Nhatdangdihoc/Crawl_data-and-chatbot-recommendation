import requests
import pandas as pd
import time

# Đọc file CSV chứa các product_id
df_ids = pd.read_csv("./Váy ngắn/vay_ngan_id.csv")

# Danh sách để lưu dữ liệu
products_data = []

# Lặp qua từng product_id trong file CSV
for product_id in df_ids['product_id']:
    # Tạo URL API với product_id hiện tại
    url = f"https://tiki.vn/api/v2/products/{product_id}?platform=web&spid=126700196&version=1"
    
    # Cài đặt header để tránh bị chặn
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
    
    try:
        # Gửi yêu cầu GET đến API
        response = requests.get(url, headers=headers)
        
        # Kiểm tra nếu yêu cầu thành công
        if response.status_code == 200:
            data = response.json()
            
            # Xử lý configurable_options
            configurable_options = data.get('configurable_options', [])
            colors = []
            sizes = []

            for option in configurable_options:
                if option['code'] == 'option1':  # Nếu là màu
                    colors = [value['label'] for value in option.get('values', [])]
                elif option['code'] == 'option2':  # Nếu là kích cỡ
                    sizes = [value['label'] for value in option.get('values', [])]

            # Lấy dữ liệu cần thiết từ API
            product_info = {
                'product_id': product_id,
                'sku': data.get('sku', 'N/A'),
                'name': data.get('name', 'N/A'),
                'url': data.get('short_url', 'N/A'),
                'price': data.get('price', 'N/A'),
                'list_price': data.get('list_price', 'N/A'),
                'original_price': data.get('original_price', 'N/A'),
                'rating_average': data.get('rating_average', 'N/A'),
                'review_count': data.get('review_count', 'N/A'),
                'thumbnail_url': data.get('thumbnail_url', 'N/A'),
                'inventory_status': data.get('inventory_status', 'N/A'),
                'color': colors,
                'size': sizes
            }
            
            # Thêm thông tin sản phẩm vào danh sách
            products_data.append(product_info)
        else:
            print(f"Không thể lấy dữ liệu cho product_id {product_id}. Mã lỗi: {response.status_code}")
        
    except Exception as e:
        print(f"Đã xảy ra lỗi khi yêu cầu cho product_id {product_id}: {e}")
    
    # Dừng 1 giây giữa các yêu cầu để tránh bị chặn
    time.sleep(0.2)

# Chuyển dữ liệu sang DataFrameS
df_products = pd.DataFrame(products_data)

# Lưu dữ liệu vào file CSV
df_products.to_csv('data_vay_ngan.csv', index=False, encoding='utf-8-sig')
print("Dữ liệu đã được lưu vào file data_vay_ngan.csv.")
