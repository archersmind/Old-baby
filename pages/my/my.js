// pages/my/my.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    petsCount: 0
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
    this.setData({
      petsCount: pets.length
    })

    // 检查是否有用户信息
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

  // 获取用户昵称
  onInputNickname(e) {
    const nickName = e.detail.value
    const userInfo = this.data.userInfo || {}
    userInfo.nickName = nickName
    this.setData({ userInfo })
    wx.setStorageSync('userInfo', userInfo)
  },

  // 管理宠物
  onManagePets() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 关于我们
  onAbout() {
    wx.showModal({
      title: '老宝贝护理',
      content: '专为老年犬主人设计的自制狗粮指南小程序。\n\n版本：1.0.0\n\n用爱守护每一天 🐕',
      showCancel: false
    })
  },

  // 意见反馈
  onFeedback() {
    wx.showModal({
      title: '意见反馈',
      content: '您可以通过以下方式联系我们：\n\n邮箱：feedback@example.com',
      showCancel: false
    })
  },

  // 清除缓存
  async onClearCache() {
    const confirmed = await util.showConfirm('确定要清除所有本地数据吗？包括宠物信息和食谱收藏。此操作不可恢复。')
    if (confirmed) {
      try {
        wx.clearStorageSync()
        this.setData({
          userInfo: null,
          hasUserInfo: false,
          petsCount: 0
        })
        util.showToast('清除成功', 'success')
      } catch (e) {
        util.showToast('清除失败')
      }
    }
  },

  // 分享小程序
  onShareAppMessage() {
    return {
      title: '老宝贝护理 - 老年犬自制狗粮指南',
      path: '/pages/index/index'
    }
  }
})
