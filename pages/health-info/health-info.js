// pages/health-info/health-info.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')
const diseasesData = require('../../data/diseases.js')
const allergensData = require('../../data/allergens.js')

Page({
  data: {
    petId: null,
    petName: '',
    isEdit: false,
    // 疾病数据
    diseases: diseasesData,
    diseaseCategories: [],
    selectedDiseases: {}, // 使用对象存储，便于 WXML 判断选中态
    // 过敏原数据
    allergens: allergensData,
    selectedAllergens: {}, // 使用对象存储
    // 表单数据
    medications: '',
    activityLevel: 'normal',
    preferences: '',
    currentDiet: '',
    // 体检报告
    reports: [],
    // 最近体检日期
    lastCheckupDate: '',
    today: '',
    // 活动水平选项
    activityOptions: [
      { value: 'normal', label: '正常', desc: '活动自如' },
      { value: 'low', label: '轻度受限', desc: '行动较缓' },
      { value: 'very_low', label: '重度受限', desc: '很少活动' }
    ]
  },

  onLoad(options) {
    // 设置今天的日期作为日期选择器的最大值
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    this.setData({ today })

    if (options.id) {
      this.setData({ petId: options.id })
      this.loadPetData(options.id)
    }

    // 检查是否从添加页面跳转过来
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    if (prevPage && prevPage.route === 'pages/pet-profile/pet-profile' && !prevPage.data.isEdit) {
      this.setData({ isEdit: false })
    } else {
      this.setData({ isEdit: true })
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
      // 将数组转换为对象以便 WXML 判断
      const diseaseObj = {}
      if (pet.diseases) {
        pet.diseases.forEach(id => {
          diseaseObj[id] = true
        })
      }

      const allergenObj = {}
      if (pet.allergens) {
        pet.allergens.forEach(id => {
          allergenObj[id] = true
        })
      }

      this.setData({
        petName: pet.name,
        selectedDiseases: diseaseObj,
        selectedAllergens: allergenObj,
        medications: pet.medications || '',
        activityLevel: pet.activityLevel || 'normal',
        preferences: pet.preferences || '',
        currentDiet: pet.currentDiet || '',
        reports: pet.reports || [],
        lastCheckupDate: pet.lastCheckupDate || ''
      })
    }
  },

  // 切换疾病选择
  toggleDisease(e) {
    const diseaseId = e.currentTarget.dataset.id
    const selected = { ...this.data.selectedDiseases }
    
    if (selected[diseaseId]) {
      delete selected[diseaseId]
    } else {
      selected[diseaseId] = true
    }
    
    this.setData({ selectedDiseases: selected })
  },

  // 切换过敏原选择
  toggleAllergen(e) {
    const allergenId = e.currentTarget.dataset.id
    const selected = { ...this.data.selectedAllergens }
    
    if (selected[allergenId]) {
      delete selected[allergenId]
    } else {
      selected[allergenId] = true
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

  // 体检日期变化
  onCheckupDateChange(e) {
    this.setData({
      lastCheckupDate: e.detail.value
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
    const { petId, selectedDiseases, selectedAllergens, medications, activityLevel, preferences, currentDiet, reports, lastCheckupDate } = this.data

    const updateData = {
      diseases: Object.keys(selectedDiseases), // 存回数组格式
      allergens: Object.keys(selectedAllergens),
      medications,
      activityLevel,
      preferences,
      currentDiet,
      reports,
      lastCheckupDate
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
