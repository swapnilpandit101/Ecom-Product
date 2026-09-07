import axios from 'axios';
import { clearFetchCache } from '../hooks/useFetch';

// Centralized Axios Instance with Base URL
const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// In-Memory Caching & Request Deduplication
let categoriesCache = null;
let categoriesPromise = null;
let productsCache = new Map();
let productsPromises = new Map();

/**
 * Invalidate in-memory caches on mutations (add/edit/patch/delete)
 */
export const invalidateApiCache = () => {
  productsCache.clear();
  productsPromises.clear();
  categoriesCache = null;
  categoriesPromise = null;
  clearFetchCache();
};

/**
 * Normalize API raw product to fit UI expectations
 */
export const normalizeProduct = (p) => {
  if (!p) return null;
  const price = Number(p.price) || 0;
  const discount = Number(p.discountPercentage) || 0;
  const oldPrice = discount > 0 ? Number((price * (1 + discount / 100)).toFixed(2)) : undefined;
  const stock = Number(p.stock) || 0;

  return {
    id: p.id,
    title: p.title || 'Untitled Product',
    category: p.category || 'General',
    price: price,
    oldPrice: oldPrice,
    rating: Number(p.rating) || 4.5,
    reviews: Array.isArray(p.reviews) ? p.reviews.length : Math.floor(Math.random() * 50) + 10,
    stock: stock,
    status: stock > 10 ? 'in-stock' : stock > 0 ? 'low-stock' : 'out-of-stock',
    image: p.thumbnail || p.image || (Array.isArray(p.images) && p.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    description: p.description || 'No detailed description available for this product.'
  };
};

/**
 * GET Products from API with server pagination (limit, skip, search, category)
 */
export const getProducts = async ({ limit = 0, skip = 0, search = '', category = '' } = {}) => {
  const cacheKey = `products_${limit}_${skip}_${search.trim().toLowerCase()}_${category}`;

  if (productsCache.has(cacheKey)) {
    return productsCache.get(cacheKey);
  }

  if (productsPromises.has(cacheKey)) {
    return productsPromises.get(cacheKey);
  }

  let endpoint = `/products?limit=${limit}&skip=${skip}`;
  
  if (search && search.trim() !== '') {
    endpoint = `/products/search?q=${encodeURIComponent(search.trim())}`;
  } else if (category && category !== 'all') {
    endpoint = `/products/category/${encodeURIComponent(category)}`;
  }

  const promise = api.get(endpoint).then((response) => {
    const rawProducts = response.data.products || [];
    const formatted = {
      products: rawProducts.map(normalizeProduct),
      total: response.data.total || rawProducts.length,
      skip: response.data.skip || 0,
      limit: response.data.limit || 0
    };
    productsCache.set(cacheKey, formatted);
    productsPromises.delete(cacheKey);
    return formatted;
  }).catch((err) => {
    productsPromises.delete(cacheKey);
    throw err;
  });

  productsPromises.set(cacheKey, promise);
  return promise;
};

/**
 * GET dynamic category list from API
 */
export const getCategories = async () => {
  if (categoriesCache) {
    return categoriesCache;
  }
  if (categoriesPromise) {
    return categoriesPromise;
  }

  categoriesPromise = api.get('/products/categories').then((response) => {
    const rawCategories = response.data;
    const formatted = rawCategories.map((cat) => {
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
    categoriesCache = formatted;
    categoriesPromise = null;
    return formatted;
  }).catch((err) => {
    categoriesPromise = null;
    throw err;
  });

  return categoriesPromise;
};

/**
 * GET single product details by ID
 */
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return normalizeProduct(response.data);
};

/**
 * POST request to create a new product (/products/add)
 */
export const createProduct = async (payload) => {
  invalidateApiCache();

  const apiPayload = {
    title: payload.title,
    price: Number(payload.price) || 0,
    category: payload.category,
    description: payload.description
  };

  try {
    const response = await api.post('/products/add', apiPayload);
    return normalizeProduct({ ...payload, ...response.data });
  } catch (err) {
    console.warn('[API WARN] POST /products/add error, creating fallback payload:', err);
    return normalizeProduct({ id: Date.now(), ...payload });
  }
};

/**
 * PUT request to update an existing product (/products/:id)
 */
export const updateProduct = async (id, payload) => {
  invalidateApiCache();

  const apiPayload = {
    title: payload.title,
    price: Number(payload.price) || 0,
    category: payload.category,
    description: payload.description
  };

  try {
    const response = await api.put(`/products/${id}`, apiPayload);
    return normalizeProduct({ ...payload, ...response.data, id });
  } catch {
    try {
      const patchRes = await api.patch(`/products/${id}`, apiPayload);
      return normalizeProduct({ ...payload, ...patchRes.data, id });
    } catch (patchErr) {
      console.warn(`[API Info] PUT/PATCH /products/${id} returned 404 from DummyJSON mock server. Applying local state & LocalStorage update:`, patchErr);
      return normalizeProduct({ id, ...payload });
    }
  }
};

/**
 * PATCH request to partially update an existing product (/products/:id)
 */
export const patchProduct = async (id, payload) => {
  invalidateApiCache();

  const apiPayload = {
    title: payload.title,
    price: Number(payload.price) || 0,
    category: payload.category,
    description: payload.description
  };

  try {
    const response = await api.patch(`/products/${id}`, apiPayload);
    return normalizeProduct({ ...payload, ...response.data, id });
  } catch (err) {
    console.warn(`[API Info] PATCH /products/${id} returned error (${err?.response?.status || err.message}), applying local state update:`, err);
    return normalizeProduct({ id, ...payload });
  }
};

/**
 * DELETE request to delete a product (/products/:id)
 */
export const deleteProduct = async (id) => {
  invalidateApiCache();
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (err) {
    console.warn(`[API Info] DELETE /products/${id} returned error (${err?.response?.status || err.message}), applying local deletion update:`, err);
    return { id, isDeleted: true };
  }
};

export default api;
