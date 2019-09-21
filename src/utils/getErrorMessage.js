export default function getErrorMessage(response) {
  if (response.error) return response.error.message;
  if (response.errorMessages) return response.errorMessages[0];
  if (response.errors) {
    const errors = response.errors[0];
    const message = errors.message;
    const detail = errors.extensions.exception.errors[0].message;
    return `${message} - ${detail}`;
  }

  return `Failed to post`;
}
