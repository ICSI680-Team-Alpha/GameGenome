import { Request, Response } from 'express';
import { GameFeedback } from '../models/GameFeedback';
import { SteamGame } from '../models/SteamGame';

interface FavoriteGame {
  AppID: number;
  Name: string;
  HeaderImage: string;
  isFavorite: boolean;
}
export const removeFavorite = async (req: Request, res: Response) => {
    try {
        const updated = await GameFavorite.findOneAndUpdate(
          { 
            userId: req.user.id, 
            gameId: req.params.gameId 
          },
          { rating: 'negative' },
          { new: true }
        );
        
        if (!updated) {
          return res.status(404).json({ message: 'Favorite not found' });
        }
        
        res.json(updated);
      } catch (error) {
        res.status(500).json({ message: 'Error removing favorite' });
      }
    };

    export const getFavorites = async (req: Request, res: Response) => {
        try {
          const favorites = await favorites.find({ 
            userId: req.user.id, 
            rating: 'positive' 
          });
          res.json(favorites);
        } catch (error) {
          res.status(500).json({ message: 'Error fetching favorites' });
        }
      };