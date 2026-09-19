/**
 * Shallowly copies a plain object, then applies its enumerable own updates.
 * Enumerable symbol keys are copied; inherited and non-enumerable keys are not.
 * A fresh object is returned even when every value is unchanged.
 */
export function updateObject<T extends object>(obj: T, updates: Partial<T>): T {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new TypeError('updateObject requires a plain object');
  }
  const prototype = Object.getPrototypeOf(obj);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError('updateObject requires a plain object');
  }
  if (updates === null || typeof updates !== 'object') {
    throw new TypeError('updateObject requires an updates object');
  }

  const result = Object.create(prototype) as T;
  for (const source of [obj, updates]) {
    for (const key of Reflect.ownKeys(source)) {
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      Object.defineProperty(result, key, {
        value: (source as Record<PropertyKey, unknown>)[key],
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  }
  return result;
}

/** Return a shallow array copy with one valid integer index replaced. */
export function updateArray<T>(array: T[], index: number, newValue: T): T[] {
  if (!Array.isArray(array) || !Number.isInteger(index) || index < 0 || index >= array.length) {
    throw new Error('Index out of bounds');
  }
  const result = array.slice();
  result[index] = newValue;
  return result;
}
