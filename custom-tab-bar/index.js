Component({
  data: {
    selected: 1,
    color: "#333",
    selectedColor: "#ffffff",
    list: [{
      "pagePath": "/pages/index/index",
      icon: 'records',
      "iconPath": "/assets/images/icon/answer.png",
      "selectedIconPath": "/assets/images/icon/answer-selected.png",
      "text": "答题"
    }, {
      "pagePath": "/pages/mine/mine",
      icon: 'contact',
      "iconPath": "/assets/images/icon/user.png",
      "selectedIconPath": "/assets/images/icon/user-selected.png",
      "text": "我的"
    }],
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = this.data.list[e.detail]
      const url = data.pagePath
      wx.switchTab({
        url
      })
      // this.setData({
      //   selected: data.index
      // })
    },
  }
})