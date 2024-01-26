import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import rootReducers from './reducer';

const store = configureStore({
  reducer: rootReducers,
  middleware: [thunk],
});

export default store;
