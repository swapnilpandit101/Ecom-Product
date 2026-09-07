import { Package, FolderTree, Search } from 'lucide-react';
import './Task1SubNav.css';

function Task1SubNav({ subRoute, onNavigateSubRoute, search, onSearchChange }) {
  return (
    <div className="task1-subnav">
      <nav className="task1-subnav__nav">
        <button
          className={`task1-subnav__item ${subRoute === 'products' || subRoute === 'product-details' ? 'task1-subnav__item--active' : ''}`}
          onClick={() => onNavigateSubRoute('products')}
        >
          <Package size={18} />
          <span>Products</span>
        </button>
        <button
          className={`task1-subnav__item ${subRoute === 'categories' ? 'task1-subnav__item--active' : ''}`}
          onClick={() => onNavigateSubRoute('categories')}
        >
          <FolderTree size={18} />
          <span>Categories</span>
        </button>
      </nav>

      <div className="task1-subnav__search">
        <Search size={16} color="#000000" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Task1SubNav;
