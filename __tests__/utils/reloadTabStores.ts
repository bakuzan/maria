import { reloadTabStores } from '../../src/utils/reloadMariaPages';

const tabExample = {
  active: false,
  highlighted: false,
  pinned: false,
  incognito: false
};

it('should reload all tab store instances', async () => {
  const tabName = 'tabStore.html';
  const resolvedTabName = `chrome://extension/${tabName}`;

  mockBrowser.runtime.getURL
    .expect(tabName)
    .andReturn(resolvedTabName)
    .times(1);

  mockBrowser.tabs.query
    .expect({ url: resolvedTabName })
    .andResolve([
      { ...tabExample, id: 1, index: 0 },
      { ...tabExample, id: 2, index: 1 }
    ])
    .times(1);

  mockBrowser.tabs.reload.expect(expect.anything()).times(2);

  await reloadTabStores();
});
