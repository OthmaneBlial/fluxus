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

  it('recomputes a selector after a state transition and reuses the latest result', () => {
    const store = new Store(reducer, initialState);
    const selector = vi.fn((state: typeof initialState) => state.count * 2);
    expect(store.select(selector)).toBe(0);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.select(selector)).toBe(2);
    expect(store.select(selector)).toBe(2);
    store.dispatch({ type: 'UNKNOWN' });
    expect(store.select(selector)).toBe(2);
    expect(selector).toHaveBeenCalledTimes(2);
  });

  it('does not log actions or state during dispatch', () => {
    const methods = ['log', 'info', 'warn', 'error', 'debug'] as const;
    const spies = methods.map((method) => vi.spyOn(console, method).mockImplementation(() => {}));
    try {
      const secretState = { token: 'private-token' };
      new Store(() => secretState, secretState).dispatch({ type: 'REFRESH', payload: secretState.token });
      for (const spy of spies) expect(spy).not.toHaveBeenCalled();
    } finally {
      for (const spy of spies) spy.mockRestore();
    }
  });

  it('rejects an inherited action type before running a custom reducer', () => {
    const customReducer = vi.fn(reducer);
    const store = new Store(customReducer, initialState);
    expect(() => store.dispatch(Object.create({ type: 'INCREMENT' }))).toThrow('Action must have a string type');
    expect(customReducer).not.toHaveBeenCalled();
  });

  it('preserves state and skips notifications when a reducer fails', () => {
    const store = new Store<typeof initialState>(() => { throw new Error('failed'); }, initialState);
    const listener = vi.fn();
    store.subscribe(listener);
    expect(() => store.dispatch({ type: 'INCREMENT' })).toThrow('failed');
    expect(store.getState()).toBe(initialState);
    expect(listener).not.toHaveBeenCalled();
  });

  it('rejects an undefined reducer result without replacing state', () => {
    const store = new Store<typeof initialState>(() => undefined as never, initialState);
    expect(() => store.dispatch({ type: 'INCREMENT' })).toThrow('Reducer returned undefined');
    expect(store.getState()).toBe(initialState);
  });

  it('notifies after a successful dispatch even when state is unchanged', () => {
    const store = new Store(reducer, initialState);
    const listener = vi.fn();
    store.subscribe(listener);
    store.dispatch({ type: 'UNKNOWN' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('keeps committed state when a subscriber throws and stops that notification', () => {
    const store = new Store(reducer, initialState);
    const later = vi.fn();
    const unsubscribeThrowing = store.subscribe(() => { throw new Error('listener failed'); });
    store.subscribe(later);

    expect(() => store.dispatch({ type: 'INCREMENT' })).toThrow('listener failed');
    expect(store.getState().count).toBe(1);
    expect(later).not.toHaveBeenCalled();

    unsubscribeThrowing();
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState().count).toBe(2);
    expect(later).toHaveBeenCalledTimes(1);
  });

  it('does not cache a selector result when the selector throws', () => {
    const store = new Store(reducer, initialState);
    const selector = vi.fn(() => { throw new Error('selector failed'); });
    expect(() => store.select(selector)).toThrow('selector failed');
    expect(() => store.select(selector)).toThrow('selector failed');
    expect(selector).toHaveBeenCalledTimes(2);
  });

  it('uses a stable listener snapshot during dispatch', () => {
    const store = new Store(reducer, initialState);
    const calls: string[] = [];
    let removeSecond = () => {};
    store.subscribe(() => {
      calls.push('first');
      removeSecond();
      store.subscribe(() => calls.push('new'));
    });
    removeSecond = store.subscribe(() => calls.push('second'));
    store.dispatch({ type: 'INCREMENT' });
    expect(calls).toEqual(['first']);
  });

  it('allows nested dispatch from a listener but rejects it inside a reducer', () => {
    const store = new Store(reducer, initialState);
    store.subscribe(() => {
      if (store.getState().count === 1) store.dispatch({ type: 'INCREMENT' });
    });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState().count).toBe(2);

    let guardedStore: Store<typeof initialState>;
    const nestedReducer: Reducer<typeof initialState> = (state = initialState) => {
      guardedStore.dispatch({ type: 'INCREMENT' });
      return state;
    };
    guardedStore = new Store(nestedReducer, initialState);
    expect(() => guardedStore.dispatch({ type: 'INCREMENT' })).toThrow('Reducers may not dispatch actions');
    expect(guardedStore.getState()).toBe(initialState);
  });
});
