/*tslint:disable:no-bitwise*/

const generateUniqueId = (): string =>
  (`${1e7}` + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (s) => {
    const c: number = Number(s);
    return (
      c ^
      (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16);
  });

export default generateUniqueId;
