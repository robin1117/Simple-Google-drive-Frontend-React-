import AxiosInstance from "./AxiosInstance";

export const getProfileApi = async function () {
  let data = await AxiosInstance.get("/user");
  return data;
};
export const getUsersApi = async function () {
  let data = await AxiosInstance.get("/users");
  return data;
};
