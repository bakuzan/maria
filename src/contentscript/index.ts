import '../styles/index.scss';
import './contentscript.scss';

import addHoverListeners from './addHoverListeners';
import addLinks from './addLinks';
import addSeries from './addSeries';
import openSeriesInErza from './openSeriesInErza';
import removeLinks from './removeLinks';
import initOnMessage from './onMessage';
import toaster from '../utils/toaster';

const page = window as any;

page.__Maria__ = {
  addHoverListeners,
  addLinks,
  addSeries,
  openSeriesInErza,
  removeLinks,
  toaster
};

initOnMessage();
