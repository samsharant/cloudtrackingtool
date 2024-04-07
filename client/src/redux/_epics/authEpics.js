import { ofType } from "redux-observable";
import { switchMap } from "rxjs/operators";
import { baseUrl } from "../../constants";
import { LOGIN } from "../_types";

import { loginSuccess, loginFail } from "../_actions/authActions";

export const loginEpic = (action$, state$, { axios }) =>
  action$.pipe(
    ofType(LOGIN),
    switchMap((action) =>
      axios
        .post(
          `${baseUrl}/account/login`,
          {
            email: action.payload.email,
            password: action.payload.password,
          },
          { withCredentials: true, credentials: "include" }
        )
        // .toPromise()
        .then((response) => {
          return loginSuccess(response.data);
        })
        .catch((error) => {
          // Handle the error here
          return loginFail(error);
        })
    )
  );
