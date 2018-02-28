<template>
    <div class="flash_sale_container" id="flash_sale">
        <div class="flash_sale_head">
            <div class="flash_sale_title_guide">
                <img src="../imgs/flash_logo.svg"/>
            </div>
            <div class="flash_sale_title_time">
                <span class="flash_sale_guide_title_number" v-text="sessionName"></span>
                <span class="flash_sale_guide_title_time_hour" v-text="hour"></span>
                <span class="flash_sale_device">:</span>
                <span class="flash_sale_guide_title_time_min" v-text="min"></span>
                <span class="flash_sale_device">:</span>
                <span class="flash_sale_guide_title_time_second" v-text="seconds"></span>
            </div>
            <div class="flash_sale_title_right_guide">
                <span class="buy_people_counts" v-text="peopleNum"></span>
                <img src="../imgs/right.png"/>
                <span class="buy_people_text"> 人在抢</span>
            </div>
        </div>
        <div class="flash_sale_body_guide">
            <div class="flash_sale_body_guide_container" id="flash_sale_products_list">
                <div class="flash_sale_products_item" v-for="item in products"
                     @click="jump(item.product_image,item.unit_price,item.back_cash,item.product_name,item.url,item.id,item.cps_type)">
                    <div class="flash_sale_products_img">
                        <img :src="item.product_image" :id="item.id" @error="errEvent(item.id)"/>
                    </div>
                    <div class="flash_sale_products_price">
                        <span>￥</span>
                        <span v-text="item.unit_price"></span>
                    </div>
                    <div v-if="!item.ba_coupon" class="flash_sale_products_balance" v-text="item.back_cash">
                    </div>
                    <div class="ms_yhq" v-if="item.ba_coupon && item.ba_coupon.id"
                         v-text="'省' + item.ba_coupon.price + '元'">
                    </div>
                </div>
                <div class="showMore off">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import initImg from "../imgs/initImg.png";

export default {
  name: "flashSale",
  data: function() {
    return {
      products: [],
      sessionName: "",
      peopleNum: "",
      startTime: "",
      endTime: "",
      now: "",
      hour: "",
      min: "",
      seconds: "",
      msHref: "",
      resId: ""
    };
  },
  mounted: function() {
    this.getProducts();
    this.arrowjump();
  },
  methods: {
    arrowjump: function() {
      var me = this;
      $(".flash_sale_title_right_guide img").click(function() {
        var nurl = window.location.href;
        localStorage.setItem("jumpState", "1");
        localStorage.setItem("lastresid", me.resId);

        try {
          var server = newMallTools.getPlatform().server;
          _czc.push(["_trackEvent", "onsale" + server, "点击更多", "秒杀"]);

          newMallTools.selfTjClick({
            position: "onsale" + server,
            actionFrom: "点击更多:秒杀"
          });
        } catch (e) {}

        //window.location.href=me.msHref;
        localStorage.removeItem("lastresid");
        localStorage.removeItem("lastgid");

        newMallTools.redirect(me.msHref);
      });
    },
    jump: function(img, unit, back, pname, url, id, type) {
      console.log(1);
      var me = this;

      var src = $("#" + id).attr("src");

      if (src != initImg) {
        localStorage.setItem("img", img);
      } else {
        localStorage.setItem("img", initImg);
      }

      localStorage.setItem("unit", unit);
      localStorage.setItem("back", back);
      localStorage.setItem("pname", pname);
      localStorage.setItem("url", url);
      localStorage.setItem("id", id);
      localStorage.setItem("cps_type", type);
      localStorage.setItem("jumpState", "0");

      var nurl = window.location.href;

      var toms = me.msHref + "&jpst=0";
      //window.location.href = me.msHref;
      localStorage.setItem("lastresid", me.resId);
      try {
        var server = newMallTools.getPlatform().server;
        _czc.push(["_trackEvent", "onsale" + server, "点击" + pname, "秒杀"]);

        newMallTools.selfTjClick({
          position: "onsale" + server,
          actionFrom: "点击" + pname + ":秒杀"
        });
      } catch (e) {}

      localStorage.removeItem("lastresid");
      localStorage.removeItem("lastgid");

      newMallTools.redirect(toms);
    },
    checkAgent: function() {
      var uastr = window.navigator.userAgent;

      var cur = null;
      if (uastr.match(/APP_iOS/i) || uastr.match(/APP_Android/i)) {
        cur = "app";
      } else if (uastr.match(/MicroMessenger/i)) {
        cur = "wechat";
      } else if (uastr.match(/Alipay/i)) {
        cur = "alipay";
      } else {
        cur = "app";
      }
      return cur;
    },
    getProducts: function() {
      var currOpenid = localStorage.getItem("openid");

      var me = this;
      //               var url = '../../dist/json/product.json';
      var nurl = window.location.href;
      if (nurl.indexOf("dev.yaomall") >= 0) {
        var burl = "http://dev.yaomall.tvm.cn";
      } else if (nurl.indexOf("127.0.0.1") >= 0) {
        var burl = "http://dev.yaomall.tvm.cn";
      } else if (nurl.indexOf("qa.yaomall") >= 0) {
        var burl = "http://qa.yaomall.tvm.cn";
      } else if (nurl.indexOf("192.168") >= 0) {
        var burl = "http://qa.yaomall.tvm.cn";
      } else {
        var burl = "http://huge.yaomall.tvm.cn";
      }

      var agent = me.checkAgent();
      var url;
      if (agent == "wechat") {
        url = burl + "/services/MallMiaoLimitFrontTag?from=wxh";
      } else {
        url = burl + "/services/MallMiaoLimitFrontTag";
      }
      // var url='http://dev.yaomall.tvm.cn/services/MallMiaoLimitFront';
      $.ajax({
        url: url,
        type: "get",
        processData: false,
        dataType: "json",
        timeout: 60000,
        beforeSend: function() {},
        success: function(result) {
          //me.products = result.data.dlimit.product_data;

          if (!result) {
            return false;
          }

          if (!result.data) {
            return false;
          }

          var dlimit = result.data.dlimit;

          if (
            $.isEmptyObject(dlimit) ||
            $.isEmptyObject(dlimit.product_data) ||
            dlimit.product_data.length == undefined
          ) {
            return;
          }

          var productList = result.data.dlimit.product_data;
          me.sessionName = result.data.dlimit.name;
          me.peopleNum = parseInt(result.data.dlimit.num);
          me.startTime = result.data.dlimit.start_time;
          me.endTime = result.data.dlimit.end_time;
          me.nowTime = result.data.dlimit.now;
          me.msHref = result.data.next_page;
          me.resId = result.data.dlimit.id;
          if (!me.peopleNum || me.peopleNum == 0) {
            $(".buy_people_counts").hide();
            $(".buy_people_counts")
              .next()
              .next()
              .hide();
          }

          //添加售罄功能
          for (var i = 0; i < productList.length; i++) {
            if (productList[i].sell_off == "0") {
              me.products.push(productList[i]);
            }
          }

          localStorage.setItem(
            "interface_url",
            result.data.dlimit.interface_url
          );
          //localStorage.setItem('headId',result.data.dlimit.id);
          let st = me.startTime.replace(/\s/g, "T");
          let et = me.endTime.replace(/\s/g, "T");
          let nt = me.nowTime.replace(/\s/g, "T");
          let start = new Date(st).getTime();
          //                        me.countDown(me.startTime, me.endTime, me.nowTime);
          me.countDown(st, et, nt);

          me.$nextTick(function() {
            setTimeout(function() {
              var conWid = $(".flash_sale_body_guide_container").width();
              var deviceW = $(".flash_sale_body_guide").width();
              if (deviceW >= conWid) {
                $(".showMore").addClass("off");
              } else {
                $(".showMore").removeClass("off");
              }
              me.toflashSale();
            }, 500);
          });
        },
        complete: function() {},
        error: function(XMLHttpRequest, textStatus, errorThrown) {}
      });
    },
    toflashSale: function() {
      var me = this;
      var guideWidth = $(".flash_sale_body_guide").width();
      var containerWidth = $(".flash_sale_body_guide_container").width();
      $(".flash_sale_body_guide").scroll(function() {
        var left = $(this).scrollLeft();
        var differ = containerWidth - left;
        if (differ == guideWidth) {
          localStorage.setItem("jumpState", "1");
          localStorage.setItem("lastresid", me.resId);
          //window.location.href=me.msHref

          try {
            var server = newMallTools.getPlatform().server;
            _czc.push(["_trackEvent", "onsale" + server, "滑动更多", "秒杀"]);

            newMallTools.selfTjClick({
              position: "onsale" + server,
              actionFrom: "滑动更多:秒杀"
            });
          } catch (e) {}

          localStorage.removeItem("lastresid");
          localStorage.removeItem("lastgid");

          newMallTools.redirect(me.msHref);
        }
      });
    },
    countDown: function(startTime, endTime, nowTime) {
      var me = this;
      let start = new Date(startTime).getTime();
      let end = new Date(endTime).getTime();
      let now = new Date(nowTime).getTime();
      let ni = nowTime.indexOf("T");
      let si = startTime.indexOf("T");
      let nowHour = parseInt(nowTime.substr(ni + 1).replace(/:/g, ""));
      let startHour = parseInt(startTime.substr(si + 1).replace(/:/g, ""));

      //时间在第一场次开始之前,等待秒杀
      let distance;
      if (nowHour < startHour) {
        distance = Math.abs(start - now);
        me.sessionName = "即将开始";

        localStorage.setItem("nostart", "0");
      } else {
        distance = Math.abs(end - now);
        localStorage.setItem("nostart", "1");
      }

      var timer = setInterval(function() {
        distance = distance - 100;
        let days = parseInt(distance / (1000 * 60 * 60 * 24));
        let hours = parseInt(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );

        if (hours == 0) {
          me.hour = "00";
        } else {
          if (hours < 10) {
            me.hour = "0" + hours;
          } else {
            me.hour = hours;
          }
        }

        let minutes = parseInt((distance % (1000 * 60 * 60)) / (1000 * 60));
        if (minutes == 0) {
          me.min = "00";
        } else {
          if (minutes < 10) {
            me.min = "0" + minutes;
          } else {
            me.min = minutes;
          }
        }
        let seconds = parseInt((distance % (1000 * 60)) / 1000);
        if (seconds == 0) {
          me.seconds = "00";
        } else {
          if (seconds < 10) {
            me.seconds = "0" + seconds;
          } else {
            me.seconds = seconds;
          }
        }
        localStorage.setItem("hour", me.hour);
        localStorage.setItem("min", me.min);
        localStorage.setItem("second", me.seconds);
        if (distance == 0) {
          clearInterval(timer);
          me.getProducts();
        }
      }, 100);
    },
    errEvent: function(id) {
      var divid = id;
      var img = $("#" + divid);
      img.attr("src", initImg);
      img.css({ maxWidth: "60%", maxHeight: "60%" });
    }
  }
};
</script>
<style scoped>
ul,
li,
div,
img,
p {
  padding: 0;
  margin: 0;
}

li {
}

div {
  box-sizing: border-box;
}

.off {
  display: none;
}

.flash_sale_container {
  width: 100%;
  background: #fff;
}

.flash_sale_head {
  line-height: 34px;
  height: 34px;
  background: #fff;
  overflow: hidden;
}

.flash_sale_title_guide {
  float: left;
  margin: -1px 0 12px 0;
  padding: 0 3px;
  max-width: 140px;
  color: #f22632;
  font-weight: bold;
  font-style: italic;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
}

@media screen and (max-width: 350px) {
  .flash_sale_title_guide {
    padding: -1px 0 12px 0;
  }

  .flash_sale_title_guide img {
    height: 19px;
  }
}

.flash_sale_title_guide img {
  height: 25px;
}

.flash_sale_title_time {
  float: left;
}

.flash_sale_title_time {
  font-size: 12px;
}

.flash_sale_guide_title_number {
  font-size: 14px;
  margin-right: 7px;
}

.flash_sale_title_right_guide {
  float: right;
  color: #777;
  font-size: 12px;
}

.flash_sale_title_right_guide img {
  float: right;
  width: 12px;
  height: 12px;
  margin-top: 12px;
  margin-right: 6px;
  margin-left: 5px;
}

.flash_sale_title_right_guide > span:nth-child(1) {
  color: #d43c31;
}

.flash_sale_title_time > span {
  float: left;
}

.flash_sale_device {
  margin: 0 3px 0 3px;
}

.flash_sale_title_time > [class^="flash_sale_guide_title_time"] {
  width: 18px;
  height: 17px;
  border-radius: 2px;
  line-height: 17px;
  text-align: center;
  font-size: 11px;
  background: rgba(0, 0, 0, 0.8);
  padding: 1px;
  color: #fff;
  margin-top: 8px;
}

/*产品列表*/

.flash_sale_body_guide {
  overflow-x: scroll;
  overflow-y: hidden;
  overflow-scrolling: touch;
  -webkit-overflow-scrolling: touch;
}

.flash_sale_body_guide::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  overflow-x: hidden;
  overflow: scroll;
}

.flash_sale_body_guide_container {
  float: left;
  height: 125px;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  margin-left: 0;
}

.flash_sale_products_item {
  box-sizing: border-box;
  padding: 0 6px;
  width: 85px;
  height: 100%;
}

/*内部样式*/

.flash_sale_products_img {
  height: 73px;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}

.flash_sale_products_img img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 3px;
}

.flash_sale_products_price {
  margin-top: 6px;
  padding: 0 6px;
  height: 18px;
  line-height: 18px;
  font-size: 13px;
}

/*yhq*/
.ms_yhq {
  display: inline-block;
  margin-top: 6px;
  height: 12px;
  line-height: 12px;
  font-size: 9px;
  color: #fc4164;
  text-align: right;
  /*text-align: right;
        -webkit-box-pack: start;
        -webkit-justify-content: flex-end;
        justify-content: flex-end;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;*/
  background: url("../imgs/ticket.png") no-repeat 0 0;
  background-size: auto 100%;
  border: 1px solid #fc4164;
  border-left: none;
  padding-right: 3px;
  padding-left: 20px;
}

/*yhq*/

.flash_sale_products_balance {
  margin-top: 4px;
  height: 16px;
  font-size: 10px;
  color: #d43c31;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}

.flash_sale_products_balance:before {
  content: "用余额立返";
  margin-right: 1px;
  padding: 0 1px;
  height: 12px;
  border-radius: 2px;
  line-height: 12px;
  background: #d43c31;
  color: #ffffff;
  font-size: 8px;
}

.showMore {
  color: #aaaaaa;
  font-size: 11px;
}

.showMore > div:nth-child(1):before {
  content: "显";
}

.showMore > div:nth-child(2):before {
  content: "示";
}

.showMore > div:nth-child(3):before {
  content: "更";
}

.showMore > div:nth-child(4):before {
  content: "多";
}

.hide {
  visibility: hidden;
}
</style>































