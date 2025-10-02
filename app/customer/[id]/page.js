"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CustomerDetailPage() {
  const params = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (params.id) {
      fetchCustomerDetails();
    }
  }, [params.id]);

  async function fetchCustomerDetails() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/customer/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Customer not found');
      }
      
      const customerData = await response.json();
      setCustomer(customerData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="p-4">
        <div className="text-center">Loading customer details...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4">
        <div className="text-center text-red-600">
          Error: {error}
        </div>
        <div className="text-center mt-4">
          <Link href="/customer" className="text-blue-600 hover:underline">
            ← Back to Customer List
          </Link>
        </div>
      </main>
    );
  }

  if (!customer) {
    return (
      <main className="p-4">
        <div className="text-center">Customer not found</div>
        <div className="text-center mt-4">
          <Link href="/customer" className="text-blue-600 hover:underline">
            ← Back to Customer List
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4">
          <Link href="/customer" className="text-blue-600 hover:underline">
            ← Back to Customer List
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Details</h1>
          
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-lg text-gray-900">{customer.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Member Number</label>
                  <p className="text-lg text-gray-900">#{customer.memberNumber}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-lg text-gray-900">
                    {new Date(customer.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Age</label>
                  <p className="text-lg text-gray-900">
                    {Math.floor((new Date() - new Date(customer.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))} years old
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {customer.interests.split(',').map((interest, index) => (
                  <span 
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {interest.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Account Information</h2>
              <div className="text-sm text-gray-600">
                <p><strong>Customer ID:</strong> {customer._id}</p>
                <p><strong>Member Since:</strong> {new Date(customer.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Link 
              href={`/customer/edit/${customer._id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Customer
            </Link>
            <button 
              onClick={() => window.print()}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Print Details
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}