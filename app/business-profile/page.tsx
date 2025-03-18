'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import BusinessProfileBot from '../components/BusinessProfileBot';

export default function BusinessProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
          <p className="text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Business Profile Setup</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <BusinessProfileBot />
        </div>
      </div>
    </div>
  );
} 