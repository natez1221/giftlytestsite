import assert from "node:assert/strict";
import { build } from "esbuild";
import { JSDOM, VirtualConsole } from "jsdom";
import { readFile } from "node:fs/promises";
const pure = await build({
  stdin: {
    contents:
      "export * from './src/cart';export {products,store} from './src/config/store';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
});
const { cleanCart, total, orderText, loadCart, products, store } = await import(
  "data:text/javascript;base64," +
    Buffer.from(pure.outputFiles[0].text).toString("base64")
);
assert.equal(products.length, 8);
assert.equal(new Set(products.map((p) => p.id)).size, 8);
assert.equal(new Set(products.map((p) => p.image)).size, 8);
assert.deepEqual(
  cleanCart({
    bad: 4,
    "slow-morning": 2,
    "quiet-evening": -1,
    "little-love": 100,
    "warm-home": 1.5,
  }),
  { "slow-morning": 2 },
);
assert.deepEqual(cleanCart(null), {});
assert.deepEqual(cleanCart([]), {});
assert.equal(total({ "slow-morning": 2, "quiet-evening": 1 }), 13700);
globalThis.localStorage = { getItem: () => '{"slow-morning":3,"unknown":8}' };
assert.deepEqual(loadCart(), { "slow-morning": 3 });
globalThis.localStorage = { getItem: () => "{invalid" };
assert.deepEqual(loadCart(), {});
delete globalThis.localStorage;
const order = orderText({ "slow-morning": 2, "quiet-evening": 1 });
assert.match(order, /1\. Медленное утро — 2 шт\./);
assert.match(order, /Итого: 13\s700 ₽/);
assert.match(store.telegram, /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/);
for (const p of products) {
  assert.ok(p.price > 0 && p.contents.length >= 3);
  assert.ok((await readFile("public" + p.image)).length > 1000);
}
console.log(
  "PASS: 8 unique products/assets, corrupt-cart validation, total and order formatting.",
);
const bundled = await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  write: false,
  format: "iife",
  platform: "browser",
  loader: { ".css": "empty" },
  define: { "process.env.NODE_ENV": '"production"' },
});
const code = bundled.outputFiles[0].text;
const errors = [];
let copied = "";
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errors.push(e.message));
vc.on("error", (...args) => errors.push(args.join(" ")));
const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  {
    url: "https://giftly.test/#/catalog",
    runScripts: "outside-only",
    pretendToBeVisual: true,
    virtualConsole: vc,
  },
);
const w = dom.window;
w.scrollTo = () => {};
w.HTMLElement.prototype.scrollIntoView = () => {};
w.matchMedia = () => ({
  matches: false,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
});
w.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
Object.defineProperty(w.navigator, "clipboard", {
  value: {
    writeText: async (text) => {
      copied = text;
    },
  },
});
w.eval(code);
await new Promise((r) => setTimeout(r, 1000));
const wait = () => new Promise((r) => setTimeout(r, 250));
await wait();
const d = w.document;
const button = (text) =>
  [...d.querySelectorAll("button")].find((e) => e.textContent.includes(text));
async function click(el) {
  assert.ok(el, "Expected clickable element");
  el.dispatchEvent(
    new w.MouseEvent("click", { bubbles: true, cancelable: true }),
  );
  await wait();
}
assert.equal(d.title, "Коллекция подарков — GIFTLY");
await click(d.querySelector(".skip"));
assert.equal(w.location.hash, "#/catalog");
await click(d.querySelector('[aria-label="Открыть меню"]'));
assert.ok(d.querySelector(".mobile-nav"));
d.dispatchEvent(
  new w.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
);
await new Promise((r) => setTimeout(r, 400));
assert.ok(!d.querySelector(".mobile-nav"));
assert.equal(d.querySelectorAll(".catalog-grid .product-card").length, 8);
await click(button("Для неё"));
assert.equal(d.querySelectorAll(".catalog-grid .product-card").length, 2);
const price = d.querySelector("select");
price.value = "1";
price.dispatchEvent(new w.Event("change", { bubbles: true }));
await wait();
assert.ok(d.querySelector(".empty"));
await click(button("Показать все наборы"));
assert.equal(d.querySelectorAll(".catalog-grid .product-card").length, 8);
await click(
  d.querySelector('[aria-label="Добавить «Медленное утро» в корзину"]'),
);
assert.deepEqual(JSON.parse(w.localStorage.getItem("giftly-cart-v1")), {
  "slow-morning": 1,
});
await click(d.querySelector('[aria-label^="Открыть корзину"]'));
assert.ok(d.querySelector('[role="dialog"]'));
await click(d.querySelector('[aria-label="Увеличить количество"]'));
assert.match(d.querySelector(".subtotal").textContent, /9\s800/);
await click(button("Скопировать заказ"));
assert.match(copied, /Медленное утро — 2 шт\./);
assert.match(d.querySelector(".copy-status").textContent, /вставьте/);
assert.equal(d.querySelector('.checkout a[href^="https://t.me/"]')?.getAttribute("href"), `https://t.me/${store.telegram}`);
await click(d.querySelector('[aria-label="Удалить «Медленное утро»"]'));
assert.match(d.querySelector(".empty").textContent, /Пока здесь тихо/);
w.dispatchEvent(
  new w.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
); // handler is attached to document
d.dispatchEvent(
  new w.KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
);
await new Promise((r) => setTimeout(r, 450));
for (let i=0; i<30 && d.querySelector('[role="dialog"]'); i++) await new Promise(r=>setTimeout(r,100));
assert.ok(!d.querySelector('[role="dialog"]'));
await click(d.querySelector(".product-visual a"));
assert.ok(d.querySelector(".product-detail"));
assert.match(d.querySelector("h1").textContent, /Медленное утро/);
await click(button("Добавить в корзину"));
assert.match(w.localStorage.getItem("giftly-cart-v1"), /slow-morning/);
w.navigator.clipboard.writeText = async () => {
  throw new Error("Clipboard denied");
};
await click(d.querySelector('[aria-label^="Открыть корзину"]'));
await click(button("Скопировать заказ"));
assert.ok(d.querySelector("textarea[readonly]"));
assert.match(d.querySelector("textarea").value, /Медленное утро/);
console.log(
  "PASS: rendered catalog, combined filters/reset, product routing, add, quantity, total, clipboard, configured Telegram link, remove, empty cart, Escape and localStorage writes.",
);
assert.deepEqual(errors, []);
console.log("PASS: no React/runtime errors in DOM checks.");
dom.window.close();
