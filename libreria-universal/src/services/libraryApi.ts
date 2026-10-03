import { Book, Category, Order, UserProfile } from '../types';
import { CheckoutDetails } from './cartService';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '');
const TOKEN_KEY = 'univ_token_v1';

interface ApiEnvelope<T> {
  data: T;
}

interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  user: UserProfile;
}

interface CheckoutPayload {
  items: Array<{ bookId: number; quantity: number }>;
  coupon?: string;
  customer: CheckoutDetails;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');

  const token = getAuthToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const firstValidationMessage = payload?.errors
      ? Object.values(payload.errors).flat()[0]
      : null;
    throw new Error(firstValidationMessage || payload?.message || `Error HTTP ${response.status}`);
  }

  return (payload?.data ?? payload) as T;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function storeAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function saveAuthResponse(promise: Promise<AuthResponse>): Promise<UserProfile> {
  const result = await promise;
  storeAuthToken(result.accessToken);
  return result.user;
}

export const libraryApi = {
  getBooks(): Promise<Book[]> {
    return request<Book[]>('/books');
  },

  createBook(book: Omit<Book, 'id'>): Promise<Book> {
    return request<Book>('/books', { method: 'POST', body: JSON.stringify(book) });
  },

  updateBook(id: string, changes: Partial<Book>): Promise<Book> {
    return request<Book>(`/books/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    });
  },

  deleteBook(id: string): Promise<void> {
    return request<void>(`/books/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  getCategories(): Promise<Category[]> {
    return request<Category[]>('/categories');
  },

  createCategory(name: string, description?: string): Promise<Category> {
    return request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  },

  deleteCategory(id: string): Promise<void> {
    return request<void>(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  login(email: string, password: string): Promise<UserProfile> {
    return saveAuthResponse(request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }));
  },

  register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<UserProfile> {
    return saveAuthResponse(request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }));
  },

  getProfile(): Promise<UserProfile> {
    return request<UserProfile>('/auth/me');
  },

  updateProfile(profile: Pick<UserProfile, 'name' | 'email' | 'phone' | 'favoriteGenre'>): Promise<UserProfile> {
    return request<UserProfile>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(profile),
    });
  },

  async logout(): Promise<void> {
    try {
      await request<void>('/auth/logout', { method: 'POST' });
    } finally {
      clearAuthToken();
    }
  },

  getOrders(): Promise<Order[]> {
    return request<Order[]>('/orders');
  },

  checkout(payload: CheckoutPayload): Promise<Order> {
    return request<Order>('/orders', { method: 'POST', body: JSON.stringify(payload) });
  },
};