import { CommonEntities, RootState } from "store";
import { createSelector, EntityId } from "@reduxjs/toolkit";
import { projectsAdapter } from "./index";

const { selectById, selectAll } = projectsAdapter.getSelectors<RootState>(
  (state) => state.projects
);

const projectsState = (state: RootState) => state.projects;

export const getAllProjects = createSelector(selectAll, (v) => v);

export const getProjectsLoadingEntities = createSelector(
  projectsState,
  (v: CommonEntities) => v
);

export const getProjectsEntities = createSelector(
  projectsState,
  (state) => state.entities
);

export const getProjectById = (id: EntityId) =>
  createSelector(
    (state: RootState) => selectById(state, id),
    (v) => v
  );
