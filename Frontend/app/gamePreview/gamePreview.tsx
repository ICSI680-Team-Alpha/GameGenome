import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './gamePreview.css';

interface Review {
  user: string;
  rating: number;
  text: string;
}

interface GameData {
  id: number;
  name: string;
  rating: number;
  description: string;
  genres: string[];
  platforms: string[];
  tags: string[];
  stores: { id: number; store: { name: string; slug: string } }[];
  screenshots: { image: string }[];
  trailers: { data: { max: string }[] };
  reviews: Review[];
}

const RAWG_API_KEY = '4941d5616f274296a303eeb26f58bdab'; // Replace this with your actual key

const GamePreview: React.FC = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameData | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        // Search for the game by slug first
        const searchRes = await axios.get(`https://api.rawg.io/api/games?search=${gameSlug}&key=${RAWG_API_KEY}`);
        const firstMatch = searchRes.data.results[0];
        if (!firstMatch) {
          console.error('Game not found');
          return;
        }

        // Then fetch full game details
        const gameRes = await axios.get(`https://api.rawg.io/api/games/${firstMatch.id}?key=${RAWG_API_KEY}`);
        const data = gameRes.data;

        const favoriteGames = JSON.parse(localStorage.getItem('favorites') || '[]');
        const alreadyFavorite = favoriteGames.some((g: any) => g.id === data.id);
        setIsFavorite(alreadyFavorite);

        setGame({
          id: data.id,
          name: data.name,
          rating: data.rating,
          description: data.description_raw,
          genres: data.genres.map((g: any) => g.name),
          platforms: data.platforms.map((p: any) => p.platform.name),
          tags: data.tags.map((t: any) => t.name),
          stores: data.stores,
          screenshots: data.short_screenshots || [],
          trailers: data.movies || [],
          reviews: [] // Placeholder if you want to fetch from your own backend later
        });
      } catch (err) {
        console.error('Failed to fetch game info:', err);
      }
    };

    fetchGame();
  }, [gameSlug]);

  const toggleFavorite = () => {
    if (!game) return;

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const exists = favorites.some((g: any) => g.id === game.id);

    let updatedFavorites;
    if (exists) {
      updatedFavorites = favorites.filter((g: any) => g.id !== game.id);
    } else {
      updatedFavorites = [...favorites, game];
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!exists);
  };

  if (!game) return <p>Loading game details...</p>;

  return (
    <>
      <Header />
      <div className="gamePreview-container">
        <button onClick={() => navigate(-1)} className="back-button">← Back</button>

        <h1 className="game-title">{game.name}</h1>
        <div className="game-rating">Rating: {game.rating}</div>
        <p className="game-description">{game.description}</p>

        <div className="info-section">
          <p><strong>Genres:</strong> {game.genres.join(', ')}</p>
          <p><strong>Platforms:</strong> {game.platforms.join(', ')}</p>
          <p><strong>Tags:</strong> {game.tags.join(', ')}</p>
          <p><strong>Purchase:</strong> {game.stores.map(s => s.store.name).join(', ')}</p>
        </div>

        <button onClick={toggleFavorite} className="favorite-button">
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>

        <div className="media-gallery">
          <h2>Media Gallery</h2>
          {game.screenshots.map((s, idx) => (
            <img key={idx} src={s.image} alt={`Screenshot ${idx}`} className="media-image" />
          ))}
          {game.trailers.map((t, idx) => (
            <video key={idx} controls className="media-video">
              <source src={t.data.max} type="video/mp4" />
            </video>
          ))}
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>
          {game.reviews.length > 0 ? (
            game.reviews.map((review, idx) => (
              <div key={idx} className="review-card">
                <strong>{review.user}</strong> - {review.rating}
                <p>{review.text}</p>
              </div>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
          <button onClick={() => alert('Load more reviews')}>Load More Reviews</button>
        </div>
      </div>
    </>
  );
};

const Header: React.FC = () => (
  <header className="header">
    <div className="nav-container">
      <Link to="/" className="logo-link">
        <img src="/Images/Logo.png" alt="Logo" className="logo-img" />
      </Link>
      <nav className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/games" className="nav-item">Games</Link>
        <Link to="/favorites" className="nav-item">Favorites</Link>
      </nav>
    </div>
  </header>
);

export default GamePreview;