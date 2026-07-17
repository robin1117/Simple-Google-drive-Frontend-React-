import AxiosInstance from "./AxiosInstance";

export const getDirectoryDataApi = async function (dirId) {
  let data = await AxiosInstance.get(`/directory/${dirId}`);
  return data;
};
