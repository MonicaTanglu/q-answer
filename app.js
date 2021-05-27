// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    this.globalData.userInfo = wx.getStorageSync('userInfo')
    this.setEnv()

  },
  setEnv() {
    // 获取小程序当前的环境
    let accountInfo = wx.getAccountInfoSync();
    let env = accountInfo.miniProgram.envVersion;
    wx.setStorageSync('env', env);
  },
  globalData: {
    userInfo: null
  }
})