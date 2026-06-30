import AxiosInstance from "./AxiosInstance";

export const deleteUserWithUserId = async function (userId) {
  let data = await AxiosInstance.delete(`/users/${userId}`);
  return data;
};
