import getRandomEnum from '../../src/utils/getRandomEnum';

enum Test1 {
  Zero,
  One,
  Two
}

enum Test2 {
  Zero = 'Zero',
  One = 'One',
  Two = 'Two'
}

it('should get random enum value from provided enum', () => {
  [Test1, Test2]
    .map((x) => [x, getRandomEnum(x)])
    .forEach((input, output) => expect(output in input).toBeTruthy());
});
