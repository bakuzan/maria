import type { TabGroup } from '../../src/types/TabGroup';
import storeTabs from '../../src/utils/storeTabs';
import { storageDefaults } from '../../src/utils/getStorage';

const storeTabsToBeReloaded = [
  {
    id: 1,
    index: 1,
    active: false,
    highlighted: false,
    pinned: false,
    incognito: false
  }
];

function setup(storeValues: { [s: string]: any }, removeTabCount: number) {
  mockBrowser.storage.local.get
    .expect(storageDefaults)
    .andResolve({ ...storageDefaults, ...storeValues })
    .times(1);

  mockBrowser.tabs.remove.expect(expect.anything()).times(removeTabCount);

  mockBrowser.storage.local.set.expect(expect.anything()).times(1);

  // Reload stores
  const tabName = 'tabStore.html';
  const resolvedTabName = `chrome://extension/${tabName}`;

  mockBrowser.runtime.getURL
    .expect(tabName)
    .andReturn(resolvedTabName)
    .times(1);

  mockBrowser.tabs.query
    .expect({ url: resolvedTabName })
    .andResolve(storeTabsToBeReloaded)
    .times(1);

  mockBrowser.tabs.reload.expect(expect.anything()).times(1);
}

it('should store tab links', async () => {
  const input = [{ id: 1, title: 'hello world', url: 'https://something.com' }];

  setup({}, 1);

  await storeTabs(input);

  const [call] = mockBrowser.storage.local.set.getMockCalls();
  const callSet = call[0];
  const tabGroups = callSet.tabGroups as TabGroup[];
  const linkItem = tabGroups[0].items[0];

  expect(tabGroups.length).toEqual(1);
  expect(tabGroups[0].items.length).toEqual(1);
  expect(linkItem.title).toEqual(input[0].title);
  expect(linkItem.url).toEqual(input[0].url);
});

it('should store tab links that match an existing pattern group', async () => {
  const input = [{ id: 1, title: 'hello world', url: 'https://something.com' }];

  setup(
    {
      tabGroups: [
        {
          id: 'some_id',
          patterns: ['something.com'],
          items: [],
          isLocked: true
        }
      ]
    },
    1
  );

  await storeTabs(input);

  const [call] = mockBrowser.storage.local.set.getMockCalls();
  const callSet = call[0];
  const tabGroups = callSet.tabGroups as TabGroup[];
  const currentGroup = tabGroups[0];

  expect(tabGroups.length).toEqual(1);
  expect(currentGroup.items.length).toEqual(1);

  expect(currentGroup.items[0].url).toEqual(input[0].url);
});
