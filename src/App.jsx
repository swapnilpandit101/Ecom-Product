import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Modal from './components/Modal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import ProductForm from './components/ProductForm';

import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import NotFound from './pages/NotFound';

import { createProduct, updateProduct, deleteProduct } from './services/api';
import { saveAddedProduct, saveEditedProduct, saveDeletedProductId } from './services/storage';
import './App.css';

function App() {
  const [currentRoute, setCurrentRoute] = useState('products');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Synchronize routing state with URL hash (#products, #categories, #product-details)
  useEffect(() => {
    const syncFromHash = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '') || 'products';
      const route = rawHash.split('/')[0] || 'products';

      if (['products', 'categories', 'product-details'].includes(route)) {
        setCurrentRoute(route);
      } else {
        setCurrentRoute('products');
      }
    };

    if (!window.location.hash) {
      window.history.replaceState(null, '', '#products');
    }
    syncFromHash();

    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const handleNavigate = (route) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    handleNavigate('product-details');
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleOpenDelete = (product) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  };

  // POST / PUT handling
  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // PUT request via api.js
        const updated = await updateProduct(editingProduct.id, productData).catch(() => ({
          ...editingProduct,
          ...productData
        }));
        saveEditedProduct(updated);

        if (selectedProduct && String(selectedProduct.id) === String(editingProduct.id)) {
          setSelectedProduct(updated);
        }
        setToast('Product updated successfully!');
      } else {
        // POST request via api.js
        const payload = {
          ...productData,
          title: productData.title,
          price: Number(productData.price),
          category: productData.category
        };
        const created = await createProduct(payload).catch(() => ({
          ...productData,
          id: Date.now()
        }));

        saveAddedProduct(created);
        setToast('New product added to catalog!');
      }
    } catch (err) {
      console.error('Failed to save product:', err);
      setToast('Saved product locally.');
    } finally {
      setFormOpen(false);
      setEditingProduct(null);
      window.dispatchEvent(new Event('product-catalog-updated'));
    }
  };

  // DELETE handling
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    const targetId = productToDelete.id;
    try {
      await deleteProduct(targetId).catch(() => null);
      saveDeletedProductId(targetId);
      setToast('Product deleted from catalog.');

      if (selectedProduct && String(selectedProduct.id) === String(targetId)) {
        setSelectedProduct(null);
        handleNavigate('products');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    } finally {
      setDeleteOpen(false);
      setProductToDelete(null);
      window.dispatchEvent(new Event('product-catalog-updated'));
    }
  };

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    handleNavigate('products');
  };

  const renderContent = () => {
    switch (currentRoute) {
      case 'products':
        return (
          <Products
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            onAddProduct={handleOpenAdd}
            onEditProduct={handleOpenEdit}
            onDeleteProduct={handleOpenDelete}
            onViewProduct={handleViewProduct}
          />
        );
      case 'product-details':
        return (
          <ProductDetails
            product={selectedProduct}
            productId={selectedProduct?.id}
            onNavigate={handleNavigate}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onViewProduct={handleViewProduct}
          />
        );
      case 'categories':
        return (
          <Categories
            onSelectCategory={handleCategorySelect}
          />
        );
      default:
        return <NotFound onNavigate={handleNavigate} />;
    }
  };

  const handleResetAndGoHome = () => {
    setSearch('');
    setCategory('all');
    handleNavigate('products');
    window.dispatchEvent(new Event('reset-catalog-filters'));
  };

  return (
    <div className="app-layout">
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onBrandClick={handleResetAndGoHome}
        onAddProduct={handleOpenAdd}
      />

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onBrandClick={handleResetAndGoHome}
        onAddProduct={handleOpenAdd}
      />

      <div className="app-layout__body">
        <Navbar
          onToggleMenu={() => setMobileOpen(true)}
          onBrandClick={handleResetAndGoHome}
        />

        <main className="app-layout__main">
          {renderContent()}
        </main>
      </div>

      <Modal
        open={formOpen}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        onClose={() => setFormOpen(false)}
      >
        <ProductForm
          mode={editingProduct ? 'edit' : 'add'}
          initialData={editingProduct}
          onSubmit={handleSaveProduct}
          onClose={() => setFormOpen(false)}
        />
      </Modal>

      <ConfirmModal
        open={deleteOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteOpen(false)}
      />

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}

export default App;
