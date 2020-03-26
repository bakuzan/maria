import '../styles.scss';
import './tabStore.scss';

import getStorage from '@/utils/getStorage';
import { TabGroupController } from './TabGroupController';

async function run() {
  const rootContainer = document.getElementById('tabStore');
  const { tabGroups } = await getStorage();
  console.log('Tab store controller...', tabGroups);

  const controllers = tabGroups.map((x) => new TabGroupController(x));

  controllers.forEach((x) => x.renderIn(rootContainer));

  // TODO
  // Create an add group button

  // TODO !!
  // How to handle changing pattern matches.
}

run();
