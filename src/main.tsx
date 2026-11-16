import { ArrowUpRight, Check } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { CART_KEY, loadCart, type Cart } from "./cart";
import { CartDrawer } from "./components/CartDrawer";
import { Footer, Header, ScrollManager } from "./components/layout";
import { products, store } from "./config/store";
import { Context } from "./context";
import { Catalog } from "./pages/Catalog";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { ProductPage } from "./pages/ProductPage";
import "./styles.css";
import { Metadata } from "./components/Metadata";
function App() {
  const [cart, setCart] = useState<Cart>(loadCart);
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [cart]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(timer);
  }, [toast]);
  function setQty(id: string, q: number) {
    setCart((current) => {
      const next = { ...current };
      if (q <= 0) delete next[id];
      else next[id] = Math.min(99, Math.max(1, Math.floor(q)));
      return next;
    });
  }
  function add(id: string, q = 1) {
    setCart((c) => ({ ...c, [id]: Math.min(99, (c[id] || 0) + q) }));
    setToast(`«${products.find((p) => p.id === id)?.name}» — в корзине`);
  }
  const close = React.useCallback(() => setOpen(false), []);
  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(store.palette))
      root.style.setProperty("--" + key, value);
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <Context.Provider
        value={{ cart, add, setQty, open: () => setOpen(true) }}
      >
        <HashRouter>
          <ScrollManager />
          <Metadata />
          <a
            className="skip"
            href="#main"
            onClick={(e) => {
              e.preventDefault();
              const main = document.getElementById("main");
              main?.focus();
              main?.scrollIntoView();
            }}
          >
            Перейти к содержимому
          </a>
          <Header />
          <div id="main" tabIndex={-1}>
            <Routes>
              <Route
                path="/"
                element={
                  <main>
                    <Home />
                  </main>
                }
              />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
          <AnimatePresence>
            {isOpen && <CartDrawer close={close} />}
          </AnimatePresence>
          <div className="toast-container" role="status">
            <AnimatePresence>
              {toast && (
                <motion.div
                  className="toast"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                >
                  <Check size={17} />
                  {toast}
                  <button
                    onClick={() => {
                      setToast("");
                      setOpen(true);
                    }}
                  >
                    Открыть <ArrowUpRight size={15} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {storageError && (
            <p className="storage-error" role="status">
              Сохранение недоступно: корзина останется до закрытия страницы.
            </p>
          )}
        </HashRouter>
      </Context.Provider>
    </MotionConfig>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
