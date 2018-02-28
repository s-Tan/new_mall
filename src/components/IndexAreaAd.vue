<template>
    <section class="clear" style="overflow-x: hidden">
        <div v-if="imgList.length >=4" class="clear" style="overflow-x: hidden">
            <div v-for="(item,inx) in imgList"  @click="jumpArea(inx)" class="grid-body">
                <template v-if="inx <=3">
                    <img class="swiper-slide" :src="item.image_uri" width="100%" >
                </template>
            </div>
        </div>
    </section>
</template>
<script>
    import 'swiper/dist/js/swiper';
    export default{
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
                containerId: 'splo' + new Date().getTime(),
                fourimgShow: true
            };
        },
        mounted: function() {
        },
        methods: {
            jumpArea: function(inx) {
                localStorage.setItem('lastresid', this.imgList[inx].id || '0000');
                localStorage.removeItem('lastgid');
                try {
                    //debugger;
                    var server = newMallTools.getPlatform().server;
                    _czc.push(['_trackEvent', 'categoryad' + server, '点击' + (inx + 1), this.imgList[inx].name]);

                    newMallTools.selfTjClick({
                        position: 'categoryad' + server,
                        actionFrom: '点击' + (inx + 1) + ':' + this.imgList[inx].name
                    })
                } catch (e) {

                }
                if (this.imgList[inx].uri) {
                    newMallTools.redirect(this.imgList[inx].uri);
                }else{
                    $('.pacman-wrapper').hide()
                }
            }
        }//,

    }

</script>
<style scoped="scoped">
    /*清楚浮动*/
    .clear:after{content:'';display:block;clear:both;height:0;overflow:hidden;visibility:hidden;}
    .clear{zoom:1;}
    section{
        margin: 0 auto;
        margin-top: 10px;
    }
    .grid-body{
        float: left;
        width: 50%;
        box-sizing: border-box;
        border-right: 1px solid #f2f2f2;
    }
    .grid-body:first-child,.grid-body:nth-child(2){
        border-bottom: 1px solid #f2f2f2;
    }
    .grid-body img{
        width: 100%;
        height: 100%;
    }
    /*--- load6 ---*/

    /*.pacman-wrapper {
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
    }*/


    /*--- load6 ---*/
</style>
