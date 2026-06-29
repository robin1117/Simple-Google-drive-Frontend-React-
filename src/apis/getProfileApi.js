import AxiosInstance from "./AxiosInstance";

export const getProfileApi = async function () {
  let data = await AxiosInstance.get("/user");
  return data;
};
