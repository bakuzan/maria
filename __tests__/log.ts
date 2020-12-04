import { log, reportError } from '../src/log';

it('should call console log', () => {
  const input = 'test';
  const spyFn = jest.spyOn(console, 'log').mockImplementation(() => null);

  log(input);

  expect(spyFn).toHaveBeenCalledTimes(1);
  expect(spyFn).toHaveBeenCalledWith('%c [Maria]: ', expect.anything(), input);

  spyFn.mockRestore();
});

it('should call console error', () => {
  const input = 'test';
  const spyFn = jest.spyOn(console, 'log').mockImplementation(() => null);

  reportError(input);

  expect(spyFn).toHaveBeenCalledTimes(1);
  expect(spyFn).toHaveBeenCalledWith(
    '%c [Maria]: Error, ',
    expect.anything(),
    input
  );

  spyFn.mockRestore();
});
