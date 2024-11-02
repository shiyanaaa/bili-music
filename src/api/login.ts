import http from "./http";
export const generateQrcode = () => {
  return http.get(
    "https://passport.bilibili.com/x/passport-login/web/qrcode/generate"
  );
};

export const pollQrcode = (qrcode_key: string) => {
  return http.get(
    "https://passport.bilibili.com/x/passport-login/web/qrcode/poll",
    {
      params: {
        qrcode_key,
      },
    }
  );
};
export const exitLogin = () => {
  // 读取cookie
  const SESSDATA_Cookies = localStorage.getItem("SESSDATA_Cookies");
  if (!SESSDATA_Cookies) return Promise.reject("未登录");
  const regex = /bbb=(\d+);/;
  const match = SESSDATA_Cookies.match(regex);
  SESSDATA_Cookies;
  return http.post(
    "https://passport.bilibili.com/login/exit/v2",
    {
      biliCSRF: match && match[1] ? match[1] : "",
    },
    {
      headers: { SESSDATA: true },
    }
  );
};
