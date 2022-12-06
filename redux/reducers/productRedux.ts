import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    productStart: (state) => {
      state.isFetching = true;
    },
    productSuccess: (state, action) => {
      state.isFetching = false;
      state.products = action.payload;
    },
    productFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { productStart, productSuccess, productFailure } =
  userSlice.actions;
export default userSlice.reducer;
