import { ofType } from "redux-observable";
import { switchMap } from "rxjs/operators";
import { baseUrl } from "../../constants";
import { SIGNUP } from "../_types";

import { signupSuccess, signupFail } from "../_actions/signupActions";

export const signupEpic = (action$, state$, { axios }) =>
  action$.pipe(
    ofType(SIGNUP),
    switchMap((action) =>
      axios
        .post(`${baseUrl}/account/create`, {
          organizationName: action.payload.companyName,
          organizationDomain: action.payload.companyDomain,
          userName: action.payload.userName,
          userEmail: action.payload.email,
          password: action.payload.password,
        },
        { withCredentials: true, credentials: "include" }
        )
        
        // .toPromise()
        .then((response) => {
          return signupSuccess(response.data); // Assuming the response contains the data you want
        })
        .catch((error) => {
          // Handle the error here
          console.error("Signup failed:", error);
          return signupFail(error);
        })
    )
  );
