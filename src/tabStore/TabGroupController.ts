import browser from 'webextension-polyfill';
import Sortable from 'sortablejs';

import getViewToggleSVG from './getViewToggleSVG';
import groupSync from './TabGroupSync';

import { TabGroup } from '@/types/TabGroup';
import { move } from '@/utils/array';
import getStorage from '@/utils/getStorage';
import getUrlOrigin from '@/utils/getUrlOrigin';

const LIST_HOVER_CLASS = 'stored-links--is-target';

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
      if (group) {
        this.data = group;
        this.render();
      } else {
        this.tearDown();
      }
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
    name.className = 'maria-input tab-group__name';
    name.placeholder = 'Enter a group name...';
    name.value = this.data.name ?? '';
    name.addEventListener('blur', (e: Event) => this.onNameChange(e));

    const controls = document.createElement('div');
    controls.className = 'tab-group__controls';

    const patternToggle = document.createElement('button');
    patternToggle.className = 'maria-button tab-group__view-toggle';
    patternToggle.title = this.isGroupView
      ? 'Display pattern filters'
      : 'Display group links';

    patternToggle.innerHTML = getViewToggleSVG(this.isGroupView);
    patternToggle.addEventListener('click', () => this.togglePatternView());

    const tickbox = document.createElement('label');
    tickbox.className = 'maria-tickbox';

    const lock = document.createElement('input');
    lock.type = 'checkbox';
    lock.name = `isLocked_${this.id}`;
    lock.checked = this.data.isLocked;
    lock.addEventListener('change', () => this.toggleLock());

    tickbox.append(lock);
    tickbox.append('\uD83D\uDD12\uFE0E');

    const itemCount = this.data.items.length;
    const count = document.createElement('div');
    count.className = 'tab-group__count';
    count.textContent = `${itemCount} tab${itemCount !== 1 ? 's' : ''}`;

    const content = this.isGroupView
      ? this.createItemsList()
      : this.createPatternsView();

    // Pieceing it together
    controls.append(patternToggle);
    controls.append(tickbox);

    header.append(name);
    header.append(controls);

    this.node.append(header);
    if (this.isGroupView) {
      this.node.append(count);
    }
    this.node.append(content);

    if (oldNode) {
      this.root.replaceChild(this.node, oldNode);
    } else {
      this.root.append(this.node);
    }
  }

  private createItemsList() {
    const ul = document.createElement('ul');
    ul.className = 'tab-group__items stored-links';
    ul.setAttribute('data-id', this.id);

    this.data.items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'stored-links__item';
      li.setAttribute('data-link', item.url);

      const btn = document.createElement('button');
      btn.className = 'maria-button stored-links__button';
      btn.textContent = '\u274C\uFE0E';
      btn.addEventListener('click', (e: MouseEvent) => this.removeListener(e));

      const icon = new Image(16, 16);
      icon.className = 'stored-links__icon';
      icon.src = `${getUrlOrigin(item.url)}/favicon.ico`;
      icon.alt = 'i';
      icon.onerror = function (event: ErrorEvent) {
        const t = event.target as HTMLImageElement;
        t.onerror = null;
        t.src = 'assets/maria_16x16.png';
      };

      const link = document.createElement('a');
      link.className = 'maria-link stored-links__link';
      link.textContent = item.title;
      link.setAttribute('href', item.url);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'nofollow noreferrer noopener');
      link.addEventListener('click', (e: MouseEvent) => this.openListener(e));
      link.addEventListener('auxclick', (e: MouseEvent) =>
        this.openListener(e)
      );

      li.append(btn);
      li.append(icon);
      li.append(link);
      ul.append(li);
    });

    this.sortable = new Sortable(ul, {
      group: 'tabs',
      animation: 150,
      sort: true,
      ghostClass: 'stored-links__item--ghost',
      chosenClass: 'stored-links__item--chosen',
      onMove: (moveEvent) => this.onMove(moveEvent),
      onEnd: (event) => this.onSortableEnd(event)
    });

    return ul;
  }

  private createPatternsView() {
    const patternsId = `patterns_${this.id}`;

    const container = document.createElement('div');
    container.className = 'tab-group__patterns';

    const label = document.createElement('label');
    label.className = 'maria-label';
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

  private onMove(event: Sortable.MoveEvent) {
    this.removeIsTargetClassFromLists();
    event.to.classList.add(LIST_HOVER_CLASS);
    return true; // Needed so the move goes ahead.
  }

  private async onSortableEnd(event: Sortable.SortableEvent) {
    this.removeIsTargetClassFromLists();

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
    let newGroups = [...tabGroups];

    if (hasChangedList) {
      const item = this.data.items[fromIndex];

      newGroups.forEach((grp) => {
        if (grp.id === fromId) {
          grp.items.splice(fromIndex, 1);
          this.data = grp;
        } else if (grp.id === toId) {
          grp.items.splice(toIndex, 0, item);
        }
      });
    } else {
      newGroups.forEach((fromGroup) => {
        if (fromGroup.id === fromId) {
          fromGroup.items = move(fromGroup.items, fromIndex, toIndex);
          this.data = fromGroup;
        }
      });
    }

    newGroups = newGroups.filter((x) => x.items.length > 0 || x.isLocked);

    if (hasChangedList) {
      await groupSync.updateGroups(newGroups);
    } else {
      await browser.storage.local.set({
        ...store,
        tabGroups: newGroups
      });
    }
  }

  private removeIsTargetClassFromLists() {
    Array.from(document.querySelectorAll('.stored-links')).forEach((from) =>
      from.classList.remove(LIST_HOVER_CLASS)
    );
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

  private async openListener(event: MouseEvent) {
    const isLeft = event.button === 0;
    const isMiddle = event.button === 1;

    if (!isLeft && !isMiddle) {
      return;
    }

    event.preventDefault();

    const element = event.target as HTMLElement;
    const parent = element.parentElement;
    const url = parent.getAttribute('data-link');

    await browser.tabs.create({
      active: false,
      index: 1000,
      url
    });

    if (isLeft) {
      this.removeListener(event);
    }
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

    await browser.storage.local.set({
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
