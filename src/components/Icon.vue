<template>
    <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#${name}`"></use>
</svg>
</template>
<script lang="ts" setup>
defineProps({
    name:{
        type:String,
        default:""
    }
})

</script>