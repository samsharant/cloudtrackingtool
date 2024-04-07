export const usernameSelector = state => state.session.username;
export const isLoggedInSelector = state => state?.session?.loggedIn;
export const loginTokenSelector = state => state.session.sessionToken;
export const nextPageSelector = state => state.session.nextPage;
