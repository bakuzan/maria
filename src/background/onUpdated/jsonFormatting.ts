import browser from 'webextension-polyfill';

function formatJson() {
  const indentation = 2;
  const [pre] = Array.from(
    document.querySelectorAll("body > *:not([id^='userscript'])")
  );
  const isPreTag = pre.tagName === 'PRE';
  if (!isPreTag) {
    return;
  }

  try {
    pre.innerHTML = JSON.stringify(
      JSON.parse(pre.innerHTML),
      null,
      indentation
    );
  } catch (e) {
    console.log(
      '%c [Maria]: Error, ',
      'color: #660000; font-size: 16px; font-weight: bold;',
      e
    );
  }
}

export default async function jsonFormatting(tabId: number) {
  await browser.scripting.executeScript({
    target: { tabId },
    func: formatJson
  });
}
