import React from 'react'
import './gamePreview.css'

export const games = [
    {
        id: 1,
        title: 'Spiderman2',
        image: '/Images/spiderman2.jpg',
        description: "An action-adventure single-player game, that continues the stories of Peter Parker and Miles Morales as they face new threats in New York City, including Venom, Kraven the HUnter, and the Lizard. Experience the new traversal mechanics, such as the Web Wings, and features enhanced visuals.",
        price: "$69.99"
    },
    {
        id: 2,
        title: 'Batman: Arkham Asylum',
        image: '/Images/batman.jpg',
        description: "An action-adventure single-player game, where Batman attempts to thwart The Joker's plan to take control of the institution. Experience a combine elements of stealth, combat, and puzzle-solving.",
        price: "$39.99"
    },
    {
        id: 3,
        title: 'God of War Ragnarok',
        image: '/Images/god-of-war-ragnarok.jpeg',
        description: "An action-adventure single-player game, that continues the story of Kratos and his son Atreus as they navigate the complexities of Norse myhtology and prepare for the prophesied end of Ragnarok. Experience a combine of hack-and-slah combat with puzzle-solving and exploration.",
        price: "$69.99"
    },
    {
        id: 4,
        title: 'Game 4',
        image: '/Images/spiderman2.jpg',
        description: "Temporary place holder.",
        price: "$69.99"
    },
    {
        id: 5,
        title: 'Game 5',
        image: '/Images/batman.jpg',
        description: "Temporary place holder.",
        price: "$39.99"
    },
    {
        id: 6,
        title: 'Game 6',
        image: '/Images/god-of-war-ragnarok.jpeg',
        description: "Temporary place holder.",
        price: "$69.99"
    }
];
interface Game{
    id: number;
    title: string;
    image: string;
    description: string;
    price: string;
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
                    <p className="price">{game.price}</p>
                </div>
            ))}
        </div>
    );
};
export default gamePreview;