module.exports = {
  'env': {
    'es6': true,
    'node': true
  },
  'plugins':[
    'html' //插件，此插件用于识别文件中的js代码，没有MIME类型标识没有script标签也可以识别到，因此拿来识别.vue文件中的js代码
  ],
  'parserOptions': {
    // ECMAScript 版本
    'ecmaVersion': 6,
    'sourceType': 'module',//module
    // 想使用的额外的语言特性:
    'ecmaFeatures': {
      // 允许在全局作用域下使用 return 语句
      'globalReturn': true,
      // impliedStric
      'impliedStrict': true,
      // 启用 JSX
      'jsx': true
    }
  },
  'extends': 'standard',
  'globals': {
    'localStorage': true,
    'alert':true,
    '$': true,
    'newMallTools':true,
    'newMallAuthorize':true,
    'setupWebViewJavascriptBridge': true,
    'WebViewJavascriptBridge':true,
    'CallBridgeHander':true,
    'createMenu':true,
    '_czc':true
  },
  // 0 off 1 warn 2 error
  'rules':{
    'import/no-duplicates': 0,
    'no-new': 0,
    'no-var': 1,
    'no-unused-vars': 1
  }
}
