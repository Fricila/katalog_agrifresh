export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';

// Deteksi dinamis Base URL backend untuk VPS & Localhost
const getDynamicServerUrl = () => {
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL;
  }
  // Jika diakses via browser di VPS IP / Domain
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, protocol, port } = window.location;
    // Jika frontend berjalan di port 3000 (dev / standalone), backend default port 5000 di host yang sama
    if (port === '3000') {
      return `${protocol}//${hostname}:5000`;
    }
    // Jika diakses via reverse proxy VPS / production (port 80 / 443 / default)
    if (!port || port === '80' || port === '443') {
      return `${protocol}//${hostname}${port ? ':' + port : ''}`;
    }
    // Fallback: gunakan host browser
    return `${protocol}//${hostname}:5000`;
  }
  return 'http://localhost:5000';
};

export const SERVER_URL = getDynamicServerUrl();

// Deteksi API Base (gunakan proxy /api atau absolut ke backend SERVER_URL/api)
export const API_BASE = '/api';

// ==========================================
// UNIFIED IMAGE URL HELPER (VPS & LOCAL READY)
// ==========================================
export const getImageUrl = (image, fallback = DEFAULT_PRODUCT_IMAGE) => {
  if (!image || typeof image !== 'string') {
    return fallback;
  }

  const cleanImage = image.trim();
  if (!cleanImage || cleanImage === '-' || cleanImage === '_') {
    return fallback;
  }

  // Jika sudah URL eksternal (Unsplash, HTTPS, HTTP) atau Base64 / Blob
  if (
    cleanImage.startsWith('http://') ||
    cleanImage.startsWith('https://') ||
    cleanImage.startsWith('data:image/') ||
    cleanImage.startsWith('blob:')
  ) {
    return cleanImage;
  }

  // Ambil nama file dan hilangkan awalan /uploads/ atau uploads/
  const filename = cleanImage.replace(/^\/?uploads\//, '').trim();
  if (!filename) return fallback;

  // Bersihkan SERVER_URL
  const base = SERVER_URL.replace(/\/+$/, '');

  // Kembalikan URL absolut yang valid ke backend VPS / localhost
  return `${base}/uploads/${filename}`;
};


// ==========================================
// TOKEN MANAGEMENT
// ==========================================
export const getAuthToken = () =>
  localStorage.getItem('katalogwa_token');

export const setAuthToken = (token) =>
  localStorage.setItem('katalogwa_token', token);

export const clearAuthToken = () =>
  localStorage.removeItem('katalogwa_token');

export const isAuthenticated = () =>
  !!getAuthToken();


// ==========================================
// AUTH HEADERS
// ==========================================
const getHeaders = (isFormData = false) => {
  const token = getAuthToken();

  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};


// ==========================================
// ERROR HANDLER
// ==========================================
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data.message ||
      `Request failed with status ${response.status}`;

    throw new Error(errorMsg);
  }

  return data;
};


// ==========================================
// STORE SETTINGS
// ==========================================
export const fetchStoreSettings = async () => {
  const res = await fetch(`${API_BASE}/store`);
  return handleResponse(res);
};

export const updateStoreSettings = async (settings) => {
  const res = await fetch(`${API_BASE}/store`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(settings)
  });

  return handleResponse(res);
};


// ==========================================
// CATEGORIES
// ==========================================
export const fetchCategories = async () => {
  const res = await fetch(`${API_BASE}/categories`);
  return handleResponse(res);
};

export const createCategory = async (name) => {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name })
  });

  return handleResponse(res);
};

export const updateCategory = async (id, name) => {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ name })
  });

  return handleResponse(res);
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  return handleResponse(res);
};


// ==========================================
// PRODUCTS
// ==========================================
export const fetchProducts = async ({
  categoryId = '',
  search = ''
} = {}) => {
  const params = new URLSearchParams();

  if (categoryId) {
    params.append('categoryId', categoryId);
  }

  if (search) {
    params.append('search', search);
  }

  const url =
    `${API_BASE}/products` +
    (params.toString()
      ? `?${params.toString()}`
      : '');

  const res = await fetch(url);

  return handleResponse(res);
};


export const createProduct = async (formData) => {
  const isFormData = formData instanceof FormData;

  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: getHeaders(isFormData),
    body: isFormData
      ? formData
      : JSON.stringify(formData)
  });

  return handleResponse(res);
};


export const updateProduct = async (id, formData) => {
  const isFormData = formData instanceof FormData;

  const res = await fetch(
    `${API_BASE}/products/${id}`,
    {
      method: 'PUT',
      headers: getHeaders(isFormData),
      body: isFormData
        ? formData
        : JSON.stringify(formData)
    }
  );

  return handleResponse(res);
};


export const updateProductStock = async (id, stock) => {
  const res = await fetch(
    `${API_BASE}/products/${id}/stock-amount`,
    {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        stock: Number(stock)
      })
    }
  );

  return handleResponse(res);
};


export const toggleProductStock = async (id) => {
  const res = await fetch(
    `${API_BASE}/products/${id}/stock`,
    {
      method: 'PATCH',
      headers: getHeaders()
    }
  );

  return handleResponse(res);
};


export const deleteProduct = async (id) => {
  const res = await fetch(
    `${API_BASE}/products/${id}`,
    {
      method: 'DELETE',
      headers: getHeaders()
    }
  );

  return handleResponse(res);
};


// ==========================================
// ORDERS
// ==========================================
export const fetchOrders = async () => {
  const res = await fetch(
    `${API_BASE}/orders`,
    {
      headers: getHeaders()
    }
  );

  return handleResponse(res);
};


export const createOrder = async (orderData) => {
  const res = await fetch(
    `${API_BASE}/orders`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    }
  );

  return handleResponse(res);
};


export const updateOrderStatus = async (id, status) => {
  const res = await fetch(
    `${API_BASE}/orders/${id}/status`,
    {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        status
      })
    }
  );

  return handleResponse(res);
};


export const deleteOrder = async (id) => {
  const res = await fetch(
    `${API_BASE}/orders/${id}`,
    {
      method: 'DELETE',
      headers: getHeaders()
    }
  );

  return handleResponse(res);
};


// ==========================================
// AUTH
// ==========================================
export const loginAdmin = async (email, password) => {
  const res = await fetch(
    `${API_BASE}/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await handleResponse(res);

  if (data && data.token) {
    setAuthToken(data.token);
  }

  return data;
};


export const fetchAdminProfile = async () => {
  const res = await fetch(
    `${API_BASE}/auth/me`,
    {
      headers: getHeaders()
    }
  );

  return handleResponse(res);
};


export const updateAdminProfile = async (profileData) => {
  const res = await fetch(
    `${API_BASE}/auth/profile`,
    {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    }
  );

  const data = await handleResponse(res);

  if (data && data.token) {
    setAuthToken(data.token);
  }

  return data;
};