import React, { useState } from 'react';
import { supabase } from '../supabase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const { data, error } = await supabase
      .from('villas')
      .select('*')
      .eq('email', email)
      .eq('phone', phone)
      .single();

    if (error || !data) {
      setError('Invalid login. Please check your credentials.');
      return;
    }

    localStorage.setItem('user', JSON.stringify(data));
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">Login</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Phone number (used as password)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
