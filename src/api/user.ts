import http from './http'
export const getUserInfo = () => {
    return http.get('https://api.bilibili.com/x/web-interface/nav',{
        headers:{SESSDATA:true}
    })
  }