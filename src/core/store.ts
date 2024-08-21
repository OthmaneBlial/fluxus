import { Reducer } from './reducer'
import { Middleware, MiddlewareAPI } from '../types'
import { memoize } from '../utils/memoize';
import { IStore } from '../types';

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

  /**
   * Creates a new Store instance.
   * 
   * @param reducer The root reducer function.
   * @param initialState The initial state of the application.
   * @param middlewares An optional array of middleware functions.
   */
  constructor(reducer: Reducer<S>, initialState: S, middlewares: Middleware[] = []) {
    this.state = initialState;
    this.reducer = reducer;
    
    // Apply middlewares
    this.applyMiddlewares(middlewares);
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
  dispatch(action: any): void {
    console.log('Dispatching action:', action);
    const oldState = this.state;
    this.state = this.reducer(this.state, action);
    console.log('State updated. Old:', oldState, 'New:', this.state);
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
    this.listeners.forEach(listener => listener());
  }

  /**
   * Applies the middleware chain to the dispatch function.
   * 
   * @param middlewares An array of middleware functions.
   */
  private applyMiddlewares(middlewares: Middleware[]): void {
    if (middlewares.length > 0) {
      const middlewareAPI: MiddlewareAPI<S> = {
        getState: this.getState.bind(this),
        dispatch: (action: any) => this.dispatch(action)
      };
      const chain = middlewares.map(middleware => middleware(middlewareAPI));
      this.dispatch = chain.reduce((a, b) => (next: any) => a(b(next)))(this.dispatch.bind(this));
    }
  }
}