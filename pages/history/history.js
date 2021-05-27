// pages/history/history.js
const app = getApp()
const api = require('../../api/apis.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'common',
    list: [],
    params: {
      pageNo: 1,
      pageSize: 30,
      user: app.globalData.userInfo ? app.globalData.userInfo.id : ''
    },
    total: 0,
    bottomLineShow: false,
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    this.getList()
  },
  async getList() {
    let list = [],
      res;
    this.data.params.user = app.globalData.userInfo.id
    if (this.data.type === 'common') {
      res = await api.getPracticeList(this.data.params)
    } else {
      res = await api.getExamList(this.data.params)
    }
    list = res.records;
    this.data.total = res.total
    this.setData({
      list: list,
      loading: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.params.pageNo * this.data.params.pageSize >= this.data.total) {
      this.setData({
        bottomLineShow: true
      })
      return
    } else {
      this.setData({
        loading: true
      })
      this.data.params.pageNo++
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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