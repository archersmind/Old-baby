// app.js
App({
  onLaunch() {
    // 初始化本地存储
    this.initStorage()
  },

  initStorage() {
    // 检查是否有宠物数据，没有则初始化空数组
    const pets = wx.getStorageSync('pets')
    if (!pets) {
      wx.setStorageSync('pets', [])
    }
  },

  globalData: {
    userInfo: null,
    currentPetId: null  // 当前选中的宠物ID
  }
})
