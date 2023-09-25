import type { Browser } from 'webextension-polyfill';
import { deepMock } from 'mockzilla';

const [browser, mockBrowser, mockBrowserNode] = deepMock<Browser>(
  'browser',
  false
);

jest.mock('webextension-polyfill', () => browser);

export { mockBrowser, mockBrowserNode };

/* Copy paste the below into your test file:

  import { mockBrowser, mockBrowserNode } from '../__helpers/browser'

   beforeEach(() => mockBrowserNode.enable());

   afterEach(() => mockBrowserNode.verifyAndDisable());

*/
