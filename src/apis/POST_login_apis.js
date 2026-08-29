import AxiosInstance from "./AxiosInstance";

export const sendingAuthCode = async function (code) {
  let data = await AxiosInstance.post("/auth/auth-code", code, {
    timeout: 10000,
  });
  return data;
};

export const sendingLoginData = async function (dataObj) {
  let data = await AxiosInstance.post("/user/login", dataObj);
  return data;
};

export const requestingUrlResetPassword = async function (email) {
  let data = await AxiosInstance.post("/auth/forgot-password", email);
  return data;
};

export const resetPasswordUsingUrl = async function (dataObj) {
  let data = await AxiosInstance.post("/auth/reset-password", dataObj);
  return data;
};
