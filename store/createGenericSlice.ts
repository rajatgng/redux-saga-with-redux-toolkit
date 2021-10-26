import {
  AnyAction,
  createSlice,
  CreateSliceOptions,
  EntityAdapter,
  EntityId,
  PayloadAction,
  SliceCaseReducers,
  Update,
} from "@reduxjs/toolkit";
import { EntityState, RejectedError } from "store";
import { Dictionary } from "../types";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

const createGenericSlice = <
  T,
  State extends EntityState<T>,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends string = string
>(
  adapter: EntityAdapter<T>,
  options: CreateSliceOptions<State, CaseReducers, Name>
) => {
  return createSlice({
    ...options,
    reducers: {
      // entity adapter utility reducers
      setAll: adapter.setAll,
      addOne: adapter.addOne,
      updateOne: adapter.updateOne,
      removeOne: adapter.removeOne,

      // for pending/begin action's reducers
      fetchPending: (state) => {
        state.fetching = true;
        state.fetched = false;
      },
      addPending: (state: EntityState<T>, action: PayloadAction<any>) => {
        state.creating = true;
        state.created = false;
      },
      updatePending: (
        state,
        action: PayloadAction<Update<Dictionary<any>>>
      ) => {
        state.updatingIds = [...state.updatingIds, action.payload.id];
        state.updatedIds = state.updatingIds.filter(
          (s) => s !== action.payload.id
        );
      },
      removePending: (state, action: PayloadAction<EntityId>) => {
        state.updatingIds = [...state.updatingIds, action.payload];
        state.updatedIds = state.updatingIds.filter(
          (s) => s !== action.payload
        );
      },

      // for success/fulfilled/resolved action's reducers
      fetchResolved: (state: EntityState<T>, action: PayloadAction<T[]>) => {
        state.fetching = false;
        state.fetched = true;
        adapter.setAll(state, action);
      },
      addResolved: (state: EntityState<T>, action: PayloadAction<T>) => {
        state.creating = false;
        state.created = true;
        adapter.addOne(state, action);
      },
      updateResolved: (
        state: EntityState<T>,
        action: PayloadAction<T & { id: EntityId }>
      ) => {
        state.updatingIds = state.updatingIds.filter(
          (s) => s !== action.payload.id
        );
        state.updatedIds.push(action.payload.id);
        adapter.upsertOne(state, action.payload);
      },
      removeResolved: (
        state: EntityState<T>,
        action: PayloadAction<EntityId>
      ) => {
        state.updatingIds = state.updatingIds.filter(
          (s) => s !== action.payload
        );
        state.updatedIds.push(action.payload);
        adapter.removeOne(state, action);
      },

      // for rejected/error action's reducers
      fetchRejected: (state, action: PayloadAction<RejectedError>) => {
        state.fetching = false;
        state.error = action.payload;
      },
      addRejected: (state, action: PayloadAction<RejectedError>) => {
        state.creating = false;
        state.error = action.payload;
      },
      updateRejected: (
        state,
        action: PayloadAction<{ err: RejectedError; id: EntityId }>
      ) => {
        state.updatingIds = state.updatingIds.filter(
          (s) => s !== action.payload.id
        );
        state.error = action.payload.err;
      },
      removeRejected: (
        state,
        action: PayloadAction<{ err: RejectedError; id: EntityId }>
      ) => {
        state.updatingIds = state.updatingIds.filter(
          (s) => s !== action.payload.id
        );
        state.error = action.payload.err;
      },

      // common entities handling reducers
      setFetching: (state, action: PayloadAction<boolean>) => {
        state.fetching = action.payload;
      },
      setFetched: (state, action: PayloadAction<boolean>) => {
        state.fetched = action.payload;
      },
      setCreating: (state, action: PayloadAction<boolean>) => {
        state.fetching = action.payload;
      },
      setCreated: (state, action: PayloadAction<boolean>) => {
        state.created = action.payload;
      },
      setError: (state, action: PayloadAction<string | null | Error>) => {
        state.error = action.payload;
      },
      addToUpdatingIds: (state, action: PayloadAction<EntityId>) => {
        state.updatingIds = [...state.updatingIds, action.payload];
      },
      addToUpdatedIds: (state, action: PayloadAction<EntityId>) => {
        state.updatedIds = [...state.updatedIds, action.payload];
      },
      removeFromUpdatingIds: (state, action: PayloadAction<EntityId>) => {
        state.updatingIds = state.updatingIds.filter(
          (s) => s !== action.payload
        );
      },
      removeFromUpdatedIds: (state, action: PayloadAction<EntityId>) => {
        state.updatedIds = state.updatedIds.filter((s) => s !== action.payload);
      },
      ...options.reducers,
    },
  });
};

export default createGenericSlice;
