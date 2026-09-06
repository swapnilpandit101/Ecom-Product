const STORAGE_KEYS = {
  ADDED: 'ecommerce_added_products',
  EDITED: 'ecommerce_edited_products',
  DELETED: 'ecommerce_deleted_product_ids'
};

/**
 * Get added products stored in LocalStorage
 */
export const getAddedProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ADDED);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading added products from localStorage:', err);
    return [];
  }
};

/**
 * Save a newly added product to LocalStorage
 */
export const saveAddedProduct = (product) => {
  try {
    const current = getAddedProducts();
    const updated = [product, ...current.filter((p) => p.id !== product.id)];
    localStorage.setItem(STORAGE_KEYS.ADDED, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving added product to localStorage:', err);
  }
};

/**
 * Get edited products map from LocalStorage
 */
export const getEditedProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EDITED);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Error reading edited products from localStorage:', err);
    return {};
  }
};

/**
 * Save edited product changes to LocalStorage
 */
export const saveEditedProduct = (product) => {
  try {
    // If it's a locally added product, update it in added list as well
    const added = getAddedProducts();
    const isLocalAdded = added.some((p) => String(p.id) === String(product.id));
    
    if (isLocalAdded) {
      const updatedAdded = added.map((p) => (String(p.id) === String(product.id) ? product : p));
      localStorage.setItem(STORAGE_KEYS.ADDED, JSON.stringify(updatedAdded));
    } else {
      const current = getEditedProducts();
      current[product.id] = product;
      localStorage.setItem(STORAGE_KEYS.EDITED, JSON.stringify(current));
    }
  } catch (err) {
    console.error('Error saving edited product to localStorage:', err);
  }
};

/**
 * Get list of deleted product IDs from LocalStorage
 */
export const getDeletedProductIds = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DELETED);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading deleted product IDs from localStorage:', err);
    return [];
  }
};

/**
 * Save deleted product ID to LocalStorage
 */
export const saveDeletedProductId = (id) => {
  try {
    // Also remove from local added products if present
    const added = getAddedProducts().filter((p) => String(p.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.ADDED, JSON.stringify(added));

    const currentDeleted = getDeletedProductIds();
    if (!currentDeleted.includes(id)) {
      currentDeleted.push(id);
      localStorage.setItem(STORAGE_KEYS.DELETED, JSON.stringify(currentDeleted));
    }
  } catch (err) {
    console.error('Error saving deleted product ID to localStorage:', err);
  }
};

/**
 * Merge fetched API products with LocalStorage modifications
 */
export const mergeApiWithLocalStorage = (apiProducts = []) => {
  const added = getAddedProducts();
  const edited = getEditedProducts();
  const deletedIds = getDeletedProductIds().map(String);

  // 1. Filter out deleted products
  let filtered = apiProducts.filter((p) => !deletedIds.includes(String(p.id)));

  // 2. Apply local edits to API products
  filtered = filtered.map((p) => {
    if (edited[p.id]) {
      return { ...p, ...edited[p.id] };
    }
    return p;
  });

  // 3. Prepend local added products (ensure no duplicate IDs)
  const existingIds = new Set(filtered.map((p) => String(p.id)));
  const uniqueAdded = added.filter((p) => !existingIds.has(String(p.id)));

  return [...uniqueAdded, ...filtered];
};
