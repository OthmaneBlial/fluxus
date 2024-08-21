import { describe, it, expect, vi } from 'vitest';
import { Store } from '../../src/core/store';
import { Action, Reducer } from '../../src/types';

describe('Store', () => {
  const initialState = { count: 0 };
  
  const reducer: Reducer<typeof initialState> = (state = initialState, action: Action) => {
    switch (action.type) {
      case 'INCREMENT':
        return { ...state, count: state.count + 1 };
      default:
        return state;
    }
  };

  it('should initialize with the given state', () => {
    const store = new Store(reducer, initialState);
    expect(store.getState()).toEqual(initialState);
  });

  it('should update state when an action is dispatched', () => {
    const store = new Store(reducer, initialState);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toEqual({ count: 1 });
  });

  it('should notify subscribers when state changes', () => {
    const store = new Store(reducer, initialState);
    const listener = vi.fn();
    store.subscribe(listener);
    store.dispatch({ type: 'INCREMENT' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe listeners', () => {
    const store = new Store(reducer, initialState);
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.dispatch({ type: 'INCREMENT' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('should memoize selectors', () => {
    const store = new Store(reducer, initialState);
    const selector = vi.fn((state: typeof initialState) => state.count);
    store.select(selector);
    store.select(selector);
    expect(selector).toHaveBeenCalledTimes(1);
  });
});