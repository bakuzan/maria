import '../styles/index.scss';
import './contentscript.scss';

import addHoverListeners from './addHoverListeners';
import addLinks from './addLinks';
import activateErzaSeries from './activateErzaSeries';
import removeLinks from './removeLinks';
import initOnMessage from './onMessage';
import toaster from '../utils/toaster';

const page = window as any;

page.__Maria__ = {
  activateErzaSeries,
  addHoverListeners,
  addLinks,
  removeLinks,
  toaster
};

initOnMessage();
