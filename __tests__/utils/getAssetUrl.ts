import getAssetUrl from '../../src/utils/getAssetUrl';
import { MariaAssetFileNames } from '../../src/consts';

it('should return the asset url based on input filename', () => {
  const input = MariaAssetFileNames.Greeting;
  const output = `chrome://extension/${input.toString()}`;

  mockBrowser.runtime.getURL
    .expect(expect.anything())
    .andReturn(output)
    .times(1);

  const result = getAssetUrl(input);

  expect(result.includes('chrome://')).toBeTruthy();
  expect(result.includes(input.toString())).toBeTruthy();
});
