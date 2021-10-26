import {
  ActionCreatorWithPayload,
  createEntityAdapter,
  Update,
} from "@reduxjs/toolkit";
import { Project } from "models/Project";
import createGenericSlice from "store/createGenericSlice";
import { EntityState } from "../index";

const name = "projects";

export const projectsAdapter = createEntityAdapter<Project>();

const initialState: EntityState<Project> = projectsAdapter.getInitialState({
  fetching: false,
  fetched: false,
  created: false,
  creating: false,
  updatingIds: [],
  updatedIds: [],
  error: null,
});

const projectsSlice = createGenericSlice(projectsAdapter, {
  name,
  initialState,
  reducers: {},
});

// actions

export const allProjectsActions = projectsSlice.actions;

const { setCreated, removeFromUpdatedIds } = allProjectsActions;

export const projectsActions = {
  setCreated,
  removeFromUpdatedIds,
  fetchProjects: allProjectsActions.fetchPending,
  addProject: allProjectsActions.addPending as ActionCreatorWithPayload<{
    name: string;
    company_id: number;
  }>,
  updateProject: allProjectsActions.updatePending as ActionCreatorWithPayload<
    Update<{ name: string }>
  >,
  removeProject: allProjectsActions.removePending,
};

export default projectsSlice;
