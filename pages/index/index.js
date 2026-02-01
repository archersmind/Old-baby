// pages/index/index.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    pets: [],
    isEmpty: true
  },

  onLoad() {
    this.loadPets()
  },

  onShow() {
    // 如果是tabBar页面，需要手动设置选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.loadPets()
  },

  loadPets() {
    const pets = storage.getPets()
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

  // 点击宠物卡片
  onPetTap(e) {
    const petId = e.currentTarget.dataset.id
    storage.setCurrentPetId(petId)
    wx.navigateTo({
      url: `/pages/pet-profile/pet-profile?id=${petId}`
    })
  },

  // 查看宠物的食谱推荐
  onViewRecipes(e) {
    const petId = e.currentTarget.dataset.id
    storage.setCurrentPetId(petId)
    wx.switchTab({
      url: '/pages/recipe-list/recipe-list'
    })
  },

  // 编辑健康信息
  onEditHealth(e) {
    const petId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/health-info/health-info?id=${petId}`
    })
  },

  // 删除宠物
  async onDeletePet(e) {
    const petId = e.currentTarget.dataset.id
    const pet = storage.getPetById(petId)
    
    const confirmed = await util.showConfirm(`确定要删除 ${pet.name || '该宠物'} 的档案吗？数据将被永久清除。`)
    
    if (confirmed) {
      storage.deletePet(petId)
      util.showToast('已删除')
      this.loadPets()
    }
  }
})
