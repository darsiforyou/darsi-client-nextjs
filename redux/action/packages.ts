import {
  packagesStart,
  packagesSuccess,
  packagesFailure,
} from "../reducers/packagesRedux";
import { publicRequest } from "../../requestMethods";

export const get_packages = async (dispatch: any) => {
  dispatch(packagesStart());
  try {
    const res = await publicRequest.get("/packages/without_filter");
    dispatch(packagesSuccess(res.data));
  } catch (err: any) {
    dispatch(packagesFailure());
  }
};
