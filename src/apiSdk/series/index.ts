import axios from 'axios';
import queryString from 'query-string';
import { SeriesInterface, SeriesGetQueryInterface } from 'interfaces/series';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getSeries = async (query?: SeriesGetQueryInterface): Promise<PaginatedInterface<SeriesInterface>> => {
  const response = await axios.get('/api/series', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createSeries = async (series: SeriesInterface) => {
  const response = await axios.post('/api/series', series);
  return response.data;
};

export const updateSeriesById = async (id: string, series: SeriesInterface) => {
  const response = await axios.put(`/api/series/${id}`, series);
  return response.data;
};

export const getSeriesById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/series/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSeriesById = async (id: string) => {
  const response = await axios.delete(`/api/series/${id}`);
  return response.data;
};
