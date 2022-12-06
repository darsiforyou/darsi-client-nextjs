import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "searchProduct",
  initialState: {
    searchProducts: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    searchProductsStart: (state) => {
      state.isFetching = true;
    },
    searchProductsSuccess: (state, action) => {
      state.isFetching = false;
      state.searchProducts = action.payload;
    },
    searchProductsFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { searchProductsStart, searchProductsSuccess, searchProductsFailure } =
  userSlice.actions;
export default userSlice.reducer;
