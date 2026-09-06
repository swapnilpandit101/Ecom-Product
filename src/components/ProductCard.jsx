import React from 'react';
import { Star, Edit2, Trash2, Eye } from 'lucide-react';
import PrimaryButton from './common/PrimaryButton';
import SecondaryButton from './common/SecondaryButton';
import DangerButton from './common/DangerButton';
import './ProductCard.css';

function ProductCard({ product, onEdit, onDelete, onView }) {
  const { title, category, price, oldPrice, rating, reviews, stock, status, image } = product;

  const badgeClass = status === 'in-stock' 
    ? 'product-card__badge--in-stock' 
    : status === 'low-stock' 
    ? 'product-card__badge--low-stock' 
    : 'product-card__badge--out-of-stock';

  const badgeLabel = status === 'in-stock' ? 'In Stock' : status === 'low-stock' ? `${stock} left` : 'Out of Stock';

  return (
    <div className="product-card">
      <div className="product-card__image-wrap" onClick={() => onView(product)}>
        <img src={image} alt={title} className="product-card__image" loading="lazy" />
        <span className={`product-card__badge ${badgeClass}`}>{badgeLabel}</span>
      </div>

      <div className="product-card__body">
        <span className="product-card__category">{category}</span>
        <h3 className="product-card__title" onClick={() => onView(product)}>
          {title}
        </h3>

        <div className="product-card__rating">
          <Star size={14} fill="#000000" color="#000000" />
          <span>{rating}</span>
          <span className="product-card__reviews">({reviews})</span>
        </div>

        <div className="product-card__footer">
          <div className="product-card__price-box">
            <span className="product-card__price">₹{price.toFixed(2)}</span>
            {oldPrice && <span className="product-card__old-price">₹{oldPrice.toFixed(2)}</span>}
          </div>

          <div className="product-card__actions">
            <SecondaryButton onClick={() => onView(product)} className="product-card__icon-btn">
              <Eye size={16} />
            </SecondaryButton>
            <PrimaryButton onClick={() => onEdit(product)} className="product-card__icon-btn">
              <Edit2 size={16} />
            </PrimaryButton>
            <DangerButton onClick={() => onDelete(product)} className="product-card__icon-btn">
              <Trash2 size={16} />
            </DangerButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
