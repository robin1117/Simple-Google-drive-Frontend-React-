import AxiosInstance from "./AxiosInstance";

export const sendingAuthCode = async function (code) {
  let data = await AxiosInstance.post("/auth/auth-code", code, {  });
  return data;
};

export const sendingLoginData = async function (dataObj) {
  let data = await AxiosInstance.post("/user/login", dataObj);
  return data;
};
