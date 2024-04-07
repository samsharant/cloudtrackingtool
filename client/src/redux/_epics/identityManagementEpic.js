import { ofType } from "redux-observable";
import { switchMap } from "rxjs/operators";
import { baseUrl } from "../../constants";
import { IDENTITYMANAGEMENT } from "../_types";

import { identityManagementSuccess, identityManagementFail } from "../_actions/identityManagement";

export const identityManagementEpic = (action$, state$, { axios }) =>
  action$.pipe(
    ofType(IDENTITYMANAGEMENT),
    switchMap((action) =>
      axios
        .post(`${baseUrl}/access/arn/create`, {
            ARN: action.payload.arnInput,
            cloudType: action.payload.selectedService,
            sessionToken: action.payload.sessionToken,
        },
        { withCredentials: true, credentials: "include" }
        )
        // .toPromise()
        .then((response) => {
          return identityManagementSuccess(response.data); // Assuming the response contains the data you want
        })
        .catch((error) => {
          // Handle the error here
          // console.error("Signup failed:", error);
          return identityManagementFail(error);
        })
    )
  );
