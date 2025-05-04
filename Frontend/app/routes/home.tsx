import type { Route } from "../+types/home";
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const Welcome = lazy(() => import("../welcome/welcome"));

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GameGenome" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <Suspense fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    }>
      <Welcome />
    </Suspense>
  );
}
