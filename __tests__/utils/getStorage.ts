import getStorage, { storageDefaults } from '../../src/utils/getStorage';

it('should return defaults', async () => {
  mockBrowser.storage.local.get
    .expect(storageDefaults)
    .andResolve({ ...storageDefaults })
    .times(1);

  const result = await getStorage();

  expect(result).toEqual(storageDefaults);
});

it('should return current store', async () => {
  const newValues = { test: 'something' };

  mockBrowser.storage.local.get
    .expect(storageDefaults)
    .andResolve({ ...storageDefaults, ...newValues })
    .times(1);

  const result = await getStorage();

  expect(result).toEqual({ ...storageDefaults, ...newValues });
});
