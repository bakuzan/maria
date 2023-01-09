import browser from 'webextension-polyfill';
import formatDateForDisplay from './formatDateForDisplay';

export default async function openTimezoneConverter(
  from: Date,
  result: Date,
  utcOffset: number,
  raw: string = ''
) {
  const targetTabUrl = browser.runtime.getURL('timezoneConverter.html');

  const stores = await browser.tabs.query({
    url: targetTabUrl
  });

  const removeTabIds = stores.map((x) => x.id);
  await browser.tabs.remove(removeTabIds);

  const f = encodeURIComponent(
    `${formatDateForDisplay(from, true)} (UTC ${
      utcOffset > 0 ? '+' : ''
    }${utcOffset})`
  );
  const t = encodeURIComponent(formatDateForDisplay(result, true));
  const url = `${targetTabUrl}?r=${raw}&f=${f}&t=${t}`;
  await browser.tabs.create({ url });
}
