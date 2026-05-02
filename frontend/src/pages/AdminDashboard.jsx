import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContextValue';
import { createProduct, deleteProduct, fetchAdminProducts, updateProduct, uploadProductImage } from '../lib/api';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  imageUrls: '',
  category: 'Skincare',
  subCategory: 'Serums',
  sizes: '30ML,50ML',
  stock: 20,
  bestseller: false,
  active: true,
};

const categoryOptions = ['Makeup', 'Skincare'];
const typeOptions = ['Serums', 'Lips', 'Face', 'SPF', 'Cleansers', 'Moisturizers'];

const AdminDashboard = () => {
  const { refreshProducts, productsError } = useContext(ShopContext);
  const [entryAllowed] = useState(() => sessionStorage.getItem('adminEntryUnlocked') === 'true');
  const [form, setForm] = useState(emptyForm);
  const [credentials, setCredentials] = useState(() => {
    const saved = sessionStorage.getItem('adminCredentials');
    return saved ? JSON.parse(saved) : { username: '', password: '' };
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(sessionStorage.getItem('adminCredentials')));
  const [loginError, setLoginError] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [adminProducts, setAdminProducts] = useState([]);

  const productStats = useMemo(() => {
    const totalValue = adminProducts.reduce((sum, product) => sum + Number(product.price || 0), 0);
    const bestsellers = adminProducts.filter((product) => product.bestseller).length;

    return {
      count: adminProducts.length,
      bestsellers,
      average: adminProducts.length ? Math.round(totalValue / adminProducts.length) : 0,
    };
  }, [adminProducts]);

  const loadAdminProducts = useCallback(async (nextCredentials = credentials) => {
    const products = await fetchAdminProducts(nextCredentials);
    setAdminProducts(products);
  }, [credentials]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminProducts().catch((error) => setStatus(error.message));
    }
  }, [isAuthenticated, loadAdminProducts]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateCredential = (field, value) => {
    setCredentials((current) => ({ ...current, [field]: value }));
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrls: product.image?.join(', ') || '',
      category: product.category,
      subCategory: product.subCategory,
      sizes: product.sizes?.join(',') || '',
      stock: product.stock ?? 0,
      bestseller: product.bestseller,
      active: product.active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId('');
    setForm(emptyForm);
    setStatus('');
  };

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus('');

    try {
      const dataUrl = await fileToDataUrl(file);
      const imageUrl = await uploadProductImage({ fileName: file.name, dataUrl }, credentials);
      setForm((current) => ({
        ...current,
        imageUrls: current.imageUrls ? `${current.imageUrls}, ${imageUrl}` : imageUrl,
      }));
      toast.success('Image uploaded.');
    } catch (error) {
      setStatus(error.message);
      toast.error(error.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const submitLogin = (event) => {
    event.preventDefault();
    setLoginError('');

    if (credentials.username === 'admin1234' && credentials.password === '1111') {
      sessionStorage.setItem('adminCredentials', JSON.stringify(credentials));
      setIsAuthenticated(true);
      loadAdminProducts(credentials).catch((error) => setLoginError(error.message));
      return;
    }

    setLoginError('Wrong username or password.');
  };

  const logout = () => {
    sessionStorage.removeItem('adminCredentials');
    sessionStorage.removeItem('adminEntryUnlocked');
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus('');

    try {
      if (editingId) {
        await updateProduct(editingId, form, credentials);
      } else {
        await createProduct(form, credentials);
      }
      await loadAdminProducts();
      await refreshProducts();
      setForm(emptyForm);
      setEditingId('');
      setStatus(editingId ? 'Product updated successfully.' : 'Product added successfully.');
      toast.success(editingId ? 'Product updated.' : 'Product added.');
    } catch (error) {
      setStatus(error.message);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (productId) => {
    setStatus('');

    try {
      await deleteProduct(productId, credentials);
      await loadAdminProducts();
      await refreshProducts();
      setStatus('Product deleted.');
      toast.success('Product deleted.');
    } catch (error) {
      setStatus(error.message);
      toast.error(error.message);
    }
  };

  if (!entryAllowed) {
    return <Navigate to='/' replace />;
  }

  if (!isAuthenticated) {
    return (
      <div className='flex min-h-[70vh] items-center justify-center border-t py-12'>
        <form onSubmit={submitLogin} className='w-full max-w-md border border-gray-200 bg-white p-6 soft-shadow'>
          <div className='mb-6'>
            <Title text1='ADMIN' text2='LOGIN' />
            <p className='mt-2 text-sm text-gray-600'>Enter the hidden dashboard credentials.</p>
          </div>

          <div className='flex flex-col gap-4'>
            <label className='text-sm'>
              Username
              <input
                value={credentials.username}
                onChange={(event) => updateCredential('username', event.target.value)}
                className='mt-1 w-full border border-gray-300 px-3 py-3 outline-none focus:border-black'
                autoFocus
                required
              />
            </label>
            <label className='text-sm'>
              Password
              <input
                value={credentials.password}
                onChange={(event) => updateCredential('password', event.target.value)}
                className='mt-1 w-full border border-gray-300 px-3 py-3 outline-none focus:border-black'
                type='password'
                required
              />
            </label>
            <button className='bg-black px-4 py-3 text-sm font-medium text-white' type='submit'>
              LOGIN
            </button>
            {loginError && <p className='text-sm text-red-600'>{loginError}</p>}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className='border-t py-10'>
      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <Title text1='ADMIN' text2='DASHBOARD' />
          <p className='mt-2 max-w-2xl text-sm text-gray-600'>
            Manage beauty products stored in PostgreSQL. Add new items, mark bestsellers, and remove old products.
          </p>
        </div>
        <div className='flex flex-col gap-3 sm:items-end'>
          <button onClick={logout} className='w-fit border border-gray-300 px-4 py-2 text-sm hover:bg-white' type='button'>
            Logout
          </button>
          <div className='grid grid-cols-3 gap-2 text-center'>
            <div className='border bg-white px-4 py-3'>
              <p className='text-xl font-semibold'>{productStats.count}</p>
              <p className='text-xs text-gray-500'>Products</p>
            </div>
            <div className='border bg-white px-4 py-3'>
              <p className='text-xl font-semibold'>{productStats.bestsellers}</p>
              <p className='text-xs text-gray-500'>Best</p>
            </div>
            <div className='border bg-white px-4 py-3'>
              <p className='text-xl font-semibold'>${productStats.average}</p>
              <p className='text-xs text-gray-500'>Avg</p>
            </div>
          </div>
        </div>
      </div>

      {productsError && (
        <div className='mb-6 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
          Backend is not connected yet, so the storefront is using local fallback products.
        </div>
      )}

      <div className='grid gap-8 lg:grid-cols-[380px_1fr]'>
        <form onSubmit={submitProduct} className='h-fit border border-gray-200 p-5'>
          <div className='mb-4 flex items-center justify-between gap-3'>
            <p className='text-lg font-semibold'>{editingId ? 'Edit product' : 'Add product'}</p>
            {editingId && (
              <button onClick={cancelEdit} className='text-sm text-gray-500 hover:text-black' type='button'>
                Cancel
              </button>
            )}
          </div>

          <div className='flex flex-col gap-4'>
            <label className='text-sm'>
              Name
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className='mt-1 w-full border px-3 py-2 outline-none focus:border-black'
                required
              />
            </label>
            <label className='text-sm'>
              Description
              <textarea
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                className='mt-1 min-h-24 w-full border px-3 py-2 outline-none focus:border-black'
                required
              />
            </label>
            <div className='grid grid-cols-2 gap-3'>
              <label className='text-sm'>
                Price
                <input
                  value={form.price}
                  onChange={(event) => updateField('price', event.target.value)}
                  className='mt-1 w-full border px-3 py-2 outline-none focus:border-black'
                  type='number'
                min='0'
                required
                />
              </label>
              <label className='text-sm'>
                Options
                <input
                  value={form.sizes}
                  onChange={(event) => updateField('sizes', event.target.value)}
                  className='mt-1 w-full border px-3 py-2 outline-none focus:border-black'
                  placeholder='30ML,50ML or Rose,Nude'
                  required
                />
              </label>
            </div>
            <label className='text-sm'>
              Stock
              <input
                value={form.stock}
                onChange={(event) => updateField('stock', event.target.value)}
                className='mt-1 w-full border px-3 py-2 outline-none focus:border-black'
                type='number'
                min='0'
                required
              />
            </label>
            <div className='grid grid-cols-2 gap-3'>
              <label className='text-sm'>
                Category
                <select
                  value={form.category}
                  onChange={(event) => updateField('category', event.target.value)}
                  className='mt-1 w-full border px-3 py-2 outline-none focus:border-black'
                >
                  {categoryOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className='text-sm'>
                Type
                <select
                  value={form.subCategory}
                  onChange={(event) => updateField('subCategory', event.target.value)}
                  className='mt-1 w-full border px-3 py-2 outline-none focus:border-black'
                >
                  {typeOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <label className='text-sm'>
              Image URLs
              <input
                value={form.imageUrls}
                onChange={(event) => updateField('imageUrls', event.target.value)}
                className='mt-1 w-full border px-3 py-2 outline-none focus:border-black'
                placeholder='/products/beauty_01.png, https://...'
                required
              />
            </label>
            <label className='block text-sm'>
              Upload image
              <input
                onChange={uploadImage}
                className='mt-1 w-full border px-3 py-2 text-sm'
                type='file'
                accept='image/*'
                disabled={uploading}
              />
              {uploading && <span className='mt-1 block text-xs text-gray-500'>Uploading...</span>}
            </label>
            <label className='flex items-center gap-2 text-sm'>
              <input
                checked={form.bestseller}
                onChange={(event) => updateField('bestseller', event.target.checked)}
                type='checkbox'
              />
              Bestseller
            </label>
            <label className='flex items-center gap-2 text-sm'>
              <input
                checked={form.active}
                onChange={(event) => updateField('active', event.target.checked)}
                type='checkbox'
              />
              Active on storefront
            </label>
            <button
              type='submit'
              disabled={saving}
              className='bg-black px-4 py-3 text-sm font-medium text-white disabled:bg-gray-400'
            >
              {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
            </button>
            {status && <p className='text-sm text-gray-600'>{status}</p>}
          </div>
        </form>

        <div className='overflow-x-auto border border-gray-200'>
          <div className='grid min-w-[560px] grid-cols-[70px_1fr_70px_70px_120px] border-b bg-gray-50 px-4 py-3 text-xs font-semibold uppercase text-gray-500'>
            <span>Image</span>
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Action</span>
          </div>
          <div className='divide-y'>
            {adminProducts.map((product) => (
              <div
                key={product._id}
                className='grid min-w-[560px] grid-cols-[70px_1fr_70px_70px_120px] items-center gap-3 px-4 py-3 text-sm'
              >
                <img
                  src={product.image?.[0]}
                  alt={product.name}
                  className='h-14 w-12 object-cover'
                />
                <div>
                  <p className='font-medium text-gray-900'>{product.name}</p>
                  <p className='text-xs text-gray-500'>
                    {product.category} / {product.subCategory} {product.active ? '' : '/ Hidden'}
                  </p>
                </div>
                <p>${product.price}</p>
                <p>{product.stock ?? 0}</p>
                <div className='flex gap-2'>
                  <button
                    type='button'
                    onClick={() => startEdit(product)}
                    className='border border-gray-200 px-3 py-2 text-xs font-medium hover:bg-gray-50'
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    onClick={() => removeProduct(product._id)}
                    className='border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
