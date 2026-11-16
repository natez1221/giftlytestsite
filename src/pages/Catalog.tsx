import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { products, store } from "../config/store";
export function Catalog() {
  const location = useLocation();
  const [category, setCategory] = useState(
    new URLSearchParams(location.search).get("category") || "Все",
  );
  const [range, setRange] = useState(0);
  const [sort, setSort] = useState("default");
  useEffect(
    () =>
      setCategory(
        new URLSearchParams(location.search).get("category") || "Все",
      ),
    [location.search],
  );
  const r = store.priceRanges[range];
  const list = products
    .filter(
      (p) =>
        (category === "Все" || p.category === category) &&
        p.price >= r.min &&
        p.price <= r.max,
    )
    .sort((a, b) =>
      sort === "asc"
        ? a.price - b.price
        : sort === "desc"
          ? b.price - a.price
          : 0,
    );
  return (
    <main className="section catalog">
      <p className="eyebrow">
        <Link to="/">{store.name}</Link> / КОЛЛЕКЦИЯ
      </p>
      <div className="catalog-title">
        <h1>
          {store.copy.catalog.title} <em>{store.copy.catalog.accent}</em>
        </h1>
        <p>
          {store.copy.catalog.intro[0]}
          <br />
          {store.copy.catalog.intro[1]}
        </p>
      </div>
      <div className="filters">
        <div className="categories">
          {["Все", ...store.categories].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={c === category ? "selected" : ""}
              aria-pressed={c === category}
            >
              {c}
              {c === "Все" && (
                <sup>{products.length.toString().padStart(2, "0")}</sup>
              )}
            </button>
          ))}
        </div>
        <div className="selects">
          <label>
            Цена
            <select
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
            >
              {store.priceRanges.map((r, i) => (
                <option value={i} key={i}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Порядок
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Наш выбор</option>
              <option value="asc">Сначала дешевле</option>
              <option value="desc">Сначала дороже</option>
            </select>
          </label>
        </div>
      </div>
      <div className="catalog-meta">
        <span>Найдено наборов: {list.length}</span>
        <span>СОБРАНЫ ДЛЯ ОСОБЕННЫХ МОМЕНТОВ</span>
      </div>
      {list.length ? (
        <div className="catalog-grid">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>Немного другой повод?</h2>
          <p>В этом диапазоне пока нет наборов.</p>
          <button
            className="button dark"
            onClick={() => {
              setCategory("Все");
              setRange(0);
            }}
          >
            Показать все наборы
          </button>
        </div>
      )}
      <p className="demo-note">
        Демонстрационный магазин. Все товары, составы и цены вымышлены.
        Фотографии передают настроение; фактическая комплектация не предлагается
        к продаже.
      </p>
    </main>
  );
}
