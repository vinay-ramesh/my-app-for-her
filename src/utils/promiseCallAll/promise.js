export default function promiseAllCall(promises) {
  return Promise.all(
    promises.map(async (m) => {
      try {
        return await m;
      } catch (e) {
        if (e instanceof Error) return e;
        return new Error(e);
      }
    }),
  );
}
