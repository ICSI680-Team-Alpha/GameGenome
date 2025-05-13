import type { Route } from "../+types/home";
import GamePreview from "../gamePreview/gamePreview";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Game Preview - GameGenome" },
    { name: "description", content: "Preview and explore game details on GameGenome." },
  ];
}

export default function GamePreviewRoute() {
  return <GamePreview />;
}