<template>
    <div :id="containerId" class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item,inx) in imgList" @click="jump(inx)">
                <img :src="item.image_uri" width="100%">
            </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
    </div>
</template>

<script>
import "swiper/dist/js/swiper";
export default {
  name: "banner",
  props: {
    imgList: {
      type: Array,
      default: []
    },
    position: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      containerId: "sp" + new Date().getTime()
    };
  },
  mounted: function() {},
  methods: {
    jump: function(inx) {
      //debugger;
      try {
        var server = newMallTools.getPlatform().server;

        newMallTools.selfTjClick({
          position: this.position + server,
          actionFrom: "点击" + (inx + 1) + ":" + this.imgList[inx].name
        });

        _czc.push([
          "_trackEvent",
          this.position + server,
          "点击" + (inx + 1),
          this.imgList[inx].name
        ]);

        MtaH5.clickStat("banner", {
          title: $("title").text(),
          name: this.imgList[inx].name,
          id: newMallTools.getUrlParams("id"),
          frame: inx + 1,
          position: this.position + server
        });
      } catch (e) {}

      try {
        var uri = this.imgList[inx].uri;
        var resId = this.imgList[inx].id;

        localStorage.setItem("lastresid", resId || "0000");
        localStorage.removeItem("lastgid");

        newMallTools.redirect(uri);
      } catch (e) {
        console.log(e);
      }
    }
  },
  watch: {
    imgList: function() {
      var mySwiper;
      var that = this;

      this.$nextTick(function() {
        if (that.imgList.length < 2) {
          return false;
        }
        mySwiper = new Swiper("#" + that.containerId, {
          pagination: ".swiper-pagination",
          autoplay: 5000 //可选选项，自动滑动
        });
      });
    }
  }
};
</script>

<style>
@import url("../../node_modules/swiper/dist/css/swiper.min.css");
</style>
