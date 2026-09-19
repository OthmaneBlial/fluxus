import { describe, it, expect } from 'vitest';
import { createReducer } from '../../src/core/reducer';

describe('createReducer', () => {
  const initialState = { count: 0 };

  it('should create a reducer that handles specified actions', () => {
    const reducer = createReducer(initialState, {
      INCREMENT: (state) => ({ ...state, count: state.count + 1 }),
      DECREMENT: (state) => ({ ...state, count: state.count - 1 }),
    });

    expect(reducer(undefined, { type: 'INCREMENT' })).toEqual({ count: 1 });
    expect(reducer({ count: 5 }, { type: 'DECREMENT' })).toEqual({ count: 4 });
  });

  it('should return the current state for unhandled actions', () => {
    const reducer = createReducer(initialState, {
      INCREMENT: (state) => ({ ...state, count: state.count + 1 }),
    });

    expect(reducer({ count: 5 }, { type: 'UNKNOWN' })).toEqual({ count: 5 });
  });

  it('ignores inherited object properties as action types', () => {
    const reducer = createReducer(initialState, { INCREMENT: (state) => ({ count: state.count + 1 }) });
    const state = { count: 5 };
    for (const type of ['toString', 'constructor', '__proto__']) {
      expect(reducer(state, { type })).toBe(state);
    }
  });

  it('rejects malformed actions and undefined reducer results', () => {
    const reducer = createReducer(initialState, {
      BAD: () => undefined as never,
    });
    expect(() => reducer(initialState, null as never)).toThrow('Action must have a string type');
    expect(() => reducer(initialState, { type: 42 } as never)).toThrow('Action must have a string type');
    expect(() => reducer(initialState, Object.create({ type: 'BAD' }) as never)).toThrow('Action must have a string type');
    expect(() => reducer(initialState, { type: 'BAD' })).toThrow('returned undefined');
  });
});
