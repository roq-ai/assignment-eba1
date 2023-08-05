import { SeasonInterface } from 'interfaces/season';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface SeriesInterface {
  id?: string;
  title: string;
  genre: string;
  release_year: number;
  director: string;
  description: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  season?: SeasonInterface[];
  user?: UserInterface;
  _count?: {
    season?: number;
  };
}

export interface SeriesGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  genre?: string;
  director?: string;
  description?: string;
  user_id?: string;
}
