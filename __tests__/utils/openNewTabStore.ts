import openNewTabStore from '../../src/utils/openNewTabStore';

const testTabId = 1066;
const tabExample = {
  id: testTabId,
  index: 1999,
  active: true,
  highlighted: true,
  pinned: false,
  incognito: false
};

it('should open tabStore.html', async () => {
  const input = 'tabStore.html';
  const tabStoreUrl = `chrome://extension/${input}`;

  mockBrowser.runtime.getURL.expect(input).andReturn(tabStoreUrl).times(1);

  mockBrowser.tabs.query.expect({ url: tabStoreUrl }).andResolve([]).times(1);

  mockBrowser.tabs.remove.expect([]).times(1);

  mockBrowser.tabs.create
    .expect({
      index: 0,
      url: tabStoreUrl
    })
    .times(1);

  await openNewTabStore();
});

it('should open tabStore.html closing currently open tabStore.htmls', async () => {
  const input = 'tabStore.html';
  const tabStoreUrl = `chrome://extension/${input}`;

  mockBrowser.runtime.getURL.expect(input).andReturn(tabStoreUrl).times(1);

  mockBrowser.tabs.query
    .expect({ url: tabStoreUrl })
    .andResolve([tabExample])
    .times(1);

  mockBrowser.tabs.remove.expect([testTabId]).times(1);

  mockBrowser.tabs.create
    .expect({
      index: 0,
      url: tabStoreUrl
    })
    .times(1);

  await openNewTabStore();
});

it('should append the search param to tabStore.html', async () => {
  const searchParam = `?src=audio.mp3`;

  const input = 'tabStore.html';
  const tabStoreUrl = `chrome://extension/${input}`;

  mockBrowser.runtime.getURL.expect(input).andReturn(tabStoreUrl).times(1);
  mockBrowser.tabs.query.expect({ url: tabStoreUrl }).andResolve([]).times(1);
  mockBrowser.tabs.remove.expect([]).times(1);

  mockBrowser.tabs.create
    .expect({
      index: 0,
      url: `${tabStoreUrl}${searchParam}`
    })
    .times(1);

  await openNewTabStore(searchParam);
});
