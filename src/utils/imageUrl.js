import { API_BASE } from '../services/api'

/**
 * Resolves an image path/URL to a full executable URL.
 * Handles Cloudinary URLs, external HTTPS images, blob URLs, and relative local server uploads.
 * @param {string} path 
 * @param {string} fallback 
 * @returns {string}
 */
export function getImageUrl(path, fallback = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80') {
  if (!path) return fallback
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path
  }
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`
}
