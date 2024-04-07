import { combineEpics, ofType } from "redux-observable";
import { catchError } from "rxjs/operators";

import { loginEpic } from "./authEpics";
import { signupEpic } from "./signupEpics";
import { identityManagementEpic } from "./identityManagementEpic";
import { sessionEpic } from "./sessionEpics";
import { logoutEpic } from "./logoutEpics";
const epics = [
  loginEpic,
  signupEpic,
  identityManagementEpic,
  sessionEpic,
  logoutEpic,
];

export const rootEpic = (action$, store$, dependencies) =>
  combineEpics(...epics)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      return source;
    })
  );
