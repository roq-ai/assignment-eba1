import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ActivityLogInterface {
  id?: string;
  timestamp: any;
  user_id?: string;
  action: string;
  resource: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface ActivityLogGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  action?: string;
  resource?: string;
}
