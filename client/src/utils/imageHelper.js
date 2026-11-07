/**
 * Utility helper to normalize image URLs for production & VPS environments.
 * - Handles relative `/uploads/...` paths correctly.
 * - Handles full URLs (http/https) and data:image (base64).
 * - Falls back to a clean default image if empty or invalid.
 */
export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';

export const getImageUrl = (imageSrc, fallback = DEFAULT_PRODUCT_IMAGE) => {
  if (!imageSrc || typeof imageSrc !== 'string') return fallback;

  const trimmed = imageSrc.trim();
  if (!trimmed || trimmed === '-' || trimmed === '_') return fallback;

  // If already absolute URL (http/https) or base64 data URI
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // If relative uploads path without leading slash
  if (trimmed.startsWith('uploads/')) {
    return `/${trimmed}`;
  }

  // If starts with / (e.g. /uploads/product-xyz.jpg)
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return trimmed;
};

