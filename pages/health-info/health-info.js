// pages/health-info/health-info.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')
const diseasesData = require('../../data/diseases.js')
const allergensData = require('../../data/allergens.js')

Page({
  data: {
    petId: null,
    petName: '',
    // 疾病数据
    diseases: diseasesData,
    diseaseCategories: [],
    selectedDiseases: [],
    // 过敏原数据
    allergens: allergensData,
    selectedAllergens: [],
    // 表单数据
    medications: '',
    activityLevel: 'normal',
    preferences: '',
    currentDiet: '',
    // 体检报告
    reports: [],
    // 活动水平选项
    activityOptions: [
      { value: 'normal', label: '正常', desc: '能自如运作' },
      { value: 'low', label: '轻度受限', desc: '运动缓慢' },
      { value: 'very_low', label: '重度受限', desc: '低功耗模式' }
    ]
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ petId: options.id })
      this.loadPetData(options.id)
    }
    this.initDiseaseCategories()
  },

  initDiseaseCategories() {
    const categories = [...new Set(diseasesData.map(d => d.category))]
    this.setData({ diseaseCategories: categories })
  },

  loadPetData(petId) {
    const pet = storage.getPetById(petId)
    if (pet) {
      this.setData({
        petName: pet.name,
        selectedDiseases: pet.diseases || [],
        selectedAllergens: pet.allergens || [],
        medications: pet.medications || '',
        activityLevel: pet.activityLevel || 'normal',
        preferences: pet.preferences || '',
        currentDiet: pet.currentDiet || '',
        reports: pet.reports || []
      })
    }
  },

  // 切换疾病选择
  toggleDisease(e) {
    const diseaseId = e.currentTarget.dataset.id
    let selected = [...this.data.selectedDiseases]
    
    const index = selected.indexOf(diseaseId)
    if (index > -1) {
      selected.splice(index, 1)
    } else {
      selected.push(diseaseId)
    }
    
    this.setData({ selectedDiseases: selected })
  },

  // 切换过敏原选择
  toggleAllergen(e) {
    const allergenId = e.currentTarget.dataset.id
    let selected = [...this.data.selectedAllergens]
    
    const index = selected.indexOf(allergenId)
    if (index > -1) {
      selected.splice(index, 1)
    } else {
      selected.push(allergenId)
    }
    
    this.setData({ selectedAllergens: selected })
  },

  // 活动水平选择
  onActivityChange(e) {
    this.setData({
      activityLevel: e.currentTarget.dataset.value
    })
  },

  // 输入框变化
  onInputChange(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [field]: e.detail.value
    })
  },

  // 上传体检报告
  onUploadReport() {
    wx.chooseMedia({
      count: 9 - this.data.reports.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newReports = res.tempFiles.map(file => ({
          id: Date.now() + '_' + Math.random().toString(36).substr(2, 6),
          path: file.tempFilePath,
          uploadTime: Date.now()
        }))
        this.setData({
          reports: [...this.data.reports, ...newReports]
        })
      }
    })
  },

  // 预览报告图片
  onPreviewReport(e) {
    const index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.reports[index].path,
      urls: this.data.reports.map(r => r.path)
    })
  },

  // 删除报告图片
  onDeleteReport(e) {
    const index = e.currentTarget.dataset.index
    const reports = [...this.data.reports]
    reports.splice(index, 1)
    this.setData({ reports })
  },

  // 保存
  onSave() {
    const { petId, selectedDiseases, selectedAllergens, medications, activityLevel, preferences, currentDiet, reports } = this.data

    // 获取疾病名称用于显示
    const diseaseNames = selectedDiseases.map(id => {
      const disease = diseasesData.find(d => d.id === id)
      return disease ? disease.name : id
    })

    const updateData = {
      diseases: diseaseNames,
      allergens: selectedAllergens,
      medications,
      activityLevel,
      preferences,
      currentDiet,
      reports
    }

    util.showLoading('写入数据...')

    try {
      storage.updatePet(petId, updateData)
      util.hideLoading()
      util.showToast('数据写入成功', 'success')
      
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    } catch (e) {
      util.hideLoading()
      util.showToast('数据写入失败')
    }
  },

  // 查看推荐食谱
  onViewRecipes() {
    this.onSave()
    storage.setCurrentPetId(this.data.petId)
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/recipe-list/recipe-list'
      })
    }, 500)
  }
})
