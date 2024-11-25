import processImportedValue from '../../src/exportImport/processImportedValue';

it('should return error if import is not an object', () => {
  const result = processImportedValue(undefined);

  expect(result.success).toBeFalsy();
  expect(result.messages.pop()).toEqual('Import value must be an object.');
});

it('should return empty default when input is empty', () => {
  const result = processImportedValue({});

  if (!result.data) {
    throw new Error("result.data should not be undefined")
  }

  expect(result.success).toBeTruthy();
  expect(result.messages.length).toEqual(0);
  expect(result.data.digitOptions).toEqual([]);
  expect(result.data.feeds).toEqual([]);
  expect(result.data.tabGroups).toEqual([]);
});

it('should process feeds', () => {
  const feeds = [
    { name: 'test', link: 'fake', hasUnread: false },
    { name: undefined, link: undefined, hasUnread: undefined }
  ];
  const expected = feeds.slice(0, 1);

  const result = processImportedValue({ feeds });

  if (!result.data) {
    throw new Error("result.data should not be undefined")
  }

  expect(result.success).toBeTruthy();
  expect(result.messages.pop()).toEqual(
    'Skipped a feed as it did not have a name or url.'
  );
  expect(result.data.feeds).toEqual(expected);
});

it('should prevent item-less tab groups', () => {
  const tabGroups = [
    {
      id: undefined,
      name: 'test',
      items: undefined,
      patterns: undefined,
      isLocked: false
    }
  ];

  const result = processImportedValue({ tabGroups });

  expect(result.success).toBeFalsy();
  expect(result.messages.pop()).toEqual(
    'Tab groups must contain an items array.'
  );
});

it('should process tab groups', () => {
  const tabGroups = [
    {
      id: undefined,
      name: 'test2',
      items: [
        { title: 'first', url: 'https' },
        { title: undefined, url: 'https' },
        { title: undefined, url: undefined }
      ],
      isLocked: false,
      patterns: []
    },
    {
      id: undefined,
      name: 'test3',
      items: [{ title: 'second', url: 'http' }],
      isLocked: undefined,
      patterns: undefined
    }
  ];

  const result = processImportedValue({ tabGroups });

  if (!result.data) {
    throw new Error("result.data should not be undefined")
  }

  const tg = result.data.tabGroups[0];

  expect(result.success).toBeTruthy();
  expect(result.messages.pop()).toEqual(
    'Skipped a stored tab as it did not have a url.'
  );
  expect(tg.isLocked).toBeFalsy();
  expect(tg.name).toEqual('test2');
  expect(tg.patterns).toEqual([]);
  expect(tg.items.length).toEqual(2);
  expect(tg.items[0].title).toEqual('first');
  expect(tg.items[1].title).toEqual('unknown link');
});
