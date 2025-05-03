import { Request, Response } from 'express';
import { GameFeedback } from '../models/GameFeedback';
import { SteamMedia } from '../models/SteamMedia';

interface FavoriteGame {
  AppID: number;
  Name: string;
  HeaderImage: string;
  isFavorite: boolean;
}

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const positiveFeedbacks = await GameFeedback.aggregate([
      { $unwind: "$rating" },
      { $match: { "rating.RatingType": "positive" } }
    ]);

    const appIds = [...new Set(
      positiveFeedbacks.map(fb => fb.rating.AppID)
    )];

    const favorites = await SteamMedia.aggregate([
      {$match: { AppID: { $in: appIds } }},
      {
        $lookup: {
          from: "gamefeedback",
          localField: "AppID",
          foreignField: "rating.AppID",
          as: "feedback"
        }
      },
      {
        $project: {
          AppID: 1,
          Name: 1,
          HeaderImage: 1,
          Background: 1,
          Genre: 1,
          isFavorite: { $gt: [{ $size: "$feedback" }, 0] } 
        }
      }
    ]);

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: console.error() });
  }
};