import { combineReducers } from "@reduxjs/toolkit";
import session, { SessionState } from "./sessionSlice";
import user, { UserState } from "./userSlice";
import { NavigationState } from "./navigationSlice";

const reducer = combineReducers({
  session,
  user,
});

export type AuthState = {
  session: SessionState;
  user: UserState;
  navigationConfig: NavigationState;
};

export * from "./sessionSlice";
export * from "./userSlice";
export * from "./navigationSlice";

export default reducer;
