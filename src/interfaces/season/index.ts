import { EpisodeInterface } from 'interfaces/episode';
import { SeriesInterface } from 'interfaces/series';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface SeasonInterface {
  id?: string;
  series_id?: string;
  season_number: number;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  episode?: EpisodeInterface[];
  series?: SeriesInterface;
  user?: UserInterface;
  _count?: {
    episode?: number;
  };
}

export interface SeasonGetQueryInterface extends GetQueryInterface {
  id?: string;
  series_id?: string;
  user_id?: string;
}
