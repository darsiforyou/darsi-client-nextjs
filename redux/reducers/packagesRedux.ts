import { createSlice } from "@reduxjs/toolkit";

const packegesSlice = createSlice({
  name: "package",
  initialState: {
    packages: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    packagesStart: (state) => {
      state.isFetching = true;
    },
    packagesSuccess: (state, action) => {
      state.isFetching = false;
      state.packages = action.payload;
    },
    packagesFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { packagesStart, packagesSuccess, packagesFailure } =
  packegesSlice.actions;
export default packegesSlice.reducer;
