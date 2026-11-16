import { content } from "./content";
export const store = {
  name: "GIFTLY",
  logo: null as string | null,
  email: "hello@giftly.example",
  telegram: "" as string, // Укажите username продавца без @. Пустое значение блокирует переход.
  socials: [] as { label: string; url: string }[],
  palette: {
    background: "#F8F6F2",
    paper: "#F0EBE3",
    ink: "#242424",
    rose: "#D6B7B2",
    brown: "#8A6F5A",
  },
  copy: content,
  images: {
    hero: "/images/hero.jpg",
    story: "/images/story.jpg",
    art: "/images/art.jpg",
  },
  categories: ["Для неё", "Для него", "Для дома", "Особый повод"],
  priceRanges: [
    { label: "Любая цена", min: 0, max: Infinity },
    { label: "До 4 000 ₽", min: 0, max: 3999 },
    { label: "4 000–6 000 ₽", min: 4000, max: 6000 },
    { label: "От 6 000 ₽", min: 6001, max: Infinity },
  ],
};
export { products, type Product } from "./products";
export const money = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value) + " ₽";
