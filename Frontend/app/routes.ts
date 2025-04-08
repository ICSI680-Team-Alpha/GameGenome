import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("Login", "routes/logInRoute.tsx"),
    route("Signup", "routes/signUpRoute.tsx"),
    route("Quiz", "routes/quizRoute.tsx"),
    // route("Recommendations", "routes/recommendationsRoute.tsx")
] satisfies RouteConfig;