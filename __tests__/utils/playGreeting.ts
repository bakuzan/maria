import playGreeting from '@/utils/playGreeting';
import getAssetUrl from '../../src/utils/getAssetUrl';
import openNewTabStore from '../../src/utils/openNewTabStore';
import { MariaAssetFileNames } from '@/consts';

jest.mock('../../src/utils/openNewTabStore');
jest.mock('../../src/utils/getAssetUrl', () => ({
  __esModule: true,
  default: jest.fn(() => 'test')
}));

it('should open new tab store with search param', async () => {
  await playGreeting();

  expect(getAssetUrl).toBeCalledWith(MariaAssetFileNames.Greeting);
  expect(openNewTabStore).toHaveBeenCalledWith(`?src=test`);
});
