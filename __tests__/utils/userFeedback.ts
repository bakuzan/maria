import { expect, jest } from '@jest/globals';
import userFeedback from '../../src/utils/userFeedback';

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

  mockBrowser.scripting.executeScript.spy(spyFn).times(1);

  await userFeedback('error', input);

  const [[call]] = mockBrowser.scripting.executeScript.getMockCalls();

  expect(call.args).toEqual(['error', input]);
  expect(call.target.tabId).toEqual(testTabId);
  expect(call?.func?.toString().includes('.toaster(')).toBeTruthy();
});

it('should log failure', async () => {
  const input = 'my error feedback';
  const expected = new Error('This is a test error');
  const spyFn = jest.spyOn(console, 'log').mockImplementation(() => null);

  mockBrowser.tabs.query
    .expect(expect.anything())
    .andResolve([tabExample])
    .times(1);

  mockBrowser.scripting.executeScript.mock(() => {
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
