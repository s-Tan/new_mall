// 页面样式表
import '../css/common.css'
import '../css/index-page.css'
// 模块
import Vue from 'vue'
import 'lib-flexible'
import '../js/tools' // 工具类 可用线上包tvm-tools代替
// vue页面组件
import ProductList from '../components/ProductListV1.vue'
import TopMenuBarV1 from '../components/TopMenuBarV1.vue'
import Banner from '../components/Banner.vue'
import Banner2 from '../components/Banner2.vue'
import FunctionBall from '../components/FunctionBall.vue'
import IndexArea from '../components/IndexArea.vue'
import FlashSale from '../components/FlashSale.vue'
import IndexAreaAd from '../components/IndexAreaAd.vue'
import djdzm from '../components/djdzm.vue'
import LoadingProduct from '../components/LoadingProduct.vue'
import PopRebateMes from '../components/PopRebateMes.vue'
import PopUp from '../components/Popup.vue'
import drag from '../components/drag.vue'
//import backToTop from '../components/backToTop.vue'

let _platform = newMallTools.getPlatform()

var _v = new Vue({
  el: '#app',
  components: {
    ProductList: ProductList,
    TopMenuBarV1: TopMenuBarV1,
    Banner: Banner,
    FunctionBall: FunctionBall,
    BannerTwo: Banner2,
    IndexArea: IndexArea,
    FlashSale: FlashSale,
    IndexAreaAd: IndexAreaAd,
    djdzm: djdzm,
    LoadingProduct: LoadingProduct,
    PopRebateMes: PopRebateMes,
    PopUp: PopUp,
    CompDrag: drag,
    //BackToTop: backToTop
  },
  data: {
    products: [],
    showSearch: false,
    nextPage: 1,
    limit: 20,
    url2: '//dev.yaomall.tvm.cn/shadmin/Home/SuperReturn/GetSuperReturn',
    navList: [],
    todayNewNum: '',
    showAll: false,
    imgList: [], // banner
    mImgList: [], // middle banner
    imgListBanner: [], // 中间banner
    localBlockList: [], // 区位块
    ballList: [], // function ball
    zad: [], // area
    djdzmUrl: 'javascript:;',
    djdzmProduct1: {},
    djdzmProduct2: {},
    djdzmProduct3: {},
    djdzmId: '0000',
    djdzmgId: '0000',
    pageId: newMallTools.getUrlParams('id'),
    face: '',
    hhjxData: undefined,
    hhjxId: '0000',
    hhjxgId: '0000',
    isLoadingMore: true,
    noHaveMore: false,
    loadItemTotal: 4,
    pageStartArr: [],
    pad: [], // AD,
    flowAd: [],
    tbJumpBeforImgsrc: '',
    showReturnToTop: false,
    pageY: 400, // 默认在哪个视图显示返回按钮

  },
  mounted: function () {
    // $('.to-top').hide();
    window.onscroll = function () {
      if ($(window).scrollTop() > 100) {
        $('.go-top').show();
      } else {
        $('.go-top').hide();
      }
    }

    let that = this;
    let platform = newMallTools.getPlatform();

    const faceInterval = setInterval(function () {
      let face = localStorage.getItem('face')
      if (face) {
        that.face = face
        clearInterval(faceInterval)
      }
    }, 100)

    if (platform.wechat) {
      const userInterval = setInterval(function () {
        if (localStorage.getItem('ttvmopenid') || localStorage.getItem('openid')) {
          clearInterval(userInterval);
          that.init();
        }
      }, 100);
    } else {
      this.init();
    }
  },
  created() {
    window.addEventListener('scroll', this.currentPageYOffset);
    // alert(localStorage.getItem('openid'))
  },
  methods: {
    currentPageYOffset() {
      // 判断滚动区域大于多少的时候显示返回顶部的按钮
      window.pageYOffset > this.pageY ? this.showReturnToTop = true : this.showReturnToTop = false;

    },
    init: function () {
      this.getIndexData()

      let that = this
      let params = newMallTools.getUrl().queryParams

      let script = document.createElement('script')
      if (params.platform === 'public') {
        script.src = '//a-h5.mtq.tvm.cn/yao/ybt_module/jc/menu.js'
      } else if (params.platform) {
        script.src = '//a-h5.mtq.tvm.cn/yao/ybt_module_tv/jc/menu.js'
      }

      if (script.src) {
        let head = document.getElementsByTagName('head')[0]
        head.appendChild(script)
      }

      script.onload = function () {
        that.storeCreateMenu()
      }

      this.getTodayNew()

      $('.to-top').click(function () {
        let bodyObj = $('body')[0]
        bodyObj.scrollTop = 0
      })

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

      localStorage.setItem('lastpagename', '花余额');

      newMallTools.emptyImgTJ()
    },
    storeCreateMenu: function (openid) {
      let platform = newMallTools.getPlatform()
      let uriParams = newMallTools.getUrl().queryParams

      if (platform.app) {
        return false
      }

      openid = window.localStorage.getItem('openid')
      let nickname = window.localStorage.getItem('nickname')
      let face = window.localStorage.getItem('face')
      let channelid = uriParams.channelid || uriParams.channelId
      let yyyappid = uriParams.yyyappid || uriParams.yappid
      let token = uriParams.token

      if (this.createMenuValidate(channelid + '_' + token + '_' + yyyappid) >= 0) {
        return false
      }

      if (channelid !== undefined && yyyappid !== undefined && token !== undefined) {
        let ele = $('body')

        createMenu({
          ele: ele[0],
          userInfo: {
            openid: openid,
            nickname: nickname,
            weixin_avatar_url: face
          },
          page: {
            channelid: channelid,
            yyyappid: yyyappid,
            token: token
          },
          current: 2
        })

        $('body').css({
          'padding-bottom': '50px'
        })
      }
    },
    createMenuValidate: function (str) {
      let arr = [
        '7acjjfybsg9o_7acjjfybsg9o_MP_7acjjfybsg9o',
        '44hdxxjvkx62_44hdxxjvkx62_MP_44hdxxjvkx62',
        'cxqbfzkaqkdb_cxqbfzkaqkdb_MP_cxqbfzkaqkdb',
        'e83q6gqbch7o_e83q6gqbch7o_MP_e83q6gqbch7o',
        'ax3pkz06zxfr_ax3pkz06zxfr_MP_ax3pkz06zxfr',
        '1777_0be2d360c83f776f_wxdde8d49a9600d9e2',
        '1789_df1596792613d19a_wxaccdee789ba027ec',
        '1658_x9hft3kmmkuy_wxf789b2228bee1f21',
        '70_8m0pzkxe15wg_wxa3a0f973ee381a6a',
        '1735_qn8q268ad3e9_wxc100f3a6c803caf6',
        '2201_97a0e87776a0_wx7ea49046dca96e60',
        '2262_4q7er95js1r5_wxd1f158117c0bc5df',
        '1712_d7hp7vfw7zbp_wx1b606c45521ed16d',
        '51538_axrqyasqn8s2_wxbac5eb4ba96e19f1',
        '1381_0dcbe1bc988f_wx59a1798e6ac10244',
        '51516_nvmkrx3is8uq_wx82f7b7883ca1ce6b',
        '1383_352b4b35b1f7_352b4b35b1f7',
        '1953_6tgy3eu428p9_wxd9c76a271f1ef965',
        '51468_94tfkxzpdzrh_wxe4a9890b4285a417',
        '2187_12dec5848dfd_wx3f88e45ca2f0371c',
        '2266_or2y29bm4rst_wx81edbdfc77c3c0e7',
        '1691_kqvm0qfquqro_wx9ad19f50b1e04d06',
        '1614_pr9u0y1uibej_wx6d86b929be1437b2',
        '1703_5bd0ff83bd7c_wx9e7286d723048237',
        '1403_gansuweishi_wx64390e2814faa2da',
        '1654_cjhs2eekr0bf_wxcf36808cf7a1bfb0',
        '1512_29ee35c70f72_wx98c6ff7b126bf406',
        '1611_i05fpv3up4kg_wx092a7b52f78207ce',
        '2198_d0a8a7dc8584_wx4894d5a945d55c13'
      ]

      return arr.indexOf(str)
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

      that.noHaveMore = false
      that.isLoadingMore = true

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
    redirect: function (url) {
      localStorage.setItem('lastresid', this.djdzmId)
      localStorage.setItem('lastgid', this.djdzmgId)
      try {
        let server = newMallTools.getPlatform().server
        _czc.push(['_trackEvent', 'salelist' + server, '点击', '更多'])

        newMallTools.selfTjClick({
          position: 'salelist' + server,
          actionFrom: '点击:更多'
        })
      } catch (e) {

      }
      newMallTools.redirect(url)
    },
    jumpMine: function () {
      try {
        let server = newMallTools.getPlatform().server
        _czc.push(['_trackEvent', 'mine' + server, '点击', '我的'])

        newMallTools.selfTjClick({
          position: 'mine' + server,
          actionFrom: '点击:我的'
        })
      } catch (e) {

      }
      newMallTools.mineUri()
    },
    getIndexData: function () {
      let that = this
      let url = newMallTools.getApiUrl('MallPage')
      console.log(url)

      if (!that.pageId) {
        window.location.href = 'index.html?id=1'
      }
      that.noHaveMore = false
      that.isLoadingMore = true

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
          if (reqData.banner) {
            that.initBanner(reqData.banner)
            that.loadItemTotal--
          } else {
            that.loadItemTotal--
          }
          if (reqData.tbanner) {
            that.initBannerTwo(reqData.tbanner)
          }
          if (reqData.zad2) {
            that.initLocalBlock(reqData.zad2)
          }
          if (reqData.fball) {
            that.initFBall(reqData.fball)
            that.loadItemTotal--
          } else {
            that.loadItemTotal--
          }

          if (reqData.zad) {
            that.initArea(reqData.zad)
            that.loadItemTotal--
          } else {
            that.loadItemTotal--
          }

          if (reqData.mbanner) {
            that.initMBanner(reqData.mbanner)
            that.loadItemTotal--
          } else {
            that.loadItemTotal--
          }
          if (reqData.pad) {
            try {
              that.pad = reqData.pad
            } catch (e) {
              console.log(e)
            }
          }
          if (reqData.flow_ad) {
            try {
              that.flowAd = reqData.flow_ad
            } catch (e) {
              console.log(e)
            }
          }

          //that.showAD();
          if (reqData.cnav) {
            that.initNav(reqData.cnav.cnav_name)

            if (reqData.cnav.cnav_data && reqData.cnav.cnav_data.length > 0) {
              that.initDjdzm(reqData.cnav.cnav_data[0])
              that.initHhjx(reqData.cnav.cnav_data[1] || [])
            } else {
              that.noHaveMore = true
              that.isLoadingMore = false

              newMallTools.noProductBodyImg()
            }
          } else {
            that.noHaveMore = true
            that.isLoadingMore = false
          }
        }
      })
    },
    initBanner: function (arr) {
      this.imgList = arr
    },
    //新上顶部banner
    initBannerTwo: function (arr) {
      this.imgListBanner = arr
    },
    //区位块
    initLocalBlock: function (arr) {
      this.localBlockList = arr
    },
    initFBall: function (arr) {
      this.ballList = arr
    },
    initArea: function (arr) {
      this.zad = arr
    },
    initMBanner: function (arr) {
      this.mImgList = arr
    },
    initNav: function (arr) {
      this.navList = arr
    },
    initDjdzm: function (arr) {
      let that = this

      if (arr && arr.id) {
        this.djdzmId = arr.id
      }

      if (arr && arr.gid) {
        this.djdzmgId = arr.gid
      }

      if (arr && arr.link_url) {
        this.djdzmUrl = arr.link_url
      }

      if (arr && arr.interface_url) {
        let params = {
          from: _platform.current === 'wechat' ? 'wxh' : _platform.current,
          tag_id: arr.gid || '',
          offset: 0,
          limit: 3
        }

        newMallTools.baseAjax({
          type: 'post',
          url: arr.interface_url,
          data: JSON.stringify(params),
          cb: function (req) {
            if (typeof (req) === 'string') {
              req = JSON.parse(req)
            }

            try {
              req.data[0].gid = arr.gid || '0000'
              that.djdzmProduct1 = req.data[0]
              req.data[1].gid = arr.gid || '0000'
              that.djdzmProduct2 = req.data[1]
              req.data[2].gid = arr.gid || '0000'
              that.djdzmProduct3 = req.data[2]
            } catch (e) {
              console.log(JSON.stringify(e))
            }
          }
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
        localStorage.setItem('lastresid', arr.id)
      }

      if (arr && arr.gid) {
        this.hhjxgId = arr.gid
        localStorage.setItem('lastgid', arr.gid)
      }

      if (arr && arr.interface_url) {
        that.hhjxData = arr
      }

      let htmlHeight = document.querySelectorAll('html')[0].clientHeight
      let scrollTop = document.querySelectorAll('body')[0].scrollTop
      let hhjxTop = document.querySelectorAll('.hhjx-wrapper')[0].offsetTop
      let hhjxHeight = document.querySelectorAll('.hhjx-header')[0].offsetHeight

      if (this.products.length > 0 && htmlHeight - (scrollTop + hhjxTop + hhjxHeight) > 0) {
        return false
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
            from: newMallTools.getUrlParams('debug_platform') || _platform.current === 'wechat' ? 'wxh' : _platform.current,
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
            }

            // console.log(req);
          }
        })
      } else {
        that.noHaveMore = true
        that.isLoadingMore = false
      }
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
    // showAD: function () {
    //   this.adCurr = 'ad'
    //   this.showNormalAD()
    //   // 新人广告
    //   // if (_platform.app) {
    //   //   this.showNewHumenAD()
    //   // } else {
    //   //   this.adCurr = 'ad'
    //   //   this.showNormalAD()
    //   // }
    // },
    // showNewHumenAD: function () {
    //   this.adCurr = 'firstad'
    //   let that = this

    //   let pdt = {
    //     customer_id: localStorage.getItem('openid')
    //     // customer_id: '22e'
    //   }

    //   newMallTools.baseAjax({
    //     type: 'post',
    //     url: newMallTools.getApiUrl('FirstAd'),
    //     data: JSON.stringify(pdt),
    //     cb: function (req) {
    //       // console.log(req);

    //       if (typeof (req) === 'string') {
    //         req = JSON.parse(req)
    //       }

    //       if (req.data && req.data.length > 0) {
    //         that.adName = '新人弹窗带下次不显示'
    //         that.adImgUri = req.data[0]
    //         that.isAdShow = true
    //         that.isAdTipShow = true
    //       } else {
    //         that.showNormalAD()
    //       }
    //     }
    //   })
    // },
    // showNormalAD: function () {
    //   this.adCurr = 'ad'
    //   let arr = this.pad || [];
    //   try {
    //     this.adImgUri = arr[0].image_uri
    //     this.adUrl = arr[0].uri
    //     this.isAdShow = true
    //     this.isAdTipShow = false
    //     this.adId = arr[0].id
    //     this.adName = arr[0].name || '0000'
    //   } catch (e) {
    //     console.error('ad', JSON.stringify(e))
    //   }
    // },
    closeEvent: function () {
      try {
        let server = newMallTools.getPlatform().server
        _czc.push(['_trackEvent', 'adclose' + server, '点击', '广告关闭按钮'])

        newMallTools.selfTjClick({
          position: 'adclose' + server,
          actionFrom: '点击:广告关闭按钮'
        })
      } catch (e) {}
      this.isAdShow = false
      let pdt = {
        customer_id: localStorage.getItem('openid')
        // customer_id: '22e'
      }

      if (this.isAdTipShow) {
        if (this.adCheckbox) {
          $.ajax({
            type: 'post',
            url: newMallTools.getApiUrl('ForbidFirstAd'),
            data: JSON.stringify(pdt),
            success: function (req) {}
          })
        }

        this.showNormalAD()
      }
    },
    adJump: function () {
      if (this.adCurr === 'ad') {
        localStorage.setItem('lastresid', this.adId)
        localStorage.setItem('lastgid', '0000')

        try {
          let server = newMallTools.getPlatform().server
          _czc.push(['_trackEvent', 'pushad' + server, '点击', this.adName])

          newMallTools.selfTjClick({
            position: 'pushad' + server,
            actionFrom: '点击:' + this.adName
          })
        } catch (e) {}
      } else {
        localStorage.setItem('lastresid', this.adFirstId)
        localStorage.setItem('lastgid', '0000')

        try {
          let server = newMallTools.getPlatform().server
          _czc.push(['_trackEvent', 'pushad' + server, '点击', this.adName])

          newMallTools.selfTjClick({
            position: 'pushad' + server,
            actionFrom: '点击:' + this.adName
          })
        } catch (e) {}
      }

      newMallTools.redirect(this.adUrl)
    }

  },
  watch: {
    loadItemTotal: function (newValue) {
      if (newValue === 0) {
        $('#app').removeClass('display-none')

        $('.pacman-wrapper').hide()

        setTimeout(function () {
          $('.pacman-wrapper').hide()
        }, 3000)
      }
    },
    isAdShow: function (newValue) {
      if (newValue) {
        $('html,body').addClass('lock-viewpoint')
      } else {
        $('html,body').removeClass('lock-viewpoint')
      }
    }
  }
})