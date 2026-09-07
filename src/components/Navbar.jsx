import { Menu, ShoppingBag } from 'lucide-react';
import './Navbar.css';

function Navbar({ onToggleMenu, onBrandClick }) {
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
        <div
          className="navbar__brand"
          onClick={onBrandClick}
          title="Reset filters & go to Product Catalog"
          style={{ cursor: 'pointer' }}
        >
          <div className="navbar__brand-badge">
            <ShoppingBag size={18} color="#ffffff" />
          </div>
          <span>ProductHub</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
