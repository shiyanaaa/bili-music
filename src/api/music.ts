import http from './http'
export const getDetail = (params:any) => {
    return http.get('https://api.bilibili.com/x/web-interface/view',{
        headers: { 'content-type': 'multipart/form-data' },
        params
    })
  }
export const getVideoDetail = (params:any) => {
  return http.get(`https://api.bilibili.com/x/player/wbi/playurl`,{
    headers:{isWBI:true},
    params
  })
}
export const getVideoDetailInfo = (params:any) => {
  return http.get(`https://api.bilibili.com/x/web-interface/view/detail`,{
    headers:{isWBI:true},
    params
  })
}
export const getHotListByRid= (rid:string)=>{
  return http.get(`https://api.bilibili.com/x/web-interface/ranking/region`,{
    params:{
      rid,
      original:0,
      day:7
    }
  })
}