import { FetchResponse } from '@/types/FetchResponse';

export default function getErrorMessage(response: FetchResponse) {
  if (!response) {
    return `No response.`;
  }

  if (response.error) {
    return response.error.message;
  }

  if (response.errorMessages) {
    return response.errorMessages[0];
  }

  if (response.errors) {
    const baseErrors = response.errors[0] || { extensions: {} };
    const message = baseErrors.message;
    const { errors = [] } = baseErrors.extensions.exception || {};
    const detail = errors[0] ? errors[0].message : 'No fault detail';

    return `${message} - ${detail}`;
  }

  return `Failed to post`;
}
