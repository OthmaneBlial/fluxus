/** Cache only the most recent argument and result, comparing arguments with Object.is. */
export function memoize<T, R>(fn: (arg: T) => R): (arg: T) => R {
  let hasValue = false;
  let lastArgument: T;
  let lastResult: R;

  return (arg: T): R => {
    if (hasValue && Object.is(lastArgument, arg)) return lastResult;
    lastResult = fn(arg);
    lastArgument = arg;
    hasValue = true;
    return lastResult;
  };
}
