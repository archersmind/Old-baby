Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#4A7C59",
    list: [
      {
        pagePath: "/pages/index/index",
        icon: "🐕",
        text: "我的宝贝"
      },
      {
        pagePath: "/pages/recipe-list/recipe-list",
        icon: "🍲",
        text: "食谱"
      },
      {
        pagePath: "/pages/my/my",
        icon: "👤",
        text: "我的"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
    }
  }
})
