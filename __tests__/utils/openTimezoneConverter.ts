import { mockBrowser, mockBrowserNode } from '../__helpers/browser';

import openTimezoneConverter from '../../src/utils/openTimezoneConverter';
import formatDateForDisplay from '../../src/utils/formatDateForDisplay';

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

it('should open timezoneConverter.html', async () => {
  const input = 'timezoneConverter.html';
  const today = new Date();
  const d = encodeURIComponent(formatDateForDisplay(today, true));
  const utcOff = encodeURIComponent(` (UTC +1)`);
  const newTabUrl = `chrome://extension/${input}`;
  const params = `?r=&f=${d}${utcOff}&t=${d}`;

  mockBrowser.extension.getURL.expect(input).andReturn(newTabUrl).times(1);
  mockBrowser.tabs.query.expect({ url: newTabUrl }).andResolve([]).times(1);
  mockBrowser.tabs.remove.expect([]).times(1);
  mockBrowser.tabs.create.expect({ url: `${newTabUrl}${params}` }).times(1);

  await openTimezoneConverter(today, today, 1);
});

it('should open timezoneConverter.html closing currently open timezoneConverter.htmls', async () => {
  const input = 'timezoneConverter.html';
  const today = new Date();
  const d = encodeURIComponent(formatDateForDisplay(today, true));
  const utcOff = encodeURIComponent(` (UTC +1)`);
  const newTabUrl = `chrome://extension/${input}`;
  const params = `?r=&f=${d}${utcOff}&t=${d}`;

  mockBrowser.extension.getURL.expect(input).andReturn(newTabUrl).times(1);
  mockBrowser.tabs.query
    .expect({ url: newTabUrl })
    .andResolve([tabExample])
    .times(1);

  mockBrowser.tabs.remove.expect([testTabId]).times(1);
  mockBrowser.tabs.create.expect({ url: `${newTabUrl}${params}` }).times(1);

  await openTimezoneConverter(today, today, 1);
});
