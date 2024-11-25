import { Feed } from './Feed';
import { Redirect } from './Redirect';
import { TabGroup } from './TabGroup';

export interface MariaStore {
  digitOptions: number[];
  feeds: Feed[];
  redirects: Redirect[];
  shouldCheckFeeds: boolean;
  shouldPlayGreeting: boolean;
  shouldRedirect: boolean;
  tabGroups: TabGroup[];
}
