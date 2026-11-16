import { ArrowUpRight, Check, Copy, ShoppingBag, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { orderText, total } from "../cart";
import { money, products, store } from "../config/store";
import { useShop } from "../context";
import { Image, Quantity } from "./ui";
export function CartDrawer({ close }: { close: () => void }) {
  const { cart, setQty } = useShop();
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const previous = useRef<HTMLElement | null>(
    document.activeElement as HTMLElement,
  );
  const lines = products.filter((p) => cart[p.id]);
  const validTelegram = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(store.telegram);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const els = ref.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]),a[href],textarea",
        );
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", key);
      previous.current?.focus();
    };
  }, [close]);
  useEffect(() => {
    setCopied(false);
    setStatus("");
    setFallback(false);
  }, [cart]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(orderText(cart));
      setCopied(true);
      setStatus(
        "Заказ скопирован. Откройте Telegram и вставьте его в чат продавца.",
      );
    } catch {
      setFallback(true);
      setStatus(
        "Автокопирование недоступно. Выделите и скопируйте текст ниже вручную.",
      );
    }
  }
  return (
    <motion.div
      className="cart-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={close}
    >
      <motion.aside
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="cart-drawer"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.35 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-heading">
          <div>
            <p className="eyebrow">ВАШИ МАЛЕНЬКИЕ ИСТОРИИ</p>
            <h2 id="cart-title">
              Корзина{" "}
              <em>({Object.values(cart).reduce((a, b) => a + b, 0)})</em>
            </h2>
          </div>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Закрыть корзину"
          >
            <X />
          </button>
        </div>
        {!lines.length ? (
          <div className="empty">
            <ShoppingBag size={38} strokeWidth={1} />
            <h3>Пока здесь тихо.</h3>
            <p>Добавьте подарок, который расскажет о ваших чувствах.</p>
            <Link to="/catalog" onClick={close} className="button dark">
              Исследовать коллекцию <ArrowUpRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {lines.map((p) => (
                <div className="cart-item" key={p.id}>
                  <Link to={`/product/${p.id}`} onClick={close}>
                    <Image src={p.image} alt={p.name} />
                  </Link>
                  <div>
                    <Link to={`/product/${p.id}`} onClick={close}>
                      <h3>{p.name}</h3>
                    </Link>
                    <span>{money(p.price)}</span>
                    <Quantity
                      value={cart[p.id]}
                      onChange={(n) => setQty(p.id, n)}
                      label={`Количество «${p.name}»`}
                    />
                  </div>
                  <div className="cart-item-right">
                    <button
                      className="icon-button"
                      onClick={() => setQty(p.id, 0)}
                      aria-label={`Удалить «${p.name}»`}
                    >
                      <X size={16} />
                    </button>
                    <span>{money(p.price * cart[p.id])}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout">
              <div className="subtotal">
                <span>Итого</span>
                <strong>{money(total(cart))}</strong>
              </div>
              <p>
                Доставка и оплата согласовываются с продавцом.
                <br />
                Демонстрационный заказ — без онлайн-оплаты.
              </p>
              <button className="button dark" onClick={copy}>
                {copied ? <Check size={17} /> : <Copy size={17} />}{" "}
                {copied ? "Заказ скопирован" : "1. Скопировать заказ"}
              </button>
              {validTelegram ? (
                <a
                  className={`button outline ${!copied ? "muted" : ""}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://t.me/${store.telegram}`}
                >
                  2. Открыть Telegram <ArrowUpRight size={17} />
                </a>
              ) : (
                <div className="telegram-unset">
                  Telegram продавца пока не настроен. В демоверсии доступно
                  копирование заказа.
                </div>
              )}
              <p className="checkout-instruction">
                Вставьте скопированный текст в чат продавца и отправьте
                сообщение самостоятельно.
              </p>
              <p role="status" className="copy-status">
                {status}
              </p>
              {fallback && (
                <textarea
                  aria-label="Текст заказа для ручного копирования"
                  readOnly
                  value={orderText(cart)}
                  onFocus={(e) => e.target.select()}
                  rows={7}
                />
              )}
            </div>
          </>
        )}
      </motion.aside>
    </motion.div>
  );
}
