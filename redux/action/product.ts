import {
  productStart,
  productSuccess,
  productFailure,
} from "../reducers/productRedux";
import { publicRequest } from "../../requestMethods";
import {
  featuredProductFailure,
  featuredProductStart,
  featuredProductSuccess,
} from "../reducers/featuredProductRedux";

export const get_products = async (dispatch: any, quary = "") => {
  dispatch(productStart());
  try {
    const res = await publicRequest.get("/products/without_filter?isActive=true" + quary);
    dispatch(productSuccess(res.data));
  } catch (err) {
    dispatch(productFailure());
  }
};
export const get_products_by_cat = async (id: any) => {
  try {
    const res = await publicRequest.get("/products/without_filter");
    let data = await res.data.filter((product: any) => product.category === id)
    return data
  } catch (err) {
  }
};
export const get_featured_products = async (dispatch: any, quary = "") => {
  dispatch(featuredProductStart());
  try {
    const res = await publicRequest.get("/products/without_filter" + quary);
    dispatch(featuredProductSuccess(res.data));
  } catch (err) {
    dispatch(featuredProductFailure());
  }
};
export const get_product = (id: any) => {
  return new Promise((resolve, reject) => {
    publicRequest
      .get(`/products/${id}`)
      .then((data: any) => resolve(data))
      .catch((err: any) => reject(err));
  });
};
