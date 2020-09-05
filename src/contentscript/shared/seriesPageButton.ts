export default function seriesPageButton(
  buttonText: string,
  onButtonClick: (container: HTMLDivElement, button: HTMLButtonElement) => void
) {
  const location = document.querySelector('#profileRows');

  const scraper = document.createElement('div');
  scraper.className = 'maria maria-mal-add';

  const btn = document.createElement('button');
  btn.className = 'maria-button maria-button--padding maria-button--primary';
  btn.style.cssText = `width: 99%;`;
  btn.textContent = buttonText;

  btn.addEventListener('click', () => onButtonClick(scraper, btn));
  scraper.appendChild(btn);

  // Add to page
  location.insertAdjacentElement('afterend', scraper);
}
