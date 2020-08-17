import { Feed } from './Feed';
import { TabGroup } from './TabGroup';

export interface MariaStore {
  digitOptions: number[];
  feeds: Feed[];
  shouldPlayGreeting: boolean;
  tabGroups: TabGroup[];
}
