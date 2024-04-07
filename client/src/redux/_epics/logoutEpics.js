import { ofType } from "redux-observable";
import { switchMap } from "rxjs/operators";
import { baseUrl } from "../../constants";
import { LOGOUT } from "../_types";

import { logoutSuccess, logoutFail } from "../_actions/logoutAction";

export const logoutEpic = (action$, state$, { axios }) =>
  action$.pipe(
    ofType(LOGOUT),
    switchMap((action) =>
      axios
        .post(
          `${baseUrl}/account/logout`,
          { withCredentials: true, credentials: "include" }
        )
        // .toPromise()
        .then((response) => {
          return logoutSuccess(response.data);
        })
        .catch((error) => {
          // Handle the error here
          return logoutFail(error);
        })
    )
  );
