import { SeasonInterface } from 'interfaces/season';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface EpisodeInterface {
  id?: string;
  season_id?: string;
  episode_number: number;
  title: string;
  duration: number;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  season?: SeasonInterface;
  user?: UserInterface;
  _count?: {};
}

export interface EpisodeGetQueryInterface extends GetQueryInterface {
  id?: string;
  season_id?: string;
  title?: string;
  user_id?: string;
}
