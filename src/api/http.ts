import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { getEnc } from "./wbi";
const instance = axios.create({
  timeout: 5000,
  withCredentials: true,
});
instance.interceptors.request.use((config) => {
  return new Promise<InternalAxiosRequestConfig<any>>((resolve) => {
    if (localStorage.getItem("authorization")) {
      config.headers.authorization = localStorage.getItem("authorization");
    }
    if(config.headers.SESSDATA){
      config.headers.authorization = localStorage.getItem("SESSDATA_Cookies");
    }
    if (config.headers.isWBI) {
      getEnc(config.params).then((res) => {
        config.params={}
        config.url+="?"+res
        resolve(config);
      });
    }else{
      resolve(config);
    }
    
  });
});
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default instance;
