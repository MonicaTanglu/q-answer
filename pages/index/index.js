const api = require('../../api/apis.js')
const util = require('../../utils/util.js')
// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    exams: []
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  onShow: function () {
    this.getExams()
    this.setBarSelected()
  },
  async getExams() {
    let today = new Date()
    let starttime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' 00:00:00'
    // let tomorrow = new Date(today.setDate(today.getDate() + 1))
    // let endTime = tomorrow.getFullYear() + '-' + (tomorrow.getMonth() + 1) + '-' + tomorrow.getDate() + ' 00:00:00'

    let list = await api.getExams({
      starttime: starttime
    })
    if (list.records && list.records.length > 0) {
      this.setData({
        exams: list.records
      })
    }
  },
  setBarSelected() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  goExam(e) {
    let userInfo = app.globalData.userInfo
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/updUserInfo/updUserInfo',
      })
      return
    }
    let index = e.currentTarget.dataset.index
    let obj = this.data.exams[index]
    let message = `
    开启：${obj.starttime}
    关闭：${obj.endtime}
    考试时间：${obj.kssj/60}分钟
    `
    wx.showModal({
      title: '本次考试',
      content: message,
      success: (res) => {
        if (res.confirm) {
          let now = new Date().getTime()
          let startTime = obj.starttime.replaceAll('-', '/')
          let endTime = obj.endtime.replaceAll('-', '/')
          if (now < new Date(startTime).getTime()) {
            wx.showToast({
              title: '本次考试未开始',
              icon: 'error'
            })
          } else if (now > new Date(endTime).getTime()) {
            wx.showToast({
              title: '本次考试已结束',
              icon: 'error'
            })
          } else {
            wx.navigateTo({
              url: '/pages/question/question?type=exam&&examName=' + obj.name + '&&time=' + obj.kssj,
            })
          }
        } else {

        }
      }
    })
  },
  practice() {
    let userInfo = app.globalData.userInfo
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/updUserInfo/updUserInfo',
      })
    } else {
      // 开放时间每天9:00-21:00
      let now = new Date()
      let hours = now.getHours()
      if (hours < 9 || hours > 21) {
        wx.showToast({
          title: '开放时间：9:00 - 21:00',
          icon: 'none'
        })
        return
      }
      let records = wx.getStorageSync('recentSaveRecord')
      if (records) {
        wx.showModal({
          title: '提示',
          content: '上次答题未提交，是否继续上次答题？',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/question/question?type=common',
              })
              // 继续上次答题
            } else if (res.cancel) {
              wx.removeStorageSync('recentSaveRecord')
              wx.navigateTo({
                url: '/pages/question/question?type=common',
              })
              // 重新答题
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/question/question?type=common',
        })
      }
    }
  }
})