import type { Route } from "./+types/home";
import LogIn from "../logIn/logIn";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function LogInRoute() {
  return <LogIn />;
}
