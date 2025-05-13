import type { Route } from "./+types/home";
import GamePreview from "../gamePreview/gamePreview";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Preview ${params.gameSlug} - GameGenome` },
    { name: "description", content: "Preview and explore game details on GameGenome." },
  ];
}

export default function GamePreviewRoute() {
  return <GamePreview />;
}