Disadvantages of Redux/Redux Toolkit

* Having to wire up the reducers and actions to the store.

```typescript
import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './usersReducer'
import postsReducer from './postsReducer'

const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
  },
})

export default store
```

* Having to create middleware and enhancers AND having to wire them up to the store.

```typescript
import { configureStore } from '@reduxjs/toolkit'

import monitorReducersEnhancer from './enhancers/monitorReducers'
import loggerMiddleware from './middleware/logger'
import rootReducer from './reducers'

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(loggerMiddleware),
    preloadedState,
    enhancers: (getDefaultEnhancers) =>
      getDefaultEnhancers().concat(monitorReducersEnhancer),
  })

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  }

  return store
}
```

* It forces you to not use classes, because of Redux-Persist. It considers that classes are non-serializable.
  But they are! It forces you to use JavaScript objects, which are almost key/value Maps, and not as powerful as
  classes.

* You end up writing "Redux Oriented Programming" instead of "Object Oriented Programming".
  Reducers are like class methods, and state is like class fields.

* Immer is necessary only because the state is pure Javascript object. If you use properly encapsulated
  immutable classes, changing nested state becomes easy and you don't need Immer.

```typescript
case
"UPDATE_VALUE"
:
return {
  ...state,
  first: {
    ...state.first,
    second: {
      ...state.first.second,
      [action.someId]: {
        ...state.first.second[action.someId],
        fourth: action.someValue
      }
    }
  }
}
```

With Immer (Unpacked Size 620 kB):

```typescript
updateValue(state, action)
{
  const { someId, someValue } = action.payload;
  state.first.second[someId].fourth = someValue;
}
```

With classes:

```typescript
updateValue(state, action)
{
  return state.withValue(someId, someValue);
}
```

* After creating your reducers, you have to export them as actions using ES6 destructuring:

```typescript
export const {
  setPortfolio,
  buyStock,
  sellStock,
  addCashBalance,
  removeCashBalance
}
  = portfolioSlice.actions;
```

* In slices, the slice sub-state is also called `state`:

```typescript
export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {

    setPortfolio: (state, action: PayloadAction<Portfolio>) => {
      state = action.payload;
      return state;
    },

    buyStock: (state, action: PayloadAction<{ availableStock: AvailableStock, howMany: number }>) => {
      state = state.buy(action.payload.availableStock, action.payload.howMany);
      return state;
    },
```

This is confusing, as `state` means different things depending on the file you are in.
It would be better if `state` referred to the top state only.

* According to the documentation, `Redux action types are not meant to be exclusive to a single slice`.
  Conceptually, each slice reducer "owns" its own piece of the Redux state, but it should be able to
  listen to any action type and update its state appropriately. For example, many different slices
  might want to respond to a "user logged out" action by clearing data or resetting back to initial
  state values. Keep that in mind as you design your state shape and create your slices.
  An extra problem is that JS modules can have "circular reference" problems if two modules try to import each other.
  This can result in imports being undefined, which will likely break the code that needs that import. Specifically in
  the case of slices, this can occur if slices defined in two different files both want to respond to actions
  defined in the other file. If you encounter this, you may need to restructure your code in a way that avoids the
  circular references. This will usually require extracting shared code to a separate common file that both modules can
  import and use. In this case, you might define some common action types in a separate file using createAction, import
  those action creators into each slice file, and handle them using the extraReducers argument.

* Asynchronous Logic using thunks is cumbersome. You have to use thunks, and they cannot be defined as part of a
  createSlice() call. You have to write them separate from the reducer logic, exactly the same as with plain Redux code.
  And then you have to deal with the loading/pending/fulfilled/rejected states (the Redux Data Fetching Patterns). Look
  at al the code you have to write:

```typescript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userAPI } from './userAPI'

// First, create the thunk
const fetchUserById = createAsyncThunk(
        'users/fetchByIdStatus',
        async (userId, thunkAPI) => {
          const response = await userAPI.fetchById(userId)
          return response.data
        },
)

// Then, handle actions in your reducers:
const usersSlice = createSlice({
  name: 'users',
  initialState: { entities: [], loading: 'idle' },
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      // Add user to the state array
      state.entities.push(action.payload)
    })
  },
})

// Later, dispatch the thunk as needed in the app
dispatch(fetchUserById(123))
```

And the ThunkAPI is complex:

```typescript
interface ThunkAPI {
  dispatch: Function
  getState: Function
  extra?: any
  requestId: string
  signal: AbortSignal
}
```
