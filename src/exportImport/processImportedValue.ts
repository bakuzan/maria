import { Feed } from '@/types/Feed';
import { MariaStore } from '@/types/MariaStore';
import { Redirect } from '@/types/Redirect';
import { TabGroup, StoredTab } from '@/types/TabGroup';

import generateUniqueId from '@/utils/generateUniqueId';

export default function processImportedValue(input: Partial<MariaStore>) {
  if (!input || typeof input !== 'object') {
    return { success: false, messages: ['Import value must be an object.'] };
  }

  const messages = [];

  // Digit options processing
  const digitOptions = input.digitOptions ?? [];

  // Feeds processing
  const inputFeeds = input.feeds ?? [];
  const feeds: Feed[] = [];

  for (const item of inputFeeds) {
    if (!item.link || !item.link.trim() || !item.name || !item.name.trim()) {
      messages.push('Skipped a feed as it did not have a name or url.');
      continue;
    }

    feeds.push({
      name: item.name,
      link: item.link,
      hasUnread: false
    });
  }

  // Redirects processing
  const inputRedirects = input.redirects ?? [];
  const redirects: Redirect[] = [];

  for (const item of inputRedirects) {
    if (
      !item.fromPattern ||
      !item.fromPattern.trim() ||
      !item.toPattern ||
      !item.toPattern.trim()
    ) {
      messages.push('Skipped a redirect as it did not have a both patterns.');
      continue;
    }

    redirects.push({
      id: generateUniqueId(),
      fromPattern: item.fromPattern,
      toPattern: item.toPattern
    });
  }

  // Tab Group processing
  const inputTabGroups = input.tabGroups ?? [];
  const tabGroups: TabGroup[] = [];

  for (const item of inputTabGroups) {
    const storedItems: StoredTab[] = [];

    if (!Array.isArray(item.items)) {
      return {
        success: false,
        messages: ['Tab groups must contain an items array.']
      };
    }

    for (const entry of item.items) {
      if (!entry.url || !entry.url.trim()) {
        messages.push('Skipped a stored tab as it did not have a url.');
        continue;
      }

      storedItems.push({
        title: entry.title ?? 'unknown link',
        url: entry.url
      });
    }

    tabGroups.push({
      id: generateUniqueId(),
      isLocked: item.isLocked ?? false,
      items: storedItems,
      name: item.name ?? '',
      patterns: item.patterns ?? []
    });
  }

  return {
    success: true,
    data: { digitOptions, feeds, redirects, tabGroups },
    messages
  };
}
