import AxiosInstance from "./AxiosInstance";

export const userRegisterApi = async function () {
  let data = await AxiosInstance.post("/user/login");
  return data;
};
