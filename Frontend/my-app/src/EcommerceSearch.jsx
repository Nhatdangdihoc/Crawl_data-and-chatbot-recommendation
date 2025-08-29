import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, ShoppingCart, Eye } from 'lucide-react';

const EcommerceSearch = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    gender: '',
    priceRange: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const searchProducts = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.matches || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback với dữ liệu mẫu
      setProducts([
        {
          "category": "Quần short",
          "color": "['Xanh Đen']",
          "gender": "Nam",
          "inventory_status": "available",
          "list_price": "190000",
          "name": "Quần short nam đi biển thể thao mặc nhà - A093",
          "original_price": "190000",
          "price": "190000",
          "product_id": "147050196",
          "rating_average": "0.0",
          "review_count": "0",
          "rich_description": "Quần short nam đi biển thể thao mặc nhà - A093 thuộc danh mục Quần short, màu ['Xanh Đen'], dành cho Nam, giá 190,000đ",
          "similarity_score": 0.6984604232758903,
          "size": "['L', 'M', 'XL']",
          "sku": "7821905016034",
          "thumbnail_url": "https://salt.tikicdn.com/cache/280x280/ts/product/a9/33/ab/65dbc450593e5602e4eef1513d98a963.jpg",
          "url": "https://tiki.vn/product-p147050196.html?spid=147050198"
        },
        {
          "category": "Quần short",
          "color": "['Đen']",
          "gender": "Nam",
          "inventory_status": "available",
          "list_price": "105000",
          "name": "Quần short nam có Big Size 115kg lưng thun co giãn 4 chiều ,quần đùi nam thể thao cao cấp ShopN6 - QSB1",
          "original_price": "105000",
          "price": "59000",
          "product_id": "57758774",
          "rating_average": "4.5",
          "review_count": "63",
          "rich_description": "Quần short nam có Big Size 115kg lưng thun co giãn 4 chiều ,quần đùi nam thể thao cao cấp ShopN6 - QSB1 thuộc danh mục Quần short, màu ['Đen'], dành cho Nam, giá 59,000đ",
          "similarity_score": 0.6909956324962655,
          "size": "['3XL (68kg–75kg)', '4XL (75kg–85kg)', '5XL (85kg–95kg)', '6XL (95kg–115kg)', 'XL (50kg–58kg)', 'XXL (58kg–66kg)']",
          "sku": "3590128799513",
          "thumbnail_url": "https://salt.tikicdn.com/cache/280x280/ts/product/b7/bb/9d/e8e767df2dadb316e86a08e19cd1d271.jpg",
          "url": "https://tiki.vn/product-p57758774.html?spid=57758776"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    searchProducts();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const parseColors = (colorStr) => {
    try {
      return JSON.parse(colorStr.replace(/'/g, '"'));
    } catch {
      return [colorStr];
    }
  };

  const parseSizes = (sizeStr) => {
    try {
      return JSON.parse(sizeStr.replace(/'/g, '"'));
    } catch {
      return [sizeStr];
    }
  };

  const quickSearches = [
    "quần short nam đen",
    "quần thể thao",
    "quần đi biển",
    "quần size XL"
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      backgroundColor: '#ffffff',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #e5e7eb'
    },
    headerContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '24px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '30px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    filterButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      color: '#6b7280',
      background: 'none',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'color 0.3s ease'
    },
    mainContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '32px 16px'
    },
    searchSection: {
      marginBottom: '32px'
    },
    searchContainer: {
      position: 'relative'
    },
    searchWrapper: {
      position: 'relative'
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '48px',
      paddingRight: '128px',
      padding: '16px 128px 16px 48px',
      fontSize: '18px',
      border: '2px solid #e5e7eb',
      borderRadius: '16px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
    },
    searchInputFocus: {
      borderColor: '#3b82f6'
    },
    searchButton: {
      position: 'absolute',
      right: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
      color: 'white',
      padding: '8px 24px',
      borderRadius: '12px',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    searchButtonHover: {
      background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)'
    },
    searchButtonDisabled: {
      opacity: '0.5',
      cursor: 'not-allowed'
    },
    quickSearchContainer: {
      marginTop: '16px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      alignItems: 'center'
    },
    quickSearchLabel: {
      color: '#6b7280',
      marginRight: '8px'
    },
    quickSearchButton: {
      padding: '4px 12px',
      backgroundColor: '#f3f4f6',
      border: 'none',
      borderRadius: '20px',
      fontSize: '14px',
      color: '#374151',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    quickSearchButtonHover: {
      backgroundColor: '#dbeafe',
      color: '#1d4ed8'
    },
    filtersContainer: {
      marginBottom: '24px',
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    },
    filtersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
    },
    filterSelect: {
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.3s ease'
    },
    filterSelectFocus: {
      borderColor: '#3b82f6'
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '64px 0'
    },
    spinner: {
      width: '64px',
      height: '64px',
      border: '4px solid #3b82f6',
      borderTop: '4px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    resultsCount: {
      marginBottom: '24px',
      color: '#6b7280'
    },
    resultsCountNumber: {
      fontWeight: '600',
      color: '#2563eb'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px'
    },
    productCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      transition: 'all 0.3s ease',
      overflow: 'hidden'
    },
    productCardHover: {
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-4px)'
    },
    productImageContainer: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '16px 16px 0 0'
    },
    productImage: {
      width: '100%',
      height: '256px',
      objectFit: 'cover',
      transition: 'transform 0.3s ease'
    },
    productImageHover: {
      transform: 'scale(1.05)'
    },
    discountBadge: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500'
    },
    eyeButton: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '8px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      opacity: '0',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    eyeButtonShow: {
      opacity: '1'
    },
    productInfo: {
      padding: '20px'
    },
    productName: {
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '8px',
      lineHeight: '1.4',
      display: '-webkit-box',
      WebkitLineClamp: '2',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      transition: 'color 0.3s ease'
    },
    productNameHover: {
      color: '#2563eb'
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px'
    },
    starsContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    reviewCount: {
      fontSize: '14px',
      color: '#6b7280'
    },
    attributesContainer: {
      marginBottom: '12px'
    },
    attributeRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    },
    attributeLabel: {
      fontSize: '12px',
      color: '#6b7280'
    },
    attributeValues: {
      display: 'flex',
      gap: '4px'
    },
    colorTag: {
      fontSize: '12px',
      backgroundColor: '#f3f4f6',
      padding: '2px 8px',
      borderRadius: '4px'
    },
    sizeTag: {
      fontSize: '12px',
      backgroundColor: '#eff6ff',
      color: '#1d4ed8',
      padding: '2px 8px',
      borderRadius: '4px'
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    priceSection: {
      display: 'flex',
      flexDirection: 'column'
    },
    currentPrice: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#dc2626'
    },
    originalPrice: {
      fontSize: '14px',
      color: '#6b7280',
      textDecoration: 'line-through'
    },
    productId: {
      fontSize: '12px',
      color: '#6b7280',
      backgroundColor: '#f3f4f6',
      padding: '4px 8px',
      borderRadius: '4px'
    },
    actionsContainer: {
      display: 'flex',
      gap: '8px'
    },
    viewDetailButton: {
      flex: '1',
      background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '12px',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.3s ease'
    },
    viewDetailButtonHover: {
      background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)'
    },
    noResultsContainer: {
      textAlign: 'center',
      padding: '64px 0'
    },
    noResultsEmoji: {
      fontSize: '60px',
      marginBottom: '16px'
    },
    noResultsTitle: {
      fontSize: '20px',
      color: '#6b7280',
      marginBottom: '8px'
    },
    noResultsDesc: {
      color: '#9ca3af'
    },
    sampleSearchButton: {
      marginTop: '24px',
      padding: '12px 24px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease'
    },
    footer: {
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '32px 0',
      marginTop: '64px'
    },
    footerContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 16px',
      textAlign: 'center'
    },
    footerText: {
      color: '#9ca3af'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        
        .product-card:hover .eye-button {
          opacity: 1;
        }
        
        .product-card:hover .product-name {
          color: #2563eb;
        }
        
        .product-card:hover {
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          transform: translateY(-4px);
        }
        
        .filter-button:hover {
          color: #2563eb;
        }
        
        .quick-search-button:hover {
          background-color: #dbeafe;
          color: #1d4ed8;
        }
        
        .search-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%);
        }
        
        .view-detail-button:hover {
          background: linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%);
        }
        
        .sample-search-button:hover {
          background-color: #1d4ed8;
        }
        
        .filter-select:focus {
          border-color: #3b82f6;
        }
        
        .search-input:focus {
          border-color: #3b82f6;
        }

        @media (max-width: 768px) {
          .filters-grid {
            grid-template-columns: 1fr;
          }
          
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
          
          .header-container {
            flex-direction: column;
            gap: 16px;
          }
        }

        @media (max-width: 640px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
          
          .quick-search-container {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer} className="header-container">
          <h1 style={styles.title}>
            Fashion Search
          </h1>
          <div>
            <button 
              style={styles.filterButton}
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              <span>Bộ lọc</span>
            </button>
          </div>
        </div>
      </header>

      <div style={styles.mainContainer}>
        {/* Search Section */}
        <div style={styles.searchSection}>
          <div style={styles.searchContainer}>
            <div style={styles.searchWrapper}>
              <Search style={styles.searchIcon} size={24} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                placeholder="Tìm kiếm sản phẩm... (ví dụ: quần short nam đen size L)"
                style={styles.searchInput}
                className="search-input"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                style={{
                  ...styles.searchButton,
                  ...(loading ? styles.searchButtonDisabled : {})
                }}
                className="search-button"
              >
                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </div>
          </div>

          {/* Quick Search Tags */}
          <div style={styles.quickSearchContainer} className="quick-search-container">
            <span style={styles.quickSearchLabel}>Tìm kiếm nhanh:</span>
            {quickSearches.map((quickQuery, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(quickQuery);
                  searchProducts(quickQuery);
                }}
                style={styles.quickSearchButton}
                className="quick-search-button"
              >
                {quickQuery}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div style={styles.filtersContainer}>
            <div style={styles.filtersGrid} className="filters-grid">
              <select 
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                style={styles.filterSelect}
                className="filter-select"
              >
                <option value="">Tất cả danh mục</option>
                <option value="Quần short">Quần short</option>
              </select>
              
              <select 
                value={filters.gender}
                onChange={(e) => setFilters({...filters, gender: e.target.value})}
                style={styles.filterSelect}
                className="filter-select"
              >
                <option value="">Tất cả giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>

              <select 
                value={filters.color}
                onChange={(e) => setFilters({...filters, color: e.target.value})}
                style={styles.filterSelect}
                className="filter-select"
              >
                <option value="">Tất cả màu sắc</option>
                <option value="Đen">Đen</option>
                <option value="Trắng">Trắng</option>
                <option value="Xanh">Xanh</option>
              </select>

              <select 
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                style={styles.filterSelect}
                className="filter-select"
              >
                <option value="">Tất cả giá</option>
                <option value="0-100000">Dưới 100k</option>
                <option value="100000-200000">100k - 200k</option>
                <option value="200000-500000">200k - 500k</option>
                <option value="500000+">Trên 500k</option>
              </select>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div style={styles.resultsCount}>
              Tìm thấy <span style={styles.resultsCountNumber}>{products.length}</span> sản phẩm
            </div>
            
            <div style={styles.productsGrid} className="products-grid">
              {products.map((product) => (
                <div key={product.product_id} style={styles.productCard} className="product-card">
                  {/* Product Image */}
                  <div style={styles.productImageContainer}>
                    <img
                      src={product.thumbnail_url}
                      alt={product.name}
                      style={styles.productImage}
                      className="product-image"
                    />
                    {product.price < product.original_price && (
                      <div style={styles.discountBadge}>
                        -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                      </div>
                    )}
                    <button style={styles.eyeButton} className="eye-button">
                      <Eye size={18} color="#6b7280" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName} className="product-name">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div style={styles.ratingContainer}>
                      <div style={styles.starsContainer}>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            color={i < Math.floor(product.rating_average) ? '#fbbf24' : '#d1d5db'}
                            fill={i < Math.floor(product.rating_average) ? '#fbbf24' : 'none'}
                          />
                        ))}
                      </div>
                      <span style={styles.reviewCount}>
                        ({product.review_count} đánh giá)
                      </span>
                    </div>

                    {/* Colors & Sizes */}
                    <div style={styles.attributesContainer}>
                      <div style={styles.attributeRow}>
                        <span style={styles.attributeLabel}>Màu:</span>
                        <div style={styles.attributeValues}>
                          {parseColors(product.color).slice(0, 3).map((color, index) => (
                            <span key={index} style={styles.colorTag}>
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {product.size && (
                        <div style={styles.attributeRow}>
                          <span style={styles.attributeLabel}>Size:</span>
                          <div style={styles.attributeValues}>
                            {parseSizes(product.size).slice(0, 4).map((size, index) => (
                              <span key={index} style={styles.sizeTag}>
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div style={styles.priceContainer}>
                      <div style={styles.priceSection}>
                        <div style={styles.currentPrice}>
                          {formatPrice(product.price)}
                        </div>
                        {product.price < product.original_price && (
                          <div style={styles.originalPrice}>
                            {formatPrice(product.original_price)}
                          </div>
                        )}
                      </div>
                      <div style={styles.productId}>
                        ID: {product.product_id}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={styles.actionsContainer}>
                      <button 
                        onClick={() => window.open(product.url, '_blank')}
                        style={styles.viewDetailButton}
                        className="view-detail-button"
                      >
                        <ShoppingCart size={18} />
                        <span>Xem chi tiết</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={styles.noResultsContainer}>
            <div style={styles.noResultsEmoji}>🔍</div>
            <h3 style={styles.noResultsTitle}>Chưa có kết quả tìm kiếm</h3>
            <p style={styles.noResultsDesc}>Nhập từ khóa và nhấn tìm kiếm để bắt đầu</p>
            <div>
              <button
                onClick={() => {
                  setQuery('quần short nam đen size L');
                  searchProducts('quần short nam đen size L');
                }}
                style={styles.sampleSearchButton}
                className="sample-search-button"
              >
                Thử tìm kiếm mẫu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <p style={styles.footerText}>
            Fashion Search - Tìm kiếm thông minh với AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EcommerceSearch;