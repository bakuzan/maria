import toaster from '../../src/utils/toaster';

jest.useFakeTimers();

it('should create element and append to body', () => {
  const spyCreateElement = jest.spyOn(document, 'createElement');
  const spyBodyAppend = jest.spyOn(document.body, 'appendChild');
  const spyBodyRemove = jest.spyOn(document.body, 'removeChild');

  toaster('warning', 'this is a test');

  expect(spyCreateElement).toHaveBeenCalledTimes(1);
  expect(spyBodyAppend).toHaveBeenCalledTimes(1);

  // Fast-forward until all timers have been executed
  jest.advanceTimersByTime(5000);

  expect(spyBodyRemove).toHaveBeenCalledTimes(1);
});
