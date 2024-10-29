<template>
  <div class="musicList">
    <div
      class="musicItem"
      @click="onPlay(item)"
      v-for="item in list"
      :key="item.aid"
    >
      <div class="musicItem-img">
        <img :src="item.pic" alt="" />
      </div>
      <div class="musicItem-title">
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["play"]);
defineProps({
  list: { type: Array, default: () => [] as any[] },
});
const onPlay = (item:any) => {
  emit("play", item);
};
</script>

<style scoped lang="scss">
@import "../assets/mixin.scss";
$num: (
    "0px": 1,
  "400px": 2,
  "600px": 3,
  "992px": 4,
  "1200px": 5,
);
.musicList {
  width: 100%;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  .musicItem {
    margin-right: 10px;
    @each $name, $glyph in $num {
      @media (min-width: #{$name}) {
        width: calc(calc(100% - calc(10px * calc(#{$glyph} - 1))) / #{$glyph} );
        
        &:nth-child(#{$glyph}n) {
          margin-right: 0;
        }
        &:not(:nth-child(#{$glyph}n)){
            margin-right: 10px;
        }
      }
    }
    // width: calc(calc(100% - calc(10px * #{$num - 1})) / #{$num});
    

    .musicItem-img {
      width: 100%;
      padding-bottom: calc(100% * calc(9 / 16));
      position: relative;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
        border-radius: 8px;
      }
    }
    .musicItem-title {
      padding: 5px 0;
      @include show_line(2);
      cursor: pointer;
      &:hover{
        color: #f16c8d;
      }
    }
  }
}
</style>
