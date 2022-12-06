import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    message: "",
    type: "Success",
    isOpen: false,
  },
  reducers: {
    notification_on: (state, payload: any) => {
      state.message = payload.payload.message;
      state.type = payload.payload.type || 'Success';
      state.isOpen = true;
    },
    notification_off: (state) => {
      state.message = "";
      state.type = "Success";
      state.isOpen = false;
    },
  },
});

export const { notification_off, notification_on} = notificationSlice.actions;
export default notificationSlice.reducer;
