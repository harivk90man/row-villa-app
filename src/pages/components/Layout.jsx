import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logout, isBoardMember } from '../../utils/auth';
import { Menu, X } from 'lucide-react'; // Ensure lucide-react is installed

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div>
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-lg sm:text-xl font-bold text-purple-700 max-w-[70%]">
          Ashirvadh Castle Rock Owner's Association
        </h1>

        {/* Hamburger menu icon */}
        <div className="sm:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex space-x-4">
          <Link to="/account">Account</Link>
          <Link to="/villas">Villas</Link>
          <Link to="/payments">Payments</Link>
          <Link to="/analytics">Analytics</Link>
          {isBoardMember() && <Link to="/announcements">Announcements</Link>}
          {isBoardMember() && <Link to="/complaints">Complaints</Link>}
          <button className="text-red-500" onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white shadow-md flex flex-col items-start p-4 space-y-2">
          <Link to="/account" onClick={toggleMenu}>Account</Link>
          <Link to="/villas" onClick={toggleMenu}>Villas</Link>
          <Link to="/payments" onClick={toggleMenu}>Payments</Link>
          <Link to="/analytics" onClick={toggleMenu}>Analytics</Link>
          {isBoardMember() && <Link to="/announcements" onClick={toggleMenu}>Announcements</Link>}
          {isBoardMember() && <Link to="/complaints" onClick={toggleMenu}>Complaints</Link>}
          <button className="text-red-500" onClick={() => { toggleMenu(); logout(); }}>Logout</button>
        </div>
      )}

      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;
