import type { Route } from "./+types/home";
import Favorites from "../favorite/favorite";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Favorite - GameGenome" },
    { name: "description", content: "Favorites page hold all of the games that were hearted" },
  ];
}

export default function FavoriteRoute() {
  return <Favorites />;
}