import pandas as pd
import numpy as np
import ast
from numpy.linalg import norm
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from sentence_transformers import SentenceTransformer
import logging
from typing import Tuple, Dict, Any
import time

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load dữ liệu
logger.info("Loading dataset...")
df = pd.read_csv("data_Quan_Ao_with_vectordb.csv")

# Chuyển cột vector_db từ string -> numpy array và normalize
logger.info("Processing vectors...")
def parse_and_normalize_vector(x):
    vec = np.array(ast.literal_eval(x))
    return vec / norm(vec)  # Pre-normalize để tối ưu tính cosine similarity

df["vector_db"] = df["vector_db"].apply(parse_and_normalize_vector)

# Tạo rich description nếu chưa có
def create_rich_description(row):
    desc = f"{row['name']}"
    if pd.notna(row.get('category')):
        desc += f" thuộc danh mục {row['category']}"
    if pd.notna(row.get('color')):
        color = row['color']
        if isinstance(color, str) and color.startswith('['):
            try:
                color_list = ast.literal_eval(color)
                color = color_list[0] if color_list else color
            except:
                pass
        desc += f", màu {color}"
    if pd.notna(row.get('gender')):
        desc += f", dành cho {row['gender']}"
    if pd.notna(row.get('price')):
        desc += f", giá {int(row['price']):,}đ"
    return desc

# Thêm rich description nếu chưa có
if 'rich_description' not in df.columns:
    logger.info("Creating rich descriptions...")
    df['rich_description'] = df.apply(create_rich_description, axis=1)

logger.info(f"Dataset loaded: {len(df)} products")

# Hàm tìm top-k matches với filtering
def find_best_matches(query: str, model: SentenceTransformer, df: pd.DataFrame, 
                     top_k: int = 5, min_score: float = 0.3, 
                     filters: Dict = None) -> Tuple[pd.DataFrame, np.ndarray]:
    
    # Encode query và normalize
    q_vec = model.encode(query)
    q_vec = q_vec / norm(q_vec)
    
    # Áp dụng filters nếu có
    filtered_df = df.copy()
    if filters:
        for key, value in filters.items():
            if key in filtered_df.columns and value:
                if key == 'gender':
                    filtered_df = filtered_df[filtered_df[key].str.lower() == value.lower()]
                elif key == 'category':
                    filtered_df = filtered_df[filtered_df[key].str.contains(value, case=False, na=False)]
                elif key == 'color':
                    # Handle color as list or string
                    filtered_df = filtered_df[filtered_df[key].str.contains(value, case=False, na=False)]
                elif key == 'price_range':
                    if isinstance(value, dict) and 'min' in value and 'max' in value:
                        filtered_df = filtered_df[
                            (filtered_df['price'] >= value['min']) & 
                            (filtered_df['price'] <= value['max'])
                        ]
    
    if len(filtered_df) == 0:
        return pd.DataFrame(), np.array([])
    
    # Tính cosine similarity (đã pre-normalized nên chỉ cần dot product)
    similarities = filtered_df["vector_db"].apply(lambda v: np.dot(q_vec, v))
    
    # Lọc theo min_score và lấy top-k
    valid_indices = similarities[similarities >= min_score].index
    if len(valid_indices) == 0:
        # Nếu không có match nào đủ điểm, lấy top match
        best_idx = similarities.idxmax()
        return filtered_df.loc[[best_idx]], np.array([similarities[best_idx]])
    
    # Sort và lấy top-k
    top_indices = similarities.loc[valid_indices].nlargest(top_k).index
    return filtered_df.loc[top_indices], similarities.loc[top_indices].values

# Hàm convert row DataFrame sang dict JSON-friendly
def row_to_dict(row: pd.Series) -> Dict[str, Any]:
    result = {}
    for col, val in row.items():
        if col == 'vector_db':
            continue  # Skip vector data in response
        elif isinstance(val, (np.integer, np.int32, np.int64)):
            result[col] = int(val)
        elif isinstance(val, (np.floating, np.float32, np.float64)):
            result[col] = float(val)
        elif isinstance(val, np.ndarray):
            result[col] = val.tolist()
        else:
            result[col] = str(val) if pd.notna(val) else None
    return result

# Khởi tạo Flask
app = Flask(__name__)

# Cấu hình CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
        "supports_credentials": True
    }
})

# Load model BERT tốt hơn
logger.info("Loading BERT model...")
model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-mpnet-base-v2')
logger.info("Model loaded successfully!")

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "ok", 
        "message": "Fashion Search API is running",
        "model": "paraphrase-multilingual-mpnet-base-v2",
        "total_products": len(df),
        "cors_enabled": True
    }), 200

@app.route("/search", methods=["POST", "OPTIONS"])
def search():
    # Handle preflight requests
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        return response
        
    start_time = time.time()
    
    try:
        data = request.get_json()
        query = data.get("query", "").strip()
        top_k = min(data.get("top_k", 5), 20)  # Giới hạn max 20
        min_score = data.get("min_score", 0.3)
        filters = data.get("filters", {})
        
        if not query:
            return jsonify({"error": "Missing or empty query"}), 400
        
        logger.info(f"Search query: '{query}' with filters: {filters}")
        
        # Tìm matches
        matches_df, scores = find_best_matches(
            query, model, df, top_k=top_k, min_score=min_score, filters=filters
        )
        
        if len(matches_df) == 0:
            return jsonify({
                "query": query,
                "matches": [],
                "total_found": 0,
                "message": "No products found matching your criteria"
            }), 200
        
        # Convert results
        results = []
        for idx, (_, row) in enumerate(matches_df.iterrows()):
            result = row_to_dict(row)
            result['similarity_score'] = float(scores[idx])
            results.append(result)
        
        processing_time = time.time() - start_time
        
        response_data = {
            "query": query,
            "matches": results,
            "total_found": len(results),
            "processing_time_ms": round(processing_time * 1000, 2),
            "filters_applied": filters
        }
        
        logger.info(f"Found {len(results)} matches in {processing_time:.3f}s")
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route("/stats", methods=["GET"])
def stats():
    """Endpoint để xem thống kê dataset"""
    try:
        stats = {
            "total_products": len(df),
            "categories": df['category'].value_counts().to_dict() if 'category' in df.columns else {},
            "genders": df['gender'].value_counts().to_dict() if 'gender' in df.columns else {},
            "price_range": {
                "min": float(df['price'].min()) if 'price' in df.columns else None,
                "max": float(df['price'].max()) if 'price' in df.columns else None,
                "avg": float(df['price'].mean()) if 'price' in df.columns else None
            },
            "available_filters": ["gender", "category", "color", "price_range"],
            "cors_enabled": True
        }
        return jsonify(stats)
    except Exception as e:
        logger.error(f"Stats error: {str(e)}")
        return jsonify({"error": "Could not generate stats"}), 500

# Health check endpoint
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": time.time(),
        "model_loaded": model is not None,
        "dataset_size": len(df)
    }), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 Fashion Search API Starting...")
    print(f"📊 Loaded {len(df)} products")
    print("🤖 Model: paraphrase-multilingual-mpnet-base-v2")
    print("🌐 Server: http://localhost:5000")
    print("✅ CORS enabled for frontend development")
    print("🔗 Allowed origins: localhost:3000, localhost:8080")
    print("="*60 + "\n")
    
    app.run(debug=True, use_reloader=False, host='0.0.0.0', port=5000)