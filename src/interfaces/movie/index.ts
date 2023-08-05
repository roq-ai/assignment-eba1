import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MovieInterface {
  id?: string;
  title: string;
  genre: string;
  release_year: number;
  director: string;
  duration: number;
  description: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface MovieGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  genre?: string;
  director?: string;
  description?: string;
  user_id?: string;
}
