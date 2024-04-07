export const isLoggedInSelector = state => state?.signup?.loggedIn;
export const loginTokenSelector = state => state.signup.sessionToken;
export const nextPageSelector = state => state.signup.nextPage;
