import { Feed } from './Feed';
import { Redirect } from './Redirect';
import { TabGroup } from './TabGroup';

export interface MariaStore {
  digitOptions: number[];
  feeds: Feed[];
  redirects: Redirect[];
  shouldPlayGreeting: boolean;
  tabGroups: TabGroup[];
}
