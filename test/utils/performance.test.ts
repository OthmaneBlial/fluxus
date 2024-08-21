import { describe, it, expect, vi } from 'vitest';
import { lazy, measureTime } from '../../src/utils/performance';

describe('performance utils', () => {
  describe('lazy', () => {
    it('should delay computation until value is needed', () => {
      const expensiveComputation = vi.fn(() => 42);
      const lazyValue = lazy(expensiveComputation);

      expect(expensiveComputation).not.toHaveBeenCalled();

      const result = lazyValue.get();
      expect(result).toBe(42);
      expect(expensiveComputation).toHaveBeenCalledTimes(1);

      lazyValue.get(); // Should use cached value
      expect(expensiveComputation).toHaveBeenCalledTimes(1);
    });
  });

  describe('measureTime', () => {
    it('should measure execution time of a function', () => {
      const [result, time] = measureTime(() => {
        let sum = 0;
        for (let i = 0; i < 1000000; i++) {
          sum += i;
        }
        return sum;
      });

      expect(typeof result).toBe('number');
      expect(typeof time).toBe('number');
      expect(time).toBeGreaterThan(0);
    });
  });
});