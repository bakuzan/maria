import { mockBrowser, mockBrowserNode } from '../__helpers/browser';

import { MariaAction } from '../../src/consts';
import { processLinks, removeLinks } from '../../src/utils/linksProcessing';

beforeEach(() => mockBrowserNode.enable());

afterEach(() => mockBrowserNode.verifyAndDisable());

it('should execute processLinks script', () => {
  const tabId = 1;
  const callback = jest.fn();
  const executeSpy = jest.fn();

  mockBrowser.scripting.executeScript.spy(executeSpy);

  processLinks(tabId, callback);

  const executeCall = executeSpy.mock.calls[0];

  expect(executeCall[0]).toEqual(tabId);
  expect(executeCall[1].code.includes('addLinks')).toBeTruthy();
  expect(callback).toHaveBeenCalledWith({
    action: MariaAction.PROCESS_NUMBERS,
    message: 'Done'
  });
});

it('should execute removeLinks script', () => {
  const tabId = 1;
  const callback = jest.fn();
  const executeSpy = jest.fn();

  mockBrowser.scripting.executeScript.spy(executeSpy);

  removeLinks(tabId, callback);

  const executeCall = executeSpy.mock.calls[0];

  expect(executeCall[0]).toEqual(tabId);
  expect(executeCall[1].code.includes('removeLinks')).toBeTruthy();
  expect(callback).toHaveBeenCalledWith({
    action: MariaAction.REMOVE_LINKS,
    message: 'Done'
  });
});
