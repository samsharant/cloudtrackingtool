import { ofType } from "redux-observable";
import { switchMap } from "rxjs/operators";
import { baseUrl } from "../../constants";
import { SESSIONMANAGEMENT } from "../_types";

import { sessionManagementSuccess, sessionManagementFail } from "../_actions/sessionAction";

export const sessionEpic = (action$, state$, { axios }) =>
  action$.pipe(
    ofType(SESSIONMANAGEMENT),
    switchMap((action) =>
      axios
        .post(
          `${baseUrl}/access/validate`,
          {
            sessionToken: action.payload.encryptedToken,
          },
          { withCredentials: true, credentials: "include" }
        )
        // .toPromise()
        .then((response) => {
          return sessionManagementSuccess(response.data);
        })
        .catch((error) => {
          // Handle the error here
          return sessionManagementFail(error);
        })
    )
  );
