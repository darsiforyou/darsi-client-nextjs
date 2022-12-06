import { publicRequest } from "../../requestMethods";
import {p_productStart,p_productSuccess,p_productFailure} from "../reducers/popularProductRedux"

export const get_popular_products = async (dispatch: any, quary = "",) => {
  dispatch(p_productStart());
  try {
    const res = await publicRequest.get(`/dashboard/top-products?limit=${6}&isActive=true` + quary);
    res.data.data = res.data.data.filter((x: any)=> x.isActive)
    dispatch(p_productSuccess(res.data.data));
  } catch (err) {
    dispatch(p_productFailure());
  }
};

