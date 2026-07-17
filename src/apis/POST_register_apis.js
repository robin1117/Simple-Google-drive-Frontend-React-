import AxiosInstance from "./AxiosInstance";

export const userRegisterApi = async function (formData) {
  let data = await AxiosInstance.post("/user/register", formData);
  return data;
};

export const verifiyOtpApi = async function (formData) {
  let data = await AxiosInstance.post("/auth/verify-otp", formData);
  return data;
};

export const senOtpApi = async function (formData) {
  let data = await AxiosInstance.post("/auth/sent-otp", formData);
  return data;
};
