import { Tag, ArrowRight, Edit2, Trash2 } from 'lucide-react';
import './ProductCard.css';

function ProductCard({ product, onEdit, onDelete, onView }) {
  const { title, category, price, rating, stock, status, image, description } = product;

  const badgeClass = status === 'in-stock' 
    ? 'product-card__badge--in-stock' 
    : status === 'low-stock' 
    ? 'product-card__badge--low-stock' 
    : 'product-card__badge--out-of-stock';

  const badgeLabel = status === 'in-stock' ? 'In Stock' : status === 'low-stock' ? `${stock} left` : 'Out of Stock';

  const categoryName = typeof category === 'string'
    ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ')
    : 'Offer';

  return (
    <div className="product-card">
      <div className="product-card__image-wrap" onClick={() => onView(product)}>
        <img src={image} alt={title} className="product-card__image" loading="lazy" />
        <span className={`product-card__badge ${badgeClass}`}>{badgeLabel}</span>
      </div>

      <div className="product-card__body">
        <div className="product-card__tag-row">
          <Tag size={15} className="product-card__tag-icon" />
          <span className="product-card__category">{categoryName}</span>
        </div>

        <h3 className="product-card__title" onClick={() => onView(product)}>
          {title}
        </h3>

        <p className="product-card__desc">
          {description || 'Exclusive store catalog item with guaranteed brand warranty.'}
        </p>

        <div className="product-card__footer">
          <div className="product-card__brand-info">
            <img src={image} alt={title} className="product-card__brand-avatar" />
            <div className="product-card__price-stack">
              <span className="product-card__price">₹{price ? Number(price).toFixed(2) : '0.00'}</span>
              <span className="product-card__subtext">★ {rating} • {badgeLabel}</span>
            </div>
          </div>

          <div className="product-card__actions">
            <button
              className="product-card__btn-circle"
              onClick={() => onEdit(product)}
              title="Edit Product"
            >
              <Edit2 size={14} />
            </button>
            <button
              className="product-card__btn-circle product-card__btn-circle--danger"
              onClick={() => onDelete(product)}
              title="Delete Product"
            >
              <Trash2 size={14} />
            </button>
            <button
              className="product-card__btn-circle product-card__btn-circle--arrow"
              onClick={() => onView(product)}
              title="View Product Details"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

