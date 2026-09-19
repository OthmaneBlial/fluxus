import { describe, it, expect } from 'vitest';
import { createAction } from '../../src/core/action';

describe('createAction', () => {
  it('should create an action creator without payload', () => {
    const increment = createAction('INCREMENT');
    expect(increment()).toEqual({ type: 'INCREMENT' });
    expect(Object.keys(increment())).toEqual(['type']);
    expect(Object.prototype.hasOwnProperty.call(increment(), 'payload')).toBe(false);
  });

  it('should create an action creator with payload', () => {
    const addTodo = createAction<string>('ADD_TODO');
    expect(addTodo('Buy milk')).toEqual({ type: 'ADD_TODO', payload: 'Buy milk' });
  });

  it('should keep an explicitly provided undefined payload', () => {
    const clear = createAction<undefined>('CLEAR');
    expect(Object.prototype.hasOwnProperty.call(clear(undefined), 'payload')).toBe(true);
  });

  it('can declare a payload without changing the runtime action creator', () => {
    const add = createAction('counter/add');
    const typedAdd = add.withPayload<number>();
    expect(typedAdd).toBe(add);
    expect(typedAdd.type).toBe('counter/add');
    expect(typedAdd(2)).toEqual({ type: 'counter/add', payload: 2 });
  });
});
