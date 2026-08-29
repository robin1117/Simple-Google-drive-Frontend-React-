import AxiosInstance from "./AxiosInstance";

export const createDirectoryApi = async function (dirId) {
  let data = await AxiosInstance.post(`/directory/${dirId}`);
  return data;
};
