// src/redux/store.js
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authSlice from './reducers/authSlice'
import searchSlice from './reducers/searchSlice'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

const persistConfig = {
  key: 'tally-redux',
  storage
}

const rootReducer = combineReducers({
  user: authSlice,
  search: searchSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)
