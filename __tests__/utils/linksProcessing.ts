import { MariaAction } from '../../src/consts';
import { processLinks, removeLinks } from '../../src/utils/linksProcessing';

it('should execute processLinks script', () => {
  const tabId = 1;
  const callback = jest.fn();
  const executeSpy = jest.fn();

  mockBrowser.scripting.executeScript.spy(executeSpy);

  processLinks(tabId, callback);

  const [[executeCall]] = executeSpy.mock.calls;

  expect(executeCall.target.tabId).toEqual(tabId);
  expect(executeCall.args).toEqual(['addLinks', '']);
  expect(executeCall.func.toString().includes('callMariaApi')).toBeTruthy();
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

  const [[executeCall]] = executeSpy.mock.calls;

  expect(executeCall.target.tabId).toEqual(tabId);
  expect(executeCall.args).toEqual(['removeLinks', '']);
  expect(executeCall.func.toString().includes('callMariaApi')).toBeTruthy();
  expect(callback).toHaveBeenCalledWith({
    action: MariaAction.REMOVE_LINKS,
    message: 'Done'
  });
});
