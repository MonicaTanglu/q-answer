// pages/answer/answer.js
const api = require('../../api/apis.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: 100,
    id: null,
    score: 0,
    answerList: [],
    useTime: '',
    ids: '',
    idObj: {},
    type: 'common'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.data.type = options.type
    if (id) {
      this.getAnswerList(id)
    }
  },
  async getAnswerList(id) {
    wx.showLoading({
      title: '加载中...',
    })
    let answerRes = null,answerList = []
    if (this.data.type === 'common') {
      answerRes = await api.getPractiveAnswers({
        id: id
      })
      answerList = JSON.parse(answerRes.dtjg)
    } else {
      answerRes = await api.getExamAnswers({
        id: id
      })
      answerList = JSON.parse(answerRes.jsjg)
    }
    if (this.data.type !== 'common') {
      let minute = parseInt(answerRes.ys / 60)
      let second = parseInt(answerRes.ys % 60)
      this.data.useTime = `${minute}分钟${second}秒`
    }
    this.setData({
      score: answerRes.df,
      answerList: answerList,
      useTime: this.data.useTime
    })
    wx.hideLoading()
    this.getQuestionList(answerList)
  },
  async getQuestionList(answerList) {
    for (let item of answerList) {
      this.data.idObj[item.id] = item.answer
    }
    let ids = Object.keys(this.data.idObj)
    
    let list = await api.getQuestionsByIds(ids.join(','))
    for(let i=0,l=list.length;i<l;i++) {
      list[i]['answer'] = this.data.idObj[list[i].id]
    }
    wx.setStorageSync('historyRecord', list)
  },

  goToQuestion(e) {
    let index = e.currentTarget.dataset.index
    wx.setStorageSync('historyIndex', index)
    wx.navigateTo({
      url: '/pages/record/record?index=' + index,
    })
  }
})