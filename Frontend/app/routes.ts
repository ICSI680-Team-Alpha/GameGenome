import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("Login", "routes/logInRoute.tsx"),
    route("Signup", "routes/signUpRoute.tsx"),
    route("Favorites", "routes/favoriteRoute.tsx"),
] satisfies RouteConfig;
