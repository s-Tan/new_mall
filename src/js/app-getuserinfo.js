function setupWebViewJavascriptBridge (callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge)
  }

  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }

  window.WVJBCallbacks = [callback]

  let WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

function CallBridgeHander (pms, callback) {
  let succ = 0
  InternalCall()

  function InternalCall () {
    try {
      WebViewJavascriptBridge.callHandler('callNativeToDo', pms, function (rspdt) {
        succ = 1
        callback(rspdt)
      })
    } catch (ex) {
      setTimeout(function () {
        if (succ) {
          return
        }

        InternalCall()
      }, 50)
    }
  }
}

function CallBridgeHanderGetUserInfo (callback) {
  CallBridgeHander({
    'action': 'get_userinfo',
    'data': {},
    'callback': 1
  }, callback)
}

window.setupWebViewJavascriptBridge = setupWebViewJavascriptBridge
window.CallBridgeHander = CallBridgeHander
window.CallBridgeHanderGetUserInfo = CallBridgeHanderGetUserInfo
