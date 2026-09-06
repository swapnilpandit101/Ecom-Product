import React from 'react';
import { X, Package, FolderTree, ShoppingBag } from 'lucide-react';
import './MobileNav.css';

function MobileNav({ open, onClose, currentRoute, onNavigate }) {
  if (!open) return null;

  const navItems = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
  ];

  const handleSelect = (id) => {
    onNavigate(id);
    onClose();
  };

  return (
    <div className="mobile-nav__overlay" onClick={onClose}>
      <div className="mobile-nav__drawer" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-nav__header">
          <div className="navbar__brand">
            <ShoppingBag size={24} color="#000000" />
            <span>ProductHub</span>
          </div>
          <button className="btn--icon" onClick={onClose}>
            <X size={20} color="#ffffff" />
          </button>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentRoute === item.id || (item.id === 'products' && currentRoute === 'product-details');
            return (
              <button
                key={item.id}
                className={`sidebar__link ${active ? 'sidebar__link--active' : ''}`}
                onClick={() => handleSelect(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default MobileNav;
