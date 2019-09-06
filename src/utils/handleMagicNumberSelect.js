import { BASE_LINK_URL } from '../consts.js';
import openWindow from './openWindow.js';
import userFeedback from './userFeedback.js';

export default function handleMagicNumberSelect(
  selectionText = '',
  showAlert = true
) {
  const selectionIsValid = /^\d+$/.test(selectionText);

  if (selectionIsValid) {
    openWindow(`${BASE_LINK_URL}${selectionText}`);
  } else if (showAlert) {
    userFeedback(
      'warning',
      'The current selection is not a valid magic number'
    );
  }
}
