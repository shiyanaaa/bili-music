<template>
  <a-modal v-model:open="open" centered>
    <div class="login-box">
      <div class="qrcode-box">
        <div class="title">扫描二维码登录</div>
        <div class="qrcode" @click="refreshQrcode">
          <div class="status" v-if="status !== 0">
            <a-result
              class="result-inner"
              v-if="status === 1"
              status="success"
              title="扫码成功"
              sub-title="请点击登录"
            >
            </a-result>
            <a-result
              class="result-inner"
              v-else-if="status === -1"
              status="error"
              title="扫码过期"
              sub-title="点击重新获取"
            >
            </a-result>
          </div>
          <VueQrcode
            v-if="qrcodeInfo.url"
            type="image/png"
            :color="{ dark: '#000000ff', light: '#ffffffff' }"
            :value="qrcodeInfo.url"
            :width="150"
          />
          <div v-else class="qrcode-loading">
            <v-icon name="icon-loading1" loading />
          </div>
        </div>
      </div>
      <div class="account-box"></div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { generateQrcode, pollQrcode } from "../api/login";
import VueQrcode from "vue-qrcode";
const open = ref(false);
const qrcodeInfo = ref({
  url: "",
  qrcode_key: "",
});

const init = () => {
  status.value = 0;
  qrcodeInfo.value = {
    url: "",
    qrcode_key: "",
  };
  generateQrcode().then((res) => {
    qrcodeInfo.value = res.data.data;
    startRequest();
  });
};
const refreshQrcode = () => {
  if (status.value === -1) init();
};
const status = ref(0);
const startRequest = () => {
  if (!open.value) return;
  pollQrcode(qrcodeInfo.value.qrcode_key).then((res) => {
    console.log(res);
    const { code, message } = res.data.data;
    if (code === 86101) status.value = 0;
    else if (code === 86090) status.value = 1;
    else if (code === 86038) status.value = -1;
    else if (code === 0) return loginSuccess(res);
    console.log(message);
    setTimeout(startRequest, 1000);
  });
};
const loginSuccess = (res: any) => {
  localStorage.setItem("SESSDATA_Cookies", res.headers.authorization);
  localStorage.setItem("refresh_token", res.data.data.refresh_token);
  localStorage.setItem("url", res.data.data.url);
  localStorage.setItem("timestamp", res.data.data.timestamp);
  close();
};
const show = () => {
  open.value = true;
  init();
};
const close = () => {
  open.value = false;
};
defineExpose({ show, close });
</script>
<style scoped lang="scss">
.login-box {
  display: flex;
  padding: 10px;
  .title {
    font-size: 20px;
    margin-bottom: 15px;
  }
  .qrcode-box {
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .qrcode {
      border: 1px solid var(--border-color);
      // padding: 2px;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      .status {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba($color: #000000, $alpha: 0.7);
        .status-inner {
        }
      }
      .qrcode-loading {
        width: 150px;
        height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }
    }
  }
}
.result-inner {
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  :deep(.ant-result-icon) {
    span {
      font-size: 30px;
    }
  }

  :deep(.ant-result-icon) {
    margin-bottom: 0;
  }
  :deep(.ant-result-title) {
    font-size: 16px;
  }
}
</style>
