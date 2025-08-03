import React from 'react';
import { Link } from 'react-router-dom';
import { logout, isBoardMember } from '../../utils/auth';

const Layout = ({ children }) => {
  return (
    <div>
      <nav className="flex justify-between items-center bg-white p-4 shadow-md">
        <h1 className="text-xl font-bold text-violet-600">Dashboard</h1>
        <div className="flex space-x-4">
          <Link to="/villas">Villas</Link>
          <Link to="/payments">Payments</Link>
          <Link to="/analytics">Analytics</Link>
          {isBoardMember() && <Link to="/announcements">Announcements</Link>}
          {isBoardMember() && <Link to="/complaints">Complaints</Link>}
          <button className="text-red-500" onClick={logout}>Logout</button>
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;
