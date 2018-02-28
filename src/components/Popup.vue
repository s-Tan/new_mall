<template>
    <div>
        <div id="dialog-face" class="none">
        </div>
        <div id="dialog" class="none">

            <div id="dialog-wrapper">
                <div class="dialog-content" :style="stylePB">
                    <div class="ad-1-close" @click="closeEvent" v-show="isAdcolsed"></div>
                    <div class="ad-1-img-wrapper">
                        <img :src="adImgUri" @click="adJump()">
                    </div>
                    <div class="ad-checkbox-is-show" v-show="isAdTipShow">
                        <input id="firstAdNo" type="checkbox" v-model="adCheckbox">
                        <label for="firstAdNo">下次不再提示</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
let _platform = newMallTools.getPlatform();
export default {
  props: ["pad"],
  data: function() {
    return {
      isAdShow: true,
      isAdcolsed: false,
      adCurr: "",
      adUrl: "",
      adImgUri: "",
      adCheckbox: false,
      isAdTipShow: false,
      adFirstId: "adfirst",
      adId: "",
      adName: "",
      stylePB: ""
    };
  },
  methods: {
    toggleDialog: function() {
      //                alert(document.body.style.overflow)
      var animationClass = this.isAdShow ? "slipUp" : "slipBottom";
      var animation = function() {
        var ele = document.getElementById("dialog-face");
        ele.className = "dialog-face " + animationClass;
        ele = document.getElementById("dialog");
        ele.className = "dialog-root " + animationClass;
        ele = document.getElementById("dialog-wrapper");
        ele.className = "dialog-wrapper " + animationClass;
      };
      var time = 100;
      if (!this.isAdShow) {
        time = 100;
      }
      setTimeout(animation, time);
    },
    showAD: function() {
      this.showNormalAD();
      // 新人广告
      // if (_platform.app) {
      //     this.showNewHumenAD()
      // } else {
      //     this.showNormalAD()
      // }
    },
    showNewHumenAD: function() {
      this.adCurr = "firstad";
      let that = this;
      let pdt = {
        customer_id: localStorage.getItem("openid")
        // customer_id: '22e'
      };
      newMallTools.baseAjax({
        type: "post",
        url: newMallTools.getApiUrl("FirstAd"),
        data: JSON.stringify(pdt),
        cb: function(req) {
          if (typeof req === "string") {
            req = JSON.parse(req);
          }

          if (req.data && req.data.length > 0) {
            that.adName = "新人弹窗带下次不显示";
            that.adImgUri = req.data[0];
            that.isAdShow = true;
            that.isAdTipShow = true;
            that.isAdcolsed = true;
            document.body.className = "stopScrollBody";
            $("html").addClass("stopScrollBody");
            this.stylePB = {
              paddingBottom: "48px"
            };
            that.toggleDialog();
          } else {
            that.showNormalAD();
          }
        }
      });
    },
    showNormalAD: function() {
      this.adCurr = "ad";
      let arr = this.pad || [];
      try {
        if (arr.length > 0) {
          this.adImgUri = arr[0].image_uri;
          this.adUrl = arr[0].uri;
          this.isAdShow = true;
          this.isAdcolsed = true;
          this.isAdTipShow = false;
          this.adId = arr[0].id;
          this.adName = arr[0].name || "0000";
          document.body.className = "stopScrollBody";
          $("html").addClass("stopScrollBody");
          this.stylePB = {
            paddingBottom: "0px"
          };
          this.toggleDialog();
        }
      } catch (e) {
        console.error("ad", JSON.stringify(e));
      }
    },
    closeEvent: function() {
      document.body.className = "";
      $("html").removeClass("stopScrollBody");
      try {
        let server = newMallTools.getPlatform().server;
        _czc.push(["_trackEvent", "adclose" + server, "点击", "广告关闭按钮"]);

        newMallTools.selfTjClick({
          position: "adclose" + server,
          actionFrom: "点击:广告关闭按钮"
        });
      } catch (e) {}
      this.isAdShow = false;
      let pdt = {
        customer_id: localStorage.getItem("openid")
        // customer_id: '22e'
      };
      if (this.isAdTipShow) {
        if (this.adCheckbox) {
          $.ajax({
            type: "post",
            url: newMallTools.getApiUrl("ForbidFirstAd"),
            data: JSON.stringify(pdt),
            success: function(req) {}
          });
        }
      }
      this.toggleDialog();
    },
    adJump: function() {
      if (this.adCurr === "ad") {
        localStorage.setItem("lastresid", this.adId);
        localStorage.setItem("lastgid", "0000");

        try {
          let server = newMallTools.getPlatform().server;
          _czc.push(["_trackEvent", "pushad" + server, "点击", this.adName]);

          newMallTools.selfTjClick({
            position: "pushad" + server,
            actionFrom: "点击:" + this.adName
          });
        } catch (e) {}
      } else {
        localStorage.setItem("lastresid", this.adFirstId);
        localStorage.setItem("lastgid", "0000");

        try {
          let server = newMallTools.getPlatform().server;
          _czc.push(["_trackEvent", "pushad" + server, "点击", this.adName]);

          newMallTools.selfTjClick({
            position: "pushad" + server,
            actionFrom: "点击:" + this.adName
          });
        } catch (e) {}
      }

      newMallTools.redirect(this.adUrl);
    }
  },
  mounted: function() {
    const _self = this;
    _self.$nextTick(function() {
      // Code that will run only after the
      // entire view has been rendered
      setTimeout(function() {
        _self.showAD();
      }, 1000);
    });
  }
};
</script>
<style scoped>
/* ---------------------公共样式 -------------------*/
.none {
  display: none;
}

.layout-root {
  position: fixed;
  background: #e74c3c;
  height: 100%;
  width: 100%;
  z-index: 1000;
  top: 0;
  left: 0;
}

.layout-content {
  line-height: 44px;
  font-weight: 300;
  font-size: 1em;
  color: #fff;
  text-indent: 10px;
}

.layout-content .code {
  line-height: 22px;
  text-align: center;
}

p {
  display: block;
  -webkit-margin-before: 1em;
  -webkit-margin-after: 1em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
}

a,
button {
  outline: none;
}

button {
  border: none;
  padding: 0.6em 1.2em;
  background: #c0392b;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  display: block;
  margin: 3px auto;
  border-radius: 2px;
}

button:hover,
button:active,
button:focus {
  border: none;
}

/* ---------------------弹窗样式 -------------------*/
.dialog-face {
  position: fixed;
  background: #000;
  height: 100%;
  width: 100%;
  z-index: 1000;
  top: 0;
  left: 0;

  -webkit-animation-duration: 500ms;
  -moz-animation-duration: 500ms;
  -o-animation-duration: 500ms;
  animation-duration: 500ms;
}

.dialog-face.slipBottom[opacity="0"] {
  display: none;
}

.dialog-face.slipUp {
  opacity: 0.7;
  -webkit-animation-name: dialogFaceSlipToUp;
  -moz-animation-name: dialogFaceSlipToUp;
  -o-animation-name: dialogFaceSlipToUp;
  animation-name: dialogFaceSlipToUp;
}

.dialog-face.slipBottom {
  opacity: 0;
  visibility: hidden;
  -webkit-animation-name: dialogFaceSlipToBottom;
  -moz-animation-name: dialogFaceSlipToBottom;
  -o-animation-name: dialogFaceSlipToBottom;
  animation-name: dialogFaceSlipToBottom;
}

.dialog-root {
  position: fixed;
  z-index: 2000;
  left: 50%;
  width: 70%;
  -webkit-animation-duration: 500ms;
  -moz-animation-duration: 500ms;
  -o-animation-duration: 500ms;
  animation-duration: 500ms;
  -webkit-perspective: 1300px;
  -moz-perspective: 1300px;
  perspective: 1300px;
}

.dialog-root.slipUp {
  top: 46%;
  opacity: 1;

  -webkit-animation-name: dialogSlipToUp;
  -moz-animation-name: dialogSlipToUp;
  -o-animation-name: dialogSlipToUp;
  animation-name: dialogSlipToUp;
  -webkit-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.dialog-root.slipBottom {
  top: 100%;
  opacity: 0.3;
  -webkit-animation-duration: 500ms;
  -moz-animation-duration: 500ms;
  -o-animation-duration: 500ms;
  animation-duration: 500ms;
  -webkit-animation-name: dialogSlipToBottom;
  -moz-animation-name: dialogSlipToBottom;
  -o-animation-name: dialogSlipToBottom;
  animation-name: dialogSlipToBottom;
  -webkit-transform: translate(-50%, 0);
  -o-transform: translate(-50%, 0);
  -moz-transform: translate(-50%, 0);
  -ms-transform: translate(-50%, 0);
  transform: translate(-50%, 0);
}

.dialog-wrapper {
  /*background: #E74C3C;*/
  /*background: rgba(0, 0, 0, 0.4);*/
  width: 100%;
  height: 375px;
  overflow: hidden;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;

  -webkit-animation-duration: 500ms;
  -moz-animation-duration: 500ms;
  -o-animation-duration: 500ms;
  animation-duration: 500ms;
  -webkit-transform-origin: 50% 100%;
  -moz-transform-origin: 50% 100%;
  -ms-transform-origin: 50% 100%;
  -o-transform-origin: 50% 100%;
  transform-origin: 50% 100%;
  padding-top: 40px;
}

.dialog-wrapper.slipUp {
  -webkit-transform: rotateX(0deg);
  -moz-transform: rotateX(0deg);
  -ms-transform: rotateX(0deg);
  -o-transform: rotateX(0deg);
  transform: rotateX(0deg);
  -webkit-animation-name: contentSlipToUp;
  -moz-animation-name: contentSlipToUp;
  -o-animation-name: contentSlipToUp;
  animation-name: contentSlipToUp;
}

.dialog-wrapper.slipBottom {
  -webkit-transform: rotateX(90deg);
  -moz-transform: rotateX(90deg);
  -ms-transform: rotateX(90deg);
  -o-transform: rotateX(90deg);
  transform: rotateX(90deg);
  -webkit-animation-name: contentSlipToBottom;
  -moz-animation-name: contentSlipToBottom;
  -o-animation-name: contentSlipToBottom;
  animation-name: contentSlipToBottom;
}

.dialog-header {
  height: 75px;
  background: #d94839;
  text-align: center;
}

.dialog-header span {
  font-size: 28px;
  line-height: 75px;
  color: #f6cbc6;
}

.dialog-content {
  font-weight: 300;
  font-size: 1.15em;
  color: #fff;
  /*padding: 15px 40px 20px 40px;*/
  margin: 0;
  height: 100%;
  /*padding-bottom: 48px;*/
}

.dialog-content p {
  margin: 0;
  padding: 10px 0;
}
.dialog-content.ad-checkbox-is-show {
  position: absolute;
  bttom: 0;
  width: 100%;
  height: 48px;
  line-height: 48px;
  left: 0;
}
.dialog-footer {
}
.ad-1-img-wrapper {
  background: url(../imgs/img_default.png) no-repeat center center;
  background-size: 60%;
}
.ad-1-img-wrapper img {
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}

/* ---------------------动画关键帧 -------------------*/

@keyframes dialogFaceSlipToUp {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.7;
  }
}

@keyframes dialogFaceSlipToBottom {
  0% {
    opacity: 0.7;
    visibility: visible;
  }
  100% {
    visibility: hidden;
    opacity: 0;
  }
}

@keyframes dialogSlipToUp {
  0% {
    top: -50%;
    opacity: 0.3;
  }
  /*25%{
            top: -25%;
            opacity: 0.5;
        }
        50%{
            top: 0%;
            opacity: 0.7;
        }*/
  100% {
    top: 46%;
    opacity: 1;
  }
}

@keyframes dialogSlipToBottom {
  0% {
    top: 50%;
    opacity: 1;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  100% {
    top: 100%;
    opacity: 0.3;
    -webkit-transform: translate(-50%, 0);
    -moz-transform: translate(-50%, 0);
    -ms-transform: translate(-50%, 0);
    -o-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
  }
}

@keyframes contentSlipToUp {
  0% {
    -webkit-transform: rotateX(0deg);
    -moz-transform: rotateX(0deg);
    -ms-transform: rotateX(0deg);
    -o-transform: rotateX(0deg);
    transform: rotateX(0deg);
  }
  100% {
    -webkit-transform: rotateX(0deg);
    -moz-transform: rotateX(0deg);
    -ms-transform: rotateX(0deg);
    -o-transform: rotateX(0deg);
    transform: rotateX(0deg);
  }
}

@keyframes contentSlipToBottom {
  0% {
    -webkit-transform: rotateX(0deg);
    -moz-transform: rotateX(0deg);
    -ms-transform: rotateX(0deg);
    -o-transform: rotateX(0deg);
    transform: rotateX(0deg);
  }
  60% {
    -webkit-transform: rotateX(0deg);
    -moz-transform: rotateX(0deg);
    -ms-transform: rotateX(0deg);
    -o-transform: rotateX(0deg);
    transform: rotateX(0deg);
  }
  100% {
    -webkit-transform: rotateX(0deg);
    -moz-transform: rotateX(0deg);
    -ms-transform: rotateX(0deg);
    -o-transform: rotateX(0deg);
    transform: rotateX(0deg);
  }
}
</style>
