import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { money, type Product } from "../config/store";
import { useShop } from "../context";
import { Image, Reveal } from "./ui";
export function ProductCard({
  p,
  index = 0,
  editorial = false,
}: {
  p: Product;
  index?: number;
  editorial?: boolean;
}) {
  const { add } = useShop();
  return (
    <Reveal className={`product-card ${editorial ? "editorial-card" : ""}`}>
      <div className="product-visual">
        <Link
          to={`/product/${p.id}`}
          aria-label={`Подробнее о наборе ${p.name}`}
        >
          <Image
            src={p.image}
            alt={`Набор «${p.name}»: ${p.contents.slice(0, 2).join(", ")}`}
          />
        </Link>
        {p.tag && <span className="tag">{p.tag}</span>}
        <button
          className="quick-add"
          aria-label={`Добавить «${p.name}» в корзину`}
          onClick={() => add(p.id)}
        >
          <Plus size={19} />
        </button>
        {editorial && <span className="product-number">0{index + 1}</span>}
      </div>
      <div className="product-caption">
        <div>
          <Link to={`/product/${p.id}`}>
            <h3>{p.name}</h3>
          </Link>
          <p>{p.subtitle}</p>
        </div>
        <span className="price">{money(p.price)}</span>
      </div>
    </Reveal>
  );
}
