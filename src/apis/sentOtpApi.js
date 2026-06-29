import AxiosInstance from "./AxiosInstance";

export const sentOtpApi = async function () {
  let data = await AxiosInstance.post("/auth/sent-otp");
  return data;
};
