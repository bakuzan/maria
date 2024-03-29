import { mockBrowser, mockBrowserNode } from '../__helpers/browser';

import storeTabs from '../../src/utils/storeTabs';
import { storageDefaults } from '../../src/utils/getStorage';

beforeEach(() => mockBrowserNode.enable());

afterEach(() => mockBrowserNode.verifyAndDisable());

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

const getRandomValues = jest
  .fn()
  .mockImplementation(() => new Uint8Array(1).fill(16));

beforeAll(() => {
  Object.defineProperty(window, 'crypto', {
    get: () => ({
      getRandomValues
    })
  });
});

beforeEach(() => {
  getRandomValues.mockClear();
});

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
  const { tabGroups } = call[0];
  const linkItem = tabGroups[0].items[0];

  expect(getRandomValues).toHaveBeenCalled();
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
  const { tabGroups } = call[0];
  const currentGroup = tabGroups[0];

  expect(getRandomValues).toHaveBeenCalled();
  expect(tabGroups.length).toEqual(1);
  expect(currentGroup.items.length).toEqual(1);

  expect(currentGroup.items[0].url).toEqual(input[0].url);
});
