/**
 * Creates a new object with the same properties as the original, but with specified properties updated.
 * This function provides a more efficient way to create immutable updates than Object.assign or spread.
 * 
 * @template T The type of the object
 * @param obj The original object
 * @param updates An object containing the properties to update
 * @returns A new object with the updates applied
 */
export function updateObject<T extends object>(obj: T, updates: Partial<T>): T {
    const result: T = Object.create(Object.getPrototypeOf(obj));
    const keys = Object.keys(obj) as (keyof T)[];
    
    for (const key of keys) {
      result[key] = key in updates ? updates[key]! : obj[key];
    }
  
    return result;
  }
  
  /**
   * Creates a new array with an element updated at the specified index.
   * 
   * @template T The type of array elements
   * @param array The original array
   * @param index The index of the element to update
   * @param newValue The new value for the element
   * @returns A new array with the update applied
   */
  export function updateArray<T>(array: T[], index: number, newValue: T): T[] {
    if (index < 0 || index >= array.length) {
      throw new Error('Index out of bounds');
    }
    const result = new Array(array.length);
    for (let i = 0; i < array.length; i++) {
      result[i] = i === index ? newValue : array[i];
    }
    return result;
  }