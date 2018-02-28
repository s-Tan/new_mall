<template>
    <div>
        <banner :img-list="imgList" position="style01"></banner>
        <div class="product-list-wrapper" v-show="isShowProductList" :style="{'background-color':colorNum || '#f0f0f0'}">
            <ul class="product-list">
                <li class="product-item" v-for="(item,inx) in products" @tap="jumpToLink(inx,$event)">
                    <div style="position:relative;width:100%;background:url('../imgs/bg_default.png') no-repeat">
                        <img src="../imgs/ms2.png" class="product-miaosha" v-show="item.is_ms">
                        <img class="product-img" :src="item.product_image">
                        <div class="product_bottom_bg"></div>
                        <!-- 多买多返 -->
                        <div class="dmdf">
                            <img src="../imgs/dmdf_3.png" :class="{'opacity0':!item.is_dmdf}">
                        </div>
                        <!-- 用余额立返 -->
						            <div class="product_bottom_content" v-show="!item.ba_coupon">
                            <span v-text="formatPrice(item.back_cash)"></span>
                        </div>
                        <!-- 卡券 -->
                        <div class="product_bottom_content" v-show="item.ba_coupon">
                            <div class="quan-price" v-text="item.ba_coupon?'领券省'+item.ba_coupon.price+'元':''"></div>
                        </div>
                    </div>
                    <div class="item-info">
                        <div class="pro-name" :class="getProductType(inx)">
                            <span v-text="item.product_name"></span>
                        </div>
                        <!-- 原价 -->
                        <div class="cost-price" v-text="item.unit_price"></div>
                        <!-- 到手价 -->
                        <div>
                            <div class="real-price" v-text="getRealPrice(inx)" :class="{'real-price-coupon':item.ba_coupon}"></div>
                        </div>
                    </div>	
                    <img src="../imgs/btn.png" width="70%" class="pop-btn">
                    <!--
                    <div class="product-price" v-text="formatPrice(item.unit_price)"></div>
   
                    <div class="ye" v-show="!item.ba_coupon">
                      <span class="promote-price-flex" v-text="formatPrice(item.back_cash)"></span>
                    </div>
                    <div class="quan-wrapper" v-show="item.ba_coupon">
                      <div class="quan-price" v-text="item.ba_coupon?'省'+item.ba_coupon.price+'元':''"></div>
                    </div>-->
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import VueLazyload from "vue-lazyload";
import bg from "../imgs/bg_default.png";
import Banner from "./Banner.vue";
Vue.use(VueLazyload, {
  preLoad: 2,
  attempt: 4
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
    },
    isshow123: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Banner
  },
  data: function() {
    return {
      products: [],
      isShowProductList: true,
      id: "",
      gid: ""
    };
  },
  mounted: function() {
    var baseWidth = 750;
    var currWidth = $("html")[0].offsetWidth;

    $(".product-list-wrapper").css({
      zoom: currWidth / baseWidth
    });
    this.init(this.productObj);
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

        this.id = nv.id;
        this.gid = nv.gid;

        newMallTools.getProductList(nv[0], function(data) {
          that.isShowProductList = true;
          that.products = data;
        });
      }
    },
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
    // },
    // watch: {
    //   products: function() {
    //       this.init(nv);
    //   }
  }
};
</script>

<style scoped>
.product-list-wrapper {
  display: inline-block;
  width: 100%;
  overflow: auto;
  padding-bottom: 18px;
  -webkit-overflow-scrolling: touch;
}

.product-list-wrapper ul {
  display: inline-block;
  white-space: nowrap;
  padding: 27px 0;
}

.product-list-wrapper li {
  display: inline-block;
  width: 233px;
  margin-left: 9px;
  white-space: nowrap;
  background: #fff;
  border-radius: 5px;
  position: relative;
  padding-bottom: 28px;
}
.product-list-wrapper li:last-child {
  margin-right: 9px;
}
.product-miaosha {
  position: absolute;
  top: 0;
  left: 8px;
  width: 26%;
}
.product-img {
  border-radius: 5px 5px 0 0;
}
.product_bottom_bg,
.product_bottom_content {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 32px;
  line-height: 32px;
  color: #fff;
  text-align: center;
}
.product_bottom_content span::before {
  content: "用余额立返 ";
}
.product_bottom_content span {
  line-height: 34px;
  font-size: 20px;
  zoom: 0.99;
}
.product_bottom_bg {
  background: rgba(255, 1, 1, 0.8);
}
/*
.pop-text{
    width:100%;
    text-align:left;
    padding: 5px 0 14px;
    word-break:break-all; word-wrap:break-word ;
}
.pop-text p{
    padding: 0 4px;
    margin: 0;
    line-height: 22px;
    
}
.pop-text p:first-child{
    font-weight: 700;
    color: #323232;
    word-break:break-all;word-wrap:break-word ;
}
.pop-text p:nth-child(2){
    color: #969696;
    padding-top: 4px;
}
.pop-text p:last-child{
    color: #E60012;
    padding-top: 4px;
}
.pop-text p span{
    font-size: 16px;
}
.pop-text p img{
    width: 16px;
    vertical-align: top;
    margin-right: 5px;
}
.pop_header img{
    border-radius: 5px 5px 0 0;
}


*/

.item-info {
  position: relative;
  display: inline-block;
  width: 100%;
  padding: 0 0 10px 10px;
}

.pro-name {
  margin-top: 20px;
}

.pro-name span {
  display: inline-block;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 22px;
  zoom: 0.99;
  color: #323232;
  text-indent: 32px;
  line-height: 1.5;
  white-space: normal;
}

.dmdf {
  display: inline-block;
  width: 120px;
  position: absolute;
  bottom: 46px;
  left: 5px;
}
.dmdf img {
  width: 100%;
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
  margin-top: 0px;
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
  background: url(../imgs/jd.png) no-repeat left 3px / 26px auto;
}

.yhd {
  background: url(../imgs/yhd.png) no-repeat left 3px / 26px auto;
}

.tmall {
  background: url(../imgs/tmall.png) no-repeat left 3px / 26px auto;
}

.taobao {
  background: url(../imgs/taobao.png) no-repeat left 3px / 26px auto;
}

.sj {
  background: url(../imgs/shoujia.png) no-repeat left 3px / 26px auto;
}

.pop-btn {
  position: absolute;
  left: 40px;
  bottom: -36px;
}
</style>
