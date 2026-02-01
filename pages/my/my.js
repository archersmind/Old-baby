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
      title: '赛博宠物',
      content: '赛博宠物护理系统\n专为老年犬主人设计的智能补给方案。\n\n版本：1.0.0\n\nCYBER PET CARE SYSTEM',
      showCancel: false
    })
  },

  // 意见反馈
  onFeedback() {
    wx.showModal({
      title: '数据上报',
      content: '请通过以下通道上报数据：\n\n邮箱：feedback@example.com',
      showCancel: false
    })
  },

  // 清除缓存
  async onClearCache() {
    const confirmed = await util.showConfirm('确定要格式化所有本地存储吗？包括生物体数据和收藏协议。此操作不可逆。')
    if (confirmed) {
      try {
        wx.clearStorageSync()
        this.setData({
          userInfo: null,
          hasUserInfo: false,
          petsCount: 0
        })
        util.showToast('格式化完成', 'success')
      } catch (e) {
        util.showToast('格式化失败')
      }
    }
  },

  // 分享小程序
  onShareAppMessage() {
    return {
      title: '赛博宠物 - 老年犬智能补给方案',
      path: '/pages/index/index'
    }
  }
})
