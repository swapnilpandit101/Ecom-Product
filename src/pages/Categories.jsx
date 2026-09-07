import { useMemo } from 'react';
import {
  Sparkles,
  Flame,
  Home,
  ShoppingBag,
  Laptop,
  Heart,
  Shirt,
  Footprints,
  Watch,
  Gem,
  Dumbbell,
  Car,
  Bike,
  Lightbulb,
  Package,
  ArrowRight
} from 'lucide-react';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import useFetch from '../hooks/useFetch';
import './Categories.css';

function Categories({ onSelectCategory }) {
  const { data, loading, error, refetch } = useFetch('https://dummyjson.com/products/categories');

  const categories = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((cat) => {
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
  }, [data]);

  // Vibrant colors for the right vertical tab ribbons matching the screenshot
  const tabColors = [
    '#f59e0b', // 1: Warm Amber
    '#f97316', // 2: Coral / Orange
    '#8d6e63', // 3: Taupe / Warm Brown
    '#10b981', // 4: Emerald Green
    '#06b6d4', // 5: Cyan / Teal
    '#1e65b8', // 6: Deep Blue
    '#5c6bc0', // 7: Slate / Indigo Blue
    '#8b5cf6', // 8: Purple / Violet
    '#ec4899', // 9: Vibrant Pink
    '#0284c7', // 10: Sky Blue
    '#14b8a6', // 11: Mint
    '#e11d48'  // 12: Rose
  ];

  // Helper to select relevant icon based on category ID/slug
  const getCategoryIcon = (catId = '') => {
    const id = catId.toLowerCase();
    if (id.includes('beauty')) return Sparkles;
    if (id.includes('fragrance') || id.includes('perfume')) return Flame;
    if (id.includes('furniture') || id.includes('home')) return Home;
    if (id.includes('grocer') || id.includes('food')) return ShoppingBag;
    if (id.includes('laptop') || id.includes('electronic') || id.includes('mobile')) return Laptop;
    if (id.includes('skin') || id.includes('care')) return Heart;
    if (id.includes('shirt') || id.includes('top') || id.includes('cloth') || id.includes('dress')) return Shirt;
    if (id.includes('shoe') || id.includes('foot')) return Footprints;
    if (id.includes('watch')) return Watch;
    if (id.includes('jewel') || id.includes('accessor')) return Gem;
    if (id.includes('sport') || id.includes('fit')) return Dumbbell;
    if (id.includes('auto') || id.includes('car')) return Car;
    if (id.includes('motor') || id.includes('bike')) return Bike;
    if (id.includes('light')) return Lightbulb;
    return Package;
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="page-header__info">
          <h1 className="page-header__title">Product Categories</h1>
          <p className="page-header__subtitle">Browse store products grouped by department and inventory metrics.</p>
        </div>
      </div>

      {loading ? (
        <LoadingState count={6} />
      ) : error ? (
        <ErrorState
          title="Categories Unavailable"
          message={error}
          onRetry={refetch}
        />
      ) : (
        <div className="categories-page__grid">
          {categories.map((cat, index) => {
            const Icon = getCategoryIcon(cat.id);
            const tabColor = tabColors[index % tabColors.length];
            const badgeNumber = index + 1;

            return (
              <div
                key={cat.id}
                className="categories-page__card"
                onClick={() => onSelectCategory(cat.id)}
              >
                <div className="categories-page__card-main">
                  <div className="categories-page__card-icon">
                    <Icon size={20} />
                  </div>

                  <h3 className="categories-page__card-title">{cat.name.toUpperCase()}</h3>

                  <p className="categories-page__card-desc">
                    Explore top quality products in {cat.name} department with live API sync and real-time inventory metrics.
                  </p>

                  <div className="categories-page__card-action">
                    <span>View Catalog</span>
                    <ArrowRight size={14} />
                  </div>
                </div>

                <div
                  className="categories-page__card-tab"
                  style={{ backgroundColor: tabColor }}
                >
                  <span className="categories-page__card-number">{badgeNumber}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Categories;
