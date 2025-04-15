import type { Route } from "./+types/home";
import Account from "../account/account";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Account - GameGenome" },
    { name: "description", content: "Manage your GameGenome account settings and preferences." },
  ];
}

export default function SignUpRoute() {
  return <Account />;
}