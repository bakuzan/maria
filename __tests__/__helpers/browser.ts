import type { Browser } from 'webextension-polyfill-ts';
import { deepMock, MockzillaDeep } from 'mockzilla';

const [browser, mockBrowser, mockBrowserNode] = deepMock<Browser>(
  'browser',
  false
);

jest.mock('webextension-polyfill-ts', () => ({ browser }));

export { mockBrowser, mockBrowserNode };

/* Copy paste the below into your test file:

  import { mockBrowser, mockBrowserNode } from '../__helpers/browser'

   beforeEach(() => mockBrowserNode.enable());

   afterEach(() => mockBrowserNode.verifyAndDisable());

*/
