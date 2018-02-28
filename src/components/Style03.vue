<template>
    <div>
        <banner :img-list="imgList" position="style03" v-show="imgList && imgList.length>0"></banner>
        <div class="product-list-wrapper" v-show="isShowProductList">
            <ul class="product-list" :style="{'background-color':colorNum || '#f0f0f0'}">
                <li class="product-item" v-for="(item,inx) in productList" @tap="jumpToLink(inx,$event)">
                    <div class="img-wra">
                        <img class="product-img lazy" :src="item.product_image" v-if="isIos">
                        <img class="product-img lazy" v-lazy="item.product_image" v-if="isAndroid">
                        <div class="flag" v-show="item.today_new"></div>
                        <div class="group" :class="{'opacity0':!item.is_dmdf}"></div>
                        <img src="../imgs/ms2.png" class="miao-sha" v-show="item.is_ms">
                    </div>
                    <div class="product-info">
                        <span class="product-name" :class="getProductType(inx)" v-text="item.product_name"></span>
                        <div class="product-price-info">
                            <span class="product-price" v-text="formatPrice(item.unit_price)"></span>
                            <span class="yyelf" v-text="formatPrice(item.back_cash)" v-show="!item.ba_coupon"></span>
                            <span class="quan-wrapper" v-show="item.ba_coupon">
                                <div class="quan-price" v-text="item.ba_coupon?'省'+item.ba_coupon.price+'元':''"></div>
                            </span>
                            <div class="real-price" v-text="getRealPrice(inx)" :class="{'real-price-coupon':item.ba_coupon}"></div>
                            <div class="go-now">立即抢购</div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import VueLazyload from "vue-lazyload";
import Banner from "./Banner.vue";

Vue.use(VueLazyload, {
  preLoad: 2,
  attempt: 10
});

export default {
  props: {
    imgList: {
      type: Array,
      default: []
    },
    productObj: {
      type: Array,
      default: []
    },
    colorNum: {
      type: String,
      default: "#f0f0f0"
    }
  },
  components: {
    Banner
  },
  data: function() {
    return {
      productList: [],
      isShowProductList: false,
      isIos: false,
      isAndroid: false
    };
  },
  mounted: function() {
    var baseWidth = 750;
    var currWidth = $("html")[0].offsetWidth;

    $(".product-list-wrapper").css({
      zoom: currWidth / baseWidth
    });

    if (newMallTools.platform.ios) {
      this.isIos = true;
    } else {
      this.isAndroid = true;
    }

    this.init(this.productObj);

    console.log(this.imgList);
  },
  methods: {
    init: function(nv) {
      var that = this;
      if (!nv) {
        return false;
      }
      if (typeof nv == "object") {
        if (!nv.length) {
          return false;
        }
        this.id = nv[0].id;
        this.gid = nv[0].gid;
        newMallTools.getProductList(nv[0], function(data) {
          var len = data.length;
          if (!(len % 2 == 0)) {
            data.splice(len - 1, 1);
          }
          that.isShowProductList = true;
          that.productList = data;
        });
      }
    },
    jumpToLink: function(inx, e) {
      e.stopPropagation();

      //debugger;

      localStorage.setItem("lastresid", this.id);
      localStorage.setItem("lastgid", this.gid);

      var that = this;
      var instc = this.productList[inx];
      var link = this.productList[inx].link;

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
    formatPrice: function(price) {
      return newMallTools.formatPrice(price);
    },
    getProductType: function(inx) {
      var instc = this.productList[inx];

      if (!instc) {
        return "";
      }
      return newMallTools.getProductCpsType(instc);
    },
    getRealPrice: function(inx) {
      // debugger;
      var obj = this.productList[inx];

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
    productObj: function(nv) {
      this.init(nv);
    },
    imgList: function(nv) {
      console.log(nv);
    }
  }
};
</script>

<style scoped>
.product-list-wrapper {
  display: inline-block;
  width: 100%;
}

.product-list-wrapper ul {
  padding-bottom: 9px;
  background: #e5a875;
}

.product-list-wrapper li {
  display: inline-block;
  width: 360px;
  border-radius: 10px;
  text-align: center;
  background: #fff;
}

.product-list-wrapper li:nth-of-type(2n-1) {
  margin: 10px 5px 0 9px;
}

.product-list-wrapper li:nth-of-type(2n) {
  margin: 10px 9px 0 5px;
}

.product-img {
  display: inline-block;
  width: 360px;
  height: 360px;
  border-radius: 10px 10px 0 0;
}

.product-info {
  padding: 0 17px;
  text-align: left;
}

.product-name {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 28px;
  zoom: 0.9999;
  color: #323232;
  margin-top: 28px;
  text-indent: 32px;
  line-height: 1.5;
  height: 80px;
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

.product-price-info {
  margin: 28px 0 15px 0;
}

.product-price {
  display: inline-block;
  font-size: 24px;
  zoom: 0.9999;
  color: #969696;
}

.product-price::before {
  content: "￥";
  color: #969696;
}

.yyelf {
  display: inline-block;
  height: 24px;
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
  zoom: 0.9999;
  color: #fb6a23;
  padding-left: 120px;
  padding-right: 10px;
  border-radius: 6px;
  list-style: none;
  background: #fee1d3 url(../imgs/ye_bg.png) no-repeat left center / auto 100%;
  margin-left: 5px;
}

.img-wra {
  position: relative;
  background: url(../imgs/img_default.png) no-repeat center center;
  background-size: 60%;
}

.flag {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 28px;
  width: 50px;
  height: 28px;
  background: url(../imgs/is_new.png) no-repeat left top / 100% auto;
}

.group {
  display: inline-block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 136px;
  height: 44px;
  background: url(../imgs/dmdf_2.png) no-repeat left top / 100% auto;
}

.miao-sha {
  position: absolute;
  left: 20px;
  top: 0;
  width: 61px;
  z-index: 1;
}

.real-price {
  display: inline-block;
  font-size: 34px;
  zoom: 0.9999;
  font-weight: bolder;
  color: #d43c31;
  padding-left: 4px;
  margin-top: 10px;
}

.real-price::before {
  content: "到手价 ￥";
  font-size: 22px;
  zoom: 0.9999;
  font-weight: 500;
}

.real-price-coupon.real-price::before {
  content: "券后价 ￥";
  font-size: 22px;
  zoom: 0.9999;
  font-weight: 500;
}

.quan-wrapper {
  display: inline-block;
}

.quan-wrapper .quan-price {
  display: inline-block;
  height: 24px;
  line-height: 28px;
  background: url(../imgs/quan_bg.png) no-repeat left top / auto 100%,
    url(../imgs/quan_price_bg.png) no-repeat right top/ auto 100%;
  border-radius: 8px;
  padding-left: 65px;
  padding-right: 20px;
  color: #e60038;
  font-size: 20px;
  font-weight: bold;
  zoom: 0.9999;
  margin-left: 10px;
}

.go-now {
  display: inline-block;
  width: 100%;
  padding: 13px 0;
  font-size: 22px;
  font-weight: bolder;
  color: #fff;
  text-align: center;
  background-color: #e60012;
  border-radius: 5px;
  margin-top: 20px;
  zoom: 0.9999;
}
</style>
