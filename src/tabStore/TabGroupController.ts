import { browser } from 'webextension-polyfill-ts';
import Sortable from 'sortablejs';

import funnelSVG from './funnelSVG';

import { TabGroup } from '@/types/TabGroup';
import getStorage from '@/utils/getStorage';
import move from '@/utils/move';
import groupSync from './TabGroupSync';

export class TabGroupController {
  private data: TabGroup;
  private isGroupView: boolean;
  private node: HTMLDivElement;
  private root: HTMLElement;
  private sortable: Sortable;
  private unsubscribe: () => void;

  constructor(parentNode: HTMLElement, group: TabGroup) {
    this.root = parentNode;
    this.data = group;
    this.isGroupView = true;

    this.initialise();
  }

  get id() {
    return this.data.id;
  }

  private initialise() {
    this.render();

    this.unsubscribe = groupSync.subscribe(this.id, (group) => {
      this.data = group;
      this.render();
    });
  }

  private render() {
    const oldNode = this.node;

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

    const controls = document.createElement('div');
    controls.className = 'tab-group__controls';

    const patternToggle = document.createElement('button');
    patternToggle.className = 'mra-button tab-group__view-toggle';
    patternToggle.title = this.isGroupView
      ? 'Display pattern filters'
      : 'Display group links';

    patternToggle.innerHTML = funnelSVG();
    patternToggle.addEventListener('click', () => this.togglePatternView());

    const tickbox = document.createElement('label');
    tickbox.className = 'mra-tickbox';

    const lock = document.createElement('input');
    lock.type = 'checkbox';
    lock.name = `isLocked_${this.id}`;
    lock.checked = this.data.isLocked;
    lock.addEventListener('change', () => this.toggleLock());

    tickbox.append(lock);
    tickbox.append('\uD83D\uDD12\uFE0E');

    const content = this.isGroupView
      ? this.createItemsList()
      : this.createPatternsView();

    // Pieceing it together
    controls.append(patternToggle);
    controls.append(tickbox);

    header.append(name);
    header.append(controls);

    this.node.append(header);
    this.node.append(content);

    if (oldNode) {
      this.root.replaceChild(this.node, oldNode);
    } else {
      this.root.append(this.node);
    }
  }

  private createItemsList() {
    const handleRemoveLink = (e: MouseEvent) => this.removeListener(e);
    const ul = document.createElement('ul');
    ul.className = 'tab-group__items stored-links';
    ul.setAttribute('data-id', this.id);

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

    this.sortable = new Sortable(ul, {
      group: 'tabs',
      animation: 150,
      sort: true,
      ghostClass: 'stored-links__item--ghost',
      chosenClass: 'stored-links__item--chosen',
      onEnd: (event) => this.onSortableEnd(event)
    });

    return ul;
  }

  private createPatternsView() {
    const patternsId = `patterns_${this.id}`;

    const container = document.createElement('div');
    container.className = 'tab-group__patterns';

    const label = document.createElement('label');
    label.className = 'mra-label';
    label.htmlFor = patternsId;
    label.textContent =
      'Enter one regex per line to catch tabs sent to the store.';

    const area = document.createElement('textarea');
    area.id = patternsId;
    area.className = 'patterns';
    area.value = this.data.patterns.join('\n');
    area.addEventListener('blur', (e: Event) => this.onPatternChange(e));

    container.append(label);
    container.append(area);

    return container;
  }

  private async onSortableEnd(event: Sortable.SortableEvent) {
    const hasChangedList = !!event.pullMode;
    const fromId = event.from.getAttribute('data-id');
    const toId = event.to.getAttribute('data-id');

    const fromIndex = event.oldIndex;
    const toIndex = event.newIndex;
    const hasIndexChange = fromIndex !== toIndex;

    if (!hasChangedList && !hasIndexChange) {
      return;
    }

    const { tabGroups, ...store } = await getStorage();
    console.log('enddd', fromIndex, toIndex, fromId, toId);
    if (hasChangedList) {
      const item = this.data.items[fromIndex];
      tabGroups.forEach((grp) => {
        if (grp.id === fromId) {
          grp.items.splice(fromIndex, 1);
          this.data = grp;
        } else if (grp.id === toId) {
          grp.items.splice(toIndex, 0, item);
        }
      });
    } else {
      tabGroups.forEach((fromGroup) => {
        if (fromGroup.id === fromId) {
          fromGroup.items = move(fromGroup.items, fromIndex, toIndex);
          this.data = fromGroup;
        }
      });
    }

    if (hasChangedList) {
      await groupSync.updateGroups(tabGroups);
    } else {
      await browser.storage.sync.set({
        ...store,
        tabGroups
      });
    }
  }

  private onNameChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.data.name = value;
    this.updateGroup(this.data);
  }

  private onPatternChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;

    this.data.patterns = value
      .split('\n')
      .map((x) => x.trim())
      .filter((x) => x !== '');

    this.updateGroup(this.data);
  }

  private togglePatternView() {
    this.isGroupView = !this.isGroupView;
    this.render();
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
  }

  private async updateGroup(group: TabGroup) {
    const { tabGroups, ...store } = await getStorage();
    const newGroups = tabGroups
      .map((g) => (g.id !== group.id ? g : group))
      .filter((x) => x.items.length > 0 || x.isLocked);

    await browser.storage.sync.set({
      ...store,
      tabGroups: newGroups
    });

    if (newGroups.some((x) => x.id === this.id)) {
      this.render();
    } else {
      this.tearDown();
    }
  }

  private tearDown() {
    if (this.node) {
      this.root.removeChild(this.node);
      this.unsubscribe();
    }
  }
}
