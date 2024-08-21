/**
 * A simple memoization function to cache the results of expensive computations.
 * This implementation uses a single argument for simplicity, but can be extended for multiple arguments.
 * 
 * @template T The type of the function argument
 * @template R The return type of the function
 * @param fn The function to memoize
 * @returns A memoized version of the input function
 */
export function memoize<T, R>(fn: (arg: T) => R): (arg: T) => R {
    const cache = new Map<T, R>();
  
    return (arg: T): R => {
      if (cache.has(arg)) {
        return cache.get(arg)!;
      }
      const result = fn(arg);
      cache.set(arg, result);
      return result;
    };
  }