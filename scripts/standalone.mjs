import { build } from "esbuild";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const target = process.argv[2] || "work-preview";
await mkdir(target, { recursive: true });
const result = await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  write: false,
  format: "iife",
  minify: true,
  platform: "browser",
  loader: { ".css": "empty" },
  define: { "process.env.NODE_ENV": '"production"' },
});
let js = result.outputFiles[0].text;
// Inline only site-owned assets. No network requests are needed in the preview.
const files = [
  ...new Set([...js.matchAll(/\/images\/[\w-]+\.jpg/g)].map((m) => m[0])),
];
for (const file of files) {
  const b64 = (await readFile("public" + file)).toString("base64");
  js = js.replaceAll(file, "data:image/jpeg;base64," + b64);
}
const distFiles = (await import("node:fs/promises")).readdir;
const cssFile = (await distFiles("dist/assets")).find((n) =>
  n.endsWith(".css"),
);
let css = await readFile("dist/assets/" + cssFile, "utf8");
for (const match of [...css.matchAll(/url\(([^)]+)\)/g)]) {
  const asset = match[1].replace(/["']/g, "");
  if (asset.includes("/fonts/")) {
    const base = path.basename(asset);
    const data = await readFile("public/fonts/" + base);
    css = css.replaceAll(
      match[0],
      `url(data:font/woff;base64,${data.toString("base64")})`,
    );
  }
}
const html = `<!doctype html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#F8F6F2"><title>GIFTLY — Искусство дарить эмоции</title><style>${css}</style></head><body><div id="root"></div><script>${js.replaceAll("</script", "<\\/script")}</script></body></html>`;
await writeFile(path.join(target, "giftly-preview.html"), html);
console.log(
  "Standalone preview:",
  Buffer.byteLength(html),
  "bytes; assets embedded:",
  files.length,
);
