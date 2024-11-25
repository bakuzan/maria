import getActiveTab from '../../src/utils/getActiveTab';

const tabExample = {
  index: 1999,
  active: true,
  highlighted: true,
  pinned: false,
  incognito: false
};

it('should return the active tab', async () => {
  mockBrowser.tabs.query
    .expect({ active: true, currentWindow: true })
    .andResolve([tabExample])
    .times(1);

  const result = await getActiveTab();

  expect(result.index).toEqual(1999);
});
