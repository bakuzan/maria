import '../styles/index.scss';
import './timezoneConverter.scss';

const timezoneConverterContainerId = 'timezoneConverter';

async function run() {
  const container = document.getElementById(timezoneConverterContainerId);
  const params = window.location.search;

  if (!params) {
    container.textContent = `No information.`;
  }

  const args = params
    .slice(1)
    .split('&')
    .map((slug) => slug.split('='));

  const fromDate = args.find(([k]) => k === 'f');
  const toDate = args.find(([k]) => k === 't');
  const rawValue = args.find(([k]) => k === 'r');

  if (!fromDate || !toDate) {
    container.textContent = `Bad arguments.`;
  }

  const timezoneOffset = new Date().getTimezoneOffset() / 60;

  container.innerHTML = `<div>
  <strong class="timezone-converter__important">${decodeURIComponent(
    rawValue[1]
  )}</strong> 
  <br />
  was processed into
  <br />
  <strong class="timezone-converter__important">${decodeURIComponent(
    fromDate[1]
  )}</strong> 
  <br />
  which is 
  <br />
  <strong class="timezone-converter__important">${decodeURIComponent(
    toDate[1]
  )} (UTC${timezoneOffset > 0 ? ' +' : ''}${
    timezoneOffset === 0 ? '' : ` ${timezoneOffset}`
  })</strong>
  </div>`;
}

run();
