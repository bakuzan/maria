import openWindow from '../../src/utils/openWindow';

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

  mockBrowser.scripting.executeScript.spy(spyFn).times(1);

  await openWindow(inputUrl);

  const [[call]] = mockBrowser.scripting.executeScript.getMockCalls();

  expect(call.args).toEqual([inputUrl]);
  expect(call.target.tabId).toEqual(testTabId);
  expect(call?.func?.toString().includes('openNewTab')).toBeTruthy();
});

it('should log failure', async () => {
  const inputUrl = 'https://duckduckgo.com';
  const expected = new Error('This is a test error');
  const spyFn = jest.spyOn(console, 'log').mockImplementation(() => null);

  mockBrowser.tabs.query
    .expect(expect.anything())
    .andResolve([tabExample])
    .times(1);

  mockBrowser.scripting.executeScript.mock(() => {
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
