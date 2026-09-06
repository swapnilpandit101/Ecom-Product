import React, { useMemo } from 'react';
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

  // Palette of light card backgrounds and matching dark icon backgrounds
  const cardColorPalettes = [
    { bgLight: '#E6F0FF', darkIconBg: '#1868DB' }, // Blue theme
    { bgLight: '#F3E8FF', darkIconBg: '#7C3AED' }, // Violet theme
    { bgLight: '#FFE6F2', darkIconBg: '#DB2777' }, // Pink theme
    { bgLight: '#E6F9F3', darkIconBg: '#059669' }, // Emerald theme
    { bgLight: '#FFF2E6', darkIconBg: '#D97706' }, // Amber theme
    { bgLight: '#FFEBE8', darkIconBg: '#DC2626' }, // Red theme
    { bgLight: '#EEF2FF', darkIconBg: '#4F46E5' }, // Indigo theme
    { bgLight: '#E6F7F8', darkIconBg: '#0D9488' }, // Teal theme
    { bgLight: '#FAF5FF', darkIconBg: '#9333EA' }, // Purple theme
    { bgLight: '#E0F2FE', darkIconBg: '#0284C7' }  // Sky theme
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
        <LoadingState count={4} />
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
            const palette = cardColorPalettes[index % cardColorPalettes.length];

            return (
              <div
                key={cat.id}
                className="categories-page__card"
                style={{ backgroundColor: palette.bgLight }}
                onClick={() => onSelectCategory(cat.id)}
              >
                <div className="categories-page__card-top">
                  <span className="product-card__category">Category</span>
                  <div
                    className="categories-page__card-icon"
                    style={{ backgroundColor: palette.darkIconBg, borderColor: palette.darkIconBg }}
                  >
                    <Icon size={22} color="#ffffff" />
                  </div>
                </div>

                <h3>{cat.name}</h3>

                <div className="categories-page__card-meta">
                  <span className="categories-page__count-text">Department Catalog</span>
                  <span className="categories-page__sales-text">Active</span>
                </div>

                <div className="categories-page__card-action">
                  <span>View Catalog</span>
                  <ArrowRight size={14} color="#000000" />
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
