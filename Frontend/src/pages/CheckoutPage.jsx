import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaRegCreditCard, FaRegClock, FaRegAddressCard, FaCheckCircle, FaUserShield, FaStar, FaMoneyBillWave, FaMobileAlt, FaHandHoldingUsd } from 'react-icons/fa';

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: '', mobile: '', pincode: '', city: '', state: '', street: '' });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('Credit/Debit Card');
  const { cartItems, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  
  const total = cartItems.reduce((acc, item) => {
    const price = item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price;
    return acc + price * item.quantity;
  }, 0);
  
  const deliveryFee = total > 0 ? 5.00 : 0;
  const grandTotal = total + deliveryFee;

  const handlePlaceOrder = () => {
    const orderDetails = {
        items: cartItems,
        total,
      deliveryFee,
      grandTotal,
        deliveryTime: selectedTimeSlot,
        paymentMethod: selectedPayment,
      shippingAddress: address
    };
    console.log("Order Placed:", orderDetails);
    clearCart();
    navigate('/order-confirmation', { state: { orderDetails } });
  };
    
  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  if (cartCount === 0) {
      return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-4xl font-bold text-slate-800">Your Cart is Empty</h1>
        <p className="text-lg text-slate-600 my-4">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-all duration-300">
                  Continue Shopping
              </Link>
          </div>
    );
  }
  
  const STEPS = [
    { number: 1, title: 'Shipping', icon: '🚚' },
    { number: 2, title: 'Delivery', icon: '🕒' },
    { number: 3, title: 'Payment', icon: '💳' },
  ];

  return (
    <div className="bg-gradient-to-br from-green-100 via-green-50 to-green-200 min-h-screen font-sans">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-green-500 to-green-700 py-12 mb-10 shadow-lg rounded-b-3xl">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          <div className="text-white mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 flex items-center gap-3">
              <FaShoppingCart className="inline-block text-5xl animate-bounce" /> Checkout
            </h1>
            <p className="text-lg md:text-2xl font-medium opacity-90">Fast, Secure & Fresh Delivery to Your Doorstep</p>
          </div>
          <div className="hidden md:block">
            <img src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png" alt="Cart" className="w-40 h-40 drop-shadow-2xl animate-float" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Stepper */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {STEPS.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full text-2xl font-bold shadow-lg transition-all duration-300 ${
                    step >= s.number ? 'bg-green-600 text-white scale-110' : 'bg-slate-200 text-slate-500'
                  } animate-fade-in`}>
                    {step > s.number ? <FaCheckCircle /> : s.icon === '🚚' ? <FaRegAddressCard /> : s.icon === '🕒' ? <FaRegClock /> : <FaRegCreditCard />}
                  </div>
                  <span className={`mt-2 font-semibold text-base ${step >= s.number ? 'text-green-700' : 'text-slate-500'}`}>{s.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-auto border-t-4 mx-4 transition-all duration-500 ${
                    step > s.number ? 'border-green-600' : 'border-slate-300'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Column: Forms */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-2xl p-10 animate-fade-in">
              {step === 1 && <AddressForm address={address} setAddress={handleAddressChange} nextStep={() => setStep(2)} />}
              {step === 2 && <TimeSlotForm selected={selectedTimeSlot} setSelected={setSelectedTimeSlot} nextStep={() => setStep(3)} prevStep={() => setStep(1)} />}
              {step === 3 && <PaymentForm selected={selectedPayment} setSelected={setSelectedPayment} placeOrder={handlePlaceOrder} prevStep={() => setStep(2)} grandTotal={grandTotal} />}
            </div>
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center animate-fade-in">
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full shadow text-green-700 font-semibold"><FaUserShield /> 100% Secure Payments</div>
              <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full shadow text-yellow-700 font-semibold"><FaStar /> 4.9/5 Customer Rating</div>
              <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full shadow text-blue-700 font-semibold">🚚 Fast Delivery</div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-8 animate-fade-in">
              <h2 className="text-2xl font-extrabold text-green-700 mb-6 border-b pb-4 flex items-center gap-2"><FaShoppingCart /> Your Order</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-green-50 rounded-xl p-3 shadow-sm">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg mr-4 object-cover border-2 border-green-200" />
                      <div>
                        <p className="font-semibold text-green-900">{item.name}</p>
                        <p className="text-xs text-green-700">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-green-800 text-lg">
                      ₹{((item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Have a promo code?</h3>
                <div className="flex">
                  <input type="text" placeholder="Enter code" className="p-2 border-2 border-green-200 rounded-l-lg w-full focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  <button className="bg-green-600 text-white px-4 rounded-r-lg font-semibold hover:bg-green-700 transition-colors">Apply</button>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex justify-between text-green-700">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-extrabold text-green-900">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddressForm = ({ address, setAddress, nextStep }) => (
  <div className="animate-fade-in">
    <h2 className="text-2xl font-bold text-slate-800 mb-6">1. Shipping Address</h2>
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={address.name} onChange={setAddress} placeholder="Full Name" className="p-3 border border-slate-300 rounded-lg w-full focus:ring-2 focus:ring-green-500" required />
        <input name="mobile" value={address.mobile} onChange={setAddress} placeholder="Mobile Number" className="p-3 border border-slate-300 rounded-lg w-full focus:ring-2 focus:ring-green-500" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input name="pincode" value={address.pincode} onChange={setAddress} placeholder="Pincode" className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
        <input name="city" value={address.city} onChange={setAddress} placeholder="City" className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
        <input name="state" value={address.state} onChange={setAddress} placeholder="State" className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
                </div>
      <textarea name="street" value={address.street} onChange={setAddress} placeholder="Street Address, House No." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500" rows="3" required></textarea>
      <button type="submit" className="w-full bg-green-600 text-white py-3 mt-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
        Continue to Delivery Slot
                </button>
              </form>
            </div>
);

const TimeSlotForm = ({ selected, setSelected, nextStep, prevStep }) => {
  const timeSlots = ['9am - 11am', '11am - 1pm', '1pm - 3pm', '5pm - 7pm', '7pm - 9pm', 'Anytime'];
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">2. Delivery Time Slot</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {timeSlots.map(slot => (
          <button key={slot} onClick={() => setSelected(slot)} className={`p-4 border rounded-lg text-center font-medium transition-all duration-200 ${selected === slot ? 'bg-green-600 text-white ring-2 ring-green-700 shadow-lg' : 'bg-slate-100 hover:bg-slate-200'}`}>
                            {slot}
                        </button>
                    ))}
                </div>
      <div className="flex justify-between items-center mt-8">
        <button onClick={prevStep} className="text-slate-600 font-semibold hover:text-slate-800 transition-colors">← Back to Address</button>
        <button onClick={nextStep} disabled={!selected} className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700 disabled:bg-slate-400 transition-all duration-300 transform hover:scale-105">
                  Continue to Payment
                </button>
            </div>
    </div>
  );
};

const PaymentForm = ({ selected, setSelected, placeOrder, prevStep, grandTotal }) => {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const paymentOptions = [
    { name: 'Credit/Debit Card', icon: <FaRegCreditCard className="text-green-600 animate-bounce" /> }, 
    { name: 'UPI / Netbanking', icon: <FaMobileAlt className="text-green-600 animate-bounce" /> }, 
    { name: 'Pay on Delivery', icon: <FaMoneyBillWave className="text-green-600 animate-bounce" /> }
  ];

  const handlePlaceOrder = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      placeOrder();
    }, 1800);
  };

  return (
    <div className="animate-fade-in relative overflow-hidden">
      <h2 className="text-3xl font-extrabold text-green-700 mb-8 flex items-center gap-2">
        <FaHandHoldingUsd className="text-4xl animate-bounce" /> 3. Payment Options
      </h2>
      <div className="space-y-6">
        {paymentOptions.map(option => (
          <div key={option.name}>
            <div onClick={() => setSelected(option.name)} className={`p-5 border-2 rounded-2xl flex items-center cursor-pointer transition-all duration-200 shadow-lg ${selected === option.name ? 'border-green-600 ring-2 ring-green-500 bg-green-50 scale-105' : 'hover:bg-slate-50'}`}>
              <span className="text-3xl mr-5">{option.icon}</span>
              <span className="text-xl font-bold text-green-900">{option.name}</span>
              <div className="ml-auto">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === option.name ? 'border-green-600 bg-green-600' : 'border-slate-300'}`}>{selected === option.name && <FaCheckCircle className="text-white text-lg" />}</div>
              </div>
            </div>
            {selected === 'Credit/Debit Card' && option.name === 'Credit/Debit Card' && (
              <div className="pl-4 pr-4 pt-4 -mt-2 bg-green-50 border-l-2 border-r-2 border-b-2 border-green-600 rounded-b-2xl animate-fade-in-down">
                <div className="space-y-3">
                  <input type="text" placeholder="Card Number" className="w-full p-3 border-2 border-green-200 rounded-lg" />
                  <div className="flex gap-3">
                    <input type="text" placeholder="MM / YY" className="w-1/2 p-3 border-2 border-green-200 rounded-lg" />
                    <input type="text" placeholder="CVC" className="w-1/2 p-3 border-2 border-green-200 rounded-lg" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-10">
        <button onClick={prevStep} className="text-green-700 font-bold hover:text-green-900 transition-colors">← Back to Delivery</button>
        <button onClick={handlePlaceOrder} className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-10 rounded-2xl font-extrabold text-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 relative overflow-hidden">
          <FaMoneyBillWave className="text-2xl animate-bounce" /> Place Order (₹{grandTotal.toFixed(2)})
        </button>
      </div>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 z-50">
          {[...Array(40)].map((_, i) => (
            <span key={i} className="confetti" style={{ left: `${Math.random()*100}%`, animationDelay: `${Math.random()}s` }}>
              💸
            </span>
          ))}
        </div>
      )}
      <style>{`
        .confetti {
          position: absolute;
          top: -2rem;
          font-size: 2rem;
          animation: confetti-fall 1.5s linear forwards;
          pointer-events: none;
        }
        @keyframes confetti-fall {
          to {
            top: 110%;
            transform: rotate(360deg) scale(1.2);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage; 