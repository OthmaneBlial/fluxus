import { describe, expect, it, vi } from 'vitest';
import { createStore } from '../../src';
import { applyMiddleware } from '../../src/core/middleware';
import type { Middleware, Reducer } from '../../src/types';

type State = { count: number };
const initialState: State = { count: 0 };
const reducer: Reducer<State> = (state = initialState, action) =>
  action.type === 'INCREMENT' ? { count: state.count + 1 } : state;

describe('middleware composition', () => {
  it('runs two middlewares in declared order around one dispatch', () => {
    const calls: string[] = [];
    const first: Middleware<State> = (api) => (next) => (action) => {
      calls.push(`first before ${api.getState().count}`);
      next(action);
      calls.push(`first after ${api.getState().count}`);
    };
    const second: Middleware<State> = () => (next) => (action) => {
      calls.push('second before');
      next(action);
      calls.push('second after');
    };
    const store = createStore(reducer, initialState, [first, second]);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toEqual({ count: 1 });
    expect(calls).toEqual(['first before 0', 'second before', 'second after', 'first after 1']);
  });

  it('can suppress an action without notifying listeners', () => {
    const blocker: Middleware<State> = () => (next) => (action) => {
      if (action.type !== 'BLOCK') next(action);
    };
    const store = createStore(reducer, initialState, [blocker]);
    const listener = vi.fn();
    store.subscribe(listener);
    store.dispatch({ type: 'BLOCK' });
    expect(store.getState()).toBe(initialState);
    expect(listener).not.toHaveBeenCalled();
  });

  it('routes an API dispatch through the enhanced dispatch', () => {
    const followUp: Middleware<State> = (api) => (next) => (action) => {
      next(action);
      if (action.type === 'INCREMENT') api.dispatch({ type: 'INCREMENT_AGAIN' });
    };
    const countBoth: Reducer<State> = (state = initialState, action) =>
      action.type === 'INCREMENT' || action.type === 'INCREMENT_AGAIN'
        ? { count: state.count + 1 }
        : state;
    const store = createStore(countBoth, initialState, [followUp]);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState().count).toBe(2);
  });

  it('exposes the same middleware contract through applyMiddleware', () => {
    const store = createStore(reducer, initialState);
    const seen: string[] = [];
    const logger: Middleware<State> = () => (next) => (action) => {
      seen.push(action.type);
      next(action);
    };
    const enhancedDispatch = applyMiddleware([logger], store);
    enhancedDispatch({ type: 'INCREMENT' });
    expect(seen).toEqual(['INCREMENT']);
    expect(store.getState().count).toBe(1);
  });
});
