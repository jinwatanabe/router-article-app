import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/sidemenu.tsx", [
    index("routes/home.tsx"),
    route("popular", "routes/popular.tsx"),
    route("search", "routes/search.tsx"),
  ]),
  ...prefix("v1", [...prefix("systems", [route("ping", "routes/ping.tsx")])]),
] satisfies RouteConfig;
