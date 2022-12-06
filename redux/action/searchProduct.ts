import { publicRequest } from "../../requestMethods";
import {
  searchProductsSuccess,
  searchProductsStart,
  searchProductsFailure,
} from "../reducers/searchProductRedux";

export const search_products = async (dispatch: any, search = "") => {
  dispatch(searchProductsStart());
  try {
    if (search === "") {
      dispatch(searchProductsSuccess([]));
      return;
    }

    const res = await publicRequest.get(
      `/products?search=${search}&page=1&limit=10&isActive=true`
    );
    if (res.status === 200) {
      const data = await res.data.data.docs.map((item: any) => {
        const image = (item.media || []).find((img: any) => img.isFront);
        return {
          value: item.title,
          description: item.description,
          imageURL: image ? image?.imageURL : item?.imageURL || "",
          id: item._id,
          category_name: item.category_name || "",
          brand_name: item.brand_name || "",
          isbn: item.isbn || "",
        };
      });
      dispatch(searchProductsSuccess(data));
    } else {
      dispatch(searchProductsFailure());
    }
  } catch (err) {
    dispatch(searchProductsFailure());
  }
};
