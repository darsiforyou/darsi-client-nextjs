import {
  categoryStart,
  categorySuccess,
  categoryFailure,
} from "../reducers/categoryRedux";
import { publicRequest } from "../../requestMethods";

export const get_categories = async (dispatch: any) => {
  dispatch(categoryStart());
  try {
    const res = await publicRequest.get(
      "/categories/without_filter?isFeatured=true&isActive=true"
    );
    let categories = res.data;
    dispatch(categorySuccess(categories));
  } catch (err) {
    dispatch(categoryFailure());
  }
};
