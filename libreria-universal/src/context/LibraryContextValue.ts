import { createContext } from 'react';
import type { Book, Category, CartItem, Order, UserProfile, UserRole } from '../types';
import type { CheckoutDetails } from '../services/cartService';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface LibraryContextType {
  books: Book[];
  categories: Category[];
  addBook: (bookData: Omit<Book, 'id'>) => void;
  updateBook: (id: string, bookData: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addCategory: (name: string, description?: string) => void;
  deleteCategory: (id: string) => void;
  refreshCatalog: () => void;

  cart: CartItem[];
  addToCart: (book: Book, quantity?: number) => boolean;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: { code: string; percent: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartFinalTotal: number;

  orders: Order[];
  completeCheckout: (details: CheckoutDetails) => Promise<Order | null>;

  user: UserProfile;
  role: UserRole;
  isLoggedIn: boolean;
  setRole: (role: UserRole) => void;
  updateUser: (data: Partial<UserProfile>) => void;
  loginUser: (email: string, password?: string, customName?: string, register?: boolean) => Promise<void>;
  logoutUser: () => void;

  activeView: 'shop' | 'admin';
  setActiveView: (view: 'shop' | 'admin') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isFAQModalOpen: boolean;
  setIsFAQModalOpen: (open: boolean) => void;
  isTermsModalOpen: boolean;
  setIsTermsModalOpen: (open: boolean) => void;
  selectedBookDetail: Book | null;
  setSelectedBookDetail: (book: Book | null) => void;
  editingBook: Book | null;
  setEditingBook: (book: Book | null) => void;
  isBookFormOpen: boolean;
  setIsBookFormOpen: (open: boolean) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'title-asc';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'title-asc') => void;
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;
  resetFilters: () => void;

  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

export const LibraryContext = createContext<LibraryContextType | undefined>(undefined);