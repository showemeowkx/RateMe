export const productGen = async function* (array, showSize) {
  let i = 0;
  while (i < array.length) {
    await new Promise((res) => setTimeout(res, 100));
    yield array.slice(i, i + showSize);
    i += showSize;
  }
};
