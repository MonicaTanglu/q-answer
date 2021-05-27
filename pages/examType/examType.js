// pages/examType/examType.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  goTo(e) {
    let userInfo = app.globalData.userInfo
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/updUserInfo/updUserInfo',
      })
    } else {
      let url = e.currentTarget.dataset.url
      wx.navigateTo({
        url: url,
      })
    }
  },
})