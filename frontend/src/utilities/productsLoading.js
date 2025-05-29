export const productGen = async function* (array, showSize) {
  let i = 0;
  while (i < array.length) {
    yield array.slice(i, i + showSize);
    i += showSize;
  }
};
