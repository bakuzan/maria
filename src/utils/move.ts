const move = (arr: any[], from: number, to: number) =>
  arr.map((item, i) => (i === from ? arr[to] : i === to ? arr[from] : item));

export default move;
