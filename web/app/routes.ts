import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("products/:slug", "routes/product.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
  route("legal", "routes/legal.tsx"),

  route("docs/*", "routes/docs.tsx"),
  route("api/search", "routes/search.ts"),
  route("*", "routes/404.tsx"),
] satisfies RouteConfig;
