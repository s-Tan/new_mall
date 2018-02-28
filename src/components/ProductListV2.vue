<template>
    <ul class="list">
        <li class="h5-items-s" v-for="(item,inx) in products">
            <a href="javascript:;" @click="jumpToLink(inx,$event)">
                <div class="item-pic">
                    <img class="flat" src="../imgs/is_new.png" v-show="item.today_new">
                    <div class="show123" v-show="isshow123 && inx<3"></div>
                    <img src="../imgs/ms2.png" class="miao-sha" v-show="item.is_ms">
                    <img class="pro-img lazy" v-lazy="item.product_image">
                </div>
                <div class="item-info ">
                    <p class="pro-name" :class="getProductType(inx)">
                        <span v-text="item.product_name"></span>
                    </p>
                    <!-- 多买多返 -->
                    <div class="dmdf">
                        <img src="../imgs/dmdf.png" :class="{'opacity0':!item.is_dmdf}">
                    </div>
                    <!-- 用余额立返 -->
                    <div class="ye" v-show="!item.ba_coupon">
                      <span class="promote-price-flex" v-text="formatPrice(item.back_cash)"></span>
                    </div>
                    <!-- 卡券 -->
                    <div class="quan-wrapper" v-show="item.ba_coupon">
                      <div class="quan-price" v-text="item.ba_coupon?'省'+item.ba_coupon.price+'元':''"></div>
                    </div>
                    <!-- 原价 -->
                    <div class="cost-price" v-text="item.unit_price"></div>
                    <!-- 到手价 -->
                    <div>
                      <div class="real-price" v-text="getRealPrice(inx)" :class="{'real-price-coupon':item.ba_coupon}"></div>
                    </div>
                    <div class="lable">
                        <img src="../imgs/go_now.png">
                    </div>
                </div>
            </a>
        </li>
    </ul>
</template>

<script>
import Vue from "vue";
import VueLazyload from "vue-lazyload";

Vue.use(VueLazyload, {
  preLoad: 2,
  attempt: 4
});

export default {
  name: "productList",
  props: {
    products: {
      type: Array,
      default: []
    },
    isshow123: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: "0000"
    },
    gid: {
      type: String,
      default: "0000"
    }
  },
  data: function() {
    return {
      openid: ""
    };
  },
  mounted: function() {
    this.openid = window.localStorage.getItem("openid");

    var baseWidth = 750;
    var currWidth = $("html")[0].offsetWidth;

    $(".list").css({
      zoom: currWidth / baseWidth
    });
  },
  methods: {
    jumpToLink: function(inx, e) {
      e.stopPropagation();

      //debugger;

      localStorage.setItem("lastresid", this.id);
      localStorage.setItem("lastgid", this.gid);

      var that = this;
      var instc = this.products[inx];
      var link = this.products[inx].link;

      if (link) {
        var apiUri = newMallTools.getApiUrl("GetCpsProductActivity");
        newMallTools.baseAjax({
          type: "post",
          url: apiUri,
          data: JSON.stringify({
            product_id: instc.product_id,
            sku_id: instc.sku_id || "",
            open_id: localStorage.getItem("openid"),
            mall_id: newMallTools.mallId,
            is_dlimit: true
          }),
          cb: function(req) {
            if (typeof req == "string") {
              req = JSON.parse(req);
            }

            var uri = link;

            if (uri.indexOf("redirectTmall?") >= 0) {
              newMallTools.redirect(uri, instc, req.data);

              return false;
            }

            if (req.data) {
              newMallTools.redirect(uri, instc, req.data);
            } else {
              newMallTools.redirect(uri, instc);
            }
          }
        });
      } else if (link) {
        newMallTools.redirect(link, instc);
      }
    },
    imgError: function(inx, e) {
      e.target.remove();
    },
    formatPrice: function(num) {
      num = parseFloat(num);
      if (isNaN(num)) {
        return "0.00";
      }

      return num.toFixed(2);
    },
    getProductType: function(inx) {
      var instc = this.products[inx];

      if (!instc) {
        return "";
      }
      return newMallTools.getProductCpsType(instc);
    },
    getRealPrice: function(inx) {
      var obj = this.products[inx];

      if (!obj) {
        return false;
      }

      var price = Number(obj.unit_price);
      var back = Number(obj.back_cash);

      if (obj.ba_coupon && obj.ba_coupon.price) {
        back = Number(obj.ba_coupon.price);
      } else {
      }

      if (price && back) {
        price = price - back;
      }

      if (!price) {
        price = 0;
      }

      return price.toFixed(2);
    }
  },
  watch: {
    products: function() {}
  }
};
</script>

<style scoped>
.list {
  width: 100%;
}

.h5-items-s {
  display: inline-block;
  width: 738px;
  height: 282px;
  margin: 9px 0 0 6px;
  background: #fff;
  border-radius: 10px;
}

.item-pic {
  display: inline-block;
  position: relative;
  width: 282px;
  height: 282px;
  border-radius: 10px 0 0 10px;
  background: url(../imgs/img_default.png) no-repeat center center;
  background-size: 60%;
}

.item-pic .flat {
  position: absolute;
  right: 0;
  top: 24px;
  z-index: 1;
}

.item-pic .miao-sha {
  position: absolute;
  left: 20px;
  top: 0;
  width: 61px;
  z-index: 1;
}

.item-pic .pro-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  border-radius: 10px 0 0 10px;
}

.show123 {
  position: absolute;
  left: 0;
  top: 0;
  width: 84px;
  height: 84px;
  z-index: 990;
}

.h5-items-s:nth-of-type(1) .item-pic .show123 {
  background: url(../imgs/hot1.png) no-repeat center / 100%;
}

.h5-items-s:nth-of-type(2) .item-pic .show123 {
  background: url(../imgs/hot2.png) no-repeat center / 100%;
}

.h5-items-s:nth-of-type(3) .item-pic .show123 {
  background: url(../imgs/hot3.png) no-repeat center / 100%;
}

.item-info {
  position: relative;
  display: inline-block;
  width: 427px;
  height: 282px;
  margin-left: 20px;
  padding-right: 20px;
}

.pro-name {
  margin-top: 20px;
  min-height: 76px;
}

.pro-name span {
  display: inline-block;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 28px;
  zoom: 0.99;
  color: #323232;
  text-indent: 32px;
  line-height: 1.5;
}

.dmdf {
  display: inline-block;
  width: 85px;
  height: 26px;
  margin-top: 8px;
}

.h5-item-price-info {
  margin-top: 30px;
}

.cost-price {
  display: inline-block;
  font-size: 20px;
  zoom: 0.9999;
  color: #969696;
  padding-top: 16px;
}

.cost-price::before {
  content: "原价 ￥";
  color: #969696;
}

.ye {
  padding-top: 10px;
}

.promote-price-flex {
  display: inline-block;
  height: 30px;
  font-size: 20px;
  font-weight: bold;
  line-height: 36px;
  zoom: 0.9999;
  color: #fb6a23;
  padding-left: 160px;
  padding-right: 10px;
  border-radius: 6px;
  list-style: none;
  background: #fee1d3 url(../imgs/ye_bg.png) no-repeat left center / auto 100%;
}

.real-price {
  display: inline-block;
  font-size: 32px;
  zoom: 0.9999;
  font-weight: bolder;
  color: #d43c31;
  padding-left: 4px;
  margin-top: 10px;
}

.real-price::before {
  content: "到手价 ￥";
  font-size: 20px;
  zoom: 0.9999;
  font-weight: 500;
}

.real-price-coupon.real-price::before {
  content: "券后价 ￥";
  font-size: 20px;
  zoom: 0.9999;
  font-weight: 500;
}

.lable {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.quan-wrapper {
  display: block;
  padding-top: 10px;
}

.quan-wrapper .quan-price {
  display: inline-block;
  height: 30px;
  line-height: 36px;
  background: url(../imgs/quan_bg.png) no-repeat left top / auto 100%,
    url(../imgs/quan_price_bg.png) no-repeat right top/ auto 100%;
  border-radius: 8px;
  padding-left: 95px;
  padding-right: 20px;
  color: #e60038;
  font-size: 20px;
  font-weight: bold;
  zoom: 0.9999;
}

.jd {
  background: url(../imgs/jd.png) no-repeat left 3px / 28px auto;
}

.yhd {
  background: url(../imgs/yhd.png) no-repeat left 3px / 28px auto;
}

.tmall {
  background: url(../imgs/tmall.png) no-repeat left 3px / 28px auto;
}

.taobao {
  background: url(../imgs/taobao.png) no-repeat left 3px / 28px auto;
}

.sj {
  background: url(../imgs/shoujia.png) no-repeat left 3px / 28px auto;
}
</style>
