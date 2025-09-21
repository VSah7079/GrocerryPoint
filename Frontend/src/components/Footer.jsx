import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Send } from 'lucide-react';
import { NewsletterAPI } from '../services/api';

// Grocery basket SVG icon
const GroceryLogo = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3.13V7M8 3.13V7"/><path d="M5 10h14"/></svg>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        const response = await NewsletterAPI.subscribe(email);
        
        if (response.success) {
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 2000);
          setEmail('');
        }
      } catch (err) {
        console.error('Newsletter subscription failed:', err);
        // Still show success to user for UX
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
        setEmail('');
      }
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
        {/* Left: Logo, tagline, social */}
        <div className="flex flex-col items-center md:items-start gap-4 md:w-1/3">
          <div className="flex items-center gap-2">
            <GroceryLogo />
            <span className="text-2xl font-extrabold tracking-tight text-slate-800">GrocerryPoint</span>
          </div>
          <p className="text-slate-500 text-sm text-center md:text-left">Your one-stop shop for fresh groceries, delivered to your door.</p>
          <div className="flex gap-3 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
          </div>
        </div>
        {/* Center: Nav links */}
        <nav className="flex flex-col items-center gap-2 md:gap-4 md:flex-row md:justify-center md:w-1/3">
          <Link to="/about" className="text-slate-700 hover:text-green-600 font-medium transition-colors px-3 py-1 rounded">About</Link>
          <Link to="/contact" className="text-slate-700 hover:text-green-600 font-medium transition-colors px-3 py-1 rounded">Contact</Link>
          <Link to="/faq" className="text-slate-700 hover:text-green-600 font-medium transition-colors px-3 py-1 rounded">FAQ</Link>
          <Link to="/privacy" className="text-slate-700 hover:text-green-600 font-medium transition-colors px-3 py-1 rounded">Privacy</Link>
        </nav>
        {/* Right: Newsletter */}
        <div className="flex flex-col items-center md:items-end gap-3 md:w-1/3">
          <span className="font-semibold text-slate-700 mb-1">Subscribe for offers</span>
          <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-xs rounded-full overflow-hidden border border-slate-300 bg-slate-100">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 p-2 px-4 text-slate-800 bg-transparent focus:outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={submitted}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 flex items-center justify-center transition-colors disabled:bg-green-400"
              disabled={submitted}
              aria-label="Subscribe"
            >
              <Send size={18} />
            </button>
          </form>
          {submitted && <div className="text-green-600 text-xs mt-1">Thank you for subscribing!</div>}
        </div>
      </div>
      <div className="bg-slate-100 border-t border-slate-200 py-3 text-center text-slate-500 text-xs">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-slate-700">GrocerryPoint</span>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer; 