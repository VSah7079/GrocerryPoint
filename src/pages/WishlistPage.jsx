import React from 'react';

const WishlistPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 mb-4">You have no items in your wishlist.</p>
                {/* Wishlist items will be listed here */}
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Move All to Cart</button>
            </div>
        </div>
    );
};

export default WishlistPage; 