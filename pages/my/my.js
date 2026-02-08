// pages/my/my.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    petsCount: 0,
    favoritesCount: 0,
    useDays: 1,
    showGuide: false,
    showFAQ: false
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
  },

  loadData() {
    const pets = storage.getPets()
    const favorites = storage.getFavorites()
    this.setData({
      petsCount: pets.length,
      favoritesCount: favorites.length
    })

    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo,
        hasUserInfo: true
      })
    }
  },

  // 获取用户头像
  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl
    const userInfo = this.data.userInfo || {}
    userInfo.avatarUrl = avatarUrl
    this.setData({
      userInfo,
      hasUserInfo: true
    })
    wx.setStorageSync('userInfo', userInfo)
  },

  // 我的收藏
  onFavorites() {
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    })
  },

  // 使用指南
  onGuide() {
    this.setData({ showGuide: true })
  },

  // 关闭使用指南
  onCloseGuide() {
    this.setData({ showGuide: false })
  },

  // 提醒设置
  onReminder() {
    wx.navigateTo({
      url: '/pages/reminders/reminders'
    })
  },

  // 常见问题
  onFAQ() {
    this.setData({ showFAQ: true })
  },

  // 关闭常见问题
  onCloseFAQ() {
    this.setData({ showFAQ: false })
  },

  // 设置
  async onSettings() {
    const confirmed = await util.showConfirm('确定要清除所有本地数据吗？包括宠物档案和收藏。此操作不可逆。')
    if (confirmed) {
      try {
        wx.clearStorageSync()
        this.setData({
          userInfo: null,
          hasUserInfo: false,
          petsCount: 0
        })
        util.showToast('已清除', 'success')
      } catch (e) {
        util.showToast('清除失败')
      }
    }
  },

  // 分享小程序
  onShareAppMessage() {
    return {
      title: '宝贝护理 - 老年犬健康管理与食谱推荐',
      path: '/pages/index/index'
    }
  }
})
