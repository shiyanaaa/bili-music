<template>
  <svg class="icon" :class="{loading}" aria-hidden="true">
    <use :xlink:href="`#${name}`"></use>
  </svg>
</template>
<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
