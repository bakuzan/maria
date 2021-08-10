import { mockBrowser, mockBrowserNode } from '../__helpers/browser';

import openNewTabStore from '../../src/utils/openNewTabStore';

beforeEach(() => mockBrowserNode.enable());

afterEach(() => mockBrowserNode.verifyAndDisable());

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

  mockBrowser.tabs.query
    .expect({
      url: tabStoreUrl
    })
    .andResolve([])
    .times(1);

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
    .expect({
      url: tabStoreUrl
    })
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
