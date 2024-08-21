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
   * 
   * @template T The type of the action payload.
   */
  export type ActionCreator<T = void> = T extends void
    ? () => Action
    : (payload: T) => Action<T>;
  
  /**
   * Creates an action creator function.
   * 
   * @param type The type of the action.
   * @returns An action creator function.
   */
  export function createAction<T = void>(type: string) {
    const actionCreator = (payload?: T) => ({ type, payload });
    actionCreator.type = type;
    return actionCreator;
  }