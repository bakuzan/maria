import Parser, { mockParseURL } from '../../__mocks__/rss-parser';
import { mockBrowser, mockBrowserNode } from '../__helpers/browser';

import {
  checkFeedsForUpdates,
  getLastUpdateDate,
  getUnreadFeeds,
  updateBadge
} from '../../src/utils/rssFeedChecks';
import { storageDefaults } from '../../src/utils/getStorage';

beforeEach(() => mockBrowserNode.enable());

afterEach(() => mockBrowserNode.verifyAndDisable());

describe('updateBadge', () => {
  it('should set badge text when has no feed updates', async () => {
    const input = [{ name: 'nohing', link: 'https', hasUnread: false }];

    mockBrowser.browserAction.setBadgeBackgroundColor
      .expect(expect.anything())
      .times(1);

    mockBrowser.browserAction.setBadgeText.expect({ text: '' }).times(1);

    await updateBadge(input);
  });

  it('should set badge text when has feed updates', async () => {
    const input = [{ name: 'nohing', link: 'https', hasUnread: true }];

    mockBrowser.browserAction.setBadgeBackgroundColor
      .expect(expect.anything())
      .times(1);

    mockBrowser.browserAction.setBadgeText.expect({ text: '1' }).times(1);

    await updateBadge(input);
  });
});

describe('getLastUpdateDate', () => {
  it('should return hasDate false when no date present', () => {
    const data = { items: [] };

    const result = getLastUpdateDate(data);

    expect(result.hasDate).toBeFalsy();
  });

  it('should return hasDate true when date present', () => {
    const pubDate = new Date(2020, 12, 7);
    const data = { items: [{ pubDate: pubDate.toISOString() }] };

    const result = getLastUpdateDate(data);

    expect(result.hasDate).toBeTruthy();
    expect(result.lastUpdate).toEqual(pubDate.getTime());
  });
});

describe('checkFeedsForUpdates', () => {
  beforeEach(() => {
    Parser.mockClear();
    mockParseURL.mockClear();
  });

  it('should have no updates', async () => {
    const lastUpdate = new Date(2020, 12, 8);
    const feeds = [
      { name: 'nohing', link: 'https', lastUpdate, hasUnread: false }
    ];

    mockParseURL.mockImplementationOnce(() => ({
      items: [{ pubDate: new Date(2020, 12, 8) }]
    }));

    const spyConsole = jest
      .spyOn(console, 'log')
      .mockImplementation(() => null);

    mockBrowser.storage.local.get
      .expect(storageDefaults)
      .andResolve({ ...storageDefaults, feeds })
      .times(1);

    const result = await checkFeedsForUpdates();

    expect(result.length).toEqual(0);
    expect(spyConsole).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      `RSS Feed ${feeds[0].name} has no update.`
    );
  });

  it('should have updates', async () => {
    const feeds = [
      { name: 'nohing', link: 'https', lastUpdate: undefined, hasUnread: false }
    ];

    mockParseURL.mockImplementationOnce(() => ({
      items: [{ pubDate: new Date(2020, 12, 1) }]
    }));

    const spyConsole = jest
      .spyOn(console, 'log')
      .mockImplementation(() => null);

    mockBrowser.storage.local.get
      .expect(storageDefaults)
      .andResolve({ ...storageDefaults, feeds })
      .times(2);

    mockBrowser.storage.local.set.expect(expect.anything()).times(1);

    const result = await checkFeedsForUpdates();

    expect(result.length).toEqual(1);
    expect(result[0].link).toEqual(feeds[0].link);
    expect(result[0].hasUnread).toBeTruthy();
    expect(spyConsole).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      `RSS Feed ${feeds[0].name} updated!`
    );
  });
});

describe('getUnreadFeeds', () => {
  it('should return empty array when no unread feeds', async () => {
    const feeds = [{ name: 'nohing', link: 'https', hasUnread: false }];

    mockBrowser.storage.local.get
      .expect(storageDefaults)
      .andResolve({ ...storageDefaults, feeds })
      .times(1);

    const result = await getUnreadFeeds();

    expect(result.length).toEqual(0);
  });

  it('should return unread feeds', async () => {
    const feeds = [{ name: 'nohing', link: 'https', hasUnread: true }];

    mockBrowser.storage.local.get
      .expect(storageDefaults)
      .andResolve({ ...storageDefaults, feeds })
      .times(1);

    const result = await getUnreadFeeds();

    expect(result.length).toEqual(1);
  });
});
