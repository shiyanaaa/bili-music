import axios from "axios";

const instance = axios.create({
  timeout: 5000,
});
instance.interceptors.request.use((config) => {
    if(localStorage.getItem("authorization")){
        config.headers.authorization=localStorage.getItem("authorization")
    }
    return config;
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