import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: 'Ordering & Products',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Placing an order is simple! Browse our product categories, add items to your cart by clicking the "Add to Cart" button, and when you\'re ready, click the cart icon and proceed to checkout. Follow the steps to enter your shipping address, choose a delivery slot, and complete the payment.'
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'Unfortunately, once an order is placed, it cannot be modified. However, you can cancel it within 10 minutes of placing it from your "Order History" page. After that, the order is processed for delivery.'
      },
      {
        q: 'How do I find specific products?',
        a: 'You can use the search bar at the top of the page to search for any product by name. You can also use our filters on the product listing page to narrow down your search by category, price, and other attributes.'
      },
    ],
  },
  {
    category: 'Payment & Pricing',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept a wide range of payment methods including Credit/Debit Cards (Visa, MasterCard, Amex), UPI, Netbanking, and Pay on Delivery (Cash or UPI).'
      },
      {
        q: 'Are there any hidden charges or taxes?',
        a: 'No, the price you see on the product page is the final price. All taxes are included. A nominal delivery fee may be applied at checkout based on your order value.'
      },
    ],
  },
  {
    category: 'Delivery',
    questions: [
      {
        q: 'What are your delivery hours?',
        a: 'We deliver every day from 9 AM to 9 PM. You can choose a convenient two-hour delivery slot during the checkout process.'
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is out for delivery, you can track it in real-time from the "Order Tracking" page in your account dashboard. We will also send you SMS notifications at each stage.'
      },
      {
        q: 'What if I miss my delivery?',
        a: 'Our delivery partner will attempt to contact you. If they are unable to reach you, they will make a second attempt on the next business day. You can also reschedule the delivery from your order details page.'
      },
    ],
  },
];

const FAQItem = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="border-b border-slate-200 py-4">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-slate-800 focus:outline-none"
      >
        <span>{faq.q}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
        <p className="text-slate-600">
          {faq.a}
        </p>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleToggle = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-slate-800">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-600 mt-4 max-w-2xl mx-auto">Have questions? We're here to help. Find answers to common queries below.</p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="mb-12">
              <h2 className="text-3xl font-bold text-green-600 mb-6 pb-2 border-b-2 border-green-200">{category.category}</h2>
              <div className="bg-white p-8 rounded-xl shadow-md space-y-2">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = `${catIndex}-${faqIndex}`;
                  return (
                    <FAQItem
                      key={globalIndex}
                      faq={faq}
                      isOpen={openFAQ === globalIndex}
                      onToggle={() => handleToggle(globalIndex)}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div className="text-center bg-white p-10 rounded-xl shadow-md mt-16">
            <h3 className="text-3xl font-bold text-slate-800">Can't find your answer?</h3>
            <p className="text-lg text-slate-600 mt-3">
              Our team is just a click away. Reach out to us for any further questions.
            </p>
            <Link to="/contact" className="mt-6 inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage; 