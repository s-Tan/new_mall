<template>
    <div>
        <banner :img-list="imgList" position="style02"></banner>
        <div v-show="isShowProductList" :style="{'background-color':colorNum || '#f0f0f0'}" style="padding-bottom:5px;">
            <product-list :products="productList" :id="id" :gid="gid" v-show="isShowProductList"></product-list>
        </div>
    </div>
</template>

<script>
import Banner from './Banner.vue';
import ProductList from './ProductListV2.vue';

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
            default: '#f0f0f0'
        }
    },
    components: {
        Banner,
        ProductList
    },
    data: function() {
        return {
            productList: [],
            isShowProductList: false,
            id: '',
            gid: ''
        }
    },
    mounted: function() {
        this.init(this.productObj)
    },
    methods: {
        init: function(nv) {
            var that = this;
            if (!nv) {
                return false;
            }
            if (typeof (nv) == 'object') {
                if (!nv.length) {
                    return false;
                }

                this.id = nv.id;
                this.gid = nv.gid;

                newMallTools.getProductList(nv[0], function(data) {
                    that.isShowProductList = true;
                    that.productList = data;
                });
            }
        },
        formatPrice: function(price) {
            price = Number(price);

            if (isNaN(price) || price == '') {
                return parseFloat(0).toFixed(2);
            }

            return parseFloat(price).toFixed(2);
        }
    },
    watch: {
        productObj: function(nv) {
            this.init(nv);
        }
    }
}
</script>

<style scoped></style>
