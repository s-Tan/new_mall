<template>
    <!-- 滚动时的遮罩层 -->
    <div class="transparent-block" style="display:none;" v-show="isShowTrapb"></div>
</template>
<script>
let _platform = newMallTools.getPlatform();
export default {
  props: [],
  data: function() {
    return {
      isShowTrapb: false,
      realScrollTop: 0
    };
  },
  mounted: function() {
    var that = this;
    window.onscroll = function() {
      that.isShowTrapb = true;
      that.realScrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
    };

    setInterval(function() {
      let currTop =
        document.body.scrollTop || document.documentElement.scrollTop;

      if (currTop == that.realScrollTop) {
        that.isShowTrapb = false;
      }
    }, 100);
  },
  methods: {}
};
</script>
<style scoped>
.transparent-block {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  z-index: 999;
  background: transparent;
}
</style>
