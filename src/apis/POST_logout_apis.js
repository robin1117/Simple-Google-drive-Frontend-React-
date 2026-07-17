import AxiosInstance from "./AxiosInstance";

export const logoutAllApi = async function () {
  let data = await AxiosInstance.post("/user/logoutAll");
  return data;
};

export const logoutApi = async function () {
  let data = await AxiosInstance.post("/user/logout");
  return data;
};

export const logoutWithUserIdApi = async function (userId) {
  let data = await AxiosInstance.post(`/users/${userId}/logout`);
  return data;
};
