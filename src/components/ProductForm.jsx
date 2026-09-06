import React, { useState, useMemo } from 'react';
import PrimaryButton from './common/PrimaryButton';
import SecondaryButton from './common/SecondaryButton';
import useFetch from '../hooks/useFetch';
import './ProductForm.css';

function ProductForm({ mode = 'add', initialData, onSubmit, onClose, categories: passedCategories = [] }) {
  const shouldFetchCategories = passedCategories.length === 0;
  const { data: fetchedCatData } = useFetch(
    shouldFetchCategories ? 'https://dummyjson.com/products/categories' : null
  );

  const categories = useMemo(() => {
    if (passedCategories.length > 0) return passedCategories;
    if (!fetchedCatData || !Array.isArray(fetchedCatData)) return [];
    return fetchedCatData.map((cat) => {
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
  }, [passedCategories, fetchedCatData]);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    category: initialData?.category || categories[0]?.id || 'beauty',
    price: initialData?.price || '',
    oldPrice: initialData?.oldPrice || '',
    stock: initialData?.stock || '',
    image: initialData?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    description: initialData?.description || ''
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stockNum = parseInt(form.stock) || 0;
    const status = stockNum === 0 ? 'out-of-stock' : stockNum < 10 ? 'low-stock' : 'in-stock';

    onSubmit({
      ...initialData,
      title: form.title,
      category: form.category,
      price: parseFloat(form.price) || 0,
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
      stock: stockNum,
      status,
      image: form.image,
      description: form.description,
      rating: initialData?.rating || 5.0,
      reviews: initialData?.reviews || 1
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="modal__body product-form__body">
        <div className="product-form__group">
          <label className="product-form__label">Product Title</label>
          <input
            type="text"
            className="product-form__control"
            required
            placeholder="e.g. Wireless Headphones"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        <div className="product-form__grid">
          <div className="product-form__group">
            <label className="product-form__label">Category</label>
            <select
              className="product-form__control"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option value="beauty">Beauty</option>
              )}
            </select>
          </div>

          <div className="product-form__group">
            <label className="product-form__label">Price (₹)</label>
            <input
              type="number"
              step="0.01"
              className="product-form__control"
              required
              placeholder="999.00"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </div>
        </div>

        <div className="product-form__grid">
          <div className="product-form__group">
            <label className="product-form__label">Original Price (₹) (Optional)</label>
            <input
              type="number"
              step="0.01"
              className="product-form__control"
              placeholder="1299.00"
              value={form.oldPrice}
              onChange={(e) => handleChange('oldPrice', e.target.value)}
            />
          </div>

          <div className="product-form__group">
            <label className="product-form__label">Stock Quantity</label>
            <input
              type="number"
              className="product-form__control"
              required
              placeholder="25"
              value={form.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
            />
          </div>
        </div>

        <div className="product-form__group">
          <label className="product-form__label">Image URL</label>
          <input
            type="url"
            className="product-form__control"
            required
            placeholder="https://images.unsplash.com/..."
            value={form.image}
            onChange={(e) => handleChange('image', e.target.value)}
          />
        </div>

        <div className="product-form__group">
          <label className="product-form__label">Description</label>
          <textarea
            className="product-form__control"
            rows="3"
            placeholder="Enter product features and details..."
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
      </div>

      <div className="modal__footer product-form__footer">
        <SecondaryButton onClick={onClose}>
          Cancel
        </SecondaryButton>
        <PrimaryButton type="submit">
          {mode === 'edit' ? 'Save Changes' : 'Add Product'}
        </PrimaryButton>
      </div>
    </form>
  );
}

export default ProductForm;
