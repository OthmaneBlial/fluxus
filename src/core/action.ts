import type { ActionCreator } from '../types';

export type { Action, ActionCreator } from '../types';

/**
 * Create a named action. For a payload with a preserved literal type, use
 * `createAction('counter/add').withPayload<number>()`.
 */
export function createAction<Payload = void, const Type extends string = string>(
  type: Type
): ActionCreator<Payload, Type> {
  function actionCreator(payload?: Payload) {
    return arguments.length === 0 ? { type } : { type, payload };
  }
  actionCreator.type = type;
  actionCreator.withPayload = () => actionCreator;
  return actionCreator as ActionCreator<Payload, Type>;
}
