import React, { useState, useEffect } from 'react';
import { AdminAPI } from '../services/api';

const CustomerDataTest = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🧪 CustomerDataTest: AdminAPI imported successfully:', AdminAPI);
    const testCustomerFetch = async () => {
      try {
        console.log('🧪 Testing customer data fetch...');
        const response = await AdminAPI.getAllCustomers();
        console.log('📊 Raw API Response:', response);
        
        if (response.success && response.data && response.data.customers) {
          console.log('✅ Success! Found customers:', response.data.customers.length);
          
          const transformedData = response.data.customers.map((customer, index) => ({
            id: customer._id || `customer-${index}`,
            name: customer.name || 'Unknown User',
            email: customer.email || 'No email',
            phone: customer.phone || 'No phone',
            role: customer.role || 'No role',
            status: customer.isActive ? 'Active' : 'Suspended',
            verified: customer.isVerified ? 'Verified' : 'Unverified',
            joined: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Unknown',
            orders: customer.totalOrders || 0,
            spent: customer.totalSpent || 0
          }));
          
          console.log('🎯 Transformed Data:', transformedData);
          setCustomers(transformedData);
        } else {
          console.error('❌ Invalid response:', response);
          setError('Invalid API response format');
        }
      } catch (err) {
        console.error('❌ API Error:', err);
        setError(`API Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    testCustomerFetch();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">🔄 Loading Customer Data...</h2>
        <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-2">❌ Error Loading Customers</h2>
        <p className="text-red-600">{error}</p>
        <div className="mt-4 text-sm text-red-500">
          <p>Check:</p>
          <ul className="list-disc ml-6">
            <li>Backend server is running on port 5000</li>
            <li>MongoDB is running and has users</li>
            <li>Admin is logged in properly</li>
            <li>API routes are configured</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👥 Customer Database Test</h2>
      
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800">✅ Successfully loaded {customers.length} customers from database!</p>
      </div>

      {customers.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">⚠️ No customers found in database</p>
          <p className="text-sm text-yellow-600 mt-2">
            Run the sample users script: <code>node test-customer-data.js</code>
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer, index) => (
                <tr key={customer.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="h-8 w-8 rounded-full" 
                        src={`https://i.pravatar.cc/150?u=${customer.email}`} 
                        alt={customer.name}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.role === 'user' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      👤 {customer.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.verified === 'Verified' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.verified}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.joined}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="font-semibold mb-2">🔍 Debug Info:</h3>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify({ 
            customerCount: customers.length,
            sampleCustomer: customers[0] || null 
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CustomerDataTest;