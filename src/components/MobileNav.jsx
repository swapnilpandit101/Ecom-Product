import { X, Package, FolderTree, ShoppingBag, PlusCircle } from 'lucide-react';
import './MobileNav.css';

function MobileNav({ open, onClose, currentRoute, onNavigate, onBrandClick, onAddProduct }) {
  if (!open) return null;

  const navItems = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
  ];

  const handleSelect = (id) => {
    onNavigate(id);
    onClose();
  };

  const handleBrandClick = () => {
    if (onBrandClick) onBrandClick();
    onClose();
  };

  const handleAddClick = () => {
    if (onAddProduct) onAddProduct();
    onClose();
  };

  return (
    <div className="mobile-nav__overlay" onClick={onClose}>
      <div className="mobile-nav__drawer" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-nav__header">
          <div
            className="sidebar__brand-info"
            onClick={handleBrandClick}
            style={{ cursor: 'pointer' }}
          >
            <div className="sidebar__brand-logo">
              <ShoppingBag size={18} color="#ffffff" />
            </div>
            <div className="sidebar__brand-text">
              <span className="sidebar__brand-title">ProductHub</span>
              <span className="sidebar__brand-sub">Catalog Manager</span>
            </div>
          </div>
          <button className="mobile-nav__close-btn" onClick={onClose} aria-label="Close menu">
            <X size={18} color="#ffffff" />
          </button>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__section-title">MAIN</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentRoute === item.id || (item.id === 'products' && currentRoute === 'product-details');
            return (
              <button
                key={item.id}
                className={`sidebar__link ${active ? 'sidebar__link--active' : ''}`}
                onClick={() => handleSelect(item.id)}
              >
                <Icon size={19} className="sidebar__link-icon" />
                <span className="sidebar__link-text">{item.label}</span>
              </button>
            );
          })}

          <div className="sidebar__section-title">ACTIONS</div>
          {onAddProduct && (
            <button
              className="sidebar__link"
              onClick={handleAddClick}
            >
              <PlusCircle size={19} className="sidebar__link-icon" />
              <span className="sidebar__link-text">Add Product</span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}

export default MobileNav;

