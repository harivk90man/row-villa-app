import React from 'react';
import { Link } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';

const Dashboard = () => {
  const user = getUser();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="bg-white shadow-md rounded px-6 py-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Dashboard</h1>
        <div className="space-x-4">
          <Link to="/villas" className="text-blue-500 hover:text-blue-700">Villas</Link>
          <Link to="/payments" className="text-blue-500 hover:text-blue-700">Payments</Link>
          <Link to="/analytics" className="text-blue-500 hover:text-blue-700">Analytics</Link>
          <button onClick={logout} className="text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>

      <div className="bg-white shadow-md rounded p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome back!</h2>
        <p className="text-gray-600">You are logged in as <span className="font-medium text-indigo-600">{user?.email}</span></p>
      </div>
    </div>
  );
};

export default Dashboard;
