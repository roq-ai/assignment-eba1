import axios from 'axios';
import queryString from 'query-string';
import { ActivityLogInterface, ActivityLogGetQueryInterface } from 'interfaces/activity-log';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getActivityLogs = async (
  query?: ActivityLogGetQueryInterface,
): Promise<PaginatedInterface<ActivityLogInterface>> => {
  const response = await axios.get('/api/activity-logs', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createActivityLog = async (activityLog: ActivityLogInterface) => {
  const response = await axios.post('/api/activity-logs', activityLog);
  return response.data;
};

export const updateActivityLogById = async (id: string, activityLog: ActivityLogInterface) => {
  const response = await axios.put(`/api/activity-logs/${id}`, activityLog);
  return response.data;
};

export const getActivityLogById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/activity-logs/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteActivityLogById = async (id: string) => {
  const response = await axios.delete(`/api/activity-logs/${id}`);
  return response.data;
};
