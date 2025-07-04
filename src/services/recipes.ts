import axios from 'axios';

const API_URL = 'https://cookmate-api.lighttail.com/recipes';

export interface Recipe {
  id: string;
  name: string;
  aiRating: number;
  cookingTime?: number;
}

export interface RecipesResponse {
  data: Recipe[];
}

export const fetchRecipes = async (page = 1, limit = 10): Promise<RecipesResponse> => {
  const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
  return res.data;
}; 