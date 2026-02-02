// pages/index/index.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')
const diseasesData = require('../../data/diseases.js')

Page({
  data: {
    pets: [],
    isEmpty: true,
    diseaseMap: {}
  },

  onLoad() {
    this.initDiseaseMap()
    this.loadPets()
  },

  initDiseaseMap() {
    const map = {}
    diseasesData.forEach(d => {
      map[d.id] = d.name
    })
    this.setData({ diseaseMap: map })
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
    const pets = storage.getPets().map(pet => {
      // 翻译疾病名称
      const diseaseNames = (pet.diseases || []).map(id => this.data.diseaseMap[id] || id)

      // 检查资料完整度
      const isHealthComplete = (pet.diseases && pet.diseases.length > 0) || pet.medications || (pet.reports && pet.reports.length > 0)

      return {
        ...pet,
        diseaseNames,
        isHealthComplete
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

  // 点击宠物卡片
  onPetTap(e) {
    const petId = e.currentTarget.dataset.id
    storage.setCurrentPetId(petId)
    // 恢复为默认进入基本资料编辑页
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
