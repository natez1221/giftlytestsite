import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { Image, Quantity } from "../components/ui";
import { money, products, store } from "../config/store";
import { useShop } from "../context";
import { NotFound } from "./NotFound";
export function ProductPage() {
  const { id } = useParams();
  const p = products.find((p) => p.id === id);
  const [q, setQ] = useState(1);
  const { add } = useShop();
  useEffect(() => setQ(1), [id]);
  if (!p) return <NotFound />;
  return (
    <main className="section product-page">
      <Link className="text-link back" to="/catalog">
        <ArrowLeft size={16} /> Назад в коллекцию
      </Link>
      <div className="product-detail">
        <div className="detail-image">
          <Image src={p.image} alt={`Подарочный набор «${p.name}»`} hero />
          {p.tag && <span className="tag">{p.tag}</span>}
        </div>
        <div className="detail-copy">
          <p className="eyebrow">
            {p.category.toUpperCase()} / {store.name} COLLECTION
          </p>
          <h1>{p.name}</h1>
          <p className="detail-subtitle">{p.subtitle}</p>
          <p className="detail-price">{money(p.price)}</p>
          <p>{p.description}</p>
          <div className="detail-purchase">
            <Quantity value={q} onChange={setQ} />
            <button className="button dark" onClick={() => add(p.id, q)}>
              Добавить в корзину <Plus size={18} />
            </button>
          </div>
          <div className="contents">
            <h3>Что внутри</h3>
            <ul>
              {p.contents.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <details>
            <summary>Как заказать и получить</summary>
            <p>
              Добавьте набор в корзину, скопируйте заказ и отправьте его
              продавцу в Telegram. Наличие, оплату и доставку согласуйте в чате.
              Это демонстрационный проект.
            </p>
          </details>
          <p className="demo-note">
            Вымышленный товар и цена. Изображение иллюстративное.
          </p>
        </div>
      </div>
      <div className="section-heading related-title">
        <div>
          <p className="eyebrow">ДРУГИЕ МАЛЕНЬКИЕ ИСТОРИИ</p>
          <h2>
            Ещё немного <em>вдохновения.</em>
          </h2>
        </div>
      </div>
      <div className="related-grid">
        {products
          .filter((item) => item.id !== p.id)
          .sort(
            (a, b) =>
              Number(b.category === p.category) -
              Number(a.category === p.category),
          )
          .slice(0, 3)
          .map((item) => (
            <ProductCard p={item} key={item.id} />
          ))}
      </div>
    </main>
  );
}
