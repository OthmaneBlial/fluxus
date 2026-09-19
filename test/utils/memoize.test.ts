import { describe, it, expect, vi } from 'vitest';
import { memoize } from '../../src/utils/memoize';

describe('memoize', () => {
  it('should memoize function results', () => {
    const expensiveFunction = vi.fn((x: number) => x * 2);
    const memoizedFunction = memoize(expensiveFunction);

    expect(memoizedFunction(5)).toBe(10);
    expect(memoizedFunction(5)).toBe(10);
    expect(expensiveFunction).toHaveBeenCalledTimes(1);

    expect(memoizedFunction(6)).toBe(12);
    expect(expensiveFunction).toHaveBeenCalledTimes(2);
  });

  it('evicts an older argument and caches undefined results', () => {
    const fn = vi.fn((value: number) => value === 0 ? undefined : value);
    const memoized = memoize(fn);
    expect(memoized(0)).toBeUndefined();
    expect(memoized(0)).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);
    memoized(1);
    memoized(0);
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
