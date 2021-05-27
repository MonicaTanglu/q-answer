// pages/question/question.js
const api = require('../../api/apis.js')
const util = require('../../utils/util.js')
const app = getApp()
// import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // answer: {},
    questionList: [],
    currentIndex: 0,
    popShow: false,
    total: 0,
    submitDisabled: false,
    time: 1800, // 30分钟
    totalTime: 1800,
    timer: null,
    type: 'common',
    examName: '',
    timeObj: {
      minute: 0,
      second: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      type: options.type
    })
    await this.getQuestionList()
    if (options.type !== 'common') {
      this.data.examName = options.examName
      this.data.time = parseInt(options.time)
      this.data.totalTime = this.data.time
      this.setTime()
    }
  },
  setTime() {
    this.data.timer = setInterval(() => {
      if (this.data.time <= 0) {
        clearInterval(this.data.timer)

        wx.showToast({
          title: '即将提交本次考卷',
          image: '/assets/images/icon/wariming.png',
          duration: 2000,
          complete: () => {
            setTimeout(() => {
              this.submitAnswer()
            }, 2000);
          }
        })
      } else {
        this.data.time--
        let minute = parseInt(this.data.time / 60)
        let second = parseInt(this.data.time % 60)
        this.setData({
          'timeObj.minute': minute,
          'timeObj.second': second
        })
      }

    }, 1000);
  },
  async getQuestionList() {
    wx.showLoading({
      title: '加载试题中...',
    })
    let historyList = wx.getStorageSync('recentSaveRecord')
    let list = []
    if (historyList && this.data.type === 'common') {
      list = historyList
      this.data.currentIndex = wx.getStorageSync('historyIndex')
    } else {
      let result = await api.getQuestions()
      list = result.tikus
    }
    this.setData({
      questionList: list,
      currentIndex: this.data.currentIndex
    })
    wx.hideLoading()
  },
  setAnswer(e) {
    // this.data.answer[this.data.questionList[this.data.currentIndex].id] = e.currentTarget.dataset.value
    this.setData({
      [`questionList[${this.data.currentIndex}].answer`]: e.currentTarget.dataset.value
    })
  },
  pre() {
    if (this.data.currentIndex > 0) {
      this.data.currentIndex--
      this.setData({
        currentIndex: this.data.currentIndex
      })
    }

  },
  save() {
    wx.setStorageSync('recentSaveRecord', this.data.questionList)
    wx.setStorageSync('historyIndex', this.data.currentIndex)
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })
  },
  submit() {
    let length = 0
    for (let question of this.data.questionList) {
      if (question.answer) length++
    }
    // let length = Object.keys(this.data.answer).length
    let msg = '确定要提交吗？'
    let rest = this.data.questionList.length - length
    if (rest > 0) msg = `还有${rest}道题没做，${msg}`
    wx.showModal({
      title: '提示',
      content: msg,
      success: (res) => {
        if (res.confirm) {
          this.submitAnswer()
        } else {

        }
      }
    })
  },
  async submitAnswer() {
    this.setData({
      submitDisabled: true
    })
    let userInfo = app.globalData.userInfo
    let params = {
      user: userInfo.id,
      df: 0,
      lxsj: util.formatTime(new Date(), '-'),
      dtjg: ''
    }

    let answerList = []
    for (let item of this.data.questionList) {
      let obj = {
        id: item.id,
        answer: item.answer ? item.answer : '',
        score: 0 // 0 为未得分 1为得分
      }
      if (item.answer === item.da) {
        if(item.xxfl === '1') {
          params.df+=2
          obj.score = 2
        }
        else {
          params.df++
          obj.score = 1
        }
      }
      answerList.push(obj)
    }
    params.dtjg = JSON.stringify(answerList)
    // wx.setStorageSync('examResult', params)
    let submitRes = null
    if (this.data.type === 'common') {
      submitRes = await api.addCommonScore(params)
    } else {
      let examParams = {}
      examParams['jsname'] = this.data.examName
      examParams['jsjg'] = params.dtjg
      examParams['ys'] = this.data.totalTime - this.data.time
      examParams['user'] = params.user
      examParams['df'] = params.df
      examParams['jssj'] = params.lxsj
      submitRes = await api.addExamScore(examParams)
    }

    this.setData({
      submitDisabled: false
    })
    if (submitRes) {
      wx.removeStorageSync('recentSaveRecord')
      wx.redirectTo({
        url: '/pages/answer/answer?id=' + submitRes.id + '&&type=' + this.data.type,
      })
    }
  },
  next() {
    if (this.data.currentIndex < (this.data.questionList.length - 1)) {
      this.data.currentIndex++
      this.setData({
        currentIndex: this.data.currentIndex
      })
    }
  },

  closePop() {
    this.setData({
      popShow: false
    })
  },
  showRecord() {
    this.setData({
      popShow: true
    })
  },
  goToQuestion(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index,
      popShow: false
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
    clearInterval(this.data.timer)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})