/*tslint:disable:no-bitwise*/

function getRandomValues(array: Uint8Array) {
  for (let i = 0, l = array.length; i < l; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }

  return array;
}

const generateUniqueId = (): string =>
  (`${1e7}` + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (s) => {
    const c: number = Number(s);
    return (
      c ^
      (getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16);
  });

export default generateUniqueId;
