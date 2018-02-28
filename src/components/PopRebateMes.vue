<template>
    <section class="rebate-mes">
    </section>
</template>

<script>
export default {
    name: 'pop-rebate-mes',
    data() {
        return {
            rebateMes: [],//信息
            num: '',//消息总条数
            now: '',//现在时间
            whoAreYou: ''//记录当前显示的信息的姓名+时间戳，用来判断是否相当（同一个人在相同时间内几乎不可能点击两次） fix app假死BUG
        }
    },
    mounted() {
        let _this = this;
        //检测没有广告的时候显示pop
        const isAd = setInterval(function () {
            if ($('.ad-1-w-w').css("display") == 'block') {
                isAd;
            } else {
                _this.getRebateMes();//获取顶部返利信息
                clearInterval(isAd)
            }
        }, 500)
    },
    methods: {
        //获取返利信息并顶部弹窗
        getRebateMes() {
            let _this = this;
            newMallTools.baseAjax({
                type: 'get',
                url: newMallTools.getApiUrl('GetBarrageScreen'),
                cb: function (req) {
                    if (typeof (req) == 'string') {
                        req = JSON.parse(req);
                    }
                    if (req.status === 1 && req.data) {
                        _this.rebateMes = req.data;
                        _this.now = req.now;
                        _this.num = req.data.length;
                        _this.showMes();
                    } else {
                        return false;
                    }
                }
            });
        },
        //设置计时器，并开始展示信
        showMes() {
            let _this = this, index = 0;//当前显示消息序列
            const intervalMainFn = () => {
                //有图显示图，没有置默认
                let logo = _this.rebateMes[index].user.logo ? _this.rebateMes[index].user.logo : '../imgs/img_default.png';
                //超出三个字显示前两个字
                let province;
                if (_this.rebateMes[index].user.province) {
                    if (_this.rebateMes[index].user.province.length > 3) {
                        province = `来自 ${_this.rebateMes[index].user.province.substring(0, 2)} 的`
                    } else {
                        province = `来自 ${_this.rebateMes[index].user.province} 的`
                    }
                } else {
                    province = '';
                }
                //姓名超过三个字显示前三个字加***
                let nickname = (_this.rebateMes[index].user.nickname.length > 3) ? ` ${_this.rebateMes[index].user.nickname.substring(0, 3)}*** ` : ` ${_this.rebateMes[index].user.nickname} `;
                let lessTime = _this.getLessTime(_this.rebateMes[index].time, _this.now);
                //注入内容
                $('.rebate-mes').html(`
                    <div class="mes">
                        <img src="${logo}" alt="">
                        <span>${lessTime}</span>
                        <span>${province}${nickname}购物获得</span>
                        <span class="money">${_this.rebateMes[index].cashback}元返现</span>
                    </div>
                `);
                //开始移动
                $('.rebate-mes').addClass('action');
                //动画结束前，移除动画类，下次可继续加入
                setTimeout(function () {
                    $('.rebate-mes').removeClass('action');
                }, 4800);
                _this.whoAreYou = _this.rebateMes[index].user.nickname + _this.rebateMes[index].time;
                index += 1;//显示的序列递增
                //全部完成或者下一个显示的等于上一个显示的时候清理定时器
                if ((index === _this.num) || (_this.rebateMes[index].user.nickname + _this.rebateMes[index].time === _this.whoAreYou)) {
                    clearInterval(intervalShowMes);
                }
            };
            intervalMainFn();
            const intervalShowMes = setInterval(function () {
                intervalMainFn();
            }, 10000)//总过程5s包含1s进入3s显示1s退出
        },
        //计算时差
        getLessTime(timeA, timeB) {
            let date1 = timeA ? timeA * 1000 : new Date().getTime();  //开始时间
            let date2 = timeB ? timeB * 1000 : new Date().getTime();    //结束时间
            let date3 = date2 - date1;   //时间差的毫秒数
            //------------------------------
            if (date3 < 1000) {
                return `1秒前`
            } else if (date3 / 1000 < 60) {
                return `${Math.floor(date3 / 1000)}秒前`
            } else if (date3 / 1000 / 60 < 60) {
                return `${Math.floor(date3 / 1000 / 60)}分钟前`
            } else if (date3 / 1000 / 60 / 60 < 24) {
                return `${Math.floor(date3 / 1000 / 60 / 60)}小时前`
            } else if (date3 / 1000 / 60 / 60 / 24 < 31) {
                return `${Math.floor(date3 / 1000 / 60 / 60 / 24)}天前`
            } else if (date3 / 1000 / 60 / 60 / 24 / 31 < 12) {
                return `${Math.floor(date3 / 1000 / 60 / 60 / 24 / 31)}个月前`
            } else if (date3 / 1000 / 60 / 60 / 24 / 31 / 12 < 365) {
                return `${Math.floor(date3 / 1000 / 60 / 60 / 24 / 31 / 12)}年前`
            } else {
                return `很久很久以前`
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "../css/flexible";
@keyframes mymove {
    0% {
        top: 70px;
        opacity: 0;
    }
    20% {
        top: 90px;
        opacity: 1;
    }
    80% {
        top: 90px;
        opacity: 1;
    }
    100% {
        top: 90px;
        opacity: 0;
    }
}

.rebate-mes {
    /* width: 306px;*/
    width: 100%;
    height: size(46);
    position: fixed;
    top: size(140);
    left: 0;
    z-index: 91;
    opacity: 0;
    overflow: hidden;
    text-align: center;
    &.action {
        animation: mymove 5s infinite 0s;
    }
    .mes {
        background: rgba(0, 0, 0, .6);
        color: white;
        border-radius: size(1000);
        padding-right: size(20);
        font-size: size(22);
        display: inline-block;
        line-height: size(46);
        max-width: 100%;
        overflow: hidden;
        &>* {
            margin-right: size(20);
            &:last-child {
                margin-right: 0;
            }
        }
        img {
            width: size(46);
            height: size(46);
            border-radius: 50%;
        }
        span {
            height: 100%;
            line-height: size(46);
            &.money {
                color: #ff3c00;
            }
        }
    }
    @include media(0px, 320px) {
        .mes {
            font-size: size(16);
            &>* {
                margin-right: size(8);
            }
        }
    }
}
</style>