import executeContentModule from '../../src/utils/executeContentModule';

it('should call browser executeScript', async () => {
  const tabId = 1;
  // const code = `(async () => window.__Maria__.removeLinks())();`;
  const spyFn = jest.fn();

  mockBrowser.scripting.executeScript.spy(spyFn).times(1);

  await executeContentModule(tabId, 'removeLinks');

  const [[call]] = mockBrowser.scripting.executeScript.getMockCalls();

  expect(call?.args).toEqual(['removeLinks', '']);
  expect(call?.target.tabId).toEqual(tabId);
  expect(call?.func?.toString().includes('callMariaApi')).toBeTruthy();
});

/*
export default async function injectContentModule(
  tabId: number,
  func: ContentScriptFunction
) {
  await browser.scripting.executeScript(tabId, {
    code: `(async () => window.__Maria__.${func}())();`
  });
}
*/
