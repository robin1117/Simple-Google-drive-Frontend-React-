import AxiosInstance from "./AxiosInstance";

export const renameApi = async function (renameType, id, value) {
  let data = await AxiosInstance.patch(`/${renameType}/${id}`, {
    fileName: value,
  });
  return data;
};
