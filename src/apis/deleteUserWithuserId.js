import AxiosInstance from "./AxiosInstance";

export const deleteUserWithUserId = async function (userId, deleteType) {
  let data = await AxiosInstance.delete(`/users/${userId}`, {
    data: { deleteType },
  });
  return data;
};
