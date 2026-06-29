import AxiosInstance from "./AxiosInstance";

export const verifiyOtpApi = async function () {
  let data = await AxiosInstance.post("/auth/verify-otp");
  return data;
};
