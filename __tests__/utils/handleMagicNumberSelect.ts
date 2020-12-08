import { mockBrowser, mockBrowserNode } from '../__helpers/browser';

import handleMagicNumberSelect from '../../src/utils/handleMagicNumberSelect';
import { BASE_LINK_URL } from '../../src/consts';

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

xit('should open window if selection is valid', async () => {
  const input = '12345';
  const spyFn = jest.fn();

  mockBrowser.tabs.query
    .expect({ active: true, currentWindow: true })
    .andResolve([tabExample])
    .times(1);

  mockBrowser.tabs.executeScript.spy(spyFn).times(1);

  handleMagicNumberSelect(input);

  const [call] = mockBrowser.tabs.executeScript.getMockCalls(); // TODO is returning undefined?
  const outputCode = call.pop().code;

  expect(call).toEqual([testTabId, expect.anything()]);
  expect(outputCode.includes('window.open')).toBeTruthy();
  expect(outputCode.includes(`${BASE_LINK_URL}${input}`)).toBeTruthy();
});

xit('should send user feedback if not valid selection', async () => {
  const input = 'qwerty';
  const spyFn = jest.fn();

  mockBrowser.tabs.query
    .expect({ active: true, currentWindow: true })
    .andResolve([tabExample])
    .times(1);

  mockBrowser.tabs.executeScript.spy(spyFn).times(1);

  handleMagicNumberSelect(input);

  const [call] = mockBrowser.tabs.executeScript.getMockCalls(); // TODO is returning undefined?
  const outputCode = call.pop().code;

  expect(call).toEqual([testTabId, expect.anything()]);
  expect(outputCode.includes('warning')).toBeTruthy();
  expect(
    outputCode.includes('The current selection is not a valid magic number')
  ).toBeTruthy();
});

it('should do nothing for invalid selection with alerts turned off', async () => {
  const input = 'qwerty';
  const spyFn = jest.fn();
  const spyFn2 = jest.fn();

  mockBrowser.tabs.query.mock(spyFn);
  mockBrowser.tabs.executeScript.mock(spyFn2);

  handleMagicNumberSelect(input, false);

  expect(spyFn).not.toHaveBeenCalled();
  expect(spyFn2).not.toHaveBeenCalled();
});
