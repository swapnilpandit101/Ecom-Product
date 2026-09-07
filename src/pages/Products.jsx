import { useState, useEffect, useMemo } from 'react';
import ProductFilters from '../components/ProductFilters';
import ProductGrid from '../components/ProductGrid';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import PrimaryButton from '../components/common/PrimaryButton';
import { Plus } from 'lucide-react';

import useFetch from '../hooks/useFetch';
import { normalizeProduct } from '../services/api';
import { mergeApiWithLocalStorage } from '../services/storage';
import './Products.css';

function Products({
  search = '',
  onSearchChange,
  category = 'all',
  onCategoryChange,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onViewProduct
}) {
  const [sort, setSort] = useState('default');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // 1. Fetch full category list using custom hook useFetch
  const { data: rawCategories } = useFetch('https://dummyjson.com/products/categories');

  const allCategories = useMemo(() => {
    if (!rawCategories || !Array.isArray(rawCategories)) return [];
    return rawCategories.map((cat) => {
      if (typeof cat === 'string') {
        return {
          id: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')
        };
      }
      return {
        id: cat.slug || cat.name,
        name: cat.name || cat.slug
      };
    });
  }, [rawCategories]);

  // 2. Debounce Search Query inside Products page
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const handleCategoryChange = (newCat) => {
    onCategoryChange(newCat);
    setPage(1);
  };

  // Reset sort and page on reset-catalog-filters event
  useEffect(() => {
    const handleResetFilters = () => {
      setSort('default');
      setPage(1);
    };
    window.addEventListener('reset-catalog-filters', handleResetFilters);
    return () => window.removeEventListener('reset-catalog-filters', handleResetFilters);
  }, []);

  // 3. Construct GET URL for Product Catalog server-side API pagination
  const skip = (page - 1) * limit;
  let apiUrl = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
  if (debouncedSearch && debouncedSearch.trim() !== '') {
    apiUrl = `https://dummyjson.com/products/search?q=${encodeURIComponent(debouncedSearch.trim())}`;
  } else if (category && category !== 'all') {
    apiUrl = `https://dummyjson.com/products/category/${encodeURIComponent(category)}`;
  }

  // 4. Fetch Products using custom hook useFetch
  const { data: apiResponse, loading, error, refetch } = useFetch(apiUrl);

  // Normalize API products and merge with local storage overrides
  const { products, totalItems } = useMemo(() => {
    if (!apiResponse) return { products: [], totalItems: 0 };
    const rawList = Array.isArray(apiResponse.products) ? apiResponse.products : [];
    const normalized = rawList.map(normalizeProduct);
    const merged = mergeApiWithLocalStorage(normalized);
    const total = apiResponse.total || merged.length;
    return { products: merged, totalItems: total };
  }, [apiResponse]);

  const sortedProducts = useMemo(() => {
    let list = [...products];

    if (sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating-desc') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, sort]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="page-header__info">
          <h1 className="page-header__title">Product Catalog</h1>
          <p className="page-header__subtitle">Manage inventory, prices, ratings, and catalog listings.</p>
        </div>
        <PrimaryButton onClick={onAddProduct}>
          <Plus size={18} />
          <span>Add Product</span>
        </PrimaryButton>
      </div>

      <ProductFilters
        search={search}
        onSearch={onSearchChange}
        category={category}
        onCategory={handleCategoryChange}
        sort={sort}
        onSort={setSort}
        view={view}
        onViewChange={setView}
        categories={allCategories}
      />

      {loading ? (
        <LoadingState count={6} />
      ) : error ? (
        <ErrorState
          title="Failed to Load Products"
          message={error}
          onRetry={refetch}
        />
      ) : sortedProducts.length === 0 ? (
        <EmptyState
          title="No products match your search"
          message="Try adjusting your search query or selecting a different category."
        />
      ) : (
        <>
          <ProductGrid
            products={sortedProducts}
            view={view}
            onEdit={onEditProduct}
            onDelete={onDeleteProduct}
            onView={onViewProduct}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </>
      )}
    </div>
  );
}

export default Products;
