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
    let categories = res.data.sort((a: any,b: any)=> b.rank-a.rank)
    dispatch(categorySuccess(categories));
  } catch (err) {
    dispatch(categoryFailure());
  }
};
