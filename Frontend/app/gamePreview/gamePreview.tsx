import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './gamePreview.css';

interface Review {
    user: string;
    rating: number;
    text: string;
}

interface Media {
    type: 'image' | 'video';
    url: string;
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
    media: Media[];
}

const GamePreview: React.FC = () => {
    const { gameSlug } = useParams<{ gameSlug: string }>();
    const navigate = useNavigate();
    const [game, setGame] = useState<GameData | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const response = await axios.get(`https://api.rawg.io/api/games/${gameSlug}?4941d5616f274296a303eeb26f58bdab`);
                const gameData = response.data;

                setGame({
                    id: gameData.id,
                    name: gameData.name,
                    rating: gameData.rating,
                    description: gameData.description_raw,
                    genres: gameData.genres.map((genre: { name: string }) => genre.name),
                    platforms: gameData.platforms.map((platform: { platform: { name: string } }) => platform.platform.name),
                    tags: gameData.tags.map((tag: { name: string }) => tag.name),
                    stores: gameData.stores,
                    screenshots: gameData.screenshots,
                    trailers: gameData.movies,
                    reviews: [], // Placeholder for reviews
                    media: [] // Placeholder for media
                });
            } catch (error) {
                console.error('Error fetching game data:', error);
            }
        };

        fetchGameData();
    }, [gameSlug]);

    const toggleFavorite = () => {
        setIsFavorite(prev => !prev);
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
                </div>

                <button onClick={toggleFavorite} className="favorite-button">
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>

                <div className="media-gallery">
                    <h2>Media Gallery</h2>
                    {game.screenshots.map((screenshot, idx) => (
                        <img key={idx} src={screenshot.image} alt={`Screenshot ${idx}`} className="media-image" />
                    ))}
                    {game.trailers.data.map((trailer, idx) => (
                        <video key={idx} controls className="media-video">
                            <source src={trailer.max} type="video/mp4" />
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

const Header: React.FC = () => {
    return (
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
};

export default GamePreview;