export const asyncDecorator = (
  asyncFn,
  { onStart, onSuccess, onError, onFinish } = {}
) => {
  return async function (...args) {
    try {
      if (onStart) onStart();

      const start = performance.now();
      const result = await asyncFn(...args);
      const end = performance.now();

      console.log(`Async function took ${(end - start).toFixed(2)} ms`);

      if (onSuccess) onSuccess(result);

      return result;
    } catch (error) {
      if (onError) onError(error);
    } finally {
      if (onFinish) onFinish();
    }
  };
};
