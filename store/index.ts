import {
  combineReducers,
  configureStore,
  EntityId,
  EntityState as ReduxEntityState,
} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import projectsSlice from "./projects";
import { rootSaga } from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  [projectsSlice.name]: projectsSlice.reducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type RejectedError = string | null | Error;

export type CommonEntities = {
  fetching: boolean;
  fetched: boolean;
  creating: boolean;
  created: boolean;
  updatingIds: EntityId[];
  updatedIds: EntityId[];
  error: RejectedError;
};

export type EntityState<T> = ReduxEntityState<T> & CommonEntities;
