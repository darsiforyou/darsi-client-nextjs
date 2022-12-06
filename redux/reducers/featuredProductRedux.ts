import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "featuredProduct",
  initialState: {
    featuredProduct: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    featuredProductStart: (state) => {
      state.isFetching = true;
    },
    featuredProductSuccess: (state, action) => {
      state.isFetching = false;
      state.featuredProduct = action.payload;
    },
    featuredProductFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const {
  featuredProductStart,
  featuredProductSuccess,
  featuredProductFailure,
} = userSlice.actions;
export default userSlice.reducer;
