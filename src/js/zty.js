// 样式表
import '../css/common.css'
import '../css/zty-page.css'
// 模块
import Vue from 'vue'
import 'lib-flexible'
import '../js/tools' // 工具类 可用线上包tvm-tools代替
// vue页面组件
import Style01 from '../components/Style04.vue'
import Style02 from '../components/Style02.vue'
import Style03 from '../components/Style03.vue'
import drag from '../components/drag.vue'
import smask from '../components/ScrollMask.vue'

/* let _platform = newMallTools.getPlatform() // never used */

new Vue({
    el: '#app',
    components: {
        sOne: Style01,
        sTwo: Style02,
        sThree: Style03,
        CompDrag: drag,
        smask: smask
    },
    data: {
        combObj: [],
        showSearch: false,
        nextPage: 1,
        limit: 999,
        pageId: newMallTools.getUrlParams('id'),
        apiFrom: function () {
            let platform = newMallTools.getPlatform()

            if (platform.current === 'wechat') {
                return 'wxh'
            }

            return platform.current
        },
        face: '',
        isAppShow: false,
        flowAd: [],
        isShowTrapb: false,
        realScrollTop: 0
    },
    mounted: function () {
        let that = this
        let platform = newMallTools.platform
        // this.getFlashSaledata()

        this.isAppShow = true

        if (platform.app) {
            $('.search-wrapper .home').hide()
            $('.search-wrapper .search').css({
                left: 0,
                width: '84%'
            })
        }

        $('#app').css({
            'padding-top': 0
        })

        const faceInterval = setInterval(function () {
            let face = localStorage.getItem('face')
            if (face) {
                that.face = face
                clearInterval(faceInterval)
            }
        }, 100)

        this.getIndexData()
        this.init()

        let pageId = parseInt(newMallTools.getUrlParams('id'))

        localStorage.setItem('leaderuserid', newMallTools.getUrlParams('leader_user_id' || ''));
        localStorage.setItem('qrid', newMallTools.getUrlParams('qr_id' || ''));
    },
    methods: {
        init: function () {
            let that = this
        },
        redirect: function (url) {
            newMallTools.redirect(url)
        },
        jumpMine: function () {
            newMallTools.mineUri()
        },
        getIndexData: function () {
            let that = this
            let url = newMallTools.getApiUrl('MallPage')

            if (!that.pageId) {
                window.location.href = 'index.html?id=1'
            }
            newMallTools.baseAjax({
                type: 'get',
                url: url,
                data: {
                    user_id: localStorage.getItem('openid'),
                    page_id: that.pageId
                },
                cb: function (req) {

                    if (typeof (req) === 'string') {
                        req = JSON.parse(req)
                    }

                    if (!req) {
                        return false
                    }

                    if (!req.status) {
                        that.noHaveMore = false
                        that.isLoadingMore = false

                        newMallTools.noProductBodyImg()

                        return false
                    } else {
                        req.status = parseInt(req.status)
                    }

                    if (req.status !== 1) {
                        return false
                    }

                    let reqData
                    if (!req.data) {
                        return false
                    } else {
                        reqData = req.data
                    }
                    //悬浮窗口广告
                    if (reqData.flow_ad) {
                        try {
                            that.flowAd = reqData.flow_ad
                        } catch (e) {
                            console.log(e)
                        }
                    }
                    if (reqData.show_search) {
                        that.showSearch = true
                    } else {
                        that.showSearch = false
                    }

                    if (!that.showSearch) {
                        $('#app').css({
                            'padding-top': 0
                        })
                    } else {
                        $('#app').css({
                            'padding-top': 45
                        })
                    }

                    if (reqData.page_info) {
                        newMallTools.emptyImgTJ({
                            titleName: reqData.page_info.name
                        })

                        if ($('title').text() === '') {
                            $('title').text(reqData.page_info.name)
                        }

                        localStorage.setItem('lastpagename', reqData.page_info.name)
                    } else {
                        $('title').text('商品推荐')

                        newMallTools.emptyImgTJ()

                        localStorage.setItem('lastpagename', that.pageId)
                    }

                    if (reqData.page_comb && reqData.page_comb.length) {
                        that.combObj = reqData.page_comb;
                    }
                }
            })
        },
        searchJump: function () {
            localStorage.setItem('lastpagename', '搜索')
            localStorage.setItem('lastpageid', '0000')
            localStorage.setItem('lastresid', '0000')
            newMallTools.redirect(newMallTools.getApiUrl('search'))

            try {
                let server = newMallTools.getPlatform().server
                _czc.push(['_trackEvent', 'search' + server, '点击', '搜索'])

                newMallTools.selfTjClick({
                    position: 'search' + server,
                    actionFrom: '点击:搜索'
                })
            } catch (e) {}
        },
        jumpHome: function () {
            let href = window.location.href
            let url = '//assets.yaomall.tvm.cn/Uploads/mall_proxy/proxy.html'

            if (href.indexOf('qa.yaomall.tvm.cn') >= 0 || href.indexOf('192.168') >= 0) {
                url = '//qa.yaomall.tvm.cn/shadmin/Uploads/mall_proxy/proxy.html'
            } else if (href.indexOf('dev.yaomall.tvm.cn') >= 0) {
                url = '//dev.yaomall.tvm.cn/Uploads/mall_proxy/proxy.html'
            }

            window.location.href = url
        }
    }
})