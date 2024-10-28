import http from './http'
export const getDetail = (aid:string) => {
    return http.get('https://api.bilibili.com/x/web-interface/view',{
        headers: { 'content-type': 'multipart/form-data' },
        params:{
            aid
        }
    })
  }
export const getVideoDetail = (params:{}) => {
  return http.get('https://api.bilibili.com/x/player/wbi/playurl',{
    params
  })
}