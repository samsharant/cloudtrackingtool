export const usernameSelector = state => state.auth.username;
export const accountNameSelector = state => state.auth.accountId;
export const isLoggedInSelector = state => state?.auth?.loggedIn;
export const loginTokenSelector = state => state.auth.sessionToken;
export const nextPageSelector = state => state.auth.nextPage;
