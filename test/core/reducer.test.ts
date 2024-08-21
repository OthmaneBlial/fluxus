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
});