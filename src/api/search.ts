import http from './http'
export const getToken = () => {
    return http.get('https://www.bilibili.com')
  }
export const search = (keyword: string) => {
  return http.get('https://www.bilibili.com')
}