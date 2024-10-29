<script setup lang="ts">
import { getToken } from '../api/search';
import { onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
onMounted(() => {
    getToken().then(res => {
        localStorage.setItem("authorization", res.headers.authorization)
        router.push("/home")
    })
});
</script>

<template>
    <div class="welcome">
        <img class="welcome_logo" src="/image/bili_logo.svg" alt="">
    </div>
</template>

<style scoped lang="scss">
.welcome{
    background-color: var(--color-background);
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    .welcome_logo{
        height: 20vh;

    }
}


</style>
