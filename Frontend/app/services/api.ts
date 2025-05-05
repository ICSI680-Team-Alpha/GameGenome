import axios from 'axios';

const API_URL = 'http://3.83.244.139:5000/api';

// Game interfaces
export interface Game {
  _id: string;
  AppID: number;
  Name: string;
  ReleaseDate: string;
  Developer: string;
  Publisher: string;
  PositiveRatings: number;
  NegativeRatings: number;
  Price: number;
  HeaderImage?: string;
}

export interface GameFeedback {
  _id?: string;
  StationID: string;
  UserID: string;
  rating: Array<{
    RatingType: string;
    RatedDate: Date;
    AppID: string;
  }>;
}

// Station interfaces
export interface Station {
  _id?: string;
  stationID: number;
  name: string;
  description?: string;
  location?: {
    building?: string;
    room?: string;
    coordinates?: {
      x?: number;
      y?: number;
      z?: number;
    }
  };
  type?: 'quiz' | 'info' | 'interactive';
  content?: {
    quizID?: number;
    infoText?: string;
    mediaUrls?: string[];
  };
  requirements?: {
    minScore?: number;
    prerequisites?: number[];
  };
  isActive?: boolean;
  timestamp?: Date;
}

// Quiz interfaces
export interface QuizOption {
  id: string;
  text: string;
  HeaderImage?: string;
}

export interface Quiz {
  _id: string;
  quizID: number;
  quizText: string;
  quizType: string;
  options: QuizOption[];
  maxSelections: number;
  required: boolean;
}

export interface QuizResponse {
  userID: string;
  stationID: string;
  timestamp: Date;
  responses: Array<{
    quizID: number;
    questionText: string;
    questionType: string;
    selection: string[];
    selectedGames: Array<{
      id: string;
      name: string;
      headerImage?: string;
    }>;
  }>;
}

// Recommendation interfaces
export interface Recommendation {
  _id?: string;
  userID: string;
  stationID: string;
  recommendedGames: Game[];
  timestamp?: Date;
}

// Media interfaces
export interface SteamMedia {
  _id?: string;
  AppID: number;
  HeaderImage: string;
  Screenshots: string;
  Background: string;
  Movies: string | null;
}

// API functions
export const getSteamGames = async (): Promise<Game[]> => {
  const response = await axios.get(`${API_URL}/games`);
  return response.data.data;
};

export const getSteamGameById = async (id: number): Promise<Game> => {
  const response = await axios.get(`${API_URL}/games/${id}`);
  return response.data.data;
};

export const saveGameFeedback = async (feedback: GameFeedback): Promise<GameFeedback> => {
  const response = await axios.post(`${API_URL}/feedback`, feedback);
  return response.data.data;
};

export const getGameFeedback = async (userId: number, stationId: number): Promise<GameFeedback[]> => {
  const response = await axios.get(`${API_URL}/feedback?userId=${userId}&stationId=${stationId}`);
  return response.data.data;
};

// Station API functions
export const createStation = async (station: Station): Promise<Station> => {
  try {
    console.log('Frontend: Creating station with data:', station);
    const response = await axios.post(`${API_URL}/stations`, station);
    console.log('Frontend: Station created successfully:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Frontend: Error creating station:', error);
    throw error;
  }
};

export const getStations = async (): Promise<Station[]> => {
  const response = await axios.get(`${API_URL}/stations`);
  return response.data.data;
};

export const getStationById = async (id: string): Promise<Station> => {
  const response = await axios.get(`${API_URL}/stations/${id}`);
  return response.data.data;
};

export const updateStation = async (id: string, station: Partial<Station>): Promise<Station> => {
  const response = await axios.patch(`${API_URL}/stations/${id}`, station);
  return response.data.data;
};

export const deleteStation = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/stations/${id}`);
};

// Quiz API functions
export const getQuizzes = async (): Promise<Quiz[]> => {
  const response = await axios.get(`${API_URL}/quizzes`);
  return response.data.data;
};

export const saveQuizResponse = async (response: QuizResponse): Promise<any> => {
  const apiResponse = await axios.post(`${API_URL}/quizzes/responses`, response);
  return apiResponse.data.data;
};

// Recommendation API functions
export const getRecommendations = async (userId: string, stationId: string): Promise<Recommendation> => {
  try {
    console.log('Frontend: Getting recommendations for user:', userId, 'and station:', stationId);
    const response = await axios.get(`${API_URL}/recommendations?userId=${userId}&stationId=${stationId}`);
    console.log('Frontend: Recommendations received:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Frontend: Error getting recommendations:', error);
    throw error;
  }
};

export const createRecommendations = async (userId: string, stationId: string): Promise<Recommendation> => {
  try {
    console.log('Frontend: Creating recommendations for user:', userId, 'and station:', stationId);
    const response = await axios.post(`${API_URL}/recommendations`, { userId, stationId });
    console.log('Frontend: Recommendations created:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Frontend: Error creating recommendations:', error);
    throw error;
  }
};

// Media API functions
export const getMediaByAppId = async (appId: number): Promise<SteamMedia> => {
  try {
    console.log('Frontend: Getting media for AppID:', appId);
    const response = await axios.get(`${API_URL}/media/${appId}`);
    console.log('Frontend: Media received:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Frontend: Error getting media:', error);
    throw error;
  }
};

export const getAllMedia = async (): Promise<SteamMedia[]> => {
  try {
    console.log('Frontend: Getting all media');
    const response = await axios.get(`${API_URL}/media`);
    console.log('Frontend: All media received:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Frontend: Error getting all media:', error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data.data;
}; 
