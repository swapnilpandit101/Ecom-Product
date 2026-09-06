import React, { useMemo } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductGrid from '../components/ProductGrid';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import PrimaryButton from '../components/common/PrimaryButton';
import SecondaryButton from '../components/common/SecondaryButton';
import DangerButton from '../components/common/DangerButton';
import { Star, Edit2, Trash2, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

import useFetch from '../hooks/useFetch';
import { normalizeProduct } from '../services/api';
import { mergeApiWithLocalStorage } from '../services/storage';
import './ProductDetails.css';

function ProductDetails({ product: initialProduct, productId, onNavigate, onEdit, onDelete, onViewProduct }) {
  const targetId = productId || initialProduct?.id;

  // 1. Single Product GET fetch using custom hook useFetch
  const productUrl = (targetId && (typeof targetId === 'number' || !isNaN(Number(targetId))))
    ? `https://dummyjson.com/products/${targetId}`
    : null;

  const { data: rawProductData, loading: productLoading, error: productError, refetch } = useFetch(productUrl);

  const product = useMemo(() => {
    if (rawProductData) {
      const normalized = normalizeProduct(rawProductData);
      const merged = mergeApiWithLocalStorage([normalized]);
      return merged[0] || initialProduct;
    }
    if (initialProduct) {
      const merged = mergeApiWithLocalStorage([initialProduct]);
      return merged[0] || initialProduct;
    }
    return null;
  }, [rawProductData, initialProduct]);

  // 2. Related Products GET fetch using custom hook useFetch
  const relatedUrl = product?.category
    ? `https://dummyjson.com/products/category/${encodeURIComponent(product.category)}?limit=4`
    : null;

  const { data: relatedData } = useFetch(relatedUrl);

  const related = useMemo(() => {
    if (!relatedData || !Array.isArray(relatedData.products)) return [];
    const normalized = relatedData.products.map(normalizeProduct);
    const merged = mergeApiWithLocalStorage(normalized);
    return merged.filter((p) => String(p.id) !== String(product?.id)).slice(0, 3);
  }, [relatedData, product?.id]);

  const loading = productLoading && !product;
  const error = productError && !product ? 'Unable to load product details.' : null;

  if (loading) {
    return (
      <div className="product-details-page">
        <LoadingState count={1} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <SecondaryButton onClick={() => onNavigate('products')}>
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </SecondaryButton>
        <ErrorState
          title="Product Not Found"
          message={error || 'The requested product could not be loaded.'}
          onRetry={() => onNavigate('products')}
        />
      </div>
    );
  }

  const { title, category, price, oldPrice, rating, reviews, stock, status, image, description } = product;

  const breadcrumbs = [
    { label: 'Products', onClick: () => onNavigate('products') },
    { label: title }
  ];

  const badgeClass = status === 'in-stock' 
    ? 'product-card__badge--in-stock' 
    : status === 'low-stock' 
    ? 'product-card__badge--low-stock' 
    : 'product-card__badge--out-of-stock';

  return (
    <div className="product-details-page">
      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      <div className="product-details-page__back">
        <SecondaryButton onClick={() => onNavigate('products')}>
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </SecondaryButton>
      </div>

      <div className="product-details-page__card">
        <div className="product-details-page__gallery">
          <img src={image} alt={title} className="product-details-page__image" />
        </div>

        <div className="product-details-page__info">
          <div>
            <span className="product-card__category">{category}</span>
            <h1 className="product-details-page__title">{title}</h1>
          </div>

          <div className="product-details-page__meta-row">
            <div className="product-card__rating">
              <Star size={16} fill="#000000" color="#000000" />
              <span className="product-details-page__rating-weight">{rating}</span>
              <span className="product-card__reviews">({reviews} customer reviews)</span>
            </div>
            <span className={`product-card__badge ${badgeClass} product-details-page__badge-static`}>
              {status === 'in-stock' ? 'In Stock' : status === 'low-stock' ? `${stock} Left` : 'Out of Stock'}
            </span>
          </div>

          <div className="product-card__price-box">
            <span className="product-card__price product-details-page__price-main">₹{price ? price.toFixed(2) : '0.00'}</span>
            {oldPrice && <span className="product-card__old-price product-details-page__price-old">₹{oldPrice.toFixed(2)}</span>}
          </div>

          <p className="product-details-page__desc">{description}</p>

          <div className="product-details-page__perks">
            <div className="product-details-page__perk-item">
              <Truck size={18} color="#000000" />
              <span>Free express shipping on orders over ₹499</span>
            </div>
            <div className="product-details-page__perk-item">
              <ShieldCheck size={18} color="#000000" />
              <span>2 Year Official Brand Warranty included</span>
            </div>
            <div className="product-details-page__perk-item">
              <RefreshCw size={18} color="#000000" />
              <span>30-Day Hassle-Free Returns</span>
            </div>
          </div>

          <div className="product-details-page__actions">
            <PrimaryButton onClick={() => onEdit(product)}>
              <Edit2 size={18} />
              <span>Edit Product</span>
            </PrimaryButton>
            <DangerButton onClick={() => onDelete(product)}>
              <Trash2 size={18} />
              <span>Delete Product</span>
            </DangerButton>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="product-details-page__related-section">
          <h2 className="product-details-page__related-title">Related Products</h2>
          <ProductGrid
            products={related}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onViewProduct}
          />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
