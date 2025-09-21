import React, { useRef, useState, useEffect } from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import { Link } from 'react-router-dom';

// SVG Grocery Basket Logo
const GroceryLogo = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 animate-bounce drop-shadow-lg"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3.13V7M8 3.13V7" /><path d="M5 10h14" /></svg>
);

// SVG icons for features
const FeatureIcons = {
  delivery: (
    <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-green-500 mx-auto"><rect x="1" y="7" width="15" height="13" rx="2" /><path d="M16 7h3a2 2 0 0 1 2 2v5h-5V7z" /><circle cx="5.5" cy="20.5" r="1.5" /><circle cx="18.5" cy="20.5" r="1.5" /></svg>
  ),
  fresh: (
    <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-green-500 mx-auto"><path d="M12 2C7 7 2 12 12 22c10-10 5-15 0-20z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  price: (
    <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-green-500 mx-auto"><path d="M12 1v22M17 5H7m10 7H7m10 7H7" /></svg>
  ),
  secure: (
    <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-green-500 mx-auto"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  ),
};

// Categories based on actual mock products data
const categories = [
  {
    name: 'Grains & Rice',
    emoji: '🍚',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  {
    name: 'Oil & Ghee',
    emoji: '🛢️',
    color: 'bg-orange-100',
    textColor: 'text-orange-700',
  },
  {
    name: 'Spices',
    emoji: '�️',
    color: 'bg-red-100',
    textColor: 'text-red-700',
  },
  {
    name: 'Dairy Products',
    emoji: '�',
    color: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  {
    name: 'Pulses & Lentils',
    emoji: '🫘',
    color: 'bg-green-100',
    textColor: 'text-green-700',
  },
  {
    name: 'Beverages',
    emoji: '☕',
    color: 'bg-purple-100',
    textColor: 'text-purple-700',
  },
  {
    name: 'Sweeteners',
    emoji: '🍯',
    color: 'bg-amber-100',
    textColor: 'text-amber-700',
  },
];

const features = [
  {
    icon: FeatureIcons.delivery,
    title: 'Lightning Fast Delivery',
    description: 'Get your groceries delivered within 2 hours, guaranteed!'
  },
  {
    icon: FeatureIcons.fresh,
    title: 'Farm-Fresh Products',
    description: '100% fresh, organic, and locally sourced groceries.'
  },
  {
    icon: FeatureIcons.price,
    title: 'Unbeatable Prices',
    description: 'Best prices, exclusive deals, and regular discounts.'
  },
  {
    icon: FeatureIcons.secure,
    title: 'Secure Payments',
    description: 'Safe, encrypted, and trusted payment methods.'
  }
];

const howItWorks = [
  { step: 1, icon: '🛒', title: 'Browse & Add', desc: 'Explore categories and add products to your cart.' },
  { step: 2, icon: '📝', title: 'Checkout', desc: 'Quick, secure checkout with multiple payment options.' },
  { step: 3, icon: '🚚', title: 'Superfast Delivery', desc: 'Sit back and relax while we deliver to your door.' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Regular Customer',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: 'Amazing service! Fresh groceries delivered right to my doorstep. Highly recommended!',
    rating: 5
  },
  {
    name: 'Mike Chen',
    role: 'Home Chef',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: 'The quality of vegetables is outstanding. I love shopping here for my restaurant.',
    rating: 5
  },
  {
    name: 'Emily Davis',
    role: 'Busy Mom',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    content: 'Saves me so much time! The delivery is always on time and products are fresh.',
    rating: 5
  }
];

const HomePage = () => {
  const searchRef = useRef();

  // Special Offer Countdown Logic
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  const formatTime = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-400 via-green-500 to-green-700 text-white overflow-hidden pb-24">
        {/* Floating grocery illustrations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white opacity-10 rounded-full blur-2xl animate-pulse"></div>
        </div>
        <div className="container mx-auto px-4 pt-20 pb-10 relative z-10 flex flex-col items-center text-center">
          <GroceryLogo />
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            <span className="block">Fresh Groceries</span>
            <span className="block text-green-200">Delivered <span className="animate-pulse">Fast</span></span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-2xl mx-auto">
            Get the best quality organic products delivered to your doorstep within hours. Fresh, healthy, and convenient shopping experience.
          </p>
          {/* Search Bar */}
          <form className="w-full max-w-xl mx-auto mb-6 flex bg-white rounded-full overflow-hidden shadow-lg border-2 border-green-200">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search for fruits, veggies, brands..."
              className="flex-1 px-6 py-4 text-lg text-green-900 focus:outline-none"
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 font-bold text-lg transition-all">Search</button>
          </form>
          {/* Trust Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8">
            <span className="bg-white/80 text-green-700 font-bold px-4 py-2 rounded-full shadow">Trusted by 10,000+ families</span>
            <span className="flex items-center gap-1 text-yellow-400 font-bold text-lg ml-2">4.9/5 <span className="text-base">★</span> Rating</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/categories"
              className="bg-white text-green-600 font-bold py-4 px-8 rounded-full hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounce-slow"
            >
              Browse Categories
            </Link>
            <Link
              to="/products"
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="relative z-20 -mt-16 mb-12 flex justify-center">
        <div className="w-full max-w-3xl mx-auto bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center p-6 md:p-10 gap-6 border-4 border-white animate-pulse-slow">
          <div className="flex-shrink-0 w-32 h-32 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-lg border-2 border-yellow-200">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" alt="Fresh Mangoes" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 animate-bounce">LIMITED TIME OFFER</div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 drop-shadow">Deal of the Day: Juicy Alphonso Mangoes</h3>
            <p className="text-white/90 mb-3">Get 30% OFF on premium Alphonso mangoes. Sweet, fresh, and delivered to your door!</p>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
              <span className="bg-white text-pink-600 font-bold px-4 py-2 rounded-full shadow">Now ₹349 <span className="line-through text-slate-400 ml-2">₹499</span></span>
              <span className="bg-white/80 text-pink-700 font-bold px-3 py-2 rounded-full shadow flex items-center gap-1">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                {formatTime(timeLeft)} left
              </span>
            </div>
            <Link to="/products?category=fruits" className="inline-block bg-white text-pink-600 font-bold px-6 py-3 rounded-full shadow-lg hover:bg-pink-50 transition-all animate-bounce-slow">Shop Offer</Link>
          </div>
        </div>
        <style>{`
          .animate-pulse-slow {
            animation: pulse 2.5s infinite;
          }
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4); }
            50% { box-shadow: 0 0 40px 10px rgba(236, 72, 153, 0.15); }
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best grocery shopping experience with quality products and excellent service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-2xl transition-all duration-300 bg-slate-50">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Order groceries in 3 easy steps</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center bg-white rounded-xl shadow-md p-8 w-full max-w-xs hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4 animate-bounce-slow">{step.icon}</div>
                <div className="text-2xl font-bold text-green-700 mb-2">Step {step.step}</div>
                <div className="font-semibold text-gray-800 mb-1">{step.title}</div>
                <div className="text-gray-600 text-center">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-green-700 mb-4">🛒 Shop by Category</h2>
            <p className="text-xl text-gray-600">Explore our wide range of fresh products</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className={`group ${cat.color} ${cat.textColor} p-6 rounded-2xl flex flex-col items-center shadow hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-transparent hover:border-green-400 cursor-pointer`}
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">{cat.emoji}</div>
                <div className="font-bold text-lg mb-1 text-center">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Don't just take our word for it</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-green-50 p-6 rounded-xl shadow hover:scale-105 transition-transform duration-300 relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex mb-4 mt-8 justify-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic text-center">"{testimonial.content}"</p>
                <div className="text-center">
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Deals Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">🔥 Trending Deals</h2>
            <p className="text-xl text-gray-600">Don't miss out on these amazing offers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Deal Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1573246123716-6b1782bfc499?auto=format&fit=crop&w=800&q=80"
                  alt="Fresh Vegetables"
                  className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Save 25%
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Fresh Vegetable Bundle</h3>
                <p className="text-gray-600 mb-4">Get farm-fresh vegetables at wholesale prices</p>
                <div className="flex justify-between items-center">
                  <div className="text-green-600 font-bold">₹399 <span className="line-through text-gray-400 ml-2">₹599</span></div>
                  <Link to="/products" className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">Shop Now</Link>
                </div>
              </div>
            </div>

            {/* Deal Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1609501967126-1a42584de310?auto=format&fit=crop&w=800&q=80"
                  alt="Dry Fruits"
                  className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Save 30%
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Dry Fruits Pack</h3>
                <p className="text-gray-600 mb-4">Handpicked premium quality dry fruits</p>
                <div className="flex justify-between items-center">
                  <div className="text-green-600 font-bold">₹699 <span className="line-through text-gray-400 ml-2">₹999</span></div>
                  <Link to="/products" className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">Shop Now</Link>
                </div>
              </div>
            </div>

            {/* Deal Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=800&q=80"
                  alt="Breakfast Items"
                  className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Save 20%
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Breakfast Essentials</h3>
                <p className="text-gray-600 mb-4">Complete breakfast bundle with cereals & more</p>
                <div className="flex justify-between items-center">
                  <div className="text-green-600 font-bold">₹499 <span className="line-through text-gray-400 ml-2">₹629</span></div>
                  <Link to="/products" className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">Shop Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white relative">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of satisfied customers and get fresh groceries delivered today
          </p>
          <Link
            to="/signup"
            className="bg-white text-green-600 font-bold py-4 px-8 rounded-full hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounce-slow"
          >
            Get Started Now
          </Link>
        </div>
        {/* Sticky CTA for mobile */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 block md:hidden">
          <Link
            to="/signup"
            className="bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg animate-bounce-slow border-2 border-white"
          >
            Start Shopping
          </Link>
        </div>
      </section>
      <style>{`
        .animate-bounce-slow {
          animation: bounce 2.5s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          20% { transform: translateY(-8px); }
          40% { transform: translateY(0); }
          60% { transform: translateY(-4px); }
          80% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HomePage; 