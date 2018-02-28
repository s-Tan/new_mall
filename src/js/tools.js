/* eslint-disable no-var,camelcase,no-redeclare,eqeqeq,no-unused-vars */
import '../css/common.css' // 样式表
import '../js/app-getuserinfo' // 壳上的用户信息认证 可用线上包tvm-getuserinfo代替
import '../js/authorize' // 认证 可用线上包tvm-authorize代替
import 'tvm-zepto' // zepto 模块包
import uriparamify from 'urlparamify' // 地址解析插件：把地址中的协议、主机、路径以及参数全部封装成一个对象，方便使用。
import b64encode from 'base64-encode-string' // base64转换
import Cookies from 'js-cookie' // http://www.bootcdn.cn/js-cookie/readme/
import Moment from 'moment' // http://momentjs.com/docs/

// eslint-disable-next-line
var _hmt = _hmt || [] // 百度统计使用的变量
// eslint-disable-next-line
var _tvm2017 = _tvm2017 || []; // self_tj.js使用的变量

(function () {
  /**
   * 工具类
   * 页面加载时生成，不可以异步，授权类也要使用此类，页面级脚本需要在此对象生成成功后使用
   */
  function Tvmtools() {
    // 个人中心主路径
    this.UriYaomalHtml = '//yaomall.tvm.cn/html/'
    // app版本号
    this.appVersion = 0
    // 平台来源
    this.platform = 0
    // 店铺ID备用
    this.mallId = '2aeaf986-da55-8738-2f81-2b2918cad9df'
    // 店铺统计使用
    this.mallSigId = '964660'

    // 加载动画HTML
    this.loadingHtmlStr = '<div class="pacman-wrapper">' +
      '<div class="pacman-mark"></div>' +
      '<div class="load6">' +
      '<div class="bounce1"></div>' +
      '<div class="bounce2"></div>' +
      '<div class="bounce3"></div>' +
      '</div>' +
      '</div>';

    this.tbBeforeHtml =
      `
    <img src="imgs/alert_tb.png?v=1" style="display:inline-block;width:0;height:0;opacity:0;z-index:-1;">
    <img src="imgs/alert_tb_rebate.png?v=1" style="display:inline-block;width:0;height:0;opacity:0;z-index:-1;">
    <img src="imgs/alert_tb_head.gif?v=1" style="display:inline-block;width:0;height:0;opacity:0;z-index:-1;">
    <div class="tb-jump-before-quan" style="display: none;">
        <div class="tb-jump-before-mask"></div>
        <div class="tb-jump-before-content">
            <img src="imgs/alert_tb_head.gif" width="100%;" style="position: absolute;width: 100%;top: 3px;left: 0;z-index: 93;">
            <img src="imgs/alert_tb.png" width="100%;">
        </div>
    </div>
    <div class="tb-jump-before" style="display: none;">
        <div class="tb-jump-before-mask"></div>
        <div class="tb-jump-before-content">
            <img src="imgs/alert_tb_head.gif" width="100%;" style="position: absolute;width: 100%;top: 3px;left: 0;z-index: 93;">
            <img src="imgs/alert_tb_rebate.png" width="100%;">
        </div>
    </div>
    `

    this.traceIdStore = localStorage.getItem('tranceidpath')
    // 初始化函数
    this.init = init
    // 第三方平台以及自平台统计js的引入
    this.tj = tj
    // 空图片统计，页面级
    this.emptyImgTJ = emptyImgTJ
    // 空图片统计，商品级
    this.emptyImgProductTJ = emptyImgProductTJ
    this.selfTjProduct = selfTjProduct
    this.selfTjClick = selfTjClick
    this.sendTaobaoFeedback = sendTaobaoFeedback
    this.baseAjax = baseAjax
    this.getApiUrl = getApiUrl
    this.getUrlParams = getUrlParams
    this.getUrl = getUrl
    this.getPlatform = getPlatform
    this.redirect = redirect
    this.mineUri = mineUri
    this.resetAuth = resetAuth
    this.noProductBodyImg = noProductBodyImg
    this.getProductInfo = getProductInfo
    this.getProductInfoAll = getProductInfoAll
    // 首页大接口返回的通过接口获取商品信息的函数，专题页模板专用函数
    this.getProductList = getProductList
    // 格式化价格，保留两位小数，不符合返回0.00
    this.formatPrice = formatPrice;
    // trace_id统计
    this.getTraceRecord = getTraceRecord
    // base64 转码
    this.base64 = base64
    // 淘宝地址跳转
    this.jumpOpenTbTmallUrl = jumpOpenTbTmallUrl
    // open_url跳转
    this.jumpOpenUrlSim = jumpOpenUrlSim
    // 获取商品类型
    this.getProductCpsType = getProductCpsType
    // js-cookies对象
    this.getCookies = Cookies;
    // moment对象
    this.getMoment = Moment();

    this.init()
  }

  function init() {
    if (!this.getUrlParams('mall_tj')) {
      localStorage.removeItem('lastpageid')
      localStorage.removeItem('lastpagename')
      localStorage.removeItem('lastgid')
      localStorage.removeItem('lastresid')
    }

    var that = this
    var href = window.location.href
    if (this.getUrlParams('debug')) {
      var script = document.createElement('script')
      script.src = 'https://cdn.bootcss.com/eruda/1.3.1/eruda.min.js'
      var s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(script, s)
      script.onload = function () {
        //eslint-disable-next-line
        eruda.init()
      }
    }

    this.platform = this.getPlatform()

    $('body').append(this.loadingHtmlStr)

    if (this.platform.app) {
      setupWebViewJavascriptBridge(function (WebViewJavascriptBridge) {})

      CallBridgeHander({
        action: 'get_version',
        data: {},
        callback: 1
      }, function (rspdt) {
        var jdat = JSON.parse(rspdt)
        var version = jdat.version

        that.appVersion = version
      })
    }

    if (this.platform.android) {
      $('html').css({
        'overflow-x': 'hidden'
      })
    }

    localStorage.setItem('tid', this.getUrlParams('trace_id') || '0000')
    localStorage.setItem('pageid', this.getUrlParams('id') || '0000')
    localStorage.setItem('cid', '0000')

    if (href.indexOf('qa.yaomall.tvm.cn') >= 0 || href.indexOf('192.168') >= 0) {
      this.mallId = '0755307c-6d38-8d82-7dc5-7cdd1c700f94'
      this.mallSigId = '550976'
      this.UriYaomalHtml = '//qa.yaomall.tvm.cn/html/'
    }

    // 获取trace记录
    this.getTraceRecord()

    // 查询到认证之后进行统计
    var isAutherize = setInterval(function () {
      if (localStorage.ttvmopenid) {
        clearInterval(isAutherize)
        tj()
      }
    }, 500)

    if (this.platform.app) {
      window.tbBeforeImgLoad = function (str, link, instc, acts) {
        if (str) {
          var obj = $('.tb-jump-before-' + str);
        } else {
          var obj = $('.tb-jump-before');
        }

        var vHeight = obj.find('.tb-jump-before-mask').height();
        var imgHeight = obj.find('.tb-jump-before-content img').eq(1).height();
        vHeight = vHeight / 2;
        imgHeight = imgHeight / 2;
        obj.find('.tb-jump-before-content img').css({
          'margin-top': (vHeight - imgHeight) + 'px',
          'opacity': 1
        });

        var starTime = new Date().getTime();
        var tbTimer = setInterval(function () {
          var endTime = new Date().getTime();
          if (endTime - starTime >= 2000) {
            clearInterval(tbTimer);
            newMallTools.redirect(link, instc, acts, true);
          }
        }, 100);
      }

      $('body').append(this.tbBeforeHtml);
    }
  };

  function tj() {
    /* var href = window.location.href // never used */

    // 商城统计
    var a = document.createElement('script')
    a.type = 'text/javascript'
    a.async = 'async'
    a.src = '//assets.yaomall.tvm.cn/Uploads/tj/self_tj.js'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(a, s)

    // 友盟统计
    var script = document.createElement('script')
    script.async = 'async'
    script.src = 'https://s13.cnzz.com/z_stat.php?id=1262175703&web_id=1262175703'
    script.language = 'JavaScript'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(script, s)

    // 百度统计
    var hm = document.createElement('script')
    hm.async = 'async'
    hm.src = 'https://hm.baidu.com/hm.js?1135e0d9625d90043fff0866f984a716'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(hm, s)

    // 腾讯统计
    var _mtac = {
      "performanceMonitor": 1,
      "senseQuery": 1
    };
    (function () {
      var mta = document.createElement("script");
      mta.src = "http://pingjs.qq.com/h5/stats.js?v2.0.4";
      mta.setAttribute("name", "MTAH5");
      mta.setAttribute("sid", "500548120");
      mta.setAttribute("cid", "500548136");
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(mta, s);
    })();
  }

  function emptyImgTJ(params) {
    // 空图片统计
    var href = window.location.href
    var _upms = this.getUrl().queryParams
    try {
      var _addi = JSON.parse(this.getUrlParams('addi'))
    } catch (e) {
      var _addi = {}
    }

    if (this.platform.app) {
      var origin = 'app'
    } else if (_upms.source === 3) {
      var origin = 'dsp'
    } else if (_addi && _addi.yyyappid) {
      var origin = 'yaotv'
    } else if (this.platform.wechat) {
      var origin = 'wx'
    } else if (this.platform.alipay) {
      var origin = 'alipay'
    } else {
      var origin = 'oth'
    }

    if (params && params.titleName) {
      var titleName = params.titleName
    } else {
      var titleName = document.title
    }

    var ajaxData = 'stat=' + encodeURIComponent(JSON.stringify({
      openid: localStorage.getItem('openid'),
      page: {
        nick: 'shop',
        id: this.mallSigId,
        pid: this.getUrlParams('id'),
        pname: titleName + '-' + (this.platform.current)
      },
      from: {
        origin: origin,
        id: (_addi && _addi.yyyappid) ? _addi.yyyappid : undefined,
        platform: this.platform.app ? 'app' : (this.platform.wechat ? 'gzh' : (this.platform.alipay ? 'alipay' : 'unknown'))
      }
    }))
    var hm = document.createElement('img')
    var src = 'http://stat.yaomall.tvm.cn/newstat/no.png?'
    if (href.indexOf('qa.yaomall.tvm.cn') >= 0 || href.indexOf('192.168') >= 0) {
      src = 'http://qa.yaomall.tvm.cn/newstat/no.png?'
    }
    hm.src = src + ajaxData
    hm.setAttribute('class', 'no-png')
    var s = document.querySelectorAll('body')[0]
    s.appendChild(hm)
  }

  function emptyImgProductTJ(params) {
    // 空图片统计
    var href = window.location.href
    var _upms = this.getUrl().queryParams
    try {
      var _addi = JSON.parse(this.getUrlParams('addi'))
    } catch (e) {
      var _addi = {}
    }

    if (this.platform.app) {
      var origin = 'app'
    } else if (_upms.source === 3) {
      var origin = 'dsp'
    } else if (_addi && _addi.yyyappid) {
      var origin = 'yaotv'
    } else if (this.platform.wechat) {
      var origin = 'wx'
    } else if (this.platform.alipay) {
      var origin = 'alipay'
    } else {
      var origin = 'oth'
    }

    if (params && params.pid) {
      var pid = params.pid
    } else {
      var pid = ''
    }

    var ajaxData = 'stat=' + encodeURIComponent(JSON.stringify({
      openid: localStorage.getItem('openid'),
      page: {
        nick: 'product',
        id: pid,
        storeid: this.mallSigId,
        fanli: true,
        tuan: false
      },
      from: {
        origin: origin,
        id: (_addi && _addi.yyyappid) ? _addi.yyyappid : undefined,
        platform: this.platform.app ? 'app' : (this.platform.wechat ? 'gzh' : (this.platform.alipay ? 'alipay' : 'unknown'))
      }
    }))

    var hm = document.createElement('img')
    var src = 'http://stat.yaomall.tvm.cn/newstat/no.png?'
    if (href.indexOf('qa.yaomall.tvm.cn') >= 0 || href.indexOf('192.168') >= 0) {
      src = 'http://qa.yaomall.tvm.cn/newstat/no.png?'
    }
    hm.src = src + ajaxData
    hm.setAttribute('class', 'no-png')
    var s = document.querySelectorAll('body')[0]
    s.appendChild(hm)
  }

  /**
   * 自用统计，点击商品统计函数
   * @param {*} params {productId:商品ID,do:行为（buy买，search搜索）}
   */
  function selfTjProduct(params) {
    if (!params) {
      return false
    }

    if (!params.openid || params.openid.length < 10) {
      return false
    }

    this.baseAjax({
      type: 'get',
      url: this.getApiUrl('SystemStMongo'),
      data: {
        args: JSON.stringify({
          'action': 'product_click',
          'product_id': params.productId || '',
          'sku_id': params.sku_id || '',
          'cps_type': params.cpsType || '',
          'userinfo': {
            id: localStorage.getItem('ttvmopenid') || localStorage.getItem('openid') || localStorage.getItem('tvmid') || ''
          },
          'source': newMallTools.getPlatform().current,
          'behavior': params.do || '', // 'search','buy'
          'page_title': document.title,
          'start_trace_id': localStorage.getItem('starttraceid') || '0000',
          'group_id': localStorage.getItem('lastgid') || '0000',
          'curr_res_id': localStorage.getItem('lastresid') || '0000',
          'last_trace_id': newMallTools.getUrlParams('trace_id') || '0000',
          'curr_trace_id': newMallTools.getUrlParams('trace_id') || '0000',
          'curr_id': newMallTools.getUrlParams('id') || '0000',
          'arc_type': params.arcType || ''
        })
      },
      cb: function (req) {
        // console.log('SystemStMongo:', JSON.stringify(req));
      }
    })
  }

  /**
   * 自用统计，点击事件统计函数
   * @param {*} params {productId:商品ID,do:行为（buy买，search搜索）}
   */
  function selfTjClick(params) {
    if (!params) {
      return false
    }

    this.baseAjax({
      type: 'get',
      url: this.getApiUrl('SystemStMongo'),
      data: {
        args: JSON.stringify({
          'action': "all_click",
          'userinfo': {
            id: localStorage.getItem('ttvmopenid') || localStorage.getItem('openid') || localStorage.getItem('tvmid') || ''
          },
          'position': params.position || '', // 资源位名称，同友盟点击事件名称
          'action_from': params.actionFrom || '', // 事件来源，资源位中的项目名称及位置
          'source': newMallTools.getPlatform().current, // 平台来源
          'page_title': document.title, // 页面标题
          'start_trace_id': localStorage.getItem('starttraceid') || '0000', // 入口页面traceid
          'group_id': localStorage.getItem('lastgid') || '0000', // 分组id
          'curr_res_id': localStorage.getItem('lastresid') || '0000', // 当前资源位id
          'last_trace_id': newMallTools.getUrlParams('trace_id') || '0000', // 上一资源位id
          'curr_trace_id': newMallTools.getUrlParams('trace_id') || '0000', // 当前页面traceid
          'curr_id': newMallTools.getUrlParams('id') || '0000', // 当前页面id
          'keyword': params.keyword || '', // 搜索关键字
          'behavior': params.behavior || '' //
        })
      },
      cb: function (req) {
        // console.log('SystemStMongo:', JSON.stringify(req));
      }
    })
  }

  function sendTaobaoFeedback(feedback) {
    $.ajax({
      url: 'http://yaomall.tvm.cn/shadmin/Home/Api/WriteFeedBackToMongo',
      data: JSON.stringify(feedback),
      type: 'POST',
      success: function (req) {
        // alert(JSON.stringify(req))
      }
    });
  }

  /**
   * 基础ajax请求
   * @param params={type:'',url:'',data:'',cb:function(req){}}
   */
  function baseAjax(params) {
    if (!localStorage.getItem('openid')) {
      newMallAuthorize.Authorize()
    }

    // console.log('base_ajax:', params);

    if (params && params.url.indexOf('GetMallPtTag') < 0) {
      $('.pacman-wrapper').show()
    }

    var async = true

    if (params.async === false) {
      async = false
    }

    if (params.url.indexOf('http') < 0) {
      // params.url += 'http:' + params.url;
    }

    var ajax = $.ajax({
      type: params.type,
      url: params.url,
      data: params.data,
      async: async,
      success: function (req) {
        // console.log('success_req:', JSON.stringify(params));
        if (params.cb) {
          params.cb(req)
        }

        $('.pacman-wrapper').hide()
      },
      error: function (req) {
        if (params.cb) {
          params.cb({
            status: 0
          })
        }

        $('.pacman-wrapper').hide()
      }
    })

    if (async === false) {
      if (ajax && ajax.status === 200) {
        try {
          return JSON.parse(ajax.responseText)
        } catch (e) {
          return ajax
        }
      } else {
        return ajax
      }
    }
  };

  /**
   * 获取商城接口访问地址
   * @param name 接口名
   * @returns {*} 接口地址
   */
  function getApiUrl(name) {
    var currArea = 'local' // 本地服务器
    var href = window.location.href
    var platform = this.getPlatform()

    if (href.indexOf('dev.yaomall.tvm.cn') >= 0) {
      currArea = 'dev' // 开发服务器
    } else if (href.indexOf('127.0.0.1') >= 0 || href.indexOf('192.168') >= 0 || href.indexOf('localhost') >= 0) {
      currArea = 'qa' // 测试服务器
    } else if (href.indexOf('qa.yaomall.tvm.cn') >= 0) {
      currArea = 'qa' // 测试服务器
    } else if (href.indexOf('yaomall.tvm.cn') >= 0) {
      currArea = 'fm' // 正式服务器
    }

    switch (name) {
      case 'MallPage':
        if (currArea === 'local') {
          return '//qa.yaomall.tvm.cn/services/MallPage'
        } else if (currArea === 'dev') {
          return '//dev.yaomall.tvm.cn/services/MallPage'
        } else if (currArea === 'qa') {
          return '//qa.yaomall.tvm.cn/services/MallPage'
        } else {
          return '//huge.yaomall.tvm.cn/services/MallPage'
        }
      case 'GetTodayNewProductNum':
        if (currArea === 'local') {
          return '//qa.yaomall.tvm.cn/services/GetTdNewProNum'
        } else if (currArea === 'dev') {
          return '//dev.yaomall.tvm.cn/services/GetTdNewProNum'
        } else if (currArea === 'qa') {
          return '//qa.yaomall.tvm.cn/services/GetTdNewProNum'
        } else {
          return '//huge.yaomall.tvm.cn/services/GetTdNewProNum'
        }
      case 'GetCpsProductActivity':
        if (currArea === 'local') {
          return '//qa.yaomall.tvm.cn/services/GetCpsProductActivity'
        } else if (currArea === 'dev') {
          return '//dev.yaomall.tvm.cn/services/GetCpsProductActivity'
        } else if (currArea === 'qa') {
          return '//qa.yaomall.tvm.cn/services/GetCpsProductActivity'
        } else {
          return '//huge.yaomall.tvm.cn/services/GetCpsProductActivity'
        }
      case 'fanxianPageFan':
        if (currArea === 'local') {
          return 'https://qa-cps.yaomall.tvm.cn/auth/fanxian?page=fan'
        } else if (currArea === 'dev') {
          return 'https://qa-cps.yaomall.tvm.cn/auth/fanxian?page=fan'
        } else if (currArea === 'qa') {
          return 'https://qa-cps.yaomall.tvm.cn/auth/fanxian?page=fan'
        } else {
          return 'https://cps.yaomall.tvm.cn/auth/fanxian?page=fan'
        }
      case 'GetCpsLink':
        if (currArea === 'local') {
          return '//qa.yaomall.tvm.cn/services/GetCpsLink'
        } else if (currArea === 'dev') {
          return '//dev.yaomall.tvm.cn/services/GetCpsLink'
        } else if (currArea === 'qa') {
          return '//qa.yaomall.tvm.cn/services/GetCpsLink'
        } else {
          return '//huge.yaomall.tvm.cn/services/GetCpsLink'
        }
      case 'search':
        if (currArea === 'local') {
          if (this.platform.app) {
            return 'http://qa.yaomall.tvm.cn/services/short?id=W6Eap2';
          } else {
            return 'http://qa.yaomall.tvm.cn/services/short?id=kPcQH3';
          }
        } else if (currArea === 'dev') {
          if (this.platform.app) {
            return 'http://qa.yaomall.tvm.cn/services/short?id=W6Eap2';
          } else {
            return 'http://qa.yaomall.tvm.cn/services/short?id=kPcQH3';
          }
        } else if (currArea === 'qa') {
          if (this.platform.app) {
            return 'http://qa.yaomall.tvm.cn/services/short?id=W6Eap2';
          } else {
            return 'http://qa.yaomall.tvm.cn/services/short?id=kPcQH3';
          }
        } else {
          if (this.platform.app) {
            return 'http://huge.yaomall.tvm.cn/services/short?id=dNPyv3';
          } else {
            return 'http://huge.yaomall.tvm.cn/services/short?id=5JUHV1';
          }
        }
      case 'MallMiaoLimitFront':
        var from = platform.wechat ? '?from=wxh' : ''

        if (currArea === 'local') {
          return '//qa.yaomall.tvm.cn/services/MallMiaoLimitFront' + from
        } else if (currArea === 'dev') {
          return '//dev.yaomall.tvm.cn/services/MallMiaoLimitFront' + from
        } else if (currArea === 'qa') {
          return '//qa.yaomall.tvm.cn/services/MallMiaoLimitFront' + from
        } else {
          return '//huge.yaomall.tvm.cn/services/MallMiaoLimitFront' + from
        }
      case 'FirstAd':
        if (currArea === 'local') {
          return '//qa.yaomall.tvm.cn/services/FirstAd'
        } else if (currArea === 'dev') {
          return '//dev.yaomall.tvm.cn/services/FirstAd'
        } else if (currArea === 'qa') {
          return '//qa.yaomall.tvm.cn/services/FirstAd'
        } else {
          return '//huge.yaomall.tvm.cn/services/FirstAd'
        }
      case 'ForbidFirstAd':
        if (currArea === 'local') {
          return '//qa.yaomall.tvm.cn/services/ForbidFirstAd'
        } else if (currArea === 'dev') {
          return '//dev.yaomall.tvm.cn/services/ForbidFirstAd'
        } else if (currArea === 'qa') {
          return '//qa.yaomall.tvm.cn/services/ForbidFirstAd'
        } else {
          return '//huge.yaomall.tvm.cn/services/ForbidFirstAd'
        }
      case 'GetProductInfo':
        if (currArea === 'local') {
          return '//qa.yaomall.tvm.cn/services/GetProductCps'
        } else if (currArea === 'dev') {
          return '//dev.yaomall.tvm.cn/services/GetProductCps'
        } else if (currArea === 'qa') {
          return '//qa.yaomall.tvm.cn/services/GetProductCps'
        } else {
          return '//huge.yaomall.tvm.cn/services/GetProductCps'
        }
      case 'GetBarrageScreen':
        if (currArea === 'local') {
          return '//qa.yaomall.tvm.cn/services/GetBarrageScreen'
        } else if (currArea === 'dev') {
          return '//dev.yaomall.tvm.cn/services/GetBarrageScreen'
        } else if (currArea === 'qa') {
          return '//qa.yaomall.tvm.cn/services/GetBarrageScreen'
        } else {
          return '//huge.yaomall.tvm.cn/services/GetBarrageScreen'
        }
      case 'SystemStMongo':
        if (currArea === 'local') {
          return '//qa.yaomall.tvm.cn/services/SystemStMongo'
        } else if (currArea === 'dev') {
          return '//dev.yaomall.tvm.cn/services/SystemStMongo'
        } else if (currArea === 'qa') {
          return '//qa.yaomall.tvm.cn/services/SystemStMongo'
        } else {
          return '//huge.yaomall.tvm.cn/services/SystemStMongo'
        }
      case 'GetProductInfoAll':
        if (currArea === 'local') {
          return '//qa.yaomall.tvm.cn/services/GetProductInfo'
        } else if (currArea === 'dev') {
          return '//dev.yaomall.tvm.cn/services/GetProductInfo'
        } else if (currArea === 'qa') {
          return '//qa.yaomall.tvm.cn/services/GetProductInfo'
        } else {
          return '//huge.yaomall.tvm.cn/services/GetProductInfo'
        }
      default:
        return ''
    }
  };
  /**
   * 
   * @param {*} str //url
   * @param {*} key //url中的参数key
   * 如果只有一个str参数，那么str当做参数key
   */
  function getUrlParams(str, key) {
    if (arguments.length === 1) {
      key = str
      str = window.location.href
    }
    var reg = new RegExp('[^\\w*]' + key + '=([^#&]*)')
    var r = reg.exec(str)

    return r !== null ? decodeURIComponent(r[1]) : null
  };

  function getUrl(uri) {
    if (!uri) {
      uri = window.location.href
    }
    return uriparamify(uri)
  };
  /**
   * 获取当前浏览的平台信息，即微信、支付宝、APP
   */
  function getPlatform() {
    var platform = {
      server: ''
    }
    var uastr = window.navigator.userAgent
    var href = window.location.href

    var cur = null
    if (uastr.match(/APP_iOS/i) || uastr.match(/APP_Android/i)) {
      cur = 'app'
    } else if (uastr.match(/MicroMessenger/i)) {
      cur = 'wechat'
    } else if (uastr.match(/Alipay/i)) {
      cur = 'alipay'
    } else {
      cur = 'app'
    }

    if (href.indexOf('qa.yaomall.tvm.cn') >= 0 || href.indexOf('192.168') >= 0 || href.indexOf('127.0') >= 0) {
      platform.server = 'qa'
    } else if (href.indexOf('dev.yaomall.tvm.cn') >= 0) {
      platform.server = 'dev'
    }

    platform.current = cur
    platform[cur] = 1

    if (uastr.match(/Mac OS X/i)) {
      platform.ios = 1
    } else if (uastr.match(/Android/i)) {
      platform.android = 1
    }

    return platform
  };
  /**
   * 商城点击跳转函数，包含链接、商品等
   * @param * uri 跳转地址字符串
   * @param instc 商品信息对象
   * @param acts 商品活动信息对象
   */
  function redirect(uri, instc, acts, isJump) {
    var uriBat = uri;
    var isExternalLink = false // 是否是优惠券商品

    // console.log('redirect_uri:', uri);

    if (!uri) {
      return false
    }

    if (this.getUrl().queryParams.debug) {
      debugger;
    }

    // 判断是否是天猫商品
    // if (uri && uri.indexOf('redirectTmall?') >= 0) {
    //   acts = undefined
    // }

    $('.pacman-wrapper').show()

    // 当前浏览平台属性 useragen
    var _platform = this.getPlatform()
    // 当前页面链接地址上的所有参数
    var uriParams = this.getUrl().queryParams
    // 往下级页面带的参数数组，为转化成参数字符串提供数据
    var params = []
    // 地址参数字符串
    var paramsStr = ''
    // 是否是静默授权
    var isBase = false
    // 老版商城的兼容处理，老版中，会把要传到下一页面的参数放到addi中
    var _addi = this.getUrl(uri).queryParams
    // 复用老版商城代码时，使用的变量，新版也被继续使用。当前页面地址上的所有参数对象
    var _upms = uriParams
    // 微信用户的openid，微信官方提供
    var localOpenid = localStorage.getItem('openid') || ''
    // 本地存储的天天电视宝微信公众号的openid，应该与openid一致，因为有可能其它网站本地存储也会用到openid，所以，启用了新的本地存储值
    // 在进行关键操作时，进行对比，如果不同，重新授权
    var localttvmopenid = localStorage.getItem('ttvmopenid') || ''
    // 搜索页面传过来的属性，给getCpsLink使用
    var proType = ''

    // 本地存储中的openid会有undefined和null的情况，如果不是正确的openid，重新授权
    if (localOpenid.length < 11) {
      if (_platform.app) {
        CallBridgeHander({
          action: 'open_login',
          data: {},
          callback: 1
        }, function (rspdt) {});

        return false;
      }
      localStorage.removeItem('openid')
      newMallAuthorize.Authorize()

      return false
    }

    // 如果ttvmopen和openid不同，重新授权。解决不是天天电视宝openid的订单
    if (localOpenid !== localttvmopenid || localOpenid.length !== localttvmopenid.length) {
      localStorage.removeItem('openid')
      newMallAuthorize.Authorize()

      return false
    }
    //url参数要重新拼接，为什么？
    //当前页面的id，trace_id以及页面独有属性不允许往下一页带，其它参数要一直往下带。
    if (uri && uri.indexOf('?') < 0) {
      paramsStr += '?'
    } else {
      paramsStr += '&'
    }

    //需要往下一页带参数的参数对象
    var pms = uriParams
    delete pms.trace_id
    delete pms.id

    if (_upms.isbase) {
      pms.isbase = 1;
    } else {
      delete pms.isbase;
    }

    if (_addi.shop) {
      pms.mall_id = _addi.shop.id
    }

    if (_upms.yyyappid || _upms.yyyappId || _upms.yappid || _addi.yyyappid || _addi.yyyappId || _addi.yappid) {
      pms.yyyappid = _upms.yyyappid || _upms.yyyappId || _upms.yappid || _addi.yyyappid || _addi.yyyappId || _addi.yappid;
      pms.yyyappId = pms.yyyappid;
      pms.fromgzh = 1;
    }

    if (_upms.sig || _addi.sig) {
      pms.sig = _upms.sig || _addi.sig;
    }

    if (_upms.sigExpire || _addi.sigExpire) {
      pms.sigExpire = _upms.sigExpire || _addi.sigExpire;
    }

    if (_upms.yaotv_openid || _addi.yaotv_openid) {
      pms.yaotv_openid = _upms.yaotv_openid || _addi.yaotv_openid;
    }

    // 统计使用
    if (_upms.referid) {
      pms.referid = _upms.referid
    }
    // 运营要求加的参数，统计使用
    if (_upms.source_entry) {
      pms.source_entry = _upms.source_entry
    }

    // 频道ID
    if (_upms.channelid || _upms.channelId) {
      pms.channelid = _upms.channelid || _upms.channelId;
    }

    // 第三方token
    if (_upms.token) {
      pms.token = _upms.token;
    }

    pms.openid = _upms.openid || _addi.openid || localOpenid
    pms.sig = localStorage.getItem('ttvmsig') || 'sig'

    // 统计使用，上一页面id
    var lid = localStorage.getItem('lastpageid') || '0000'
    // 统计使用，当前页面资源位id
    var lrid = localStorage.getItem('lastresid') || '0000'
    // 统计使用，当前页面id
    var id = newMallTools.getUrlParams('id') || newMallTools.getUrlParams('qr_id') || '0000'
    // 统计使用，当前页面组id
    var cid = localStorage.getItem('lastgid') || '0000'
    // 统计使用，当前页面trace_id
    var tid = newMallTools.getUrlParams('trace_id') || '0000'
    // 统计使用，入口页面的trace_id
    var stid = localStorage.getItem('starttraceid') || '0000'

    // 如果是搜索出来的商品，资源位id为搜索
    if (instc && instc.pro_type) {
      lrid = 'sousuo'
    }

    var mallTj = {
      'lid': lid,
      'lrid': lrid,
      'id': id,
      'cid': cid,
      'tid': tid,
      'stid': stid,
      'yyyappid': pms.yyyappId || '46497107fa23', // 第三方平台带入的参数
      'channelid': _upms.channelid || _upms.channelId || '0000', // 第三方平台带入的参数
      'token': _upms.token || _upms.token || '0000' // 第三方平台带入的参数
    }

    // 让当前页面id变为上一页页面id
    localStorage.setItem('lastpageid', id || '0000')

    if (!_upms.mall_tj) {
      mallTj.stid = tid
      mallTj.lid = '0000'
      localStorage.setItem('starttraceid', tid)
    }

    pms.mall_tj = JSON.stringify(mallTj)

    pms.mall_tj = encodeURIComponent(pms.mall_tj)
    // 给cps-guide.html使用，如果全面去中间页，此url参数可删除
    pms.addi = JSON.stringify({
      openid: pms.openid,
      main_openid: pms.openid,
      mall_url: 'javascript:;',
      yyyappId: pms.yyyappId,
      yyyappid: pms.yyyappId,
      entry_wxtoken: window._wx_token,
      lid: lid,
      lrid: lrid,
      id: id,
      cid: cid,
      tid: tid,
      stid: stid,
      last_page_name: document.title,
      qrid: newMallTools.getUrlParams('qr_id') || '',
      leaderuserid: newMallTools.getUrlParams('leader_user_id') || '',
    })

    pms.addi = encodeURIComponent(pms.addi)

    // 特殊页面，不要带参数，否则出错
    if (uri && uri.indexOf('store-new-member-system') >= 0) {
      pms = {}
    } else if (uri && uri.indexOf('m.jd.com/') >= 0) {
      pms = {}
    } else if (uri && uri.indexOf('fanxian?page=intro') >= 0) {
      pms = {}
    } else if (uri && uri.indexOf('fanxian?page=fxguide') >= 0) {
      pms = {}
    } else if (uri && uri.indexOf('p.yiqifa.com/') >= 0) {
      pms = {}
    } else if (uri && uri.indexOf('p.gouwuke.com/') >= 0) {
      pms = {}
    } else if (uri && uri.indexOf('p.gouwubang.com/') >= 0) {
      pms = {}
    } else if (uri && uri.indexOf('p.egou.com/') >= 0) {
      pms = {}
    } else if (uri && uri.indexOf('click.taobao.com') >= 0) {
      pms = {}
    } else if (uri && uri.indexOf('special/cps-guide.html') >= 0) {
      // 微信端中间页，get参数过多，会直接跳到京东商城首页。
      pms = {}
    } else if (uri && uri.indexOf('01home.com/') >= 0) {
      pms = {}
    }

    for (var i in pms) {
      if (i === 'id') {
        continue
      }
      if (i === 'isbase') {
        isBase = true
      }
      params.push(i + '=' + pms[i])
    }

    paramsStr += params.join('&')
    /* --- --- */

    // 优惠券商品，跳转至领取优惠券页面
    if (instc && instc.ba_coupon) {
      var href = window.location.href
      // uri = instc.ba_coupon.activity_url;

      isExternalLink = true
      if (href.indexOf('qa.yaomall') >= 0 || href.indexOf('192.168') >= 0) {
        var couponBgUrl = 'http://qa.yaomall.tvm.cn/shadmin/Uploads/new_mall/imgs/coupon_banner_bg.png'
      } else {
        var couponBgUrl = 'http://assets.yaomall.tvm.cn/Uploads/new_mall/imgs/coupon_banner_bg.png'
      }
    }

    // 如果是淘宝商品或者优惠券商品
    if (uri && uri.indexOf('redirectTmall?') < 0 && !isExternalLink) {
      uri += paramsStr
    }

    // console.log('redirect_end_uri:', uri);

    // 下单页面的名称
    var last_page_name = ''
    var pathName = window.location.pathname ? window.location.pathname.split('/') : [];
    var pathNameLen = pathName.length;
    var pathNameLast = pathName.length ? pathName[pathNameLen - 1] : '';

    last_page_name = last_page_name || localStorage.getItem('lastpagename') || document.title || pathNameLast
    last_page_name = $.trim(last_page_name)

    if (last_page_name.length === 0) {
      last_page_name = _upms.id
    }

    // 新用户专享商品逻辑判断
    if (acts && acts.cps_activity && acts.cps_activity.length) {
      var isNewPersion = acts.is_new || false
      var activityInfo = acts.cps_activity[0]
      var activityType = activityInfo.type

      if (acts.cps_new_data) {
        var activityData = acts.cps_new_data
      }

      if (activityType === 'new_person' && isNewPersion && activityData) {
        var backCash = activityData.back_cash
      }
    }

    if (!acts) {
      var type = 'dsbfanli'
    } else {
      var cpsActivity = acts.cps_activity
      var cpsExtCfg = acts.ext_cfg
      var BActTypeArr = acts.Business_Activity_types; //商业活动，数组-1：淘宝卡券 2：京东卡券
      var BActType = '';

      if (cpsExtCfg && cpsExtCfg.length > 0) {
        var type = 'more_return'
        last_page_name = '多买多返'
      } else if (cpsActivity && cpsActivity.length > 0) {
        var type = cpsActivity[0].type
        var tag_id = cpsActivity[0].tag_id
      }

      if (BActTypeArr) {
        BActType = BActTypeArr;
      }
    }

    // 周末特卖会标识
    if (_upms.qr_id) {
      var type = "weekend_sale"
      last_page_name = '周末特卖会'
    }

    if (instc) {
      // self_tj.js，product_click事件商品统计
      proType = Number(instc.pro_type)

      this.selfTjProduct({
        openid: localOpenid || _addi.openid,
        productId: '' + (instc.product_id || instc.sku_id || '0000'),
        sku_id: '' + (instc.sku_id || _addi.uid || '0000'),
        do: proType === 3 ? 'search' : 'buy',
        cpsType: instc.cps_type || instc.from || '未知',
        actType: type || ''
      })
    }

    // 购买数量，给壳上的banner传值使用，默认1-5件。如果活动信息中有购买件数，以活动信息为准
    var buyQuantity = 5
    if (acts && acts.cps_new_data) {
      if (acts.cps_new_data.quantity) {
        var buyQuantity = acts.cps_new_data.quantity
      }
    }

    buyQuantity = Number(buyQuantity);

    if (buyQuantity === 1) {
      buyQuantity = 1
    } else {
      buyQuantity = 1 + '-' + buyQuantity
    }

    /// app判断
    if (_platform.app || _upms.debug_platform === 'app') {
      // 如果是淘宝商品显示跳转前提示信息
      $('.tb-jump-before-quan,.tb-jump-before').hide();
      if (!isJump && instc && instc.cps_type && (instc.cps_type == '淘宝' || instc.cps_type == '天猫')) {

        if (isExternalLink) {
          $('.tb-jump-before-quan').show();
          tbBeforeImgLoad('quan', uriBat, instc, acts);
        } else {
          $('.tb-jump-before').show();
          tbBeforeImgLoad('', uriBat, instc, acts);
        }

        return false;
      } else if (!isJump && (uri.indexOf('taobao.com') >= 0 || uri.indexOf('tmall.com') >= 0)) {
        $('.tb-jump-before-quan').show();
        tbBeforeImgLoad('quan', uriBat, instc, acts);

        return false;
      }

      // 周末特卖会标识
      if (_upms.cpslink) {
        if (instc) {
          // 如果是天猫淘宝商品直接在当前页面打开
          // 如果是京东商品，在新的webview中打开
          if (instc.cps_type === '天猫') {
            jumpUrl = getProductJumpUri();
            if (jumpUrl) {
              window.location.replace(jumpUrl)
            }
          } else {
            jumpOpenUrl(uri)
          }
        }

        return false
      }

      // 3.0版本以上，非天猫商品，调用open_mall_url协议
      if (/[3-9]+.[0-9]+.[0-9]+/.test(this.appVersion)) {
        if (instc && instc.cps_type && instc.cps_type != '返现亿起发') {
          // 如果是优惠券，使用优惠券地址
          if (isExternalLink && instc && instc.cps_type && instc.cps_type === '天猫') {
            uri = instc.ba_coupon.activity_url;
          } else {
            uri = getProductJumpUri()
          }

          if (!uri) {
            return false
          }

          /* --- app协议参数 --- */
          var activityBackCash = parseFloat(backCash).toFixed(2)
          var productBackCash = parseFloat(instc.back_cash).toFixed(2)

          if (!isNaN(activityBackCash) || activityBackCash === 0) {
            var rebate = activityBackCash
          } else if (!isNaN(productBackCash) || productBackCash === 0) {
            var rebate = productBackCash
          } else {
            var rebate = ''
          }

          var unit = instc.unit_price || instc.zk_final_price
          var percent = parseFloat((rebate / unit) * 100)
          var shop = instc.cps_type
          var shopType = parseInt(instc.shop_type)
          var purl = instc.product_image
          var pname = instc.product_name
          var shareIcon = false //'https://gss0.bdstatic.com/70cFsj3f_gcX8t7mm9GUKT-xh_/avatar/100/r7s1g2.gif';
          var describe = ''

          percent = parseFloat(percent).toFixed(2)

          if (rebate === '') {
            percent = '本商品最高返现36%'
          } else {
            if (isNaN(percent)) {
              percent = 0
            }
            percent = '本商品返现' + percent + '%'
          }

          if (isNaN(unit) || !unit) {
            unit = 0.000000001
          }

          if (isNaN(rebate) || !rebate) {
            rebate = 1
          }

          if (instc.pro_type == 3) {
            rebate = '';
          }

          if (shop === '京东') {
            var _mall = 'jingdong'
          } else if (shop === '天猫') {
            var _mall = 'tmall'
          } else {
            var _mall = 'elsemall'
          }

          if (shopType && shopType === 2) {
            shop = '淘宝'
          } else if (shopType && shopType === 1) {
            shop = '天猫'
          }

          var openid = localStorage.getItem('ttvmopenid') || localStorage.getItem('openid')
          var tvmid = localStorage.getItem('tvmid');
          var uriParams = newMallTools.getUrl().queryParams

          if (openid.indexOf('orEt2') < 0 && tvmid) {
            openid = tvmid;
          }

          try {
            var paySuccessStatisticsStr = {
              openid: openid,
              openId: openid,
              page_id: id || '0000',
              share_id: tid || '0000',
              uppage_id: localStorage.getItem('lastpageid') || '0000',
              uppage_resource_id: localStorage.getItem('lastresid') || '0000',
              uppage_devide_id: _addi.source_entry || _addi.source || '0000',
              product_id: '' + (instc.multi_size_pid || instc.product_id || _addi.uid || ''),
              sku_id: instc.sku_id || instc.num_iid || '',
              tag_id: tag_id || '',
              type: type || 'dsbfanli',
              last_page_name: last_page_name,
              super_back: tag_id || '',
              curr_url: b64encode(window.location.href),
              user_agent: b64encode(navigator.userAgent),
              from_source: mallTj,
              // "trace_record": b64encode(localStorage.trace_record),
              source_entry: newMallTools.getUrlParams('source_entry') || '',
              is_new: instc.today_new ? 1 : 0,
              mall_name: instc.product_name || ''
            }

            if (BActType) {
              paySuccessStatisticsStr.store_activity = BActType;
            }

            // 如果是特卖会，要增加一些属性
            if (_upms.qr_id) {
              // 
              paySuccessStatisticsStr.family_sale_tvmid = localStorage.getItem('leaderuserid')
              paySuccessStatisticsStr.qr_id = _upms.qr_id
              paySuccessStatisticsStr.last_page_name = '周末特卖会'
            }

            // 卡券商品
            if (isExternalLink) {
              paySuccessStatisticsStr.is_coupon = 1
            }

            newMallTools.sendTaobaoFeedback(paySuccessStatisticsStr);
            paySuccessStatisticsStr = JSON.stringify(paySuccessStatisticsStr)
          } catch (e) {
            console.error('paySuccessStatisticsStr:', e)
          }

          // alert(paySuccessStatisticsStr);

          // alert(uri);

          var pData = {
            'url': uri,
            'banner_type': 1,
            'nav_title': '商品详情-' + shop,
            'headline': percent,
            'subtitle': '该商品每天购买' + buyQuantity + '件享受返现补贴',
            'banner_title_color': '',
            'banner_bg': '',
            'more_img': 'http://qa.yaomall.tvm.cn/shadmin/Uploads/Images/test_wenhao.png',
            'more_url': 'http://qa.yaomall.tvm.cn/shadmin/Uploads/backhelp/backcash_hint.html?unit=' + unit + '&rebate=' + rebate + '&shop=' + _mall,
            'sku_id': instc.sku_id || instc.num_iid || '', //
            'adzone_id': instc.promotion || '67610645', // 146878180 推广位ID
            'pid': 'mm_118948861_19536144_67610645',
            'appkey_ios': '23557066', // ios key
            'appkey_android': '23557066', // 24682211 
            'pay_success_statistics': paySuccessStatisticsStr || ''
          }

          // && instc.ba_coupon.marketing != '外部优惠券'
          if (isExternalLink) {
            pData.banner_type = 2
            if (instc.ba_coupon.combine_url) {
              pData.banner_type = 3
            }
            pData.banner_bg = couponBgUrl
            pData.headline = '该商品可领券 领券后更划算哟！';
            if (instc.cps_type == '京东') {
              if (this.platform.server == 'qa') {
                var jdCouponUrl = 'http://qa.yaomall.tvm.cn/wpadmin/Uploads/coupon_list/index.html?product_id=' + instc.product_id;
              } else {
                var jdCouponUrl = 'http://assets.yaomall.tvm.cn/Uploads/coupon_list/index.html?product_id=' + instc.product_id;
              }
              pData.coupon_url = jdCouponUrl
            } else {
              pData.coupon_url = instc.ba_coupon.activity_url
            }
            pData.coupon_page_title = instc.ba_coupon.activity_name
          }

          if (instc.marketing || (instc.ba_coupon && instc.ba_coupon.marketing)) {
            if (instc.marketing) {
              var marketing = instc.marketing || '';
            }
            if (instc.ba_coupon && instc.ba_coupon.marketing) {
              var marketing = instc.ba_coupon.marketing || '';
            }
            var isQueQiao = marketing.indexOf('鹊桥计划') >= 0 ? true : marketing.indexOf('外部优惠券') >= 0 ? true : false;
            if (isQueQiao) {
              pData.sku_id = '';
              pData.adzone_id = '';
              pData.pid = '';
              pData.appkey_ios = '';
              pData.appkey_android = '';
            }
          }

          if (shareIcon) {
            pData.share_button_show = 1
            pData.share_to = 4
            pData.share_type = 1
            pData.share_icon = shareIcon
            if (this.platform.server == 'qa') {
              pData.share_url = 'https://qa.yaomall.tvm.cn/shadmin/Uploads/mall_proxy/proxy.html'
            } else {
              pData.share_url = 'https://assets.yaomall.tvm.cn/Uploads/mall_proxy/proxy.html'
            }
            pData.share_image = purl
            pData.share_title = pname || ''
            pData.share_description = describe || ''
          }

          console.log('pData:', pData)

          /* --- app协议参数 END --- */
        }
        // 如果非淘宝商品
        if (instc && instc.cps_type && instc.cps_type !== '天猫' && instc.cps_type !== '返现亿起发' && pData) {
          try {
            WebViewJavascriptBridge.callHandler('callNativeToDo', {
              action: 'open_mall_url', // 协议名称
              data: pData, // 需要传输的参数
              callback: 1
            }, function (rspdt) {
              // console.log('open_tmall_url not tmall callback :', rspdt);

              $('.pacman-wrapper').hide()
            })
          } catch (e) {
            console.error('open_mall_url:', e)
          }

          return false
        }
      }

      // 非V3版本APP
      // 淘宝商品
      // console.log('redirect_instc:', JSON.stringify(instc));

      // 如果是淘宝商品
      if (instc && instc.cps_type && instc.cps_type === '天猫') {
        if (!pData) {
          var pData = {
            'url': getProductJumpUri(),
            'banner_type': 1,
            'nav_title': '商品详情-商城',
            'headline': '本商品最高返现36%',
            'subtitle': '该商品每天购买1-5件享受返现补贴',
            'banner_title_color': '',
            'banner_bg': '',
            'more_img': 'http://qa.yaomall.tvm.cn/shadmin/Uploads/Images/test_wenhao.png',
            'more_url': '',
            'pay_success_statistics': paySuccessStatisticsStr || ''
          }
        }

        // console.log('redirect_open_tb_tmall_url start');
        try {
          WebViewJavascriptBridge.callHandler('callNativeToDo', {
            action: 'open_tb_tmall_url', // 协议名称
            data: pData, // 需要传输的参数
            callback: 1
          }, function (rspdt) {
            // console.log('open_tb_tmall_url callback :', rspdt);

            $('.pacman-wrapper').hide()
          })
        } catch (e) {
          console.error('open_tb_mall_url:', e)
        }

        return false
      }

      jumpOpenUrl(uri)

      $('.pacman-wrapper').hide()
    } else {
      // 天猫商品，直接跳转
      if (uri && uri.indexOf('redirectTmall?') >= 0) {
        tmallJump()
      } else {
        if (!instc) {
          instc = {};
        }

        // console.log('redirect_location_href start');

        // nodejs页面
        if (uri && uri.indexOf('fanxian?page=intro') >= 0) {
          uri = getProductJumpUri()
        }

        // nodejs页面
        if (uri && uri.indexOf('fanxian?page=fxguide') >= 0) {
          uri = getProductJumpUri()
        } else if (uri && uri.indexOf('m.jd.com/') >= 0) {
          uri = getProductJumpUri()
        } else if (uri.indexOf('p.yiqifa.com/') >= 0) {
          uri = getProductJumpUri()
        } else if (uri.indexOf('p.gouwuke.com/') >= 0) {
          uri = getProductJumpUri()
        } else if (uri.indexOf('p.gouwubang.com/') >= 0) {
          uri = getProductJumpUri()
        } else if (uri.indexOf('p.egou.com/') >= 0) {
          uri = getProductJumpUri()
        } else if (uri.indexOf('01home.com/') >= 0) {
          uri = getProductJumpUri()
        }

        //debugger;
        // 优惠券商品，先跳到领券页面。
        if (instc && isExternalLink && instc.cps_type === '天猫') {
          uri = instc.ba_coupon.activity_url
        }

        // 周末特卖会
        if (_upms.cpslink) {
          uri = getProductJumpUri()
          if (uri) {
            window.location.href = uri
          }

          return false
        }

        if (uri) {
          window.location.href = uri
          //window.location.replace(uri);
        }
      }

      $('.pacman-wrapper').hide()
    }

    // 包函数，面向app使用，默认使用open_url协议
    function jumpOpenUrl(uri) {
      // 其它链接，调用open_url协议
      if (uri.indexOf('http://') >= 0 || uri.indexOf('https://') >= 0) {
        var jump = uri
      } else {
        var xy = window.location.protocol

        var jump = xy + uri
      }

      if (!instc) {
        instc = {};
      }

      // console.log('redirect_open_url start');

      if (_upms.cpslink) {
        var jump = getProductJumpUri()
      }

      // nodejs页面
      if (uri && uri.indexOf('fanxian?page=intro') >= 0) {
        jump = getProductJumpUri()
      } else if (uri && uri.indexOf('fanxian?page=fxguide') >= 0) {
        jump = getProductJumpUri()
      } else if (uri && uri.indexOf('m.jd.com/') >= 0) {
        jump = getProductJumpUri()
      } else if (uri && uri.indexOf('p.yiqifa.com/') >= 0) {
        jump = getProductJumpUri()
      } else if (uri && uri.indexOf('p.gouwuke.com/') >= 0) {
        jump = getProductJumpUri()
      } else if (uri && uri.indexOf('p.gouwubang.com/') >= 0) {
        jump = getProductJumpUri()
      } else if (uri && uri.indexOf('p.egou.com/') >= 0) {
        jump = getProductJumpUri()
      } else if (uri && uri.indexOf('01home.com/') >= 0) {
        jump = getProductJumpUri();
      }

      // alert(uri);

      if (uri.indexOf('taobao.com/') >= 0) {
        WebViewJavascriptBridge.callHandler("callNativeToDo", {
          action: "open_tb_tmall_url",
          data: {
            url: jump
          },
          callback: 1
        }, function (req) {
          // console.log('open_url is callback');
        });
      } else {
        WebViewJavascriptBridge.callHandler("callNativeToDo", {
          action: "open_url",
          data: {
            url: jump
          },
          callback: 1
        }, function (req) {
          // console.log('open_url is callback');
        })
      }
    }

    // 包内函数，淘宝商品未使用getCpsLink跳转
    function tmallJump() {
      var uri = getProductJumpUri()

      if (!uri) {
        return false
      }

      // console.log('redirect_tmallJump_location_href start');

      window.location.href = uri

      $('.pacman-wrapper').hide()

      return false
    }

    // getCpsLink，转链
    function getProductJumpUri() {
      if (uri && uri.indexOf('fanxian?page=intro') >= 0) {
        localStorage.setItem('lastpagename', '单单返')
        instc = {}
        localStorage.removeItem('qrid')
        localStorage.removeItem('leaderuserid')
      }

      if (uri && uri.indexOf('m.jd.com/') >= 0) {
        localStorage.setItem('lastpagename', '单单返')
        instc = {}
        localStorage.removeItem('qrid')
        localStorage.removeItem('leaderuserid')
      }

      var openid = localStorage.getItem('ttvmopenid') || localStorage.getItem('openid')
      var tvmid = localStorage.getItem('tvmid');
      var uriParams = newMallTools.getUrl().queryParams

      if (openid.indexOf('orEt2') < 0 && tvmid) {
        openid = tvmid;
      }

      if (proType !== 3 && instc && instc.cps_type === '天猫') {
        proType = 1
      }

      // instc.ba_coupon.type：1、淘宝卡券；2、京东卡券
      if (proType !== 3 && instc && instc.ba_coupon && instc.ba_coupon.type) {
        proType = 2
      }

      var uriLastStr = uri.substr(uri.length - 1, 1);

      if (uriLastStr == '?' || uriLastStr == '&') {
        uri = uri.substr(0, uri.length - 1);
      }

      // proType = 3;

      // console.log('instc:', instc)      

      // ext就是传说中的feedback，京东使用
      var getCpsLinkParam = {
        'uid': instc.cps_unique_id || _addi.uid || _addi.productId || '',
        'logo': instc.product_image || '',
        'type': '' + (proType || 0) || '0', // 1、淘宝普通商品；2、淘宝优惠券；3、搜索商品
        'tj_sk': instc.tj_sk || '',
        'openid': openid,
        'openId': openid,
        'yyyappId': pms.yyyappid || pms.yappid || '46497107fa23',
        'product_id': '' + (instc.multi_size_pid || instc.product_id || instc.cps_unique_id || _addi.uid),
        'sku_id': instc.sku_id || instc.num_iid || '',
        'coupon_sku_id': instc.sku_id || instc.num_iid || '',
        'cps_type': instc.cps_type === '天猫' ? '淘宝' : instc.cps_type,
        'source': '1',
        'back_cash': parseInt(backCash || instc.back_cash * 100) || 0,
        'cus_url': uri,
        'mall_name': instc.product_name || '',
        'ext': {
          'cmdt_id': instc.product_id,
          'platform': newMallTools.getPlatform().current,
          'is_new': instc.today_new ? 1 : 0,
          'last_page_name': last_page_name,
          'type': type || 'dsbfanli',
          'tag_id': tag_id || '',
          'ttdsb_product_id': instc.product_id || '',
          'from_source': mallTj,
          // "trace_record": b64encode(localStorage.trace_record),
          'source_entry': newMallTools.getUrlParams('source_entry') || '',
          'super_back': tag_id || '',
          'curr_url': b64encode(window.location.href),
          'user_agent': b64encode(navigator.userAgent)
        }
      }

      //alert(JSON.stringify(getCpsLinkParam));

      // 微信端中间页，get参数过多，会直接跳到京东商城首页。
      if (window.location.href.indexOf('html/staticfile/pages/special/cps-guide.html') >= 0) {
        delete getCpsLinkParam.ext.curr_url;
        delete getCpsLinkParam.ext.user_agent;
        delete getCpsLinkParam.ext.last_page_name;
      }

      console.log(JSON.stringify(getCpsLinkParam));

      // 子商品ID
      if (acts && acts.multi_size_sid) {
        getCpsLinkParam.child_sku_id = acts.multi_size_sid;
      }

      // 商业活动，详见变量注释
      if (BActType) {
        getCpsLinkParam.store_activity = BActType;
      }

      // 周末特卖会
      if (_upms.qr_id) {
        var ext = getCpsLinkParam.ext
        ext.family_sale_tvmid = localStorage.getItem('leaderuserid')
        ext.qr_id = _upms.qr_id
        ext.last_page_name = '周末特卖会'
      }

      // 卡券商品
      if (isExternalLink) {
        var ext = getCpsLinkParam.ext
        ext.is_coupon = 1
      }

      //console.log('getCpsLinkParam:', getCpsLinkParam)

      if (proType === 3) {
        delete getCpsLinkParam.uid
      }

      // 单单返
      if (uri && uri.indexOf('fanxian?page=intro') >= 0) {
        delete getCpsLinkParam.uid
        delete getCpsLinkParam.product_id
        delete getCpsLinkParam.sku_id
        delete getCpsLinkParam.cus_url;
        getCpsLinkParam.cps_type = '京东'
      }

      if (uri) {
        if (uri.indexOf('m.jd.com/') >= 0) {
          delete getCpsLinkParam.uid
          delete getCpsLinkParam.product_id
          delete getCpsLinkParam.sku_id
          getCpsLinkParam.cps_type = '京东'
        } else if (uri.indexOf('p.yiqifa.com/') >= 0) {
          var ext = getCpsLinkParam.ext
          ext.last_page_name = '返现亿起发'
          delete getCpsLinkParam.uid
          delete getCpsLinkParam.sku_id
          getCpsLinkParam.cps_type = '返现亿起发'
        } else if (uri.indexOf('p.gouwuke.com/') >= 0) {
          var ext = getCpsLinkParam.ext
          ext.last_page_name = '返现亿起发'
          delete getCpsLinkParam.uid
          delete getCpsLinkParam.sku_id
          getCpsLinkParam.cps_type = '返现亿起发'
        } else if (uri.indexOf('p.gouwubang.com/') >= 0) {
          var ext = getCpsLinkParam.ext
          ext.last_page_name = '返现亿起发'
          delete getCpsLinkParam.uid
          delete getCpsLinkParam.sku_id
          getCpsLinkParam.cps_type = '返现亿起发'
        } else if (uri.indexOf('p.egou.com/') >= 0) {
          var ext = getCpsLinkParam.ext
          ext.last_page_name = '返现亿起发'
          delete getCpsLinkParam.uid
          delete getCpsLinkParam.sku_id
          getCpsLinkParam.cps_type = '返现亿起发'
        } else if (uri.indexOf('01home.com/') >= 0) {
          delete getCpsLinkParam.uid
          delete getCpsLinkParam.product_id
          delete getCpsLinkParam.sku_id
          getCpsLinkParam.cps_type = '首家'
        }
      }

      if (instc && instc.cps_type && instc.cps_type != '返现亿起发') {
        delete getCpsLinkParam.cus_url;
      }

      // console.log('ajax_GetCpsLink:', newMallTools.getApiUrl('GetCpsLink'));
      // console.log('ajax_getCpsLinkParam:', JSON.stringify(getCpsLinkParam));
      // console.log('redirect_from:', instc.from);

      var href = window.location.href

      if (href.indexOf('qa.yaomall.tvm.cn') >= 0 || href.indexOf('192.168') >= 0) {
        // 后来修改为，QA线feedback中yyyappid增加qa-
        getCpsLinkParam.yyyappId = 'qa-' + getCpsLinkParam.yyyappId
      }

      // 如果是京东的优惠券，且有二合一跳转地址，删除sku_id，增加coupon_sku_id，增加cus_url
      if (instc && instc.cps_type == '京东' && instc.ba_coupon && instc.ba_coupon.combine_url) {
        getCpsLinkParam.coupon_sku_id = getCpsLinkParam.sku_id;
        getCpsLinkParam.cus_url = instc.ba_coupon.combine_url || uri;
        delete getCpsLinkParam.sku_id;
      }

      getCpsLinkParam.ext = JSON.stringify(getCpsLinkParam.ext);

      //alert(JSON.stringify(getCpsLinkParam));

      // 非自营订单
      if (instc.from !== 'self') {
        var req = newMallTools.baseAjax({
          type: 'post',
          url: newMallTools.getApiUrl('GetCpsLink'),
          data: JSON.stringify(getCpsLinkParam),
          async: false,
          cb: function (req) {}
        })
        // console.log(getCpsLinkParam);
        // debugger;
        if (req && req.status === 1) {
          // uri = req.url;
          if (!req.url) {
            return false
          } else {
            return req.url
          }
        } else {
          alert(req.msg)
          // console.log('ajax_getCpsLink:', req);
        }

        if (req.msg) {
          return false
        }
      } else {
        // 自营订单直接跳转
        jumpOpenUrl(uri)
      }
      /* --- 获取商品跳转地址 END --- */
    }

    return false
  };

  // 个人中心
  function mineUri() {
    var def = ['deal', window._wx_token, 0, 'store-new-member-system']

    var path = this.UriYaomalHtml + '?q=' + def.join('/')

    this.redirect(path)
    // window.location.href = path;
  };

  function resetAuth() {
    localStorage.removeItem('lauthtime')

    window.location.reload()
  };

  function noProductBodyImg() {
    $('body').css({
      background: '#f0f0f0 url(imgs/no-have.png) no-repeat center center / 35% auto'
    })
  };

  function getProductInfo(productId) {
    if (!productId) {
      alert('获取商品信息条件不足，无法获取商品信息。')
    }
    var params = {
      product_id: productId
    }

    var req = this.baseAjax({
      type: 'get',
      url: this.getApiUrl('GetProductInfo'),
      data: params,
      async: false,
      cb: function (req) {}
    })

    return req
  }

  function getProductInfoAll(productId, uid) {
    if (!productId || !uid) {
      alert('获取商品信息条件不足，无法获取商品信息。')
    }
    var params = {
      product_id: productId,
      cps_product_id: uid
    }

    var req = this.baseAjax({
      type: 'post',
      url: this.getApiUrl('GetProductInfoAll'),
      data: JSON.stringify(params),
      async: false,
      cb: function (req) {}
    })

    return req
  }

  function getProductList(obj, cb) {
    let that = this
    let uri = '';
    let gid = '';

    if (obj && obj.interface_url) {
      uri = obj.interface_url;
    }
    if (obj && obj.gid) {
      gid = obj.gid;
    }

    if (uri && gid) {
      newMallTools.baseAjax({
        type: 'post',
        url: uri,
        data: JSON.stringify({
          from: this.platform.current == 'wechat' ? 'wxh' : this.platform.current,
          tag_id: gid,
          offset: 0,
          limit: 999
        }),
        cb: function (req) {
          if (typeof (req) === 'string') {
            req = JSON.parse(req)
          }

          if (req && req.data && cb) {
            cb(req.data);
          }
        }
      });
    }
  }

  function formatPrice(price) {
    price = Number(price);

    if (isNaN(price) || price == '') {
      return parseFloat(0).toFixed(2);
    }

    return parseFloat(price).toFixed(2);
  }

  /**
   * @description 获取trace记录 记录到本地存储
   * @returns localStorage.trace 上一次的trace_id  localStorage.trace_record trace_id和时间的集合
   */
  function getTraceRecord() {
    let that = this // 继承Vue对象
    const now = new Date() // 获取当前时间以统一时间
    // 不含mall_tj清除本地存储过的记录并重新记录
    if (window.location.href.indexOf('mall_tj') < 0) {
      localStorage.removeItem('trace')
      localStorage.removeItem('trace_record')
    }
    // 记录时间
    if (that.getUrlParams('trace_id') !== localStorage.trace) {
      if (localStorage.trace_record) { // 已有记录
        let record = JSON.parse(localStorage.trace_record).concat({
          id: that.getUrlParams('trace_id') || that.getUrlParams('qr_id'),
          t: Math.round(now.getTime() / 1000)
        })
        localStorage.trace_record = JSON.stringify(record)
      } else { // 未有记录
        let record = [{
          id: that.getUrlParams('trace_id'),
          t: Math.round(now.getTime() / 1000)
        }]
        localStorage.trace_record = JSON.stringify(record)
      }
    }
    localStorage.trace = that.getUrlParams('trace_id')
  }

  function base64(string) {
    return Buffer.from(string, 'binary').toString('base64')
  }
  /**
   * 
   * @param {*} pData 
   * 'url': getProductJumpUri(),
      'banner_type': 1,
      'nav_title': '商品详情-商城',
      'headline': '本商品最高返现36%',
      'subtitle': '该商品每天购买1-5件享受返现补贴',
      'banner_title_color': '',
      'banner_bg': '',
      'more_img': 'http://qa.yaomall.tvm.cn/shadmin/Uploads/Images/test_wenhao.png',
      'more_url': '',
      'pay_success_statistics': paySuccessStatisticsStr || ''
   */
  function jumpOpenTbTmallUrl(pData) {
    try {
      WebViewJavascriptBridge.callHandler('callNativeToDo', {
        action: 'open_tb_tmall_url', // 协议名称
        data: pData, // 需要传输的参数
        callback: 1
      }, function (rspdt) {
        // console.log('open_tb_tmall_url callback :', rspdt);

        $('.pacman-wrapper').hide()
      })
    } catch (e) {
      console.error('open_tb_mall_url:', e)
    }
  }
  /**
   * 
   * @param {*} pData {url:url}
   */
  function jumpOpenUrlSim(pData) {
    WebViewJavascriptBridge.callHandler("callNativeToDo", {
      action: "open_url",
      data: pData,
      callback: 1
    }, function (req) {
      // console.log('open_url is callback');
    })
  }
  /**
   * 
   * @param {*} instc 商品信息
   */
  function getProductCpsType(instc) {
    if (!instc) {
      return '';
    }

    if (!instc.cps_type) {
      return '';
    }

    var type = instc.cps_type;
    var shopType = instc.shop_type;

    if (shopType) {
      shopType = parseInt(shopType);
    }

    if (shopType == 1) {
      return 'tmall';
    } else if (shopType == 2) {
      return 'taobao';
    } else {
      switch (type) {
        case '天猫':
          return 'tmall';
        case '淘宝':
          return 'taobao';
        case '京东':
          return 'jd';
        case '一号店':
          return 'yhd';
        case '首家':
          return 'sj';
        default:
          return ''
      }
    }
  }

  window.newMallTools = new Tvmtools()
})()