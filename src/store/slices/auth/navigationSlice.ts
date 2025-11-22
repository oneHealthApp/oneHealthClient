import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NavigationTree } from "@/@types/navigation";

export interface NavigationState {
  menus: NavigationTree[];
}

const initialState: NavigationState = {
  menus: [],
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setNavigationConfig(state, action: PayloadAction<NavigationTree[]>) {
      state.menus = action.payload;
    },
    clearNavigationConfig(state) {
      state.menus = [];
    },
  },
});
console.log("actions", navigationSlice.actions);
export const { setNavigationConfig, clearNavigationConfig } =
  navigationSlice.actions;
export default navigationSlice.reducer;
