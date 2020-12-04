import isElementHidden from '../../src/utils/isElementHidden';

it('should be a hidden element', () => {
  const element = document.createElement('div');

  const result = isElementHidden(element);

  expect(result).toBeTruthy();
});
