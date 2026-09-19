import { Action } from './action';

/**
 * A reducer function takes the current state and an action, and returns a new state.
 * 
 * @template S The type of state managed by this reducer.
 * @template A The type of actions this reducer can handle.
 */
export type Reducer<S = any, A extends Action = Action> = (
  state: S | undefined,
  action: A
) => S;

/**
 * A mapping of action types to reducer functions.
 */
type ReducerMap<S, A extends Action = Action> = {
  [K in A['type']]?: (state: S, action: Extract<A, { type: K }>) => S;
};

/**
 * Creates a reducer function from a reducer map and an initial state.
 * 
 * @param initialState The initial state of the reducer.
 * @param reducerMap An object mapping action types to reducer functions.
 * @returns A reducer function.
 */
export function createReducer<S, A extends Action = Action, M extends ReducerMap<S, A> = ReducerMap<S, A>>(
  initialState: S,
  reducerMap: M
): Reducer<S, A> {
  return (state = initialState, action: A) => {
    if (!action || !Object.prototype.hasOwnProperty.call(action, 'type') || typeof action.type !== 'string') {
      throw new TypeError('Action must have a string type');
    }
    if (Object.prototype.hasOwnProperty.call(reducerMap, action.type)) {
      const reducer = reducerMap[action.type as keyof M] as (state: S, action: A) => S;
      const nextState = reducer(state, action);
      if (nextState === undefined) {
        throw new Error(`Reducer for ${action.type} returned undefined`);
      }
      return nextState;
    }
    return state;
  };
}
