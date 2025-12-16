//12162025
//old code reduc refresh 
// import { createSlice } from "@reduxjs/toolkit";

// const userSlice = createSlice({
//   name: "user",
//   initialState: {
//     currentUser: null,
//     isFetching: false,
//     error: false,

//   },
//   reducers: {
//     loginStart: (state) => {
//       state.isFetching = true;
//     },
//     loginSuccess: (state, action) => {
//       state.isFetching = false;
//       state.currentUser = action.payload;
//     },
//     loginFailure: (state) => {
//       state.isFetching = false;
//       state.error = true;
//     },
//     logout: (state) => {
//       state.currentUser = null;
//       state.isFetching = false;
//       state.error = false;
//     },
//   },
// });

// export const { loginStart, loginSuccess, loginFailure , logout} = userSlice.actions;
// export default userSlice.reducer;


//new code
//12162026

import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;

      // ✅ SAVE USER TO LOCALSTORAGE
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "customerInfo",
          JSON.stringify(action.payload)
        );
      }
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isFetching = false;
      state.error = false;

      // ✅ CLEAR LOCALSTORAGE ON LOGOUT
      if (typeof window !== "undefined") {
        localStorage.removeItem("customerInfo");
        localStorage.removeItem("persist:root"); // optional if using redux-persist
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} = userSlice.actions;

export default userSlice.reducer;

