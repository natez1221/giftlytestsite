import { createContext, useContext } from "react";
import type { Cart } from "./cart";
export type Shop = {
  cart: Cart;
  add: (id: string, q?: number) => void;
  setQty: (id: string, q: number) => void;
  open: () => void;
};
export const Context = createContext<Shop>(null!);
export const useShop = () => useContext(Context);
