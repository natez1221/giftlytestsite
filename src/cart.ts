import { money, products } from "./config/store";
export type Cart = Record<string, number>;
export const CART_KEY = "giftly-cart-v1";
export function cleanCart(raw: unknown): Cart {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return Object.fromEntries(
    Object.entries(raw).filter(
      ([id, q]) =>
        products.some((p) => p.id === id) &&
        Number.isInteger(q) &&
        q > 0 &&
        q <= 99,
    ),
  );
}
export function loadCart(): Cart {
  try {
    return cleanCart(JSON.parse(localStorage.getItem(CART_KEY) || "{}"));
  } catch {
    return {};
  }
}
export const total = (cart: Cart) =>
  products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
export const orderText = (cart: Cart) =>
  "Здравствуйте! Хочу заказать:\n\n" +
  products
    .filter((p) => cart[p.id])
    .map(
      (p, i) =>
        `${i + 1}. ${p.name} — ${cart[p.id]} шт. — ${money(p.price * cart[p.id])}.`,
    )
    .join("\n") +
  "\n\nИтого: " +
  money(total(cart));
