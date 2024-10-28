<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
onMounted(() => {
    console.log("Welcome mounted");
    setTimeout(() => {
        router.push("/home");
    }, 3000);
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
