<template>
    <ul class="list">
        <li class="h5-items-s" v-for="(item,inx) in products">
            <a href="javascript:;" @click="jumpToLink(inx,$event)">
                <div class="item-pic lazy" v-lazy:background-image="item.product_image">
                    <div class="flag" v-show="item.today_new" v-text="'上新'"></div>
                    <div class="show123" v-show="isshow123 && inx<3"></div>
                    <img src="../imgs/ms.png" class="miao-sha" v-show="item.is_ms">
                </div>
                <div class="item-info ">
                    <p class="merit" :class="getProductType(inx)">
                        <span v-text="item.product_name"></span>
                    </p>
                    <div class="group" :class="{'opacity0':!item.is_dmdf}">多买多返</div>
                    <div class="h5-item-price-info">
                        <div class="horizontalContainerPrice">
                            <span class="cost-price" v-text="item.unit_price"></span>
                            <span class="promote-price-flex" v-text="formatPrice(item.back_cash)" v-show="!item.ba_coupon"></span>
                            <span class="quan-wrapper" v-show="item.ba_coupon">
                                <img src="../imgs/quan_right.png">
                                <div class="quan-price" v-text="item.ba_coupon?'省'+item.ba_coupon.price+'元':''"></div>
                            </span>
                        </div>
                        <div class="horizontalContainerBuy">
                            <span class="real-price" v-text="getRealPrice(inx)" :class="{'real-price-coupon':item.ba_coupon}"></span>
                            <span class="lable">马上抢</span>
                        </div>
                    </div>
                </div>
            </a>
        </li>
    </ul>
</template>

<script>
import Vue from "vue";
import VueLazyload from "vue-lazyload";
import bg from "../imgs/bg_default.png";

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: bg,
  loading: bg,
  attempt: 1
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

<style rel="stylesheet/scss" lang="scss">
@import "../css/flexible";
.list {
  &.gap {
    .h5-items-s {
      background: nth($color_sim, 8);
      border-bottom: none;
      margin-top: size(-30);
      & > a {
        background: nth($color_sim, 10);
        .item-pic {
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
        }
        .item-info {
          margin-top: size(20);
        }
      }
    }
  }
  .h5-items-s {
    padding: size(20) size(12);
    overflow: hidden;
    border-bottom: size(1) solid nth($color_sim, 7);
    &:last-of-type {
      border-bottom: none;
    }
    & > a {
      position: relative;
      display: flex;
      border-radius: size(10);
      background: #fff;
      .item-pic {
        width: 38%;
        padding-bottom: 38%;
        position: relative;
        background: url(../imgs/bg_default.png) no-repeat center center / auto
          50%;
        background-size: cover;
        overflow: hidden;
        border-radius: size(8);
        .flag {
          background: $color_warning;
          line-height: size(26);
          text-align: center;
          position: absolute;
          top: size(20);
          right: 0;
          font-size: size(17);
          color: nth($color_sim, 10);
          border-top-left-radius: size(1000);
          border-bottom-left-radius: size(1000);
          padding: size(4) size(4) size(4) size(8);
          z-index: 80;
        }
        .show123 {
          position: absolute;
          left: 0;
          top: 0;
          width: size(84);
          height: size(84);
          z-index: 89;
          @at-root .h5-items-s:nth-of-type(1) .item-pic .show123 {
            background: url(../imgs/hot1.png) no-repeat center / 100%;
          }
          @at-root .h5-items-s:nth-of-type(2) .item-pic .show123 {
            background: url(../imgs/hot2.png) no-repeat center / 100%;
          }
          @at-root .h5-items-s:nth-of-type(3) .item-pic .show123 {
            background: url(../imgs/hot3.png) no-repeat center / 100%;
          }
        }
        .miao-sha {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          z-index: 80;
          border-radius: 0 0 size(10) size(10);
        }
      }
      .item-info {
        margin: 0 size(16) size(30) size(20);
        position: relative;
        flex: 1;
        .merit {
          word-break: break-all;
          line-height: 1.3;
          @include ell(2);
          font-size: size(30);
          span {
            padding-left: size(40);
            @at-root .merit.jd span {
              background: url(../imgs/jd.png) no-repeat left center / auto 82%;
            }
            @at-root .merit.yhd span {
              background: url(../imgs/yhd.png) no-repeat left center / auto 82%;
            }
            @at-root .merit.tmall span {
              background: url(../imgs/tmall.png) no-repeat left center / auto
                82%;
            }
            @at-root .merit.taobao span {
              background: url(../imgs/taobao.png) no-repeat left center / auto
                82%;
            }
            @at-root .merit.sj span {
              background: url(../imgs/shoujia.png) no-repeat left center / auto
                82%;
            }
          }
        }
        .group {
          display: inline-block;
          font-size: size(20);
          color: $color_danger;
          border: 1px solid $color_danger;
          border-radius: size(4);
          padding: size(4) size(10);
          margin-top: size(10);
        }
        .h5-item-price-info {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 100%;
          .horizontalContainerPrice {
            margin: size(10) 0;
            .cost-price {
              display: inline-block;
              font-size: size(32);
              color: nth($color_sim, 1);
              &:before {
                content: "￥";
              }
            }
            .promote-price-flex {
              display: inline-block;
              padding-left: size(110);
              margin-left: size(10);
              color: $color_danger;
              font-size: size(28);
              background: url(../imgs/yyelf.svg) no-repeat left top / auto
                size(28);
            }

            .quan-wrapper {
              display: inline-block;
              position: relative;
              background: url(../imgs/quan_left.png) no-repeat right top / auto
                100%;
              height: size(28);
              top: 0;
              border: size(2) solid #fc4164;
              border-left: none;
              border-right: none;
              img {
                float: left;
                height: 100%;
              }
              .quan-price {
                margin-left: size(8);
                white-space: nowrap;
                color: #fc4164;
                height: size(28);
                line-height: size(28);
                padding-left: size(10);
                padding-right: size(10);
                font-size: size(20);
                @include ell(1);
              }
            }
          }
          .horizontalContainerBuy {
            height: size(50);
            .real-price {
              position: absolute;
              left: 0;
              bottom: 0;
              font-size: size(36);
              color: #d43c31;
              font-weight: bolder;
              padding-left: size(2);
            }
            .real-price::before {
              content: "到手价 ￥";
              font-size: size(24);
              font-weight: normal;
            }
            .real-price-coupon.real-price::before {
              content: "券后价 ￥";
              font-size: size(24);
              font-weight: normal;
            }
            .lable {
              color: $color_danger;
              border-radius: size(6);
              position: absolute;
              right: 0;
              bottom: 0;
              background: #f9e2e0;
              line-height: 1.5;
              padding: size(3) size(14);
              font-size: size(30);
            }
          }
        }
      }
      @include media-max(374px) {
        .item-info {
          margin: 0 0 0 size(20);
        }
      }
    }
  }
}
</style>
