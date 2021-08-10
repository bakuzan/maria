import { mockBrowser, mockBrowserNode } from '../__helpers/browser';

import openRSSViewer from '../../src/utils/openRSSViewer';

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

it('should open rssViewer.html', async () => {
  const input = 'rssViewer.html';
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

  await openRSSViewer();
});

it('should open rssViewer.html closing currently open rssViewer.htmls', async () => {
  const input = 'rssViewer.html';
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

  await openRSSViewer();
});
