import http from "./http";
export const getFavList = (up_mid:number) => {
  return http.get("https://api.bilibili.com/x/v3/fav/folder/created/list-all",{
    headers:{SESSDATA:true},
    params:{up_mid}
  });
};
export const getFavListContentByMid = (media_id:any,pn:number) => {
    return http.get("https://api.bilibili.com/x/v3/fav/resource/list",{
      headers:{SESSDATA:true},
      params:{media_id,ps:20,pn,platform:'web'}
    });
  };
