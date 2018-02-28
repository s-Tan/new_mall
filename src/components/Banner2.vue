<template>
    <div>
        <div class="swiper-container" :id="containerId">
            <div class="swiper-wrapper">
                <img v-for='(item,inx) in imgList' @click="jumpTop(inx)" class="swiper-slide" :class="swiperStyle" :src="item.image_uri" alt="" width="60%" style="z-index: 999" />
            </div>
        </div>
    </div>
</template>

<script>
import 'swiper/dist/js/swiper';
export default {
    name: 'banner',
    props: {
        'imgList': {
            type: Array,
            default: []
        },
        position: {
            type: String,
            default: ''
        }
    },
    data: function() {
        return {
            containerId: 'spB' + new Date().getTime(),
            swiperStyle: ''
        };
    },
    mounted: function() {
    },
    methods: {
        jumpTop: function(inx) {

            localStorage.setItem('lastresid', this.imgList[inx].id || '0000');
            localStorage.removeItem('lastgid');
            //debugger;
            try {
                var server = newMallTools.getPlatform().server;
                _czc.push(['_trackEvent', this.position + server, '点击' + (inx + 1), this.imgList[inx].name]);

                newMallTools.selfTjClick({
                    position: this.position + server,
                    actionFrom: '点击' + (inx + 1) + ':' + this.imgList[inx].name
                })
            } catch (e) {

            }

            try {
                var uri = this.imgList[inx].uri;
                if(uri){
                    newMallTools.redirect(uri);
                }else{
                    $('.pacman-wrapper').hide()
                }
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

                    that.swiperStyle = 'swiperStyle'
//                    alert(that.swiperStyle)
                    return false;
                }
                that.swiperStyle = ''
                mySwiper = new Swiper('#' + that.containerId, {
//                mySwiper = new Swiper('.swiper-container', {
//                    pagination: '.swiper-pagination',
                    autoplay: 5000,//可选选项，自动滑动
                    effect: 'coverflow',
                    grabCursor: true,
                    centeredSlides: false,
                    slidesPerView: 'auto',
                    coverflow: {
                        rotate: 50,
                        stretch: 30,
                        depth: 100,
                        modifier: 1,    //默认 1
                        slideShadows : false,
                        loop:true
                    },
                    slidesOffsetBefore:0,
                    slidesOffsetAfter:0,
                    loop:true
                });
            });
        }
    }
}
</script>

<style scoped="scoped">
/*@import url('../css/swiper.min.css');*/
@import url('../../node_modules/swiper/dist/css/swiper.min.css');
.swiper-slide {
    width: 92%;
    border-radius: 6px;
    margin:0 2% 0;
}
.swiperStyle{
    width: 100% !important;
    border-radius: 0 !important;
    margin: 0 !important;
}
@media (max-width:320px) {
    .swiper-slide {
        width: 89%;
    }
    .swiper-slide {
        border-radius: 6px;
        margin:0 10px;
    }
}
/*--- load6 ---*/
/*

.pacman-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -75px;
    margin-top: -7px;
    z-index: 999;
}

.pacman-mark {
    display: inline-block;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 998;
    opacity: .6;
    background: transparent;
}

.load6 {
    position: absolute;
    margin: 0 auto;
    width: 150px;
    text-align: center;
    z-index: 999;
}

.load6>div {
    width: 15px;
    height: 15px;
    background-color: #d43c31;
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
    animation: bouncedelay 1.4s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

.load6 .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
}

.load6 .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
}

@-webkit-keyframes bouncedelay {
    0%,
    80%,
    100% {
        -webkit-transform: scale(0.0)
    }
    40% {
        -webkit-transform: scale(1.0)
    }
}

@keyframes bouncedelay {
    0%,
    80%,
    100% {
        transform: scale(0.0);
        -webkit-transform: scale(0.0);
    }
    40% {
        transform: scale(1.0);
        -webkit-transform: scale(1.0);
    }
}
*/


/*--- load6 ---*/
</style>
