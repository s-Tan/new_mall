<template>
    <div class="djdzm-wrapper-outer" v-show="isImgLoaded">
        <img src="../imgs/img_default.png" @load="setWrapperHeight()" style="display: none;">
        <div class="djdzm-left" @click="redirect(1)">
            <div class="djdzm-p-img" :style="product1Img">
                <span class="djdzm-rq" v-show="false">90%</span>
            </div>
            <div class="djdzm-p-info">
                <div v-text="product1.product_name"></div>
                <div v-text="product1.unit_price"></div>
                <div class="djdzm-yu-e" v-text="product1.back_cash"></div>
                <div class="djdzm-real-price" v-text="getRealPrice(1)" :class="{'real-price-coupon':product1.ba_coupon}"></div>
            </div>
        </div>
        <div class="djdzm-right" v-show="product2.product_name && product3.product_name">
            <div class="djdzm-right-up" @click="redirect(2)">
                <div class="djdzm-p-img small" :style="product2Img">
                    <span class="djdzm-rq" v-show="false">70%</span>
                </div>
                <div class="djdzm-p-info-right">
                    <p v-text="product2.product_name"></p>
                    <p v-text="product2.unit_price"></p>
                    <p class="djdzm-yu-e" v-text="product2.back_cash"></p>
                    <div class="djdzm-real-price" v-text="getRealPrice(2)" :class="{'real-price-coupon':product2.ba_coupon}"></div>
                </div>
            </div>
            <div class="djdzm-right-down" @click="redirect(3)">
                <div class="djdzm-p-img small" :style="product3Img">
                    <span class="djdzm-rq" v-show="false">70%</span>
                </div>
                <div class="djdzm-p-info-right">
                    <p v-text="product3.product_name"></p>
                    <p v-text="product3.unit_price"></p>
                    <p class="djdzm-yu-e" v-text="product3.back_cash"></p>
                    <div class="djdzm-real-price" v-text="getRealPrice(3)" :class="{'real-price-coupon':product3.ba_coupon}"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'djdzm',
    props: {
        product1: {
            type: Object,
            default: {}
        },
        product2: {
            type: Object,
            default: {}
        },
        product3: {
            type: Object,
            default: {}
        },
        //资源位id
        resid: {
            type: String,
            default: '0000'
        },
        //分组id
        gid: {
            type: String,
            default: '0000'
        },
        moreurl: {
            type: String,
            default: 'javascript:;'
        }
    },
    data: function() {
        return {
            product1Img: '',
            product2Img: '',
            product3Img: '',
            isImgLoaded: false
        }
    },
    mounted: function() {
        this.product1Img = {
            'background-image': 'url(../imgs/img_default.png)'
        };

        this.product2Img = this.product1Img;
        this.product3Img = this.product1Img;
    },
    methods: {
        redirect: function(inx) {
            newMallTools.redirect(this.moreurl);

            return false;

            var that = this;
            var instc = undefined;

            switch (inx) {
                case 1:
                    instc = this.product1;
                    break;
                case 2:
                    instc = this.product2;
                    break;
                case 3:
                    instc = this.product3;
                    break;
            }

            //debugger;

            try {
                var server = newMallTools.getPlatform().server;
                _czc.push(['_trackEvent', 'salelist' + server, '点击' + inx, instc.product_name]);

                newMallTools.selfTjClick({
                    position: 'salelist' + server,
                    actionFrom: '点击' + inx + ':' + instc.product_name
                })
            } catch (e) {

            }

            localStorage.setItem('lastresid', this.resid);
            localStorage.setItem('lastgid', this.gid);

            var link = instc.link;

            if (link) {
                var apiUri = newMallTools.getApiUrl('GetCpsProductActivity');
                newMallTools.baseAjax({
                    type: 'post',
                    url: apiUri,
                    data: JSON.stringify({
                        product_id: instc.product_id,
                        sku_id: instc.sku_id || '',
                        open_id: localStorage.getItem('openid'),
                        mall_id: newMallTools.mallId,
                        is_dlimit: true
                    }),
                    cb: function(req) {
                        console.log(req);

                        if (typeof (req) == 'string') {
                            req = JSON.parse(req);
                        }

                        var params = newMallTools.getUrl(link).queryParams;
                        var uri = link;
                        var paramArr = [];

                        if (uri.indexOf('redirectTmall?') >= 0) {
                            newMallTools.redirect(uri, instc, req.data);

                            return false;
                        }

                        for (var i in params) {
                            paramArr.push(i + '=' + params[i]);
                        }
                        uri += '&' + paramArr.join('&');

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
        setWrapperHeight: function() {
            var leftObj = document.querySelectorAll('.djdzm-left')[0];
            var leftHeight = leftObj.offsetHeight;

            leftObj.parentNode.style.height = leftHeight + 'px';

            this.isImgLoaded = true;
        },
        getRealPrice: function(inx) {
            switch (inx) {
                case 1:
                    var obj = this.product1;
                    break;
                case 2:
                    var obj = this.product2;
                    break;
                case 3:
                    var obj = this.product3;
                    break;
            }

            if (!obj) {
                return false;
            }

            var price = Number(obj.unit_price);
            var back = Number(obj.back_cash);

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
        product1: function() {
            var that = this;
            var img = new Image();
            img.onerror = function() {
                that.product1Img = {
                    'background': 'url(../imgs/img_default.png) no-repeat center center / auto 40%'
                };
            };
            img.src = this.product1.product_image;

            this.product1Img = {
                'background-image': 'url(' + this.product1.product_image + ')'
            };
        },
        product2: function() {
            var that = this;
            var img = new Image();
            img.onerror = function() {
                that.product2Img = {
                    'background': 'url(../imgs/img_default.png) no-repeat center center / auto 50%'
                };
            };
            img.src = this.product2.product_image;

            this.product2Img = {
                'background-image': 'url(' + this.product2.product_image + ')'
            };
        },
        product3: function() {
            var that = this;
            var img = new Image();
            img.onerror = function() {
                that.product3Img = {
                    'background': 'url(../imgs/img_default.png) no-repeat center center / auto 50%'
                };
            };
            img.src = this.product3.product_image;

            this.product3Img = {
                'background-image': 'url(' + this.product3.product_image + ')'
            };
        }
    }
}
</script>

<style scoped>
.djdzm-wrapper-outer {
    position: relative;
    padding-bottom: 74%;
}

.djdzm-left {
    position: absolute;
    left: 0;
    top: 0;
    width: 45%;
    height: 100%;
    text-align: center;
    border-right: 1px solid #fafafa;
    padding: 20px 0;
}

.djdzm-p-img {
    position: relative;
    display: inline-block;
    width: 90%;
    padding-bottom: 90%;
    border-radius: 1000px;
    -webkit-background-size: 100% auto;
    background-size: 105% auto;
    background-repeat: no-repeat;
    background-position: center center;
    border: 1px solid #eee;
}

.djdzm-p-img:before {
    content: ' ';
    position: absolute;
    left: 0;
    top: -7px;
    width: 42px;
    height: 42px;
    background: url(../imgs/hot1.png) no-repeat left top;
    background-size: 100% auto;
}

.djdzm-p-img.small {
    width: 40%;
    padding-bottom: 40%;
}

.djdzm-right-up .djdzm-p-img.small:before {
    width: 40px;
    height: 40px;
    top: -14px;
    background: url(../imgs/hot2.png) no-repeat left top;
    background-size: 90% auto;
}

.djdzm-right-down .djdzm-p-img.small:before {
    width: 40px;
    height: 40px;
    top: -14px;
    background: url(../imgs/hot3.png) no-repeat left top;
    background-size: 90% auto;
}

.djdzm-rq {
    position: absolute;
    left: 50%;
    bottom: -10px;
    width: 50%;
    border-radius: 1000px;
    background: linear-gradient(to bottom, #ff4165, #ff7756);
    background: -webkit-linear-gradient(top, #ff4165, #ff7756);
    padding: 2px 8px;
    font-size: 12px;
    text-align: center;
    color: #fff;
    font-weight: 500;
    margin-left: -25%;
}

.djdzm-rq:before {
    content: '人气 ';
}

.djdzm-p-img.small .djdzm-rq {
    width: 96%;
    margin-left: -48%;
}

.djdzm-p-info div:nth-of-type(1) {
    display: inline-block;
    width: 90%;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-top: 10px;
    font-size: 12px;
}

.djdzm-p-info div:nth-of-type(2) {
    display: inline-block;
    width: 100%;
    margin-top: 6px;
    font-weight: 500;
}

.djdzm-p-info div:nth-of-type(2):before {
    content: '￥';
}

.djdzm-yu-e {
    display: inline-block;
    padding: 0 3px;
    font-size: 12px;
    color: #d43c31;
    height: 22px;
    line-height: 1.5;
    margin-top: 5px;
}

.djdzm-yu-e:before {
    content: '用余额立返';
    background: #d43c31;
    border-radius: 2px;
    color: #fff;
    padding: 2px 2px;
    margin-right: 4px;
    font-size: 8px;
    top: -1px;
    position: relative;
}

.djdzm-right {
    position: absolute;
    right: 0;
    top: 0;
    width: 55%;
    height: 100%;
    border-right: 1px solid #fafafa;
}

.djdzm-p-info-right {
    float: right;
    width: 55%;
    vertical-align: top;
    margin-top: -1px;
}

.djdzm-p-info-right p:nth-of-type(1) {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 12px;
}

.djdzm-p-info-right p:nth-of-type(2) {
    margin-top: 6px;
    margin-bottom: -4px;
    font-weight: 500;
}

.djdzm-p-info-right p:nth-of-type(2):before {
    content: '￥';
}

.djdzm-right-up {
    display: block;
    height: 50%;
    padding: 14% 8px 0 8px;
    border-bottom: 1px solid #fafafa;
}

.djdzm-right-down {
    display: block;
    height: 50%;
    padding: 14% 8px 0 8px;
}

.djdzm-quan {
    display: inline-block;
    width: 100%;
    border: 1px solid #fc4164;
    border-left: none;
    color: #fc4164;
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
    margin-top: 5px;
}

.djdzm-quan:before {
    content: '领券';
    display: inline-block;
    padding: 0 3px 0 8px;
    background: url(../imgs/quan_left_bg.jpg) no-repeat left top #fc4164;
    background-size: auto 100%;
    color: #fff;
    margin-right: 5px;
}

.djdzm-real-price {
    font-size: 16px;
    color: #d43c31;
    font-weight: bolder;
    padding-left: 2px;
}

.djdzm-real-price::before {
    content: '到手价 ￥';
    font-size: 12px;
    font-weight: 500;
}

.real-price-coupon.djdzm-real-price::before {
    content: '到手价 ￥';
    font-size: 12px;
    font-weight: 500;
}

@media screen and (max-width: 320px) {
    .djdzm-quan {
        font-size: 10px;
    }

    .djdzm-yu-e:before {
        display: inline-block;
        padding: 1px 2px;
    }
}
</style>