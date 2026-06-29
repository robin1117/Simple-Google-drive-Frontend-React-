import AxiosInstance from "./AxiosInstance";

export const createDirectory = async function (dirId) {
  let data = await AxiosInstance.post("/directory/", {}, {
    headers: { parentdirid: dirId },
  });
  return data;
};
