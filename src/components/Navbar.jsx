import React from 'react';
import { Menu, ShoppingBag } from 'lucide-react';
import './Navbar.css';

function Navbar({ onToggleMenu }) {
  return (
    <header className="navbar">
      <div className="navbar__left">
        <button 
          className="navbar__toggle" 
          onClick={onToggleMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} color="#000000" />
        </button>
        <div className="navbar__brand">
          <ShoppingBag size={24} color="#000000" />
          <span>ProductHub</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
