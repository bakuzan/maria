import { browser } from 'webextension-polyfill-ts';

import { TabGroup } from '@/types/TabGroup';
import getStorage from '@/utils/getStorage';

export class TabGroupController {
  private data: TabGroup;
  private node: HTMLDivElement;

  constructor(group: TabGroup) {
    this.data = group;
  }

  get id() {
    return this.data.id;
  }

  renderIn(parentNode: HTMLElement) {
    this.node = document.createElement('div');
    this.node.className = 'tab-group';
    this.node.setAttribute('data-id', this.id);

    const header = document.createElement('div');
    header.className = 'tab-group__header';

    const name = document.createElement('input');
    name.type = 'text';
    name.className = 'tab-group__name';
    name.placeholder = 'Enter a group name...';
    name.value = this.data.name ?? '';
    name.addEventListener('blur', (e: Event) => this.onNameChange(e));

    const tickbox = document.createElement('label');
    tickbox.className = 'mra-tickbox';

    const lock = document.createElement('input');
    lock.type = 'checkbox';
    lock.name = `isLocked_${this.id}`;
    lock.checked = this.data.isLocked;
    lock.addEventListener('change', () => this.toggleLock());

    tickbox.append(lock);
    tickbox.append('\uD83D\uDD12\uFE0E');

    const items = this.createItemsList();

    header.append(name);
    header.append(tickbox);
    this.node.append(header);
    this.node.append(items);

    parentNode.append(this.node);
  }

  private createItemsList() {
    const handleRemoveLink = (e: MouseEvent) => this.removeListener(e);
    const ul = document.createElement('ul');
    ul.className = 'tab-group__items stored-links';

    this.data.items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'stored-links__item';
      li.setAttribute('data-link', item.url);

      const btn = document.createElement('button');
      btn.className = 'mra-button stored-links__button';
      btn.textContent = '\u274C\uFE0E';
      btn.addEventListener('click', handleRemoveLink);

      const link = document.createElement('a');
      link.className = 'mra-link stored-links__link';
      link.textContent = item.title;
      link.setAttribute('href', item.url);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'nofollow noreferrer noopener');
      link.addEventListener('click', handleRemoveLink);

      li.append(btn);
      li.append(link);
      ul.append(li);
    });

    return ul;
  }

  private onNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.data.name = value;
    this.updateGroup(this.data);
  }

  private toggleLock() {
    this.data.isLocked = !this.data.isLocked;
    this.updateGroup(this.data);
  }

  private removeListener(event: MouseEvent) {
    const element = event.target as HTMLElement;
    const parent = element.parentElement;
    const url = parent.getAttribute('data-link');

    this.data.items = this.data.items.filter((x) => x.url !== url);
    this.updateGroup(this.data);

    parent.parentElement.removeChild(parent);
  }

  private async updateGroup(group: TabGroup) {
    const { tabGroups, ...store } = await getStorage();
    const newGroups = tabGroups
      .map((g) => (g.id !== group.id ? g : group))
      .filter((x) => x.items.length > 0 || x.isLocked);

    if (newGroups.length !== tabGroups.length) {
      this.node.parentElement.removeChild(this.node);
    }

    await browser.storage.sync.set({
      ...store,
      tabGroups: newGroups
    });
  }
}
