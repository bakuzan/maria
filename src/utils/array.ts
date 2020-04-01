function insertItem(array: any[], index: number, item: any) {
  const newArray = array.slice();
  newArray.splice(index, 0, item);
  return newArray;
}

function removeItem(array: any[], index: number) {
  const newArray = array.slice();
  newArray.splice(index, 1);
  return newArray;
}

export function move(arr: any[], from: number, to: number) {
  const item = arr[from];
  const list = removeItem(arr, from);
  return insertItem(list, to, item);
}

export function uniqueItemsFilter<T>(extractor: (x: T) => any = (x) => x) {
  return (x: T, i: number, arr: T[]) =>
    arr.findIndex((a) => extractor(a) === extractor(x)) === i;
}
