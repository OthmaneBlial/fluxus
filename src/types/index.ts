/**
 * Represents an action in the Fluxus system.
 * Actions are payloads of information that send data from your application to your store.
 */
export interface Action<T = any> {
    type: string;
    payload?: T;
  }
  
  /**
   * A function that creates an action.
   */
  export type ActionCreator<T = void> = T extends void
    ? () => Action
    : (payload: T) => Action<T>;
  
  /**
   * A reducer function takes the current state and an action, and returns a new state.
   */
  export type Reducer<S = any, A extends Action = Action> = (
    state: S | undefined,
    action: A
  ) => S;
  
  /**
   * Middleware is a higher-order function that composes a dispatch function to enable
   * features like dispatching async actions, routing, etc.
   */
  export interface MiddlewareAPI<S = any> {
    getState: () => S;
    dispatch: (action: any) => void;
  }
  
  export type Middleware = <S>(api: MiddlewareAPI<S>) => 
    (next: (action: any) => void) => (action: any) => void;
  
  /**
   * Represents the Fluxus store, which holds the complete state tree of your app.
   */
  export interface IStore<S = any> {
    /**
     * Dispatches an action. This is the only way to trigger a state change.
     */
    dispatch(action: Action): void;
  
    /**
     * Returns the current state tree of your application.
     */
    getState(): S;
  
    /**
     * Adds a change listener. It will be called any time an action is dispatched,
     * and some part of the state tree may potentially have changed.
     */
    subscribe(listener: () => void): () => void;
  
    /**
     * Applies a selector function to the current state, with memoization.
     */
    select<R>(selector: (state: S) => R): R;
  }
  
  /**
   * A function that creates a new store.
   */
  export type StoreCreator = <S>(
    reducer: Reducer<S>,
    initialState: S,
    middlewares?: Middleware[]
  ) => IStore<S>;
  
  /**
   * Options for creating a store.
   */
  export interface CreateStoreOptions<S> {
    reducer: Reducer<S>;
    initialState: S;
    middlewares?: Middleware[];
  }