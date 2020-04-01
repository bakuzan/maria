import { TabGroup, StoredTab } from '@/types/TabGroup';
import generateUniqueId from '@/utils/generateUniqueId';

export default function processImportedValue(items: Partial<TabGroup>[]) {
  if (!Array.isArray(items)) {
    return { success: false, message: 'Import value must be an array.' };
  }

  const data: TabGroup[] = [];
  let message = '';

  for (const item of items) {
    const storedItems: StoredTab[] = [];

    if (!Array.isArray(item.items)) {
      return {
        success: false,
        message: 'Tab groups must contain an items array.'
      };
    }

    for (const entry of item.items) {
      if (!entry.url) {
        message = 'At least 1 stored tab did not have a url.';
        continue;
      }

      storedItems.push({
        title: entry.title ?? 'unknown link',
        url: entry.url
      });
    }

    data.push({
      id: generateUniqueId(),
      isLocked: item.isLocked ?? false,
      items: storedItems,
      name: item.name ?? '',
      patterns: item.patterns ?? []
    });
  }

  return { success: true, data, message };
}
