// 样式表
import '../css/common.css'
import '../css/djdzm-page.css'
// 模块
import Vue from 'vue'
import 'lib-flexible'
import '../js/tools' // 工具类 可用线上包tvm-tools代替
// vue页面组件
import ProductList from '../components/ProductListV1.vue'
import TopMenuBarV1 from '../components/TopMenuBarV1.vue'
import Banner from '../components/Banner.vue'
import FunctionBall from '../components/FunctionBall.vue'
import LoadingProduct from '../components/LoadingProduct.vue'
import drag from '../components/drag.vue'

$(function () {
  /* let _platform = newMallTools.getPlatform() // never used */

  new Vue({
    el: '#app',
    components: {
      ProductList: ProductList,
      TopMenuBarV1: TopMenuBarV1,
      Banner: Banner,
      FunctionBall: FunctionBall,
      LoadingProduct: LoadingProduct,
      CompDrag: drag
    },
    data: {
      products: [],
      showSearch: false,
      nextPage: 1,
      limit: 20,
      navList: [],
      todayNewNum: 0,
      showAll: false,
      imgList: [],
      pageId: newMallTools.getUrlParams('id'),
      apiFrom: function () {
        let platform = newMallTools.getPlatform()

        if (platform.current === 'wechat') {
          return 'wxh'
        }

        return platform.current
      },
      face: '',
      hhjxData: undefined,
      hhjxId: '0000',
      hhjxgId: '0000',
      isLoadingMore: true,
      noHaveMore: false,
      isShow123: false,
      loadItemTotal: 2,
      pageStartArr: [],
      isAppShow: false,
      flowAd: []
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

      this.getTodayNew()

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

      let show123Arr = [5, 6, 11, 12]

      if (show123Arr.indexOf(pageId) >= 0) {
        this.isShow123 = true
      }
    },
    methods: {
      init: function () {
        let that = this

        window.onscroll = function () {
          let htmlObj = $('html')[0]
          let bodyObj = $('body')[0]
          let scrollTop = bodyObj.scrollTop
          let scrollHeight = htmlObj.scrollHeight
          let clientHeight = htmlObj.clientHeight

          let currPosition = scrollHeight - (clientHeight + scrollTop)

          if (scrollTop > 10 && currPosition >= 0 && currPosition < 50) {
            that.initHhjx()
          }
        }
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
            console.log(req)

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
            // alert(JSON.stringify(reqData.flow_ad))

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
                'padding-top': 37
              })
            } else {
              $('#app').css({
                'padding-top': 82
              })
            }

            if (reqData.page_info) {
              if ($('title').text() === '') {
                $('title').text(reqData.page_info.name)
              }

              localStorage.setItem('lastpagename', reqData.page_info.name)

              newMallTools.emptyImgTJ({
                titleName: reqData.page_info.name
              })
            } else {
              $('title').text('商品推荐')

              newMallTools.emptyImgTJ()

              localStorage.setItem('lastpagename', that.pageId)
            }

            if (reqData.banner) {
              that.initBanner(reqData.banner)
              that.loadItemTotal--
            } else {
              that.loadItemTotal--
            }

            if (reqData.cnav) {
              that.initNav(reqData.cnav.cnav_name)

              if (reqData.cnav.cnav_data && reqData.cnav.cnav_data.length > 0) {
                that.initHhjx(reqData.cnav.cnav_data[0] || [])
              } else {
                that.noHaveMore = false
                that.isLoadingMore = false

                newMallTools.noProductBodyImg()
              }

              that.loadItemTotal--
            } else {
              that.loadItemTotal--
                that.noHaveMore = true
              that.isLoadingMore = false

              newMallTools.noProductBodyImg()
            }
          }
        })
      },
      initBanner: function (arr) {
        this.imgList = arr
      },
      initNav: function (arr) {
        this.navList = arr

        if (!this.showSearch && !this.navList.length) {
          $('#app').css({
            'padding-top': 0
          })
        }
      },
      initHhjx: function (arr) {
        let that = this

        if (!that.hhjxData) {
          that.nextPage = 1
          that.products = []
        }

        if (arr && arr.id) {
          this.hhjxId = arr.id
          localStorage.setItem('lastresid', arr.id || '0000')
        }

        if (arr && arr.gid) {
          this.hhjxgId = arr.gid
          localStorage.setItem('lastgid', arr.gid || '0000')
        }

        if (arr && arr.interface_url) {
          that.hhjxData = arr
        }

        if (that.hhjxData) {
          if (this.pageStartArr.length && this.pageStartArr.indexOf(that.nextPage) >= 0) {
            return false
          }
          this.pageStartArr.push(that.nextPage)
          newMallTools.baseAjax({
            type: 'post',
            url: that.hhjxData.interface_url,
            data: JSON.stringify({
              from: that.apiFrom(),
              tag_id: that.hhjxData.gid || '',
              offset: (that.nextPage - 1) * that.limit,
              limit: that.limit
            }),
            cb: function (req) {
              if (typeof (req) === 'string') {
                req = JSON.parse(req)
              }

              try {
                if (req.data.length === 0) {
                  that.noHaveMore = true
                  that.isLoadingMore = false

                  return false
                }

                that.products = that.products.concat(req.data)

                that.noHaveMore = false
                that.isLoadingMore = true

                that.nextPage += 1
              } catch (e) {
                console.log('product_list_err:', e)

                that.noHaveMore = true
                that.isLoadingMore = false

                if (that.products.length === 0) {
                  that.noHaveMore = false
                  that.isLoadingMore = false

                  newMallTools.noProductBodyImg()
                }
              }

              if (that.products.length === 0) {
                newMallTools.noProductBodyImg()

                that.noHaveMore = false
                that.isLoadingMore = false
              }

              if (that.products.length < that.limit) {
                that.noHaveMore = true
                that.isLoadingMore = false
              }
            }
          })
        } else {
          that.noHaveMore = true
          that.isLoadingMore = false
        }
      },
      getTodayNew: function () {
        let that = this
        let apiUrl = newMallTools.getApiUrl('GetTodayNewProductNum')
        let platform = newMallTools.getPlatform()
        let from
        if (platform.wechat) {
          from = 'wxh'
        } else if (platform.app) {
          from = 'app'
        } else if (platform.alipay) {
          from = 'zfb'
        } else {
          from = 'wxh'
        }

        newMallTools.baseAjax({
          type: 'post',
          url: apiUrl,
          data: JSON.stringify({
            from: from
          }),
          cb: function (req) {
            if (!req) {
              return false
            }

            if (typeof (req) === 'string') {
              req = JSON.parse(req)
            }

            if (req.status === 1) {
              if (req.data) {
                that.todayNewNum = req.data
              }
            }
          }
        })
      },
      searchJump: function () {
        localStorage.setItem('lastpagename', '搜索')
        localStorage.setItem('lastpageid', '0000')
        localStorage.setItem('lastresid', '0000')

        try {
          let server = newMallTools.getPlatform().server
          _czc.push(['_trackEvent', 'search' + server, '点击', '搜索'])

          newMallTools.selfTjClick({
            position: 'search' + server,
            actionFrom: '点击:搜索'
          })
        } catch (e) {

        }

        newMallTools.redirect(newMallTools.getApiUrl('search'))
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
    },
    watch: {
      products: function (newValue, oldValue) {
        if (newValue.length === 0) {
          this.noHaveMore = true
          this.isLoadingMore = false
        } else {
          $('body').css({
            background: '#f0f0f0'
          })
        }
      }
    }
  })
})