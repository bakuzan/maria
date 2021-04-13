const SERIES_PAGE_ID = 'mariaSeriesButtonContainer';

function ensureCleanSeriesPage() {
  const container = document.getElementById(SERIES_PAGE_ID);

  if (container) {
    container.parentNode.removeChild(container);
  }
}

export default function seriesPageButton(
  buttonText: string,
  onButtonClick: (container: HTMLDivElement, button: HTMLButtonElement) => void
) {
  const location = document.querySelector('#profileRows');
  ensureCleanSeriesPage();

  const scraper = document.createElement('div');
  scraper.id = SERIES_PAGE_ID;
  scraper.className = 'maria maria-mal-add';

  const btn = document.createElement('button');
  btn.id = 'mariaSeriesButton';
  btn.className = 'maria-button maria-button--padding maria-button--primary';
  btn.style.cssText = `width: 99%;`;
  btn.textContent = buttonText;

  btn.addEventListener('click', () => onButtonClick(scraper, btn));
  scraper.appendChild(btn);

  // Add to page
  location.insertAdjacentElement('afterend', scraper);
}
