import { ArrowUpRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { Image, Reveal } from "../components/ui";
import { products, store } from "../config/store";
export function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow">{store.copy.eyebrow}</p>
            <h1>
              {store.copy.heroLines[0]}
              <br />
              {store.copy.heroLines[1]} <em>{store.copy.heroLines[2]}</em>
              <span className="period">.</span>
            </h1>
            <p className="hero-description">{store.copy.heroSubtitle}</p>
            <Link className="button dark" to="/catalog">
              {store.copy.cta}
              <ArrowUpRight size={18} />
            </Link>
          </Reveal>
          <div className="hero-foot">
            <span>
              {store.copy.heroFoot[0]}
              <br />
              {store.copy.heroFoot[1]}
            </span>
            <span className="hero-index">
              EST. <i>/</i> {store.copy.established}
            </span>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src={store.images.hero}
            hero
            alt="Подарок в бумажной упаковке с лентой"
          />
          <div className="image-label">
            <span>
              {store.copy.photoCaption[0]}
              <br />
              <em>{store.copy.photoCaption[1]}</em>
            </span>
            <span className="seal">
              {store.name.slice(0, 1)}
              <span>{store.copy.withLove}</span>
            </span>
          </div>
        </div>
        <div className="hero-side">{store.copy.heroSide}</div>
      </section>
      <div className="values-line">
        {store.copy.values.map((value, i) => (
          <React.Fragment key={value}>
            {i > 0 && <i aria-hidden="true">✦</i>}
            <span>{value}</span>
          </React.Fragment>
        ))}
      </div>
      <section className="section curated">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">{store.copy.curated.eyebrow}</p>
            <h2>
              {store.copy.curated.title} <em>{store.copy.curated.accent}</em>
            </h2>
          </div>
          <Link className="text-link" to="/catalog">
            Вся коллекция <ArrowUpRight size={17} />
          </Link>
        </Reveal>
        <div className="curated-grid">
          {products.slice(0, 3).map((p, i) => (
            <ProductCard p={p} index={i} editorial key={p.id} />
          ))}
        </div>
        <p className="demo-note">
          Демонстрационная коллекция. Товары, составы и цены вымышлены.
        </p>
      </section>
      <section id="story" className="story section">
        <Reveal className="story-photo">
          <Image src={store.images.story} alt="Бережно упакованный подарок" />
          <span className="photo-note">{store.copy.storyNote}</span>
        </Reveal>
        <Reveal className="story-copy">
          <p className="eyebrow">ФИЛОСОФИЯ {store.name}</p>
          <h2>
            {store.copy.storyTitle[0]}
            <br />
            <em>{store.copy.storyTitle[1]}</em>
          </h2>
          <p>{store.copy.storyText}</p>
          <p>
            {store.copy.storyExtra[0]}
            <br />
            {store.copy.storyExtra[1]}
          </p>
          <Link className="text-link" to="/catalog">
            Найти свой подарок <ArrowUpRight size={17} />
          </Link>
          <span className="signature">С теплом, {store.name}</span>
        </Reveal>
      </section>
      <section className="occasion section">
        <Reveal>
          <p className="eyebrow">{store.copy.occasion.eyebrow}</p>
          <h2>
            {store.copy.occasion.title}
            <br />
            {store.copy.occasion.prefix} <em>{store.copy.occasion.accent}</em>
          </h2>
          <div className="occasion-links">
            {store.categories.map((cat, i) => (
              <Link
                to={`/catalog?category=${encodeURIComponent(cat)}`}
                key={cat}
              >
                <span>0{i + 1}</span>
                {cat}
                <ArrowUpRight size={23} />
              </Link>
            ))}
          </div>
        </Reveal>
      </section>
      <section id="giving" className="giving">
        <Reveal className="giving-copy">
          <p className="eyebrow">{store.copy.brandEnglish}</p>
          <h2>
            {store.copy.artTitle[0]}
            <br />
            <em>{store.copy.artTitle[1]}</em>
          </h2>
          <p>{store.copy.artText}</p>
          <span className="fine-rule" />
          <p className="small-copy">
            {store.copy.artExtra[0]}
            <br />
            {store.copy.artExtra[1]}
          </p>
        </Reveal>
        <div className="giving-photo">
          <Image
            src={store.images.art}
            alt="Детали упаковки: бумага, лента и подарочная коробка"
          />
        </div>
      </section>
      <section id="how" className="section how">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">{store.copy.how.eyebrow}</p>
            <h2>
              {store.copy.how.title} <em>{store.copy.how.accent}</em>
            </h2>
          </div>
          <p>
            {store.copy.how.intro[0]}
            <br />
            {store.copy.how.intro[1]}
          </p>
        </Reveal>
        <div className="steps">
          {store.copy.steps.map(([title, desc], i) => (
            <Reveal key={title}>
              <span className="step-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="last-word">
        <p className="eyebrow">{store.copy.closing.eyebrow}</p>
        <h2>
          {store.copy.closing.title[0]}
          <br />
          {store.copy.closing.title[1]} <em>{store.copy.closing.accent}</em>
        </h2>
        <Link className="button dark" to="/catalog">
          {store.copy.closing.cta} <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  );
}
