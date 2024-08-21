import { describe, it, expect } from 'vitest';
import { createAction } from '../../src/core/action';

describe('createAction', () => {
  it('should create an action creator without payload', () => {
    const increment = createAction('INCREMENT');
    expect(increment()).toEqual({ type: 'INCREMENT' });
  });

  it('should create an action creator with payload', () => {
    const addTodo = createAction<string>('ADD_TODO');
    expect(addTodo('Buy milk')).toEqual({ type: 'ADD_TODO', payload: 'Buy milk' });
  });
});