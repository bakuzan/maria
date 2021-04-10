import { BASE_LINK_URL } from '@/consts';
import openWindow from './openWindow';
import userFeedback from './userFeedback';

export default function handleMagicNumberSelect(
  selectionText = '',
  showAlert = true
) {
  const text = selectionText.trim();
  const selectionIsValid = /^\d+$/.test(text);

  if (selectionIsValid) {
    openWindow(`${BASE_LINK_URL}${text}`);
  } else if (showAlert) {
    userFeedback(
      'warning',
      'The current selection is not a valid magic number'
    );
  }
}
