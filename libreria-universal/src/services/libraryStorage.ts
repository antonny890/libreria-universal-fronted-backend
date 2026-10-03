import { Book, CartItem, Category, Order, UserProfile, UserRole } from '../types';

type LibraryStorageValues = {
  books: Book[];
  categories: Category[];
  cart: CartItem[];
  role: UserRole;
  user: UserProfile;
  orders: Order[];
  loggedIn: boolean;
};

const STORAGE_KEYS: Record<keyof LibraryStorageValues, string> = {
  books: 'univ_books_v1',
  categories: 'univ_cats_v1',
  cart: 'univ_cart_v1',
  role: 'univ_role_v1',
  user: 'univ_user_v1',
  orders: 'univ_orders_v1',
  loggedIn: 'univ_logged_v1',
};

export function readLibraryValue<Key extends keyof LibraryStorageValues>(
  key: Key,
  fallback: LibraryStorageValues[Key],
): LibraryStorageValues[Key] {
  try {
    const value = localStorage.getItem(STORAGE_KEYS[key]);
    if (value === null) return fallback;
    if (key === 'loggedIn') return (value === 'true') as LibraryStorageValues[Key];
    if (key === 'role') return (value || fallback) as LibraryStorageValues[Key];
    return JSON.parse(value) as LibraryStorageValues[Key];
  } catch {
    return fallback;
  }
}

export function writeLibraryValue<Key extends keyof LibraryStorageValues>(
  key: Key,
  value: LibraryStorageValues[Key],
): void {
  try {
    const serializedValue = key === 'loggedIn' || key === 'role' ? String(value) : JSON.stringify(value);
    if (serializedValue !== undefined) {
      localStorage.setItem(STORAGE_KEYS[key], serializedValue);
    }
  } catch {
    // Storage can be unavailable or full; in-memory state remains usable.
  }
}

export function removeLibraryValue(key: keyof LibraryStorageValues): void {
  try {
    localStorage.removeItem(STORAGE_KEYS[key]);
  } catch {
    // Storage can be unavailable; in-memory state remains usable.
  }
}