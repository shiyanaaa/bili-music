<template>
    <div @click="getMusicDetail">123</div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { getDetail,getVideoDetail } from '../api/music';
onMounted(()=>{
    // search("123").then(res=>{
    //     console.log(res.headers)
    //     console.log(res.headers['set-cookie'])
    // })
})
const getMusicDetail=()=>{
    getDetail("85440373").then(res=>{
        console.log(res.data)
        getVideoDetail({
            avid:"85440373",
            cid:res.data.data.cid
        }).then(res=>{
            console.log(res)
        })
    })
}
</script>
<style lang="scss"></style>