import getErrorMessage from '../../src/utils/getErrorMessage';

it('should have no response message', () => {
  const input = null;
  const output = `No response.`;

  const result = getErrorMessage(input);

  expect(result).toEqual(output);
});

it('should return reponse error message', () => {
  const message = 'my error message';
  const input = { success: false, error: { name: 'error', message } };
  const output = message;

  const result = getErrorMessage(input);

  expect(result).toEqual(output);
});

it('should return first of reponse errorMessages', () => {
  const message = 'first error message';
  const input = { success: false, error: null, errorMessages: [message] };
  const output = message;

  const result = getErrorMessage(input);

  expect(result).toEqual(output);
});

it('should return message extracted from graphql errors', () => {
  const message = 'first error message';
  const detail = 'some detail';
  const errors = [{ message: detail }];
  const exception = { errors };
  const extensions = { exception };
  const input = {
    success: false,
    error: null,
    errors: [{ message, extensions }]
  };
  const output = `${message} - ${detail}`;

  const result = getErrorMessage(input);

  expect(result).toEqual(output);
});

it('should return message extracted from graphql errors - no detail', () => {
  const message = 'first error message';

  const errors = [];
  const exception = { errors };
  const extensions = { exception };
  const input = {
    success: false,
    error: null,
    errors: [{ message, extensions }]
  };
  const output = `${message} - No fault detail`;

  const result = getErrorMessage(input);

  expect(result).toEqual(output);
});

it('should return fallback message', () => {
  const input = { success: false, error: null };
  const output = `Failed to post`;

  const result = getErrorMessage(input);

  expect(result).toEqual(output);
});
