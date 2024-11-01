import http from './http'
export const generateQrcode = () => {
    return http.get('https://passport.bilibili.com/x/passport-login/web/qrcode/generate')
  }

  export const pollQrcode = (qrcode_key:string) => {
    return http.get('https://passport.bilibili.com/x/passport-login/web/qrcode/poll',{
        params:{
            qrcode_key
        }
    })
  }