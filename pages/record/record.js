// pages/question/question.js
const api = require('../../api/apis.js')
// import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [],
    currentIndex: 0,
    popShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // let list = await api.getQuestions()
    // console.log('questionList', list)
    this.getQuestionList()
  },
  async getQuestionList() {
    let historyList = wx.getStorageSync('historyRecord')
    if (historyList) {
      let currentIndex = wx.getStorageSync('historyIndex')
      this.setData({
        questionList: historyList,
        currentIndex: currentIndex ? currentIndex : 0
      })
    }
    
  },

  pre() {
    if (this.data.currentIndex > 0) {
      this.data.currentIndex--
      this.setData({
        currentIndex: this.data.currentIndex
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
  }
})