import { Feed } from './Feed';
import { TabGroup } from './TabGroup';

export interface MariaStore {
  digitOptions: number[];
  tabGroups: TabGroup[];
  feeds: Feed[];
}
