import AxiosInstance from "./AxiosInstance";

export const logoutWithUserId = async function (userId) {
  let data = await AxiosInstance.post(`/users/${userId}/logout`);
  return data;
};
