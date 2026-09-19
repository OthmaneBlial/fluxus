/** An action supplied to a reducer or store. Creators return more precise shapes. */
export interface Action<Payload = unknown, Type extends string = string> {
  type: Type;
  payload?: Payload;
}

/** A synchronous transition. State must be treated as immutable by callers. */
export type Reducer<S, A extends Action = Action> = (
  state: S | undefined,
  action: A
) => S;

type IsVoid<Payload> = [void] extends [Payload]
  ? [Payload] extends [void] ? true : false
  : false;

type CreatedAction<Type extends string, Payload> = IsVoid<Payload> extends true
  ? { type: Type }
  : { type: Type; payload: Payload };

/** The first type argument is the payload for compatibility with createAction<T>. */
export type ActionCreator<Payload = void, Type extends string = string> =
  (IsVoid<Payload> extends true
    ? () => CreatedAction<Type, Payload>
    : (payload: Payload) => CreatedAction<Type, Payload>) & {
    readonly type: Type;
    /** Preserve the literal action type while declaring a payload type. */
    withPayload<NextPayload>(): ActionCreator<NextPayload, Type>;
  };

export interface MiddlewareAPI<S, A extends Action = Action> {
  getState(): S;
  dispatch(action: A): void;
}

export type Dispatch<A extends Action = Action> = (action: A) => void;

export type Middleware<S, A extends Action = Action> = (
  api: MiddlewareAPI<S, A>
) => (next: Dispatch<A>) => Dispatch<A>;

export interface IStore<S, A extends Action = Action> {
  dispatch(action: A): void;
  getState(): S;
  /** Notified after every successful dispatch, including an unchanged state. */
  subscribe(listener: () => void): () => void;
  /** Cached by selector function and state reference; do not mutate state in place. */
  select<R>(selector: (state: S) => R): R;
}

export type StoreCreator = <S, A extends Action = Action>(
  reducer: Reducer<S, A>,
  initialState: S,
  middlewares?: Middleware<S, A>[]
) => IStore<S, A>;

export interface CreateStoreOptions<S, A extends Action = Action> {
  reducer: Reducer<S, A>;
  initialState: S;
  middlewares?: Middleware<S, A>[];
}
