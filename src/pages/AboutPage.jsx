import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const stats = [
    { number: '10,000+', label: 'Happy Customers', icon: '👥' },
    { number: '500+', label: 'Products Available', icon: '🛒' },
    { number: '50+', label: 'Cities Served', icon: '🏙️' },
    { number: '24/7', label: 'Customer Support', icon: '🔄' },
  ];

  const values = [
    {
      icon: '🌱',
      title: 'Fresh & Organic',
      description: 'We source only the freshest and highest quality organic products from trusted local farmers and suppliers.'
    },
    {
      icon: '⚡',
      title: 'Fast Delivery',
      description: 'Get your groceries delivered within 2 hours with our efficient delivery network and smart logistics.'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'We offer competitive prices and regular discounts to ensure you get the best value for your money.'
    },
    {
      icon: '🛡️',
      title: 'Quality Guarantee',
      description: 'Every product is carefully inspected and we offer a 100% satisfaction guarantee on all items.'
    }
  ];

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      bio: 'Passionate about revolutionizing grocery shopping with technology and customer-centric approach.'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'Expert in supply chain management with 15+ years of experience in retail operations.'
    },
    {
      name: 'Anjali Patel',
      role: 'Head of Technology',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Leading our tech team to build innovative solutions for seamless shopping experience.'
    },
    {
      name: 'Amit Singh',
      role: 'Head of Customer Success',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Dedicated to ensuring every customer has an exceptional shopping experience.'
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Started with a vision to make grocery shopping convenient and accessible for everyone.'
    },
    {
      year: '2021',
      title: 'First 1000 Customers',
      description: 'Reached our first milestone with 1000 happy customers across 5 cities.'
    },
    {
      year: '2022',
      title: 'Expansion & Growth',
      description: 'Expanded to 25+ cities and launched our mobile app for better user experience.'
    },
    {
      year: '2023',
      title: 'Market Leader',
      description: 'Became one of the leading online grocery platforms with 10,000+ customers.'
    },
    {
      year: '2024',
      title: 'Future Ready',
      description: 'Continuing to innovate and expand with AI-powered recommendations and faster delivery.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About GrocerryPoint
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 leading-relaxed">
              Revolutionizing grocery shopping with technology, quality, and convenience. 
              We're not just delivering groceries, we're delivering happiness to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products" 
                className="bg-white text-green-600 font-bold py-3 px-8 rounded-full hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
              >
                Shop Now
              </Link>
              <Link 
                to="/contact" 
                className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-600 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To provide every household with access to fresh, high-quality groceries at affordable prices, 
              delivered with speed and care. We believe that quality food should be accessible to everyone, 
              and we're committed to making that vision a reality through technology and exceptional service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&crop=center" 
                alt="Fresh Groceries" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-800">Why Choose GrocerryPoint?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-green-500 text-xl mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Fresh from Farm to Table</h4>
                    <p className="text-gray-600">Direct partnerships with local farmers ensure the freshest produce.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-500 text-xl mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Lightning Fast Delivery</h4>
                    <p className="text-gray-600">Get your groceries delivered within 2 hours of ordering.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-500 text-xl mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Best Price Guarantee</h4>
                    <p className="text-gray-600">We match or beat any competitor's price on the same product.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-green-500 text-xl mt-1">✓</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">24/7 Customer Support</h4>
                    <p className="text-gray-600">Our dedicated team is always here to help you.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These values guide everything we do and help us deliver exceptional service to our customers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind GrocerryPoint who work tirelessly to bring you the best grocery shopping experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-green-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From a small startup to a leading grocery platform, here's our story of growth and success.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {item.year}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience the Difference?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of satisfied customers and start shopping with GrocerryPoint today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-white text-green-600 font-bold py-3 px-8 rounded-full hover:bg-green-50 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
);
};

export default AboutPage; 