import AxiosInstance from "./AxiosInstance";

export const logoutApi = async function () {
  let data = await AxiosInstance.post("/user/logout");
  return data;
};
