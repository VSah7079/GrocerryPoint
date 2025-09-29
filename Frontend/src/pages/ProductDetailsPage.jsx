import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { FaStar, FaRegStar, FaShoppingCart, FaBolt, FaTag, FaCheckCircle, FaFireAlt, FaLeaf, FaHeart, FaRegHeart, FaShareAlt } from 'react-icons/fa';
import ErrorBoundary from '../components/ErrorBoundary';

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const imgRef = useRef();

  // State management - ALL hooks must be at the top level
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  const [isWishlist, setIsWishlist] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [mainImage, setMainImage] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setProductLoading(true);
        const response = await ProductAPI.getProductById(productId);
        if (response.success) {
          setProduct(response.data.product);
          
          // Fetch related products from same category
          try {
            const relatedResponse = await ProductAPI.getAllProducts({ 
              category: response.data.product.category,
              limit: 5
            });
            if (relatedResponse.success) {
              const related = relatedResponse.data.products.filter(p => p._id !== productId);
              setRelatedProducts(related.slice(0, 4));
            }
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
          }
        } else {
          setProductError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProductError('Failed to load product details');
      } finally {
        setProductLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Image handling with fallbacks - only if product exists
  const images = product?.images?.length > 0
    ? product.images
    : product?.image ? [product.image] : [];

  // Update mainImage when product changes
  useEffect(() => {
    if (product && images.length > 0) {
      setMainImage(images[0]);
    }
  }, [product, images]);

  // Loading state
  if (productLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="h-96 bg-gray-300 rounded-lg"></div>
            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productError || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          {productError || 'Product not found!'}
        </h1>
        <p className="text-gray-600 mt-4">
          {productError ? 'Please try again later.' : "The product you're looking for doesn't exist."}
        </p>
        <button 
          onClick={() => navigate('/products')}
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  // Product details with defaults - safe destructuring
  const {
    name = '',
    category = '',
    price = 0,
    discount = 0,
    rating = 0,
    description = 'No description available',
    inStock = true,
    numReviews = 0,
  } = product || {};

  // Price calculations
  const newPrice = discount > 0 
    ? price - (price * discount) / 100 
    : price;
  const emiPrice = (newPrice / 3).toFixed(2);

  // Event handlers
  const handleImageLoad = () => setImageLoaded(true);
  
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/placeholder-product.jpg';
    setImageError(true);
    setImageLoaded(true);
  };

  const handleAddToCart = () => {
    if (loading) return;
    if (!user) {
      navigate('/login', { state: { from: `/product/${productId}`, action: 'cart' } });
      return;
    }
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1200);
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (loading) return;
    if (!user) {
      navigate('/login', { state: { from: `/product/${productId}`, action: 'buy' } });
      return;
    }
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      addToCart(product, quantity);
      navigate('/checkout');
    }, 1200);
  };

  const handleMouseMove = (e) => {
    if (!imgRef.current || !zoom) return;
    const rect = imgRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <span className="hover:text-blue-500 cursor-pointer">Home</span>
          <span>/</span>
          <span className="hover:text-blue-500 cursor-pointer">{category}</span>
          <span>/</span>
          <span className="text-gray-900">{name}</span>
        </nav>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Side - Product Images */}
            <div className="lg:col-span-5 p-4 border-r border-gray-200">
              <div className="sticky top-4">
                {/* Main Image */}
                <div 
                  className="relative h-[400px] mb-4 border border-gray-100 rounded-lg overflow-hidden"
                  onMouseEnter={() => setZoom(true)}
                  onMouseLeave={() => setZoom(false)}
                  onMouseMove={handleMouseMove}
                >
                  {mainImage && (
                    <img
                      ref={imgRef}
                      src={mainImage}
                      alt={name}
                      className={`w-full h-full object-contain p-4 transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  )}
                  
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
                  )}

                  {/* Zoom Lens */}
                  {zoom && (
                    <div 
                      className="absolute pointer-events-none w-32 h-32 border-2 border-blue-500 rounded-full"
                      style={{
                        left: `calc(${zoomPos.x}% - 64px)`,
                        top: `calc(${zoomPos.y}% - 64px)`,
                        backgroundImage: `url(${mainImage})`,
                        backgroundSize: `${imgRef.current?.naturalWidth}px ${imgRef.current?.naturalHeight}px`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      }}
                    />
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button 
                      onClick={() => setIsWishlist(!isWishlist)}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      {isWishlist ? (
                        <FaHeart className="text-red-500 text-xl" />
                      ) : (
                        <FaRegHeart className="text-gray-600 text-xl" />
                      )}
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all">
                      <FaShareAlt className="text-gray-600 text-lg" />
                    </button>
                  </div>

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {discount}% OFF
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex gap-2 overflow-x-auto p-2 scrollbar-hide">
                  {images.length > 0 && images.map((img, idx) => (
                    <button 
                      key={`${product.id}-${idx}`}
                      onClick={() => { 
                        setMainImage(img); 
                        setImageError(false);
                        setImageLoaded(false);
                      }}
                      className={`flex-shrink-0 relative ${mainImage === img ? 'border-2 border-blue-500' : 'border border-gray-200'} 
                        rounded-md p-1 hover:border-blue-500 transition-all duration-200`}
                    >
                      <img 
                        src={img} 
                        alt={`${name} thumbnail ${idx + 1}`}
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-thumbnail.jpg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div className="lg:col-span-7 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      {i < Math.floor(rating) ? <FaStar /> : <FaRegStar />}
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">{numReviews} reviews</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{newPrice.toFixed(2)}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{price.toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-white bg-green-500 px-3 py-1 rounded-full">
                        You save ₹{(price - newPrice).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                <div className="text-green-600 text-sm font-semibold mt-2 flex items-center gap-2">
                  <FaTag /> Best Price Guaranteed
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  EMI from ₹{emiPrice}/month
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    <FaCheckCircle /> 100% Quality Guarantee
                  </span>
                  <span className="flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    <FaBolt /> Express Delivery
                  </span>
                  {inStock ? (
                    <span className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      In Stock
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="font-semibold mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-lg hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 text-center w-12">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-lg hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={loading || !inStock}
                    className="flex-1 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50"
                  >
                    <FaShoppingCart className="mr-2" />
                    {loading ? 'Loading...' : 'Add to Cart'}
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    disabled={loading || !inStock}
                    className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:opacity-50"
                  >
                    <FaBolt className="mr-2" />
                    {loading ? 'Loading...' : 'Buy Now'}
                  </button>
                </div>

                {/* Login Notice */}
                {!user && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center">
                      <div className="text-yellow-600 mr-3">⚠️</div>
                      <div>
                        <p className="text-yellow-800 font-semibold">Login Required</p>
                        <p className="text-yellow-700 text-sm">Please login to add items to cart or make purchases.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  color: ['#f00', '#0f0', '#00f', '#ff0', '#f0f'][Math.floor(Math.random() * 5)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              >
                {['★', '✿', '❀', '✧', '✦', '❉', '❁'][Math.floor(Math.random() * 7)]}
              </div>
            ))}
          </div>
        )}

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaFireAlt className="text-orange-500 mr-2" />
            Customers also viewed
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.slice(0, 4).map(relatedProduct => (
                <div 
                  key={relatedProduct._id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/product/${relatedProduct._id}`)}
                >
                  <img 
                    src={relatedProduct.images?.[0] || relatedProduct.image} 
                    alt={relatedProduct.name} 
                    className="w-full h-40 object-contain mb-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="text-green-600 font-bold">
                    ₹{(
                      relatedProduct.discount > 0 
                        ? relatedProduct.price - (relatedProduct.price * relatedProduct.discount) / 100 
                        : relatedProduct.price
                    ).toFixed(2)}
                  </div>
                  {relatedProduct.discount > 0 && (
                    <div className="text-xs text-gray-500 line-through">
                      ₹{relatedProduct.price.toFixed(2)}
                    </div>
                  )}
                  {relatedProduct.discount > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full mt-1 inline-block">
                      {relatedProduct.discount}% OFF
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Confetti Animation Styles */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 2s linear forwards;
        }
      `}</style>
      </div>
    </ErrorBoundary>
  );
};

export default ProductDetailsPage;