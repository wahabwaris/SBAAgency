import type { MetadataRoute } from "next";
import { company } from "@/lib/site";
import { products } from "@/lib/products";
import { stockItems } from "@/lib/stock";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.websiteUrl;
  const now = new Date();

  const staticRoutes = ["", "/about", "/products", "/stock", "/quality", "/quote", "/downloads", "/faq", "/locations", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const productRoutes = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const stockRoutes = stockItems.map((it) => ({
    url: `${base}/stock/${it.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...stockRoutes];
}
