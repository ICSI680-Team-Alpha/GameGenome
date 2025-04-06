import type { Route } from "./+types/home";
import SignUp from "../signUp/signUp";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sign Up - GameGenome" },
    { name: "description", content: "Create an account to explore GameGenome!" },
  ];
}

export default function SignUpRoute() {
  return <SignUp />;
}