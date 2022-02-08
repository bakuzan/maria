import { browser } from 'webextension-polyfill-ts';

export default async function jsonFormatting(tabId: number) {
  await browser.tabs.executeScript(tabId, {
    code: `(async () => {
          const indentation = 2;
          const pre = document.querySelector('body pre:only-child');
          if(!pre) {
            return; 
          }
  
          try {		
            pre.innerHTML = JSON.stringify(JSON.parse(pre.innerHTML), null, indentation);
          }
          catch(e) {
            console.log(
              '%c [Maria]: Error, ',
              'color: #660000; font-size: 16px; font-weight: bold;',
              e
            );	
          }
        })();`
  });
}
