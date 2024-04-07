export const isLoggedInSelector = state => state?.identityManagement?.loggedIn;
export const loginTokenSelector = state => state.identityManagement.sessionToken;
export const nextPageSelector = state => state.identityManagement.nextPage;
export const usernameSelector = state => state.identityManagement.username;
export const accountNameSelector = state => state.identityManagement.accountId;
