import { publicRequest } from "../../requestMethods";
import { apply_ref_code } from "../reducers/cartRedux";

export const apply_discount_code = (dispatch: any, code: any) => {
  return new Promise((resolve, reject) => {
    publicRequest
      .get(`/users/code/${code}`)
      .then((user: any) => {
        publicRequest
          .get(`/packages/${user.data.referral_package}`)
          .then(async (p: any) => {
            await dispatch(apply_ref_code({code, discount_percentage: p.data.discount_percentage}));
            await resolve(p.data);
          })
          .catch((err: any) => reject(err));
      })
      .catch((err: any) => reject(err));
  });
};
