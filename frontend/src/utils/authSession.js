export const SESSION_EVENT = 'camera:session-ended';

export function tokenExpiry(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return 0;
    const encoded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=')));
    return Number.isFinite(payload.exp) && payload.exp > 0 ? payload.exp * 1000 : 0;
  } catch { return 0; }
}

export function readSession() {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!token || tokenExpiry(token) <= Date.now() || !user ||
        typeof user.id !== 'string' || !/^[a-f\d]{24}$/i.test(user.id) ||
        typeof user.name !== 'string' || typeof user.email !== 'string' ||
        !['user', 'admin'].includes(user.role)) return null;
    const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=')));
    if (payload.id !== user.id) return null;
    // Only the backend verifies the signature and grants permissions.
    return { token, user };
  } catch { return null; }
}

export function storeSession(session) {
  localStorage.setItem('user', JSON.stringify(session.user));
  localStorage.setItem('token', session.token);
  localStorage.removeItem('cinevault_user');
}

export function endSession(reason = 'expired', clearCart = false) {
  if (clearCart) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (/^[a-f\d]{24}$/i.test(user?.id || '')) localStorage.removeItem(`camera_cart_v1_${user.id}`);
    } catch { /* A corrupt cached profile must not prevent logout. */ }
    ['cart', 'cinevault_cart', 'cinevault_rentals', 'cinevault_orders', 'cinevault_wishlist']
      .forEach(key => localStorage.removeItem(key));
  }
  ['token', 'user', 'cinevault_user'].forEach(key => localStorage.removeItem(key));
  window.dispatchEvent(new CustomEvent(SESSION_EVENT, { detail: { reason } }));
}
