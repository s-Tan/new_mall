<template>
    <div>
        <div class="loading-more" v-show="showNoHaveMore">
            <span class="no-have">没有更多内容了哦~~</span>
        </div>
        <div class="loading-more" v-show="showLoadingMore">
            <span class="loading-now">努力加载中....</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'loadingProduct',
    props: {
        'showNoHaveMore': {
            type: Boolean,
            default: false
        },
        'showLoadingMore': {
            type: Boolean,
            default: false
        }
    },
    mounted: function () {
    },
    watch: {
        showNoHaveMore: function (newValue, oldValue) {
            //console.log('have_nv:', newValue, ';have_ov:', oldValue);
        },
        showLoadingMore: function (newValue, oldValue) {
            //console.log('more_nv:', newValue, ';more_ov:', oldValue);
        }
    }
}
</script>

<style scoped>
.loading-more {
    font-size: 14px;
}

.loading-more span.no-have {
    background: url(../imgs/have_not.png) no-repeat left 3px / auto 80%;
    padding-left: 25px;
}

.loading-more span.loading-now {
    background: url(../imgs/loading-product.gif) no-repeat left center / auto 180%;
    padding-left: 30px;
}

.loading-more span.more {
    padding-left: 20px;
}
</style>
