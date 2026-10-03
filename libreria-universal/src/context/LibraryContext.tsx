import React, { useState, useEffect } from 'react';
import { Book, Category, CartItem, Order, UserProfile, UserRole } from '../types';
import { INITIAL_BOOKS, INITIAL_CATEGORIES, INITIAL_USER } from '../data/mockData';
import { readLibraryValue, writeLibraryValue } from '../services/libraryStorage';
import { AppliedCoupon, calculateCartTotals, CheckoutDetails, findCoupon } from '../services/cartService';
import { getAuthToken, libraryApi } from '../services/libraryApi';
import { LibraryContext, LibraryContextType } from './LibraryContextValue';

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage hydrated states
  const [books, setBooks] = useState<Book[]>(() => readLibraryValue('books', INITIAL_BOOKS));
  const [categories, setCategories] = useState<Category[]>(() => readLibraryValue('categories', INITIAL_CATEGORIES));
  const [cart, setCart] = useState<CartItem[]>(() => readLibraryValue('cart', []));
  const [role, setRoleState] = useState<UserRole>('client');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => Boolean(getAuthToken()));

  // Views & Modals
  const [activeView, setActiveView] = useState<'shop' | 'admin'>('shop');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [selectedBookDetail, setSelectedBookDetail] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 80]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'title-asc'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // The cart remains local; catalog, users, and orders are owned by the API.
  useEffect(() => {
    writeLibraryValue('cart', cart);
  }, [cart]);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [apiBooks, apiCategories] = await Promise.all([
          libraryApi.getBooks(),
          libraryApi.getCategories(),
        ]);
        if (!active) return;

        setBooks(apiBooks);
        setCategories(apiCategories);
        setCart((previous) => previous.flatMap((item) => {
          const currentBook = apiBooks.find((book) => book.id === item.book.id);
          return currentBook ? [{ ...item, book: currentBook }] : [];
        }));
      } catch (error) {
        if (active) {
          showToast(error instanceof Error ? error.message : 'No se pudo conectar con el catálogo', 'warning');
        }
      }

      if (!getAuthToken()) return;
      try {
        const [profile, apiOrders] = await Promise.all([
          libraryApi.getProfile(),
          libraryApi.getOrders(),
        ]);
        if (!active) return;

        setUser(profile);
        setRoleState(profile.role);
        setActiveView(profile.role === 'admin' ? 'admin' : 'shop');
        setOrders(apiOrders);
        setIsLoggedIn(true);
      } catch {
        if (active) {
          void libraryApi.logout().catch(() => undefined);
          setIsLoggedIn(false);
          setRoleState('client');
          setOrders([]);
        }
      }
    };

    void loadData();
    return () => {
      active = false;
    };
  }, []);

  const setRole = (newRole: UserRole) => {
    if (newRole === 'admin' && user.role !== 'admin') {
      showToast('Se requiere una cuenta administradora para abrir el panel', 'warning');
      return;
    }

    if (newRole === 'admin') {
      setActiveView('admin');
    } else {
      setActiveView('shop');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 80]);
    setSortBy('featured');
    setInStockOnly(false);
  };

  const refreshCatalog = () => {
    Promise.all([libraryApi.getBooks(), libraryApi.getCategories()])
      .then(([apiBooks, apiCategories]) => {
        setBooks(apiBooks);
        setCategories(apiCategories);
        showToast('Catálogo sincronizado con el servidor', 'info');
      })
      .catch((error: unknown) => {
        showToast(error instanceof Error ? error.message : 'No se pudo sincronizar el catálogo', 'warning');
      });
  };

  // CRUD Books
  const addBook = (bookData: Omit<Book, 'id'>) => {
    void libraryApi.createBook(bookData)
      .then((book) => {
        setBooks((previous) => [book, ...previous]);
        return libraryApi.getCategories();
      })
      .then(setCategories)
      .then(() => showToast(`"${bookData.title}" añadido con éxito al catálogo`))
      .catch((error: unknown) => {
        showToast(error instanceof Error ? error.message : 'No se pudo guardar el libro', 'warning');
      });
  };

  const updateBook = (id: string, bookData: Partial<Book>) => {
    void libraryApi.updateBook(id, bookData)
      .then((updatedBook) => {
        setBooks((previous) => previous.map((book) => book.id === id ? updatedBook : book));
        showToast('Libro actualizado correctamente');
      })
      .catch((error: unknown) => {
        showToast(error instanceof Error ? error.message : 'No se pudo actualizar el libro', 'warning');
      });
  };

  const deleteBook = (id: string) => {
    const bookToDelete = books.find((b) => b.id === id);
    void libraryApi.deleteBook(id)
      .then(() => {
        setBooks((previous) => previous.filter((book) => book.id !== id));
        setCart((previous) => previous.filter((item) => item.book.id !== id));
        showToast(`Libro "${bookToDelete?.title || id}" eliminado del catálogo`, 'warning');
      })
      .catch((error: unknown) => {
        showToast(error instanceof Error ? error.message : 'No se pudo eliminar el libro', 'warning');
      });
  };

  // Categories
  const addCategory = (name: string, description?: string) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    if (categories.some((c) => c.name.toLowerCase() === cleanName.toLowerCase())) {
      showToast('Esta categoría ya existe', 'warning');
      return;
    }
    void libraryApi.createCategory(cleanName, description)
      .then((category) => {
        setCategories((previous) => [...previous, category]);
        showToast(`Categoría "${cleanName}" agregada con éxito`);
      })
      .catch((error: unknown) => {
        showToast(error instanceof Error ? error.message : 'No se pudo guardar la categoría', 'warning');
      });
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    // Don't allow deletion if books exist in category
    const count = books.filter((b) => b.category.toLowerCase() === cat.name.toLowerCase()).length;
    if (count > 0) {
      showToast(`No se puede eliminar "${cat.name}" porque tiene ${count} libro(s) asignados`, 'warning');
      return;
    }
    void libraryApi.deleteCategory(id)
      .then(() => {
        setCategories((previous) => previous.filter((category) => category.id !== id));
        showToast(`Categoría "${cat.name}" eliminada`);
      })
      .catch((error: unknown) => {
        showToast(error instanceof Error ? error.message : 'No se pudo eliminar la categoría', 'warning');
      });
  };

  // Cart operations
  const addToCart = (book: Book, quantity: number = 1): boolean => {
    if (book.stock <= 0) {
      showToast(`"${book.title}" no cuenta con stock disponible`, 'warning');
      return false;
    }

    let success = false;
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        if (existing.quantity + quantity > book.stock) {
          showToast(`Límite de stock alcanzado (${book.stock} disponibles)`, 'warning');
          return prev;
        }
        success = true;
        return prev.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        if (quantity > book.stock) {
          showToast(`Solo hay ${book.stock} unidades en stock`, 'warning');
          return prev;
        }
        success = true;
        return [...prev, { book, quantity }];
      }
    });

    if (success) {
      showToast(`¡"${book.title}" agregado al carrito!`);
    }
    return success;
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
    showToast('Libro removido del carrito', 'info');
  };

  const updateCartQuantity = (bookId: string, delta: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.book.id === bookId);
      if (!item) return prev;
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((i) => i.book.id !== bookId);
      }
      if (newQty > item.book.stock) {
        showToast(`Stock máximo alcanzado (${item.book.stock} unidades)`, 'warning');
        return prev;
      }
      return prev.map((i) => (i.book.id === bookId ? { ...i, quantity: newQty } : i));
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const coupon = findCoupon(code);
    if (!coupon) {
      return { success: false, message: 'Código de cupón inválido o expirado' };
    }

    setAppliedCoupon(coupon);
    if (coupon.code === 'UNIVERSAL10') {
      showToast('¡Cupón aplicado! 10% de descuento concedido');
      return { success: true, message: '10% de descuento aplicado' };
    }
    showToast('¡Cupón especial Lector aplicado! 20% de descuento');
    return { success: true, message: '20% de descuento aplicado' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón removido', 'info');
  };

  const { cartTotalCount, cartSubtotal, cartDiscount, cartShipping, cartFinalTotal } =
    calculateCartTotals(cart, appliedCoupon);

  // Checkout
  const completeCheckout = async (details: CheckoutDetails): Promise<Order | null> => {
    if (cart.length === 0) return null;
    if (!isLoggedIn) {
      showToast('Debe iniciar sesión en su cuenta de cliente para proceder con la compra', 'warning');
      return null;
    }

    try {
      const newOrder = await libraryApi.checkout({
        items: cart.map((item) => ({ bookId: Number(item.book.id), quantity: item.quantity })),
        coupon: appliedCoupon?.code,
        customer: details,
      });
      const [apiBooks, apiOrders, profile] = await Promise.all([
        libraryApi.getBooks(),
        libraryApi.getOrders(),
        libraryApi.getProfile(),
      ]);
      setBooks(apiBooks);
      setOrders(apiOrders);
      setUser(profile);
      setCart([]);
      setAppliedCoupon(null);
      setIsCartOpen(false);
      showToast(`¡Pedido ${newOrder.id} realizado con éxito! Gracias por su compra`);
      return newOrder;
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'No se pudo completar el pedido', 'warning');
      return null;
    }
  };

  const updateUser = (data: Partial<UserProfile>) => {
    const profile = {
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      phone: data.phone ?? user.phone,
      favoriteGenre: data.favoriteGenre ?? user.favoriteGenre,
    };
    void libraryApi.updateProfile(profile)
      .then((updatedUser) => {
        setUser(updatedUser);
        showToast('Perfil actualizado correctamente');
      })
      .catch((error: unknown) => {
        showToast(error instanceof Error ? error.message : 'No se pudo actualizar el perfil', 'warning');
      });
  };

  const loginUser = async (email: string, password?: string, customName?: string, register = false) => {
    try {
      const profile = register
        ? await libraryApi.register({
            name: customName || email.split('@')[0],
            email,
            password: password || '',
            password_confirmation: password || '',
          })
        : await libraryApi.login(email, password || '');
      const apiOrders = await libraryApi.getOrders();

      setUser(profile);
      setRoleState(profile.role);
      setActiveView(profile.role === 'admin' ? 'admin' : 'shop');
      setOrders(apiOrders);
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
      showToast(`¡Bienvenido(a), ${profile.name}!`, 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'No se pudo iniciar sesión', 'warning');
    }
  };

  const logoutUser = () => {
    const guestUser: UserProfile = {
      name: 'Lector Invitado',
      email: '',
      phone: '',
      role: 'client',
      memberSince: 'Hoy',
      loyaltyPoints: 0,
      favoriteGenre: 'Novelas',
    };
    void libraryApi.logout().catch(() => undefined).finally(() => {
      setUser(guestUser);
      setRoleState('client');
      setActiveView('shop');
      setOrders([]);
      setIsLoggedIn(false);
      showToast('Has cerrado sesión. Navegando como Lector Invitado.', 'info');
    });
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        categories,
        addBook,
        updateBook,
        deleteBook,
        addCategory,
        deleteCategory,
        refreshCatalog,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartTotalCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartFinalTotal,

        orders,
        completeCheckout,

        user,
        role,
        isLoggedIn,
        setRole,
        updateUser,
        loginUser,
        logoutUser,

        activeView,
        setActiveView,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isProfileOpen,
        setIsProfileOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isFAQModalOpen,
        setIsFAQModalOpen,
        isTermsModalOpen,
        setIsTermsModalOpen,
        selectedBookDetail,
        setSelectedBookDetail,
        editingBook,
        setEditingBook,
        isBookFormOpen,
        setIsBookFormOpen,

        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        resetFilters,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
