import { chunk, move, uniqueItemsFilter } from '../../src/utils/array';

describe('chunk', () => {
  it('should cut array into chunks', () => {
    const size = 2;
    const input = Array(6).fill(0);

    const result = chunk(input, size);

    expect(result.length).toEqual(6 / 2);
    result.forEach((a) => expect(a.length).toEqual(size));
  });

  it('should leave remainder', () => {
    const size = 4;
    const input = Array(6).fill(0);

    const result = chunk(input, size);

    expect(result.length).toEqual(2);
    expect(result[0].length).toEqual(4);
    expect(result[1].length > 0).toBeTruthy();
  });
});

describe('move', () => {
  it('should move array item to new index (after)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const from = 2;
    const to = 4;

    const result = move(input, from, to);

    expect(result[from]).toEqual(input[from + 1]);
    expect(result[to]).toEqual(input[from]);
    expect(result[to - 1]).toEqual(input[to]);
  });

  it('should move array item to new index (before)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const from = 5;
    const to = 1;

    const result = move(input, from, to);

    expect(result[from]).toEqual(input[from - 1]);
    expect(result[to]).toEqual(input[from]);
    expect(result[to + 1]).toEqual(input[to]);
  });
});

describe('uniqueItemsFilter', () => {
  it('should filter array to unique entries', () => {
    const input = [1, 2, 1, 3, 4, 5];

    const result = input.filter(uniqueItemsFilter());

    expect(result.filter((x) => x === 1).length).toEqual(1);
  });

  it('should filter array to unique object properties', () => {
    const input = [
      { num: 1 },
      { num: 2 },
      { num: 1 },
      { num: 3 },
      { num: 4 },
      { num: 5 }
    ];

    const result = input.filter(uniqueItemsFilter((x) => x.num));

    expect(result.filter((x) => x.num === 1).length).toEqual(1);
  });
});
