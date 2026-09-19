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

    it('adds own properties and keeps the source untouched', () => {
      const original: { a: number; b?: number } = { a: 1 };
      const updated = updateObject(original, { b: 2 });
      expect(updated).toEqual({ a: 1, b: 2 });
      expect(original).toEqual({ a: 1 });
      expect(updated).not.toBe(original);
    });

    it('copies enumerable symbols without changing the prototype', () => {
      const key = Symbol('key');
      const original = { [key]: 1 };
      const updated = updateObject(original, { [key]: 2 });
      expect(updated[key]).toBe(2);
      expect(Object.getPrototypeOf(updated)).toBe(Object.prototype);
      expect(original[key]).toBe(1);
    });

    it('keeps an own __proto__ update as data', () => {
      const updates = Object.defineProperty({}, '__proto__', {
        value: { polluted: true }, enumerable: true,
      });
      const updated = updateObject({ a: 1 }, updates);
      expect(Object.getPrototypeOf(updated)).toBe(Object.prototype);
      expect(Object.prototype.hasOwnProperty.call(updated, '__proto__')).toBe(true);
    });

    it('rejects class instances rather than producing a broken clone', () => {
      class Value { constructor(public n: number) {} }
      expect(() => updateObject(new Value(1), { n: 2 })).toThrow('plain object');
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
      expect(() => updateArray(original, Number.NaN, 4)).toThrow('Index out of bounds');
      expect(() => updateArray(original, 1.5, 4)).toThrow('Index out of bounds');
    });

    it('preserves holes in sparse arrays', () => {
      const original = new Array<number>(3);
      original[0] = 1;
      original[2] = 3;
      const updated = updateArray(original, 0, 9);
      expect(updated[0]).toBe(9);
      expect(1 in updated).toBe(false);
      expect(original[0]).toBe(1);
    });
  });
});
