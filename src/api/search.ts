import http from './http'
export const getToken = () => {
    return http.get('https://www.bilibili.com')
  }
export const getSuggest = (term: string) => {
  return http.get('https://s.search.bilibili.com/main/suggest',{
    params:{
      term
    }
  })
}
export const getSearchByType = (params:any) => {
  return http.get('https://api.bilibili.com/x/web-interface/wbi/search/type',{
    params,
    headers:{isWBI:true}
  })
}