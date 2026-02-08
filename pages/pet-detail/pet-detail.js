// pages/pet-detail/pet-detail.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')
const diseasesData = require('../../data/diseases.js')
const allergensData = require('../../data/allergens.js')

Page({
  data: {
    pet: null,
    petId: null,
    diseaseNames: [],
    allergenNames: [],
    activityText: ''
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ petId: options.id })
      this.loadPetData(options.id)
    }
  },

  onShow() {
    if (this.data.petId) {
      this.loadPetData(this.data.petId)
    }
  },

  loadPetData(petId) {
    const pet = storage.getPetById(petId)
    if (!pet) {
      wx.navigateBack()
      return
    }

    // 翻译疾病名称
    const diseaseMap = {}
    diseasesData.forEach(d => { diseaseMap[d.id] = d.name })
    const diseaseNames = (pet.diseases || []).map(id => diseaseMap[id] || id)

    // 翻译过敏原名称
    const allergenMap = {}
    allergensData.forEach(a => { allergenMap[a.id] = a.name })
    const allergenNames = (pet.allergens || []).map(id => allergenMap[id] || id)

    // 活动能力文本
    const activityMap = {
      normal: '正常 - 活动自如',
      low: '轻度受限 - 行动较缓',
      very_low: '重度受限 - 很少活动'
    }
    const activityText = activityMap[pet.activityLevel] || '未记录'

    this.setData({
      pet,
      diseaseNames,
      allergenNames,
      activityText
    })

    wx.setNavigationBarTitle({ title: pet.name || '宠物详情' })
  },

  // 编辑档案
  onEdit() {
    wx.navigateTo({
      url: `/pages/pet-profile/pet-profile?id=${this.data.petId}`
    })
  },

  // 查看推荐食谱
  onViewRecipes() {
    storage.setCurrentPetId(this.data.petId)
    wx.switchTab({
      url: '/pages/recipe-list/recipe-list'
    })
  },

  // 预览体检报告
  onPreviewReport(e) {
    const index = e.currentTarget.dataset.index
    const reports = this.data.pet.reports || []
    wx.previewImage({
      current: reports[index].path,
      urls: reports.map(r => r.path)
    })
  },

  // 删除档案
  async onDelete() {
    const pet = this.data.pet
    const confirmed = await util.showConfirm(`确定要删除 ${pet.name || '该宠物'} 的档案吗？数据将被永久清除。`)
    if (confirmed) {
      storage.deletePet(this.data.petId)
      util.showToast('已删除')
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    }
  }
})
