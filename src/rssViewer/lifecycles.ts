import storeTabs from '@/utils/storeTabs';
import toaster from '@/utils/toaster';

export function afterRenderFeed() {
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    '.store-latest-button'
  );

  Array.from(buttons).forEach((btnElement) =>
    btnElement.addEventListener('click', onStoreButtonClick)
  );
}

async function onStoreButtonClick() {
  const t = this as HTMLButtonElement;
  const parent = t.parentElement;

  const linkDetail = parent.querySelector('a');
  const title = linkDetail.textContent;
  const url = linkDetail.href;

  await storeTabs([{ title, url }]);
  toaster('success', `${title} sent to tab store.`);
}
