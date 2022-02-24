import '../styles/index.scss';
import './exportImport.scss';

import getStorage from '@/utils/getStorage';
import { log } from '@/log';

import exportHandler from './export';
import importHandler from './import';

async function run() {
  const data = await getStorage();
  log('Export/Import page > ', data);

  // Export
  await exportHandler();

  // Import
  await importHandler();
}

run();
