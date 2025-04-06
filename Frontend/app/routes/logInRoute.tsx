import type { Route } from "./+types/home";
import LogIn from "../logIn/logIn";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Log In - GameGenome" },
    { name: "description", content: "Log in to your GameGenome account to explore personalized game recommendations!" },
  ];
}

export default function LogInRoute() {
  return <LogIn />;
}