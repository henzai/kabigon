import * as axiosBase from "axios";

export const axios = axiosBase.default;
axios.interceptors.request.use(request => {
  console.log("Starting Request: ", request);
  return request;
});
