import { ChevronRight, Home } from 'lucide-react';
import './Breadcrumbs.css';

function Breadcrumbs({ items, onNavigate }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumbs">
      <button 
        className="breadcrumbs__item breadcrumbs__link"
        onClick={() => onNavigate('dashboard')}
      >
        <Home size={14} />
        <span>Home</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="breadcrumbs__item">
            <ChevronRight size={14} />
            {isLast ? (
              <span className="breadcrumbs__active">{item.label}</span>
            ) : (
              <button
                className="breadcrumbs__link"
                onClick={() => item.onClick && item.onClick()}
              >
                {item.label}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
