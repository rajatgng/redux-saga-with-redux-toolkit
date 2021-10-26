import { all, call, put, takeLatest } from "redux-saga/effects";
import { projectService } from "services/ProjectService";
import { allProjectsActions, projectsActions } from "./index";
import { PayloadAction, Update } from "@reduxjs/toolkit";

function* fetchProjects(): any {
  try {
    const response = yield call(projectService.getAll);
    yield put(allProjectsActions.fetchResolved(response));
  } catch (e) {
    yield put(allProjectsActions.fetchRejected("Unable to fetch projects."));
  }
}

function* addProject({
  payload,
}: PayloadAction<{ name: string; company_id: number }>): any {
  try {
    const response = yield call(projectService.add, payload);
    yield put(allProjectsActions.addResolved(response));
  } catch (e) {
    yield put(allProjectsActions.addRejected("Project add failed."));
  }
}

function* updateProject({
  payload,
}: PayloadAction<Update<{ name: string }>>): any {
  try {
    const response = yield call<any>(projectService.update, payload.id, {
      name: payload.changes.name,
    });
    yield put(allProjectsActions.updateResolved(response));
  } catch (e) {
    yield put(
      allProjectsActions.updateRejected({
        id: payload.id,
        err: "Update failed",
      })
    );
  }
}

function* removeProject({ payload }: PayloadAction<number>): any {
  try {
    yield call(projectService.delete, payload);
    yield put(allProjectsActions.removeResolved(payload));
  } catch (e) {
    yield put(
      allProjectsActions.removeRejected({ id: payload, err: "Deletion Failed" })
    );
  }
}

function* projectsSaga() {
  yield all([
    takeLatest(projectsActions.fetchProjects.type, fetchProjects),
    takeLatest(projectsActions.addProject.type, addProject),
    takeLatest(projectsActions.updateProject.type, updateProject),
    takeLatest(projectsActions.removeProject, removeProject),
  ]);
}

export default projectsSaga;
