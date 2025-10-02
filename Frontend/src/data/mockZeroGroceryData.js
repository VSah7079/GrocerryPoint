// Mock Grocery Orders Reset for Real-Time Dashboard
// This simulates zero orders, zero revenue, and keeps customers happy

const mockZeroGroceryData = {
    totalProducts: 45, // Keep products
    totalOrders: 0,    // ✅ Zero orders
    totalRevenue: 0,   // ✅ Zero revenue  
    totalCustomers: 250, // Keep customers happy
    recentOrders: [],  // ✅ Zero recent orders
    topProducts: [],   // No top products when no orders
    categoryData: [
        { name: 'Vegetables', value: 35, products: 15, fullName: 'Fresh Vegetables' },
        { name: 'Fruits', value: 25, products: 12, fullName: 'Fresh Fruits' },
        { name: 'Dairy', value: 20, products: 8, fullName: 'Dairy Products' },
        { name: 'Grains', value: 20, products: 10, fullName: 'Grains & Cereals' }
    ],
    salesData: [
        { name: 'Jan', sales: 0, orders: 0 },
        { name: 'Feb', sales: 0, orders: 0 },
        { name: 'Mar', sales: 0, orders: 0 },
        { name: 'Apr', sales: 0, orders: 0 },
        { name: 'May', sales: 0, orders: 0 },
        { name: 'Jun', sales: 0, orders: 0 }
    ],
    notifications: [
        {
            id: 1,
            text: '🛒 All grocery orders have been reset to zero - Fresh start!',
            time: 'Just now',
            type: 'alert'
        },
        {
            id: 2,
            text: '💰 Store revenue reset to ₹0 - Ready for new sales!',
            time: '1 minute ago',
            type: 'order'
        },
        {
            id: 3,
            text: '📊 Dashboard cleared - All metrics at zero for real-time tracking',
            time: '2 minutes ago',
            type: 'alert'
        }
    ]
};

console.log('🎯 GROCERY ORDERS RESET TO ZERO');
console.log('================================');
console.log('📊 Dashboard Data:');
console.log(`🛒 Total Orders: ${mockZeroGroceryData.totalOrders}`);
console.log(`💰 Revenue: ₹${mockZeroGroceryData.totalRevenue}`);
console.log(`📝 Recent Orders: ${mockZeroGroceryData.recentOrders.length}`);
console.log(`😊 Happy Customers: ${mockZeroGroceryData.totalCustomers} (preserved)`);
console.log(`📦 Products Available: ${mockZeroGroceryData.totalProducts} (maintained)`);
console.log('================================');
console.log('✅ Ready for real-time updates!');

export default mockZeroGroceryData;