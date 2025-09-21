import React from 'react';

const PrivacyPolicyPage = () => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <h1 className="text-4xl font-extrabold mb-8 text-slate-800">Privacy Policy & Terms</h1>
    <div className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-2 text-green-700">Privacy Policy</h2>
        <p className="text-slate-700">We value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data when you use GrocerryPoint.</p>
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-1 text-slate-800">1. Data Collection</h3>
        <p className="text-slate-700">We collect information you provide directly (such as when you create an account, place an order, or contact support) and data collected automatically (such as device, browser, and usage information via cookies and analytics tools).</p>
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-1 text-slate-800">2. Use of Data</h3>
        <p className="text-slate-700">Your data is used to process orders, improve our services, personalize your experience, and communicate important updates. We do not sell or share your personal information with third parties except as required by law or to fulfill your orders.</p>
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-1 text-slate-800">3. Cookies & Tracking</h3>
        <p className="text-slate-700">We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand user behavior. You can control cookie preferences in your browser settings.</p>
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-1 text-slate-800">4. Your Rights</h3>
        <p className="text-slate-700">You have the right to access, update, or delete your personal information at any time. To exercise these rights, please contact our support team.</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-2 text-green-700">Terms & Conditions</h2>
        <p className="text-slate-700">By using GrocerryPoint, you agree to our terms and conditions. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.</p>
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-1 text-slate-800">5. Changes to Policy</h3>
        <p className="text-slate-700">We may update this policy from time to time. Any changes will be posted on this page with an updated effective date.</p>
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-1 text-slate-800">6. Contact Us</h3>
        <p className="text-slate-700">If you have any questions or concerns about our Privacy Policy or Terms, please contact our support team at <a href="mailto:support@grocerrypoint.com" className="text-green-700 underline">support@grocerrypoint.com</a>.</p>
      </section>
    </div>
  </div>
);

export default PrivacyPolicyPage; 