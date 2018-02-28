<template>
    <div class="area-wrapper">
        <img :src="item.image_uri" v-for="(item,inx) in list" @click="jump(inx)">
        <div class="area-time-wrapper" v-show="list.length>0">
            <span v-text="hour"></span>
            <span>:</span>
            <span v-text="minute"></span>
            <span>:</span>
            <span v-text="second"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'indexArea',
    props: {
        'list': {
            type: Array,
            default: []
        },
        'gid': {
            type: String,
            default: '0000'
        }
    },
    data: function() {
        return {
            hour: '00',
            minute: '00',
            second: '00'
        };
    },
    mounted: function() {
        var that = this;

        setInterval(function() {
            that.hour = localStorage.getItem('hour');
            that.minute = localStorage.getItem('min');
            that.second = localStorage.getItem('second');
        }, 100);
    },
    methods: {
        jump: function(inx) {
            localStorage.setItem('lastresid', this.list[inx].id || '0000');
            localStorage.removeItem('lastgid');

            try {
                //debugger;
                var server = newMallTools.getPlatform().server;
                _czc.push(['_trackEvent', 'categoryad' + server, '点击' + (inx + 1), this.list[inx].name]);

                newMallTools.selfTjClick({
                    position: 'categoryad' + server,
                    actionFrom: '点击' + (inx + 1) + ':' + this.list[inx].name
                })
            } catch (e) {

            }

            if (this.list[inx].uri) {
                newMallTools.redirect(this.list[inx].uri);
            }
        }
    }
}
</script>

<style scoped>
.area-wrapper {
    position: relative;
    background: #fff;
}

.area-wrapper img:nth-child(1) {
    width: 41%;
}

.area-wrapper img:nth-child(2) {
    position: absolute;
    right: 0;
    top: 0;
    width: 59%;
}

.area-wrapper img:nth-child(3) {
    position: absolute;
    right: 30%;
    bottom: 0;
    width: 29%;
}

.area-wrapper img:nth-child(4) {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 30%;
}

.area-time-wrapper {
    position: absolute;
    left: 3%;
    top: 26%;
}

.area-time-wrapper span:nth-child(2*n-1) {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    background: #000;
    color: #fff;
    font-size: 11px;
    text-align: center;
    opacity: .8;
}
</style>

