import React from 'react';
import { Package, FolderTree } from 'lucide-react';
import './Sidebar.css';

function Sidebar({ currentRoute, onNavigate }) {
  const navItems = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__title">Navigation</span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentRoute === item.id || (item.id === 'products' && currentRoute === 'product-details');
          return (
            <button
              key={item.id}
              className={`sidebar__link ${active ? 'sidebar__link--active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={20} />
              <span className="sidebar__link-text">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
