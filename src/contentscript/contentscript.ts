import '../styles.scss';
import './contentscript.scss';

import addHoverListeners from './addHoverListeners';
import addLinks from './addLinks';
import addSeries from './addSeries';
import removeLinks from './removeLinks';
import initScrapeGalleryItems from './scrapeGalleryItems';

const page = window as any;

page.__Maria__ = {
  addHoverListeners,
  addLinks,
  addSeries,
  removeLinks
};

initScrapeGalleryItems();
