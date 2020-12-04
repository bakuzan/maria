import { mockBrowser, mockBrowserNode } from '../__helpers/browser';

import openWindow from '../../src/utils/openWindow';

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

it('should execute window.open in active tab', async () => {
  const inputUrl = 'https://duckduckgo.com';
  const spyFn = jest.fn();

  mockBrowser.tabs.query
    .expect(expect.anything())
    .andResolve([tabExample])
    .times(1);

  mockBrowser.tabs.executeScript.spy(spyFn).times(1);

  await openWindow(inputUrl);

  const [call] = mockBrowser.tabs.executeScript.getMockCalls();

  expect(call).toEqual([testTabId, expect.anything()]);
});

it('should log failure', async () => {
  const inputUrl = 'https://duckduckgo.com';
  const expected = new Error('This is a test error');
  const spyFn = jest.spyOn(console, 'log').mockImplementation(() => null);

  mockBrowser.tabs.query
    .expect(expect.anything())
    .andResolve([tabExample])
    .times(1);

  mockBrowser.tabs.executeScript.mock(() => {
    throw expected;
  });

  await openWindow(inputUrl);

  expect(spyFn).toHaveBeenCalledTimes(1);
  expect(spyFn).toHaveBeenCalledWith(
    '%c [Maria]: Error, ',
    expect.anything(),
    expected
  );

  spyFn.mockRestore();
});
