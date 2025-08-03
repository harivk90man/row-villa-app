import React from 'react';
import { getUser } from '../utils/auth';

const Dashboard = () => {
  const user = getUser();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundImage: "url('/assets/bg-villa.jpg')" }}
    >
      <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 sm:p-8 text-center w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Welcome back!</h2>
        <p className="text-gray-700 text-sm sm:text-base">
          You are logged in as{' '}
          <span className="font-semibold text-indigo-700">{user?.email}</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
