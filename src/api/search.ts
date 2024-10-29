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