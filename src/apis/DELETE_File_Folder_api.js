import AxiosInstance from "./AxiosInstance";

export const deleteFileApi = async function (fileordir, id) {
  let data = await AxiosInstance.delete(`/${fileordir}/${id}`);
  return data;
};
