/**
 * A simple implementation of lazy evaluation.
 * It delays the computation of a value until it's needed and then caches the result.
 * 
 * @template T The type of the value to be lazily evaluated
 * @param computation A function that computes the value
 * @returns An object with a `get` method to retrieve the lazily computed value
 */
export function lazy<T>(computation: () => T): { get: () => T } {
    let value: T | undefined;
    let computed = false;
  
    return {
      get: () => {
        if (!computed) {
          value = computation();
          computed = true;
        }
        return value!;
      }
    };
  }
  
  /**
   * Measures the execution time of a function.
   * Useful for performance testing and optimization.
   * 
   * @param fn The function to measure
   * @returns A tuple containing the result of the function and the execution time in milliseconds
   */
  export function measureTime<T>(fn: () => T): [T, number] {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    return [result, end - start];
  }