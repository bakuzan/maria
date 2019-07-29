export default function getErrorMessage(response) {
  if (response.error) return response.error.message;
  if (response.errorMessages) return response.errorMessages[0];
  if (response.errors) return response.errors[0].message;
  return `Failed to post '${request.series.title}'`;
}
