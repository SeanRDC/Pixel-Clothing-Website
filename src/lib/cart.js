const CART_KEY = 'cart';

export function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function writeCart(items) {
  try {
    if (items.length === 0) {
      localStorage.removeItem(CART_KEY);
    } else {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  } catch {
    // Storage can be unavailable (private mode, quota); the cart still works in memory.
  }
}
