import { Reducer } from './reducer';
import { Action, Middleware } from '../types';
import { memoize } from '../utils/memoize';
import { IStore } from '../types';
import { applyMiddleware } from './middleware';

/**
 * The Store class is the heart of Fluxus. It holds the state of your application,
 * allows you to dispatch actions, and notifies listeners of state changes.
 * 
 * @template S The type of state held in the store.
 */
export class Store<S> implements IStore<S> {
  private state: S;
  private reducer: Reducer<S>;
  private listeners: Set<() => void> = new Set();
  private memoizedSelectors: Map<Function, Function> = new Map();
  private isReducing = false;

  /**
   * Creates a new Store instance.
   * 
   * @param reducer The root reducer function.
   * @param initialState The initial state of the application.
   * @param middlewares An optional array of middleware functions.
   */
  constructor(reducer: Reducer<S>, initialState: S, middlewares: Middleware<S>[] = []) {
    this.state = initialState;
    this.reducer = reducer;
    if (middlewares.length > 0) {
      this.dispatch = applyMiddleware(middlewares, this);
    }
  }

  /**
   * Retrieves the current state of the store.
   * 
   * @returns The current state.
   */
  getState(): S {
    return this.state;
  }

  /**
   * Dispatches an action to trigger a state change.
   * 
   * @param action The action to dispatch.
   */
  dispatch(action: Action): void {
    if (!action || !Object.prototype.hasOwnProperty.call(action, 'type') || typeof action.type !== 'string') {
      throw new TypeError('Action must have a string type');
    }
    if (this.isReducing) {
      throw new Error('Reducers may not dispatch actions');
    }

    let nextState: S;
    this.isReducing = true;
    try {
      nextState = this.reducer(this.state, action);
    } finally {
      this.isReducing = false;
    }
    if (nextState === undefined) {
      throw new Error('Reducer returned undefined');
    }
    this.state = nextState;
    this.notifyListeners();
  }

  /**
   * Adds a listener to be called after every dispatch.
   * 
   * @param listener The callback function to be invoked on state changes.
   * @returns A function to unsubscribe the listener.
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Applies a selector function to the current state, with memoization.
   * 
   * @param selector A function that accepts the state and returns a derived value.
   * @returns The result of the selector function.
   */
  select<R>(selector: (state: S) => R): R {
    if (!this.memoizedSelectors.has(selector)) {
      this.memoizedSelectors.set(selector, memoize(selector));
    }
    return (this.memoizedSelectors.get(selector) as Function)(this.state);
  }

  /**
   * Notifies all registered listeners of a state change.
   */
  private notifyListeners(): void {
    for (const listener of [...this.listeners]) {
      if (this.listeners.has(listener)) listener();
    }
  }
}
