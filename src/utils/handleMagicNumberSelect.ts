import { BASE_LINK_URL } from '@/consts';
import openWindow from './openWindow';
import userFeedback from './userFeedback';

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
