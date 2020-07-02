import { Feed } from '@/types/Feed';
import { checkFeedsForUpdates } from '@/utils/rssFeedChecks';

import { onFeedSelect, onRemoveFeed } from './feedActions';
import { createFeedItem } from './itemRenderers';

const UPDATE_LOADING_CLASS = 'check-updates-button--loading';

export const getCheckUpdateButton = () =>
  document.querySelector<HTMLButtonElement>('#checkUpdates');

export function renderFeedList(feeds: Feed[]) {
  const feedList = document.getElementById('feeds');

  feedList.innerHTML = feeds
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(createFeedItem)
    .join('');

  Array.from(feedList.querySelectorAll('.remove-button')).forEach((btn) =>
    btn.addEventListener('click', onRemoveFeed)
  );

  Array.from(feedList.querySelectorAll('.feed-button')).forEach((btn) =>
    btn.addEventListener('click', onFeedSelect)
  );
}

export async function checkForFeedUpdates() {
  const updateButton = getCheckUpdateButton();
  updateButton.disabled = true;
  updateButton.classList.add(UPDATE_LOADING_CLASS);

  const updatedFeeds = await checkFeedsForUpdates();
  const updatedCount = updatedFeeds.length;

  if (updatedCount) {
    renderFeedList(updatedFeeds);
  }

  updateButton.disabled = false;
  updateButton.classList.remove(UPDATE_LOADING_CLASS);
}
