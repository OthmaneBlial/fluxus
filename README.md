# Fluxus

Fluxus is a high-performance state management library inspired by Redux but designed to overcome some of Redux's limitations. It provides a more efficient and developer-friendly solution for modern applications.

## Features

- **High Performance**: Optimized for speed and minimal memory usage
- **Simplified API**: Reduces boilerplate while maintaining predictability
- **Built-in Memoization**: Efficient handling of derived state
- **Strong TypeScript Support**: Enhanced type inference and safety
- **Efficient Immutability**: Optimized immutable updates for better performance
- **Lazy Evaluation**: Support for deferred computation of expensive operations
- **Modular Architecture**: Easily extensible for custom functionality

## Comparison with Redux

While Fluxus draws inspiration from Redux, it addresses several key issues:

1. **Reduced Boilerplate**: Simplified creation of actions and reducers with `createAction` and `createReducer`.

2. **Improved Performance**: Optimized internal data structures and built-in performance utilities.

3. **Built-in Memoization**: Efficient caching of selector results and expensive computations.

4. **Enhanced TypeScript Support**: Designed with TypeScript from the ground up for improved type safety.

5. **Efficient Immutability**: Optimized immutable update utilities to reduce overhead.

6. **Lazy Evaluation**: Support for deferred computation of expensive operations.

7. **Reduced Memory Usage**: Optimized data structures for efficient memory usage, especially beneficial for applications with many subscribers.

## Installation

```bash
npm install fluxus
# or
yarn add fluxus
```

## Basic Usage

```typescript
import { createStore, createAction, createReducer } from 'fluxus';

// Define actions
const increment = createAction<number>('INCREMENT');
const decrement = createAction<number>('DECREMENT');

// Define initial state
const initialState = { count: 0 };

// Define reducer
const counterReducer = createReducer(initialState, {
  [increment.type]: (state, action) => ({ count: state.count + action.payload }),
  [decrement.type]: (state, action) => ({ count: state.count - action.payload }),
});

// Create store
const store = createStore(counterReducer, initialState);

// Subscribe to state changes
store.subscribe(() => console.log(store.getState()));

// Use selector with built-in memoization
const selectCount = (state) => state.count;
console.log(store.select(selectCount));

// Dispatch actions
store.dispatch(increment(5));
store.dispatch(increment(3));
store.dispatch(decrement(2));
```

## Advanced Features

### Efficient Immutable Updates

```typescript
import { updateObject, updateArray } from 'fluxus';

const obj = { a: 1, b: 2, c: 3 };
const newObj = updateObject(obj, { b: 20, d: 40 });

const arr = [1, 2, 3, 4];
const newArr = updateArray(arr, 2, 30);
```

### Lazy Evaluation

```typescript
import { lazy } from 'fluxus';

const expensiveComputation = lazy(() => {
  // Expensive operation here
  return result;
});

// Computation is deferred until this point
const result = expensiveComputation.get();
```

### Performance Measurement

```typescript
import { measureTime } from 'fluxus';

const [result, executionTime] = measureTime(() => {
  // Your code here
});

console.log(`Execution time: ${executionTime}ms`);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgements

Fluxus is inspired by Redux and aims to build upon its strengths while addressing its limitations. We're grateful to the Redux team and contributors for their groundbreaking work in state management for JavaScript applications.
