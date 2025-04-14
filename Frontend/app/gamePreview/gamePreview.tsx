import React from 'react'
import './gamePreview.css'

interface Game{
    id: number;
    title: string;
    image: string;
    description: string;
}
interface GamePreviewProps{
    games: Game[];
}
const gamePreview: React.FC<GamePreviewProps>=({games})=>{
    return(
        <div className="gamePreview-container">
            {games.map((game)=>(
                <div className="gamePreview-card" key={game.id}>
                    <img src={game.image} alt={game.title} className="gamePreview-image" />
                    <h3 className="gamePrview-title">{game.title}</h3>
                    <p className="gamePreview-description">{game.description}</p>
                </div>
            ))}
        </div>
    );
};
export default gamePreview;