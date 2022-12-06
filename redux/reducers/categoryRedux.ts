import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    categoryStart: (state: any) => {
      state.isFetching = true;
    },
    categorySuccess: (state: any, action: any) => {
      state.isFetching = false;
      state.categories = action.payload;
    },
    categoryFailure: (state: any) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { categoryStart, categorySuccess, categoryFailure } =
  userSlice.actions;
export default userSlice.reducer;
