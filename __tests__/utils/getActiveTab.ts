import { mockBrowser, mockBrowserNode } from '../__helpers/browser';

import getActiveTab from '../../src/utils/getActiveTab';

beforeEach(() => mockBrowserNode.enable());

afterEach(() => mockBrowserNode.verifyAndDisable());

const tabExample = {
  index: 1999,
  active: true,
  highlighted: true,
  pinned: false,
  incognito: false
};

it('should return the active tab', async () => {
  mockBrowser.tabs.query
    .expect({ active: true, currentWindow: true })
    .andResolve([tabExample])
    .times(1);

  const result = await getActiveTab();

  expect(result.index).toEqual(1999);
});
