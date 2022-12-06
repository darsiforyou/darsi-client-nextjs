import { loginFailure, loginStart, loginSuccess } from "../reducers/userRedux";
import { publicRequest } from "../../requestMethods";

export const login = async (dispatch: any, user: any) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth", user);
    if (res.status === 200) {
      if (res.data.role !== "Customer") {
        dispatch(loginFailure());
      } else {
        dispatch(loginSuccess(res.data.data));
      }
    } else {
      dispatch(loginFailure());
    }
    return res;
  } catch (err) {
    dispatch(loginFailure());
    throw err;
  }
};
export const forgotPasswordOTP = async (email: string) => {
  try {
    const res = await publicRequest.get("/users/forgotPasswordOtp/" + email);
    return res;
  } catch (err) {
    throw err;
  }
};

export const changeUserPassword = async (body: any) => {
  try {
    const res = await publicRequest.post("/users/changeUserPassword/", body);
    return res;
  } catch (err) {
    throw err;
  }
};
export const register = async (dispatch: any, user: any) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/register", user);
    dispatch(loginSuccess(res.data.data));
    return res;
  } catch (err) {
    dispatch(loginFailure());
    throw err;
  }
};
