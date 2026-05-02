const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function apiRequest(path, options = {}) {
  const { headers, ...restOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    ...restOptions,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'API request failed.');
  }

  return data;
}

export async function fetchProducts() {
  const data = await apiRequest('/api/products');
  return data.products || [];
}

function adminHeaders(credentials) {
  if (!credentials) return {};

  return {
    'x-admin-username': credentials.username || '',
    'x-admin-password': credentials.password || '',
  };
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createProduct(product, credentials) {
  const data = await apiRequest('/api/admin/products', {
    method: 'POST',
    headers: adminHeaders(credentials),
    body: JSON.stringify(product),
  });

  return data.product;
}

export async function fetchAdminProducts(credentials) {
  const data = await apiRequest('/api/admin/products', {
    headers: adminHeaders(credentials),
  });

  return data.products || [];
}

export async function updateProduct(productId, product, credentials) {
  const data = await apiRequest(`/api/admin/products/${productId}`, {
    method: 'PUT',
    headers: adminHeaders(credentials),
    body: JSON.stringify(product),
  });

  return data.product;
}

export async function deleteProduct(productId, credentials) {
  await apiRequest(`/api/admin/products/${productId}`, {
    method: 'DELETE',
    headers: adminHeaders(credentials),
  });
}

export async function uploadProductImage(filePayload, credentials) {
  const data = await apiRequest('/api/admin/upload', {
    method: 'POST',
    headers: adminHeaders(credentials),
    body: JSON.stringify(filePayload),
  });

  return data.imageUrl;
}

export async function askAssistant(message, history) {
  const data = await apiRequest('/api/assistant', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  });

  return data.reply;
}

export async function signupUser(payload) {
  return apiRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createOrder(payload, token) {
  const data = await apiRequest('/api/orders', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  return data.order;
}

export async function fetchOrders(token) {
  const data = await apiRequest('/api/orders', {
    headers: authHeaders(token),
  });

  return data.orders || [];
}

export async function sendContactMessage(payload) {
  return apiRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
