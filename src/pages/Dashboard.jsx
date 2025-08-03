import React from 'react';
import { Link } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';

const Dashboard = () => {
  const user = getUser();

  return (
      <div className="bg-white shadow-md rounded p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome back!</h2>
        <p className="text-gray-600">You are logged in as <span className="font-medium text-indigo-600">{user?.email}</span></p>
      </div>

  );
};

export default Dashboard;
