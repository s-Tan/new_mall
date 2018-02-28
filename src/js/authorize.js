import 'tvm-zepto' // zepto 模块包
let _platform = {} // 页面所在的平台（app,微信，支付宝）

function NewMallAuthorize() {
  this.api_token = '40fe533606'
  this.wx_token = '46497107fa23' // 天天电视宝授权;摇支付fcc7568c74ec

  window._wx_token = this.wx_token
  window._api_token = this.api_toke

  this.CheckUserAgent(_platform)

  if (_platform.app) {
    setupWebViewJavascriptBridge(function (WebViewJavascriptBridge) {})
  }
}

// 获取URL的参数
NewMallAuthorize.prototype.GetQueryString = function (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let param = decodeURI(window.location.search)
  let r = param.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  unescape()
  return null
}

// 获取所在平台
NewMallAuthorize.prototype.CheckUserAgent = function (platform) {
  let uastr = window.navigator.userAgent
  let cur = null
  if (uastr.match(/APP_iOS/i) || uastr.match(/APP_Android/i)) {
    cur = 'app'
  } else if (uastr.match(/MicroMessenger/i)) {
    cur = 'wechat'
  } else if (uastr.match(/Alipay/i)) {
    cur = 'alipay'
  } else {
    cur = 'app'
  }

  platform.current = cur
  platform[cur] = 1

  if (uastr.match(/Mac OS X/i)) {
    platform.ios = 1
  } else if (uastr.match(/Android/i)) {
    platform.android = 1
  }
}

// 支付宝授权
NewMallAuthorize.prototype.getAuth_alipay = function () {
  this._getUrlParams = function (key) {
    let search = window.location.search
    let searchArr = search.split('?')

    if (search === '') {
      return ''
    }

    if (searchArr[1]) {
      searchArr = searchArr[1].split('&')
    }

    let len = searchArr.length

    if (len > 1) {
      for (let i = 0; i < len; i++) {
        let keyvalue = searchArr[i].split('=')
        if (keyvalue.length > 1 && keyvalue[0] === key) {
          return decodeURIComponent(keyvalue[1])
        }
      }
    }

    return ''
  }

  let apiHostAlipay = 'https://zfb-mb.mtq.tvm.cn/services/QueryAliUserinfo'
  let authUrl = 'https://zfb-mb.mtq.tvm.cn/services/AliOauth?app_id=201612270465515&scope=auth_user&redirect_uri='

  if (window.location.href.indexOf('qa.yaomall.tvm.cn') >= 0) {
    apiHostAlipay = 'https://qa-zfb-mb.mtq.tvm.cn/services/QueryAliUserinfo'
    authUrl = 'http://qa-zfb-mb.mtq.tvm.cn/services/AliOauth?app_id=2017012405396321&scope=auth_user&redirect_uri='
  }
  if (window.location.href.indexOf('192.168.') >= 0) {
    apiHostAlipay = 'https://qa-zfb-mb.mtq.tvm.cn/services/QueryAliUserinfo'
    authUrl = 'https://qa-zfb-mb.mtq.tvm.cn/services/AliOauth?app_id=2017012405396321&scope=auth_user&redirect_uri='
  }

  let tvmId = this._getUrlParams('tvmid')
  let sign = this._getUrlParams('sign')
  let sigExpire = this._getUrlParams('sigExpire')

  if (tvmId === '') {
    let href = window.location.href.replace(/tvmid=&/ig, '')
    href = href.replace(/tvmid=/ig, '')
    href = href.replace('sign=' + sign, '')
    authUrl += href
    window.location.href = authUrl

    return false
  }

  try {
    let resultData = $.ajax({
      type: 'post',
      url: apiHostAlipay + '?tvmid=' + tvmId,
      async: false
    })

    resultData = JSON.parse(resultData.responseText)

    if (resultData.status === 'success') {
      let userInfoJson
      if (typeof (resultData.body) === 'object') {
        userInfoJson = resultData.body
      } else {
        userInfoJson = JSON.parse(resultData.body)
      }

      userInfoJson.tvmId = tvmId
      userInfoJson.sign = sign
      userInfoJson.sigExpire = sigExpire

      return userInfoJson
    } else {
      return {
        'err': '同一tvmid仅可以使用一次查询用户数据'
      }
    }
  } catch (e) {
    return {
      'err': e
    }
  }
}

// 天天电视宝授权
NewMallAuthorize.prototype.ttAuth = function () {
  // 不排除的地址参数
  let paramsGetList = ['id', 'trace_id', 'debug', 'channelid', 'token', 'platform', 'yyyappid', 'debug_platform', 'uid', 'product_id', 'qr_id', 'leader_user_id', 'cpslink', 'n', 'q', 'a', 'b', 'c', 'd']
  let href = window.location.href
  let urlObj = window.location
  let params = urlObj.search
  let currUri = urlObj.origin + urlObj.pathname
  let pms = []

  let paramsArr = params.replace('?', '')
  paramsArr = paramsArr.split('&')
  let len = paramsArr.length

  params = []

  for (let i = 0; i < len; i++) {
    let key = paramsArr[i].split('=')[0]
    let value = paramsArr[i].split('=')[1] || ''

    params[key] = value
  }

  for (let i in params) {
    if (paramsGetList.indexOf(i) >= 0) {
      pms.push(i + '=' + params[i])
    }
  }

  currUri += '?' + pms.join('&')

  if (href.indexOf('192.168') >= 0 || href.indexOf('localhost') >= 0 || href.indexOf('wx_debug=1') >= 0) {
    //this.wx_token = 'fcc7568c74ec'
  }

  let urlQueryArr = [
    'unionid=1',
    'token=' + this.api_token,
    'wx_token=' + this.wx_token,
    'redirect_uri=' + encodeURIComponent(currUri)
  ]

  if (this.GetQueryString('cpslink')) {
    urlQueryArr.push('is_base=1')
  }

  window.location.href = 'http://mb.mtq.tvm.cn/oauth?' + urlQueryArr.join('&')

  return false
}

// 获取用户信息
NewMallAuthorize.prototype.getUserinfo = function (openid, cb) {
  let url = 'http://mb.mtq.tvm.cn/rest/PlatformUserinfo'
  let params = '?token=' + this.api_token + '&wx_token=' + this.wx_token + '&openid=' + openid

  $.ajax({
    type: 'post',
    url: '//huge.yaomall.tvm.cn/services/Proxy',
    data: JSON.stringify({
      url: url + params
    }),
    dataType: 'json',
    success: function (req) {
      if (req && req.data && req.data.length > 0 && req.result === 1) {
        let data = req.data[0]

        cb(data)
      } else {
        alert('授权出错。')
      }
    },
    error: function (req) {
      console.log(req)
    }
  })

  return false
}

NewMallAuthorize.prototype.Authorize = function () {
  this.CheckUserAgent(_platform)

  // openid
  /* var localOpenid = localStorage.getItem('openid') // never used */
  let queryOpenid = this.GetQueryString('openid')
  let localttOpenid = localStorage.getItem('ttvmopenid')
  let querySig = this.GetQueryString('sig')
  let localSig = localStorage.getItem('ttvmsig')
  let queryMtqsign = this.GetQueryString('mtqsign')
  let localMtqsign = localStorage.getItem('ttvmmtqsig')
  let sin = querySig || localSig
  let mtqsig = queryMtqsign || localMtqsign
  let openid = queryOpenid || localttOpenid

  if (_platform.wechat) {
    // 获取用户信息条件：openid不为空
    if (openid && openid.length >= 10 && sin && sin.length > 10 && mtqsig && mtqsig.length > 10) {
      localStorage.setItem('ttvmsig', sin || '')
      localStorage.setItem('ttvmmtqsig', mtqsig || '')
      this.getUserinfo(openid, function (data) {
        localStorage.setItem('openid', data.openid || '')
        localStorage.setItem('ttvmopenid', data.openid || '')
        localStorage.setItem('nickname', data.nickname || '')
        localStorage.setItem('face', data.avatar_url || '')
        localStorage.setItem('unionid', data.unionid || '')
      })
    } else {
      this.ttAuth()
    }
  } else if (_platform.app) {
    try {
      CallBridgeHander({
        action: 'get_userinfo',
        data: {},
        callback: 1
      }, function (rspdt) {
        console.log('auth_app_userinfo:', rspdt)

        // 取壳上信息
        let jdat = JSON.parse(rspdt)

        let openid = jdat.ttopenid || jdat.tvmid || ''
        let nickname = jdat.nickname || ''
        let header = jdat.headimgurl || ''

        localStorage.setItem('openid', openid || '')
        localStorage.setItem('ttvmopenid', openid || '')
        localStorage.setItem('tvmid', jdat.tvmid || '')
        localStorage.setItem('ttopenid', jdat.ttopenid || '')
        localStorage.setItem('ttvmsig', '12345678901234567890')
        localStorage.setItem('ttvmmtqsig', '12345678901234567890')
        localStorage.setItem('nickname', nickname || '')
        localStorage.setItem('face', header || '')
        localStorage.setItem('unionid', jdat.unionid || '')
      })
    } catch (e) {
      alert('获取用户信息失败')
    }
  } else if (_platform.alipay) {
    let obj = this.getAuth_alipay()

    if (obj.tvmid) {
      localStorage.setItem('openid', obj.tvmid)
      localStorage.setItem('face', obj.avatar)
      localStorage.setItem('nickname', obj.nick_name)
      localStorage.setItem('ttvmopenid', obj.tvmid)
      localStorage.setItem('ttvmsig', obj.sign)

      for (let i in obj) {
        localStorage.setItem(i, obj[i])
      }
    }
  }
}

window.newMallAuthorize = new NewMallAuthorize()

window.newMallAuthorize.Authorize()