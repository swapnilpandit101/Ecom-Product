import { Search, LayoutGrid, List } from 'lucide-react';
import './ProductFilters.css';

function ProductFilters({
  search,
  onSearch,
  category,
  onCategory,
  sort,
  onSort,
  view,
  onViewChange,
  categories = []
}) {
  return (
    <div className="product-filters">
      <div className="product-filters__inputs">
        <div className="product-filters__search">
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <select
          className="product-filters__select"
          value={category}
          onChange={(e) => onCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="product-filters__select"
          value={sort}
          onChange={(e) => onSort(e.target.value)}
        >
          <option value="default">Sort by: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Highest Rated</option>
        </select>
      </div>

      <div className="product-filters__right">
        <div className="product-filters__view">
          <button
            className={`product-filters__view-btn ${view === 'grid' ? 'product-filters__view-btn--active' : ''}`}
            onClick={() => onViewChange('grid')}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`product-filters__view-btn ${view === 'list' ? 'product-filters__view-btn--active' : ''}`}
            onClick={() => onViewChange('list')}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;
