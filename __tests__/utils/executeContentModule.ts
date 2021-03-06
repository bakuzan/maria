import { mockBrowser, mockBrowserNode } from '../__helpers/browser';

import executeContentModule from '../../src/utils/executeContentModule';

beforeEach(() => mockBrowserNode.enable());

afterEach(() => mockBrowserNode.verifyAndDisable());

it('should call browser executeScript', async () => {
  const tabId = 1;
  const code = `(async () => window.__Maria__.removeLinks())();`;
  const spyFn = jest.fn();

  mockBrowser.tabs.executeScript.spy(spyFn).times(1);

  await executeContentModule(tabId, 'removeLinks');

  const [call] = mockBrowser.tabs.executeScript.getMockCalls();

  expect(call).toEqual([tabId, { code }]);
});

/*
export default async function injectContentModule(
  tabId: number,
  func: ContentScriptFunction
) {
  await browser.tabs.executeScript(tabId, {
    code: `(async () => window.__Maria__.${func}())();`
  });
}
*/
