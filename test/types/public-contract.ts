import { createAction, createReducer, createStore, type ActionCreator } from '../../src';

const initialState = { count: 0 };
const add = createAction('counter/add').withPayload<number>();
const reset = createAction('counter/reset');
const addType: 'counter/add' = add.type;
const resetType: 'counter/reset' = reset.type;

type CounterAction = ReturnType<typeof add> | ReturnType<typeof reset>;
const reducer = createReducer<typeof initialState, CounterAction>(initialState, {
  [add.type]: (state, action) => ({ count: state.count + action.payload }),
  [reset.type]: () => initialState,
});
const store = createStore(reducer, initialState);
const selected: number = store.select((state) => state.count);
store.dispatch(add(2));
store.dispatch(reset());

// @ts-expect-error the payload is numeric
add('two');
// @ts-expect-error the payload is required
add();
// @ts-expect-error a reducer's action union constrains dispatch
store.dispatch({ type: 'counter/missing' });
// @ts-expect-error selectors receive the declared state shape
store.select((state) => state.missing);

const legacy: ActionCreator<number> = createAction<number>('legacy/add');
legacy(1);
// @ts-expect-error the legacy creator still checks its payload
legacy('one');

void [addType, resetType, selected];
