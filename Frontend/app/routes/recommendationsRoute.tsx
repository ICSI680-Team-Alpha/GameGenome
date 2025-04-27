import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const Recommendations = lazy(() => import('../recommendations/recommendations'));

export default function RecommendationsRoute() {
  return (
    <Suspense fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    }>
      <Recommendations />
    </Suspense>
  );
}