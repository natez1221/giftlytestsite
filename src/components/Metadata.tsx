import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { products, store } from "../config/store";
export function Metadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const p = products.find((p) => pathname === `/product/${p.id}`);
    const title = p
      ? `${p.name} — ${store.name}`
      : pathname === "/catalog"
        ? `Коллекция подарков — ${store.name}`
        : `${store.name} — ${store.copy.heroTitle}`;
    const description = p
      ? `${p.description} Демонстрационный набор.`
      : store.copy.heroSubtitle + ". Демонстрационный магазин.";
    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
  }, [pathname]);
  return null;
}
