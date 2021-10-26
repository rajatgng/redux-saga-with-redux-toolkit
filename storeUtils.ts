import { ActionReducerMapBuilder, AnyAction, createAction, EntityAdapter } from "@reduxjs/toolkit";
import { EntityState } from "./index";

export const createAsyncAction = <P, F, R = any>(sliceName: string, actionName: string) => ({
  pending: createAction<P>(`${sliceName}/${actionName}/pending`),
  rejected: createAction<R>(`${sliceName}/${actionName}/rejected`),
  fulfilled: createAction<F>(`${sliceName}/${actionName}/fulfilled`)
});


// Useful when the model data is not normalized;
export const createCrudAsyncActions = <T = any>(sliceName: string) => {
  return {
    fetch: createAsyncAction<void, T[], any>(sliceName, "fetchAll"),
    add: createAsyncAction<Omit<T, "id">, T>(sliceName, "addOne"),
    update: createAsyncAction<T, T, { err: any, payload: any }>(sliceName, "updateOne"),
    remove: createAsyncAction<number, number, { err: any, payload: any }>(sliceName, "removeOne")
  };
};

export const generateCrudReducers = <T>(builder: ActionReducerMapBuilder<EntityState<T>>, name: string, adapter: EntityAdapter<T | any>, crudActions:any) => {

  // fetch
  builder.addCase(crudActions.fetch.pending, (state) => {
    state.fetching = true;
  });
  builder.addCase(crudActions.fetch.rejected, (state, action) => {
    state.error = action.payload;
  });
  builder.addCase(crudActions.fetch.fulfilled, (state, action) => {
    state.fetching = false;
    adapter.setAll(state, action.payload);
  });

  // add
  builder.addCase(crudActions.add.pending, (state) => {
    state.creating = true;
  });
  builder.addCase(crudActions.add.rejected, (state, action) => {
    state.error = action.payload;
  });
  builder.addCase(crudActions.add.fulfilled, (state, action) => {
    state.creating = false;
    adapter.addOne(state, action.payload);
  });


  // update
  builder.addCase(crudActions.update.pending, (state, action) => {
    state.updating = [...state.updating, action.payload.id];
  });
  builder.addCase(crudActions.update.rejected, (state, action) => {
    state.error = action.payload.err;
    state.updating = state.updating.filter(s => s !== action.payload.payload.id);
  });
  builder.addCase(crudActions.update.fulfilled, (state, action) => {
    state.updating = state.updating.filter(s => s !== action.payload.id);
    adapter.updateOne(state, action.payload);
  });


  // delete
  builder.addCase(crudActions.remove.pending, (state, action) => {
    state.updating = [...state.updating, action.payload];
  });
  builder.addCase(crudActions.remove.rejected, (state, action) => {
    state.error = action.payload.err;
    state.updating = state.updating.filter(s => s !== action.payload.payload);
  });
  builder.addCase(crudActions.remove.fulfilled, (state, action) => {
    state.updating = state.updating.filter(s => s !== action.payload);
    adapter.removeOne(state, action.payload);
  });

};
