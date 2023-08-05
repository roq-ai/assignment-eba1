import axios from 'axios';
import queryString from 'query-string';
import { SeasonInterface, SeasonGetQueryInterface } from 'interfaces/season';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getSeasons = async (query?: SeasonGetQueryInterface): Promise<PaginatedInterface<SeasonInterface>> => {
  const response = await axios.get('/api/seasons', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createSeason = async (season: SeasonInterface) => {
  const response = await axios.post('/api/seasons', season);
  return response.data;
};

export const updateSeasonById = async (id: string, season: SeasonInterface) => {
  const response = await axios.put(`/api/seasons/${id}`, season);
  return response.data;
};

export const getSeasonById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/seasons/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSeasonById = async (id: string) => {
  const response = await axios.delete(`/api/seasons/${id}`);
  return response.data;
};
