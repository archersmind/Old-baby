// pages/recipe-list/recipe-list.js
const storage = require('../../utils/storage')
const recommend = require('../../utils/recommend')
const diseasesData = require('../../data/diseases.js')

Page({
  data: {
    currentPet: null,
    recipes: [],
    allRecipes: [],
    searchKey: '',
    activeCategory: 'all',
    categories: [
      { id: 'all', name: '全部' },
      { id: 'joint', name: '关节养护' },
      { id: 'digestive', name: '肠胃调理' },
      { id: 'heart', name: '心脏健康' },
      { id: 'weight', name: '体重管理' }
    ],
    diseases: diseasesData
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  loadData() {
    const currentPet = storage.getCurrentPet()
    const allRecipes = recommend.getAllRecipes()
    let recipes = []

    if (currentPet) {
      recipes = recommend.getRecommendedRecipes(currentPet)
    } else {
      recipes = allRecipes
    }

    this.setData({
      currentPet,
      recipes,
      allRecipes
    })
  },

  // 搜索
  onSearch(e) {
    const key = e.detail.value
    this.setData({ searchKey: key })
    this.filterRecipes()
  },

  // 分类标签点击
  onCategoryTap(e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({ activeCategory: categoryId })
    this.filterRecipes()
  },

  // 清除筛选
  clearFilter() {
    this.setData({
      activeCategory: 'all',
      searchKey: ''
    })
    this.loadData()
  },

  // 筛选食谱
  filterRecipes() {
    let recipes = this.data.currentPet
      ? recommend.getRecommendedRecipes(this.data.currentPet)
      : this.data.allRecipes

    const { searchKey, activeCategory } = this.data

    // 按关键词搜索
    if (searchKey) {
      const lowerKey = searchKey.toLowerCase()
      recipes = recipes.filter(r =>
        r.name.toLowerCase().includes(lowerKey) ||
        r.description.toLowerCase().includes(lowerKey)
      )
    }

    // 按分类筛选
    if (activeCategory !== 'all') {
      const categoryDiseaseMap = {
        joint: ['arthritis'],
        digestive: ['digestive', 'pancreatitis', 'liver_disease'],
        heart: ['heart_disease'],
        weight: ['obesity', 'diabetes']
      }
      const diseaseIds = categoryDiseaseMap[activeCategory] || []
      if (diseaseIds.length > 0) {
        recipes = recipes.filter(r =>
          r.suitableFor && r.suitableFor.some(id => diseaseIds.includes(id))
        )
      }
    }

    this.setData({ recipes })
  },

  // 点击食谱
  onRecipeTap(e) {
    const recipeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${recipeId}`
    })
  },

  // 切换宠物
  onChangePet() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})
