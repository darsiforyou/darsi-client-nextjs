import { publicRequest } from "../../requestMethods";

export const get_banner_content = () => {
  return new Promise((resolve, reject) => {
    publicRequest
      .get(`/dashboard-setting/without_filter`)
      .then((data: any) => resolve(data))
      .catch((err: any) => reject(err));
  });
};
