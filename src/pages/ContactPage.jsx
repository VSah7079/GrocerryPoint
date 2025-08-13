import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.');
      return;
    }
    // Simulate form submission
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Have a question, feedback, or need help? Our team is here for you 24/7. Reach out and we'll get back to you as soon as possible!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            {submitted ? (
              <div className="text-green-600 text-lg font-semibold mb-6">Thank you! Your message has been sent. We'll get back to you soon.</div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Your Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Type your message..."
                  ></textarea>
                </div>
                {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-2xl">📍</span>
                  <span>123, Main Street, Connaught Place, New Delhi, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-2xl">📞</span>
                  <a href="tel:+911234567890" className="hover:underline">+91 12345 67890</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-2xl">✉️</span>
                  <a href="mailto:support@groccerypoint.com" className="hover:underline">support@groccerypoint.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-600 text-2xl">⏰</span>
                  <span>Support: 24/7 (including holidays)</span>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 text-2xl" title="WhatsApp"><span>🟢</span></a>
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-2xl" title="Facebook"><span>📘</span></a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 text-2xl" title="Twitter"><span>🐦</span></a>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 text-2xl" title="Instagram"><span>📸</span></a>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <iframe
                title="GrocerryPoint Location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.2090%2C28.6139%2C77.2190%2C28.6239&amp;layer=mapnik"
                className="w-full h-56 border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">We're here to help you!</h2>
          <p className="text-xl mb-8 text-green-100">
            Our support team is available 24/7. You can also check our <Link to="/faq" className="underline hover:text-white">FAQ</Link> page for quick answers.
          </p>
          <Link
            to="/"
            className="bg-white text-green-600 font-bold py-3 px-8 rounded-full hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 