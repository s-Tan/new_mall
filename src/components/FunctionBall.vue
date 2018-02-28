<template>
    <div class="fun-ball">
        <ul class="fun-ball-4" v-show="isFour">
            <li v-for="(item,inx) in list" v-show="inx<(list.length-(list.length%4))">
                <div @click.prevent="jumpToUri(inx,$event)">
                    <img :src="item.image_uri">
                    <span v-text="item.name"></span>
                </div>
            </li>
        </ul>
        <ul class="fun-ball-5" v-show="isFive">
            <li v-for="(item,inx) in list" v-show="inx<(list.length-(list.length%5))">
                <div @click.stop="jumpToUri(inx,$event)">
                    <img :src="item.image_uri">
                    <span v-text="item.name"></span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'functionBall',
    props: {
        'list': {
            type: Array,
            default: []
        }
    },
    data: function() {
        return {
            isFour: false,
            isFive: false,
            arr: []
        };
    },
    mounted: function() {
    },
    methods: {
        jumpToUri: function(inx, e) {
            //debugger;

            localStorage.setItem('lastresid', this.list[inx].id || '0000');
            localStorage.removeItem('lastgid');

            var item = this.list[inx];
            var link = item.uri;

            try {
                var server = newMallTools.getPlatform().server;
                _czc.push(['_trackEvent', 'ball' + server, '点击' + (inx + 1), item.name]);

                newMallTools.selfTjClick({
                    position: 'ball' + server,
                    actionFrom: '点击' + (inx + 1) + ":" + item.name
                })
            } catch (e) { }

            console.log('function ball link:', link);

            newMallTools.redirect(link);

            return false;
        }
    },
    watch: {
        list: function(newValue, oldValue) {
            if (newValue.length / 4 >= 1 && newValue.length % 4 == 0) {
                this.isFour = true;
            } else if (newValue.length / 5 >= 1 && newValue.length % 5 == 0) {
                this.isFive = true;
            } else if (newValue.length / 4) {
                var fourNum = newValue.length % 4;
                var fiveNum = newValue.length % 5;

                if (fourNum > fiveNum) {
                    this.isFive = true;
                } else {
                    this.isFour = true;
                }
            }
        },
        isFive: function(newValue) {
            if (newValue) {
                var s = this.list.length - (this.list.length % 5);

                if (s == 0) {
                    this.isFive = false;
                }
            }
        },
        isFour: function(newValue) {
            if (newValue) {
                var s = this.list.length - (this.list.length % 4);

                if (s == 0) {
                    this.isFour = false;
                }
            }
        }
    }
}
</script>

<style scoped>
.fun-ball {
    padding: 0 8px;
}

.fun-ball-4 {}

.fun-ball ul {
    padding: 10px 0;
    display: block;
    overflow: hidden;
}

.fun-ball-4 li {
    float: left;
    width: 25%;
    padding: 2px 4px;
    text-align: center;
}

.fun-ball-4 li div span {
    display: inline-block;
    white-space: nowrap;
    margin-top: 10px;
    font-size: 12px;
}

.fun-ball-5 li {
    float: left;
    width: 20%;
    padding: 2px 0;
    text-align: center;
}

.fun-ball-5 li div span {
    display: inline-block;
    white-space: nowrap;
    margin-top: 10px;
    font-size: 13px;
    width: 100%;
    overflow: hidden;
}
</style>

