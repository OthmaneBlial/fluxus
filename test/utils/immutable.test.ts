import { describe, it, expect } from 'vitest';
import { updateObject, updateArray } from '../../src/utils/immutable';

describe('immutable utils', () => {
  describe('updateObject', () => {
    it('should create a new object with updated properties', () => {
      const original = { a: 1, b: 2, c: 3 };
      const updated = updateObject(original, { b: 20, c: 40 });
      expect(updated).toEqual({ a: 1, b: 20, c: 40 });
      expect(updated).not.toBe(original);
    });
  });

  describe('updateArray', () => {
    it('should create a new array with an updated element', () => {
      const original = [1, 2, 3, 4];
      const updated = updateArray(original, 2, 30);
      expect(updated).toEqual([1, 2, 30, 4]);
      expect(updated).not.toBe(original);
    });

    it('should throw an error for out of bounds index', () => {
      const original = [1, 2, 3];
      expect(() => updateArray(original, 3, 4)).toThrow('Index out of bounds');
    });
  });
});