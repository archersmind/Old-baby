// pages/index/index.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')
const diseasesData = require('../../data/diseases.js')

Page({
  data: {
    pets: [],
    isEmpty: true,
    diseaseMap: {},
    showWelcome: false,
    todayReminders: []
  },

  onLoad() {
    this.initDiseaseMap()
    this.loadPets()
    this.loadReminders()
    this.checkWelcome()
  },

  checkWelcome() {
    const hasSeenWelcome = wx.getStorageSync('hasSeenWelcome')
    if (!hasSeenWelcome) {
      this.setData({ showWelcome: true })
      wx.setStorageSync('hasSeenWelcome', true)
    }
  },

  onCloseWelcome() {
    this.setData({ showWelcome: false })
  },

  initDiseaseMap() {
    const map = {}
    diseasesData.forEach(d => {
      map[d.id] = d.name
    })
    this.setData({ diseaseMap: map })
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.loadPets()
    this.loadReminders()
  },

  loadReminders() {
    const todayReminders = storage.getTodayReminders()
    this.setData({ todayReminders })
  },

  // 标记提醒完成
  onReminderDone(e) {
    const id = e.currentTarget.dataset.id
    storage.markReminderDone(id)
    wx.showToast({ title: '已完成', icon: 'success' })
    this.loadReminders()
  },

  // 跳转到提醒设置
  goReminders() {
    wx.navigateTo({
      url: '/pages/reminders/reminders'
    })
  },

  formatDate(timestamp) {
    if (!timestamp) return ''
    const d = new Date(timestamp)
    const month = d.getMonth() + 1
    const day = d.getDate()
    return `${month}月${day}日`
  },

  loadPets() {
    const pets = storage.getPets().map(pet => {
      const diseaseNames = (pet.diseases || []).map(id => this.data.diseaseMap[id] || id)
      const isHealthComplete = (pet.diseases && pet.diseases.length > 0) || pet.medications || (pet.reports && pet.reports.length > 0)

      return {
        ...pet,
        diseaseNames,
        isHealthComplete,
        lastCheckupDate: pet.lastCheckupDate || ''
      }
    })

    this.setData({
      pets,
      isEmpty: pets.length === 0
    })
  },

  // 添加新宠物
  onAddPet() {
    wx.navigateTo({
      url: '/pages/pet-profile/pet-profile'
    })
  },

  // 点击宠物卡片 → 进入宠物详情页
  onPetTap(e) {
    const petId = e.currentTarget.dataset.id
    storage.setCurrentPetId(petId)
    wx.navigateTo({
      url: `/pages/pet-detail/pet-detail?id=${petId}`
    })
  }
})
