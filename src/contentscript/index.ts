import '../styles/index.scss';
import './contentscript.scss';

import addHoverListeners from './addHoverListeners';
import addLinks from './addLinks';
import addSeries from './addSeries';
import removeLinks from './removeLinks';
import initScrapeGalleryItems from './scrapeGalleryItems';
import toaster from '../utils/toaster';

const page = window as any;

page.__Maria__ = {
  addHoverListeners,
  addLinks,
  addSeries,
  removeLinks,
  toaster
};

initScrapeGalleryItems();
