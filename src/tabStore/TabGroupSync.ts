import { browser } from 'webextension-polyfill-ts';

import { TabGroup } from '@/types/TabGroup';
import getStorage from '@/utils/getStorage';

export class TabGroupSync {
  private subscribers: Record<string, (group: TabGroup) => void>;

  constructor() {
    this.subscribers = {};
  }

  public subscribe(id: string, fn: (group: TabGroup) => void) {
    this.subscribers[id] = fn;

    return () => this.unsubscribe(id);
  }

  public async updateGroups(groups: TabGroup[]) {
    const store = await getStorage();

    await browser.storage.sync.set({
      ...store,
      tabGroups: groups
    });

    this.notify(groups);
  }

  private notify(groups: TabGroup[]) {
    Object.keys(this.subscribers).forEach((groupId) => {
      const caller = this.subscribers[groupId];
      const grp = groups.find((x) => x.id === groupId);

      if (caller && grp) {
        caller(grp);
      }
    });
  }

  private unsubscribe(id: string) {
    delete this.subscribers[id];
  }
}

const groupSync = new TabGroupSync();

export default groupSync;
