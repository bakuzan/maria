import { mockBrowser, mockBrowserNode } from '../__helpers/browser';

import userFeedback from '../../src/utils/userFeedback';

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

it('should execute toaster call in active tab', async () => {
  const input = 'my error feedback';
  const spyFn = jest.fn();

  mockBrowser.tabs.query
    .expect(expect.anything())
    .andResolve([tabExample])
    .times(1);

  mockBrowser.tabs.executeScript.spy(spyFn).times(1);

  await userFeedback('error', input);

  const [call] = mockBrowser.tabs.executeScript.getMockCalls();

  expect(call).toEqual([testTabId, expect.anything()]);
  expect(call.pop().code.includes('.toaster(')).toBeTruthy();
});

it('should log failure', async () => {
  const input = 'my error feedback';
  const expected = new Error('This is a test error');
  const spyFn = jest.spyOn(console, 'log').mockImplementation(() => null);

  mockBrowser.tabs.query
    .expect(expect.anything())
    .andResolve([tabExample])
    .times(1);

  mockBrowser.tabs.executeScript.mock(() => {
    throw expected;
  });

  await userFeedback('error', input);

  expect(spyFn).toHaveBeenCalledTimes(1);
  expect(spyFn).toHaveBeenCalledWith(
    '%c [Maria]: Error, ',
    expect.anything(),
    expected
  );

  spyFn.mockRestore();
});
