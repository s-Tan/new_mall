var mallTj = {
  'lid': "上一次访问的页面id || '0000'",
  'lrid': "上一次访问的资源位id || '0000'",
  'id': "当前访问的页面id || '0000'",
  'cid': "当前访问的分组id || '0000'",
  'tid': "当前页面的trace_id || '0000'",
  'stid': "入口页面的trace_id || '0000'",
  'yyyappid': "地址参数yyyappid || '46497107fa23'", // 第三方平台带入的参数
  'channelid': "地址参数中的chanelid  || '0000'", // 第三方平台带入的参数
  'token': "地址参数中的token || '0000'" // 第三方平台带入的参数
}

// 接口参数
var getCpsLinkParams = {
  "openid": "用户openid",
  "openId": "用户openid",
  "yyyappId": "46497107fa23",
  "cps_type": "商品类型，天猫，京东，一号店，等",
  "source": "1",
  "cus_url": "跳转的链接地址",
  "ext": JSON.stringify({
    "platform": "平台来源：微信，APP",
    "last_page_name": "当前页面名称",
    "type": "dsbfanli",
    "tag_id": "",
    "ttdsb_product_id": "",
    "from_source": mallTj,
    "source_entry": "地址参数中的source_entry || ''",
    "super_back": "",
    "curr_url": b64encode(window.location.href),// base64编码的当前页面的地址，为查找问题提供方便
    "user_agent": b64encode(navigator.userAgent) // base64浏览器属性字符串，为查找问题提供方便
  })
}

/**
 * 接口地址
 * 测试线：//qa.yaomall.tvm.cn/services/GetCpsLink
 * 正式线：//huge.yaomall.tvm.cn/services/GetCpsLink
 */
