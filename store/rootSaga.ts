import { all, fork } from "redux-saga/effects";

import projectsSaga from "./projects/saga";

export function* rootSaga() {
  yield all([fork(projectsSaga)]);
}
