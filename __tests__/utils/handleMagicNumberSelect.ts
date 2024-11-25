import handleMagicNumberSelect from '../../src/utils/handleMagicNumberSelect';
import openWindow from '../../src/utils/openWindow';
import userFeedback from '../../src/utils/userFeedback';

import { BASE_LINK_URL } from '../../src/consts';

jest.mock('../../src/utils/openWindow');
jest.mock('../../src/utils/userFeedback');

const testTabId = 1066;
const tabExample = {
  id: testTabId,
  index: 1999,
  active: true,
  highlighted: true,
  pinned: false,
  incognito: false
};

it('should open window if selection is valid', async () => {
  const input = '12345';

  handleMagicNumberSelect(input);

  expect(openWindow).toHaveBeenCalledWith(`${BASE_LINK_URL}${input}`);
});

it('should send user feedback if not valid selection', async () => {
  const input = 'qwerty';

  handleMagicNumberSelect(input);

  expect(userFeedback).toHaveBeenCalledWith(
    'warning',
    'The current selection is not a valid magic number'
  );
});

it('should do nothing for invalid selection with alerts turned off', async () => {
  const input = 'qwerty';
  const spyFn = jest.fn();
  const spyFn2 = jest.fn();

  mockBrowser.tabs.query.mock(spyFn);
  mockBrowser.scripting.executeScript.mock(spyFn2);

  handleMagicNumberSelect(input, false);

  expect(spyFn).not.toHaveBeenCalled();
  expect(spyFn2).not.toHaveBeenCalled();
});
