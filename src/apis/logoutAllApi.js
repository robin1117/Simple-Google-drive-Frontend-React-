import AxiosInstance from "./AxiosInstance";

export const logoutAllApi = async function () {
  let data = await AxiosInstance.post("/user/logoutAll");
  return data;
};
