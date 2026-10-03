import { CartItem, Order } from '../types';

export interface AppliedCoupon {
  code: string;
  percent: number;
}

export interface CheckoutDetails {
  customerName: string;
  email: string;
  address: string;
  city: string;
  paymentMethod: 'Tarjeta' | 'Contraentrega' | 'Transferencia';
}

export interface CartTotals {
  cartTotalCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartFinalTotal: number;
}

const COUPONS: Record<string, AppliedCoupon> = {
  UNIVERSAL10: { code: 'UNIVERSAL10', percent: 10 },
  LECTOR20: { code: 'LECTOR20', percent: 20 },
};

export function findCoupon(code: string): AppliedCoupon | null {
  return COUPONS[code.trim().toUpperCase()] ?? null;
}

export function calculateCartTotals(
  cart: CartItem[],
  coupon: AppliedCoupon | null,
): CartTotals {
  const cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = Number(
    cart.reduce((total, item) => total + item.book.price * item.quantity, 0).toFixed(2),
  );
  const cartDiscount = coupon
    ? Number(((cartSubtotal * coupon.percent) / 100).toFixed(2))
    : 0;
  const cartShipping = cartSubtotal > 40 || cartTotalCount === 0 ? 0 : 4.5;
  const cartFinalTotal = Number(
    Math.max(0, cartSubtotal - cartDiscount + cartShipping).toFixed(2),
  );

  return { cartTotalCount, cartSubtotal, cartDiscount, cartShipping, cartFinalTotal };
}

export function createOrder(
  cart: CartItem[],
  details: CheckoutDetails,
  totals: CartTotals,
): Order {
  return {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    items: cart.map((item) => ({
      bookId: item.book.id,
      bookTitle: item.book.title,
      author: item.book.author,
      imageUrl: item.book.imageUrl,
      quantity: item.quantity,
      price: item.book.price,
    })),
    subtotal: totals.cartSubtotal,
    discount: totals.cartDiscount,
    shipping: totals.cartShipping,
    total: totals.cartFinalTotal,
    status: 'Procesando',
    customerName: details.customerName,
    email: details.email,
    address: details.address,
    city: details.city,
    paymentMethod: details.paymentMethod,
  };
}