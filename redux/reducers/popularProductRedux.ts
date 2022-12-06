import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "popularProduct",
  initialState: {
    p_products: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    p_productStart: (state) => {
      state.isFetching = true;
    },
    p_productSuccess: (state, action) => {
      state.isFetching = false;
      state.p_products = action.payload;
    },
    p_productFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { p_productStart, p_productSuccess, p_productFailure } =
  userSlice.actions;
export default userSlice.reducer;
