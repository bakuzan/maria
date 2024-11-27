import checkAndPlayAudio from '../../src/tabStore/audio';

describe('checkAndPlayAudio', () => {
  let originalAudio;

  beforeAll(() => {
    // Save the original Audio constructor
    originalAudio = window.Audio;
  });

  beforeEach(() => {
    // Mock the Audio constructor
    window.Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn()
    }));
  });

  afterEach(() => {
    // Clear the mocks after each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore the original Audio constructor
    window.Audio = originalAudio;
  });

  it('should do nothing if there is no src param', async () => {
    await checkAndPlayAudio();

    expect(window.Audio).not.toHaveBeenCalled();
  });

  it('should create Audio with src param', async () => {
    // Mock window.location.search
    const locationSpy = jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      search: '?src=test.mp3'
    } as Location);

    // Mock Audio constructor and its methods
    const audioPlayMock = jest.fn().mockResolvedValueOnce(undefined);
    const addEventListenerMock = jest.fn();

    (window.Audio as jest.Mock).mockImplementation(() => ({
      play: audioPlayMock,
      addEventListener: addEventListenerMock
    }));

    // Act
    await checkAndPlayAudio();

    expect(window.Audio).toHaveBeenCalledWith('test.mp3');
    expect(audioPlayMock).toHaveBeenCalled();

    // Restore the original window.location after the test
    locationSpy.mockRestore();
  });
});
