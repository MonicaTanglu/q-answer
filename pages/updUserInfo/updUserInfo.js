// pages/updUserInfo/updUserInfo.js
const util = require('../../utils/util.js')
const api = require('../../api/apis.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      id: 1,
      name: '',
      department: ''
    },
    popShow: true,
    departIndex: 0,
    departmentList: ['大队机关', '测绘院', '规划院', '遥感航测院', '地信中心', '中煤勘测规划院', '中煤测绘院']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = app.globalData.userInfo 
    if(userInfo) {
      this.setData({
        userInfo
      })
    }
  },
  closePop() {
    this.setData({
      popShow: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  setPopVisible() {
    this.setData({
      popShow: true
    })
  },
  pickConfirm(e) {
    this.data.departIndex = e.detail.value
    this.setData({
      'userInfo.department': this.data.departmentList[e.detail.value]
    })
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
  inputChange(e) {
    this.setData({
      'userInfo.name': e.detail
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  goTo() {
    if (!util.trim(this.data.userInfo.name)) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return false
    } else if (!this.data.userInfo.department) {
      wx.showToast({
        title: '请选择部门',
        icon: 'none'
      })
      return false
    }
    wx.login({
      success: async (res) => {
        if (res.code) {
          let params = {
            bm: this.data.userInfo.department,
            name: this.data.userInfo.name,
            code: res.code
          }
          let subRes = await api.updateUserInfo(params)
          if (subRes) {
            
            this.data.userInfo.id = subRes.id
            wx.setStorageSync('userInfo', this.data.userInfo)
            app.globalData.userInfo = this.data.userInfo
            wx.navigateBack({
              delta: 0,
            })
          }

        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'error'
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '提交失败',
          icon: 'error'
        })
      }
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})