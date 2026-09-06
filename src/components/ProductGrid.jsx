import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

function ProductGrid({ products, view = 'grid', onEdit, onDelete, onView }) {
  return (
    <div className={`product-grid ${view === 'list' ? 'product-grid--list' : ''}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
