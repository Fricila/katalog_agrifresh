
const API_BASE = '/api';

// ============================================
// TOKEN MANAGEMENT
// ============================================

export const getAuthToken = () => {
  try {
    return localStorage.getItem('katalogwa_token');
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    localStorage.setItem('katalogwa_token', token);
  } catch (error) {
    console.error('Gagal menyimpan token:', error);
  }
};

export const clearAuthToken = () => {
  try {
    localStorage.removeItem('katalogwa_token');
  } catch (error) {
    console.error('Gagal menghapus token:', error);
  }
};

export const isAuthenticated = () => !!getAuthToken();

// ============================================
// REQUEST HEADERS
// ============================================

const getHeaders = (isFormData = false) => {
  const headers = {};
  const token = getAuthToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

// ============================================
// RESPONSE HANDLER
// ============================================

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  let data = {};

  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => ({}));
  } else {
    const text = await response.text().catch(() => '');
    data = text ? { message: text } : {};
  }

  if (!response.ok) {
    const errorMessage =
      data.message ||
      data.error ||
      `Request gagal dengan status ${response.status}`;

    throw new Error(errorMessage);
  }

  return data;
};

// ============================================
// API REQUEST HELPER
// ============================================

const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  });

  return handleResponse(response);
};

// ============================================
// STORE SETTINGS
// ============================================

export const fetchStoreSettings = async () => {
  return apiRequest('/store');
};

export const updateStoreSettings = async (settings) => {
  return apiRequest('/store', {
    method: 'PUT',
    body: JSON.stringify(settings)
  });
};

// ============================================
// CATEGORIES
// ============================================

export const fetchCategories = async () => {
  return apiRequest('/categories');
};

export const createCategory = async (name) => {
  return apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify({ name })
  });
};

export const updateCategory = async (id, name) => {
  return apiRequest(`/categories/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ name })
  });
};

export const deleteCategory = async (id) => {
  return apiRequest(`/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};

// ============================================
// PRODUCTS
// ============================================

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

  const queryString = params.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  return apiRequest(endpoint);
};

export const createProduct = async (formData) => {
  const isFormData = formData instanceof FormData;

  return apiRequest('/products', {
    method: 'POST',
    headers: isFormData
      ? { 'Content-Type': undefined }
      : {},
    body: isFormData ? formData : JSON.stringify(formData)
  });
};

export const updateProduct = async (id, formData) => {
  const isFormData = formData instanceof FormData;

  return apiRequest(`/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: isFormData
      ? { 'Content-Type': undefined }
      : {},
    body: isFormData ? formData : JSON.stringify(formData)
  });
};

export const toggleProductStock = async (id) => {
  return apiRequest(`/products/${encodeURIComponent(id)}/stock`, {
    method: 'PATCH'
  });
};

export const deleteProduct = async (id) => {
  return apiRequest(`/products/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
};

// ============================================
// AUTHENTICATION
// ============================================

export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  return handleResponse(response);
};

export const fetchAdminProfile = async () => {
  return apiRequest('/auth/me');
};
