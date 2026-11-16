import { Menu, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { store } from "../config/store";
import { useShop } from "../context";
export function Header() {
  const { cart, open } = useShop();
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  useEffect(() => setMenu(false), [location]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <>
      <div className="announcement">
        {store.copy.announcement}{" "}
        <span>
          {store.name}, {store.copy.announcementNote}
        </span>
      </div>
      <header className="header">
        <Link to="/" className="logo" aria-label="Магазин — на главную">
          {store.logo ? <img src={store.logo} alt={store.name} /> : store.name}
          <span>{store.copy.brandEnglish}</span>
        </Link>
        <nav className="desktop-nav">
          <NavLink to="/catalog">Коллекция</NavLink>
          <Link to="/#story">О {store.name}</Link>
          <Link to="/#giving">Искусство дарить</Link>
        </nav>
        <div className="header-right">
          <span className="header-note">{store.copy.tagline}</span>
          <button
            className="bag icon-button"
            onClick={open}
            aria-label={`Открыть корзину, товаров: ${count}`}
          >
            <ShoppingBag size={20} />
            <span>{count.toString().padStart(2, "0")}</span>
          </button>
          <button
            className="mobile-toggle icon-button"
            aria-label={menu ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {menu && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <NavLink to="/catalog">Коллекция</NavLink>
            <Link to="/#story">О {store.name}</Link>
            <Link to="/#giving">Искусство дарить</Link>
            <Link to="/#how">Как заказать</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Link className="footer-logo" to="/">
            {store.name}
          </Link>
          <p>
            {store.copy.footer[0]}
            <br />
            {store.copy.footer[1]}
          </p>
        </div>
        <div className="footer-links">
          <Link to="/catalog">Коллекция</Link>
          <Link to="/#story">О бренде</Link>
          <Link to="/#how">Как заказать</Link>
        </div>
        <div>
          <p className="eyebrow">ДАВАЙТЕ БУДЕМ БЛИЖЕ</p>
          <a href={`mailto:${store.email}`}>{store.email}</a>
          {store.socials.map((s) => (
            <a
              className="social"
              href={s.url}
              key={s.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.label} ↗
            </a>
          ))}
          <p className="footer-demo">Контакты демонстрационные.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {store.name}. Создано с вниманием.
        </span>
        <span>Демонстрационный магазин · Без приёма платежей</span>
        <span>{store.copy.footerEnglish}</span>
      </div>
    </footer>
  );
}

export function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() =>
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
          }),
      );
    } else window.scrollTo(0, 0);
  }, [location]);
  return null;
}
