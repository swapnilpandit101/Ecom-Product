import { useState } from 'react';
import {
  Package,
  FolderTree,
  ShoppingBag,
  PlusCircle,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import './Sidebar.css';

function Sidebar({ currentRoute, onNavigate, onBrandClick, onAddProduct }) {
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__brand-box">
        <div
          className="sidebar__brand-info"
          onClick={onBrandClick}
          title="Reset filters & go to Product Catalog"
        >
          <div className="sidebar__brand-logo">
            <ShoppingBag size={18} color="#ffffff" />
          </div>
          {!collapsed && (
            <div className="sidebar__brand-text">
              <span className="sidebar__brand-title">ProductHub</span>
              <span className="sidebar__brand-sub">Catalog Manager</span>
            </div>
          )}
        </div>

        <button
          className="sidebar__toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar__nav">
        {!collapsed && <div className="sidebar__section-title">MAIN</div>}
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const active = currentRoute === item.id || (item.id === 'products' && currentRoute === 'product-details');
          return (
            <button
              key={item.id}
              className={`sidebar__link ${active ? 'sidebar__link--active' : ''}`}
              onClick={() => onNavigate(item.id)}
              title={item.label}
            >
              <Icon size={19} className="sidebar__link-icon" />
              {!collapsed && <span className="sidebar__link-text">{item.label}</span>}
            </button>
          );
        })}

        {!collapsed && <div className="sidebar__section-title">ACTIONS</div>}
        {onAddProduct && (
          <button
            className="sidebar__link sidebar__action-btn"
            onClick={onAddProduct}
            title="Add Product"
          >
            <PlusCircle size={19} className="sidebar__link-icon" />
            {!collapsed && <span className="sidebar__link-text">Add Product</span>}
          </button>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;

