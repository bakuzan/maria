import { MariaAssetFileNames } from '@/consts';
import getAssetUrl from '@/utils/getAssetUrl';
import openNewTabStore from '@/utils/openNewTabStore';

export default async function playGreeting() {
  const greetingUrl = getAssetUrl(MariaAssetFileNames.Greeting);
  const search = `?src=${encodeURIComponent(greetingUrl)}`;
  await openNewTabStore(search);
}
