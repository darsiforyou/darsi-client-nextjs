import { publicRequest } from "../../requestMethods";

export const createOrder = (data: any) => {
  return new Promise((resolve, reject) => {
    publicRequest
      .post(`/orders`, data)
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => reject(err));
  });
};
