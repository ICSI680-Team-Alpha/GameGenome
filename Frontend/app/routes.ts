import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("Login", "routes/logInRoute.tsx"), // Add this line for the /Login route
] satisfies RouteConfig;