import axios from 'axios';
import queryString from 'query-string';
import { MovieInterface, MovieGetQueryInterface } from 'interfaces/movie';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getMovies = async (query?: MovieGetQueryInterface): Promise<PaginatedInterface<MovieInterface>> => {
  const response = await axios.get('/api/movies', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createMovie = async (movie: MovieInterface) => {
  const response = await axios.post('/api/movies', movie);
  return response.data;
};

export const updateMovieById = async (id: string, movie: MovieInterface) => {
  const response = await axios.put(`/api/movies/${id}`, movie);
  return response.data;
};

export const getMovieById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/movies/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMovieById = async (id: string) => {
  const response = await axios.delete(`/api/movies/${id}`);
  return response.data;
};
