<template>
    <div>
        <banner :img-list="imgList" position="style01"></banner>
        <div class="product-list-wrapper" v-show="isShowProductList" :style="{'background-color':colorNum || '#f0f0f0'}">
            <ul class="product-list">
                <li class="product-item" v-for="(item,inx) in productList" @tap="jumpToLink(inx,$event)">
                    <img class="product-img" :src="item.product_image">
                    <div class="product-price" v-text="formatPrice(item.unit_price)"></div>
                    <!-- <div class="yyelf" v-text="formatPrice(item.back_cash)"></div> -->
                    <!-- 用余额立返 -->
                    <div class="ye" v-show="!item.ba_coupon">
                      <span class="promote-price-flex" v-text="formatPrice(item.back_cash)"></span>
                    </div>
                    <!-- 卡券 -->
                    <div class="quan-wrapper" v-show="item.ba_coupon">
                      <div class="quan-price" v-text="item.ba_coupon?'省'+item.ba_coupon.price+'元':''"></div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Banner from "./Banner.vue";

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
        this.id = nv[0].id;
        this.gid = nv[0].gid;

        newMallTools.getProductList(nv[0], function(data) {
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
    }
  },
  watch: {
    productObj: function(nv) {
      this.init(nv);
    }
  }
};
</script>

<style scoped>
.product-list-wrapper {
  display: inline-block;
  width: 100%;
  overflow: auto;
  padding-bottom: 18px;
  background: #fff;
  -webkit-overflow-scrolling: touch;
}

.product-list-wrapper ul {
  display: inline-block;
  background: #fff;
  white-space: nowrap;
  padding: 27px 0 10px 0;
}

.product-list-wrapper li {
  display: inline-block;
  width: 168px;
  margin: 0 14px;
  white-space: nowrap;
}

.product-img {
  border: 1px solid #f8f8f8;
}

.product-price {
  margin-top: 10px;
  font-size: 28px;
  zoom: 0.99;
}

.product-price::before {
  content: "￥";
}

.yyelf {
  background: url(../imgs/yyelf.svg) no-repeat left center / auto 65%;
  font-size: 24px;
  zoom: 0.9999;
  padding-left: 75px;
  color: #cf0000;
}
.ye {
  padding-top: 5px;
}

.promote-price-flex {
  display: inline-block;
  height: 20px;
  font-size: 10px;
  font-weight: bold;
  line-height: 24px;
  zoom: 0.9999;
  color: #fb6a23;
  padding-left: 100px;
  padding-right: 10px;
  border-radius: 4px;
  list-style: none;
  background: #fee1d3 url(../imgs/ye_bg.png) no-repeat left center / auto 100%;
}
.quan-wrapper {
  display: block;
  padding-top: 5px;
}

.quan-wrapper .quan-price {
  display: inline-block;
  height: 20px;
  line-height: 24px;
  background: url(../imgs/quan_bg.png) no-repeat left top / auto 100%,
    url(../imgs/quan_price_bg.png) no-repeat right top/ auto 100%;
  border-radius: 4px;
  padding-left: 55px;
  padding-right: 20px;
  color: #e60038;
  font-size: 10px;
  font-weight: bold;
  zoom: 0.9999;
}
</style>
