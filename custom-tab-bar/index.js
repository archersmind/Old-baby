Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/index/index",
        text: "我的宝贝",
        icon: "/images/tabbar/heart.svg",
        activeIcon: "/images/tabbar/heart-active.svg"
      },
      {
        pagePath: "/pages/recipe-list/recipe-list",
        text: "食谱",
        icon: "/images/tabbar/book.svg",
        activeIcon: "/images/tabbar/book-active.svg"
      },
      {
        pagePath: "/pages/my/my",
        text: "我的",
        icon: "/images/tabbar/user.svg",
        activeIcon: "/images/tabbar/user-active.svg"
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
