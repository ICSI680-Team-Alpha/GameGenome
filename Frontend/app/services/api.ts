import axios from 'axios';

const API_URL = 'http://54.87.3.247:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
  userID: string;
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

// User interfaces
export interface LoginCredentials {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: {
      _id: string;
      Username: string;
      Email: string;
      // ... other user fields
    };
    token: string;
  };
}

// API functions
export const getSteamGames = async (): Promise<Game[]> => {
  const response = await api.get('/games');
  return response.data.data;
};

export const getSteamGameById = async (id: number): Promise<Game> => {
  const response = await api.get(`/games/${id}`);
  return response.data.data;
};

export const saveGameFeedback = async (feedback: GameFeedback): Promise<GameFeedback> => {
  const response = await api.post('/feedback', feedback);
  return response.data.data;
};

export const getGameFeedback = async (userId: number, stationId: number): Promise<GameFeedback[]> => {
  const response = await api.get(`/feedback?userId=${userId}&stationId=${stationId}`);
  return response.data.data;
};

// Station API functions
export const createStation = async (station: Station): Promise<Station> => {
  try {
    console.log('Frontend: Creating station with data:', station);
    const response = await api.post('/stations', station);
    console.log('Frontend: Station created successfully:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Frontend: Error creating station:', error);
    throw error;
  }
};

export const getStations = async (): Promise<Station[]> => {
  const response = await api.get('/stations');
  return response.data.data;
};

export const getStationById = async (id: string): Promise<Station> => {
  const response = await api.get(`/stations/${id}`);
  return response.data.data;
};

export const updateStation = async (id: string, station: Partial<Station>): Promise<Station> => {
  const response = await api.patch(`/stations/${id}`, station);
  return response.data.data;
};

export const deleteStation = async (id: string): Promise<void> => {
  await api.delete(`/stations/${id}`);
};

// Quiz API functions
export const getQuizzes = async (): Promise<Quiz[]> => {
  const response = await api.get('/quizzes');
  return response.data.data;
};

export const saveQuizResponse = async (response: QuizResponse): Promise<any> => {
  const apiResponse = await api.post('/quizzes/responses', response);
  return apiResponse.data.data;
};

// Recommendation API functions
export const getRecommendations = async (userId: string, stationId: string): Promise<Recommendation> => {
  try {
    console.log('Frontend: Getting recommendations for user:', userId, 'and station:', stationId);
    const response = await api.get(`/recommendations?userId=${userId}&stationId=${stationId}`);
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
    const response = await api.post('/recommendations', { userId, stationId });
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
    const response = await api.get(`/media/${appId}`);
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
    const response = await api.get('/media');
    console.log('Frontend: All media received:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Frontend: Error getting all media:', error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data.data;
};

export const updateUserById = async (id: string, data: { Username?: string; Email?: string }) => {
  const response = await axios.patch(`${API_URL}/users/${id}`, data);
  return response.data;
};

export const getGameDetails = async (appId: number): Promise<Game> => {
  try {
    const response = await api.get(`/games/${appId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
};

// User API functions
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('Frontend: Attempting login with:', credentials);
    const response = await api.post('/users/login', credentials);
    console.log('Frontend: Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Frontend: Login error:', error);
    throw error;
  }
}; 
