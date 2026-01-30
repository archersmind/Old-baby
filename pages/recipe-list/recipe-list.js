// pages/recipe-list/recipe-list.js
const storage = require('../../utils/storage')
const recommend = require('../../utils/recommend')
const diseasesData = require('../../data/diseases.json')

Page({
  data: {
    currentPet: null,
    recipes: [],
    allRecipes: [],
    searchKey: '',
    filterDisease: '',
    diseases: diseasesData,
    showFilter: false
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
      // 有选中的宠物，使用推荐算法
      recipes = recommend.getRecommendedRecipes(currentPet)
    } else {
      // 没有选中宠物，显示所有食谱
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

  // 切换筛选面板
  toggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    })
  },

  // 按疾病筛选
  onFilterByDisease(e) {
    const diseaseId = e.currentTarget.dataset.id
    this.setData({
      filterDisease: this.data.filterDisease === diseaseId ? '' : diseaseId,
      showFilter: false
    })
    this.filterRecipes()
  },

  // 清除筛选
  clearFilter() {
    this.setData({
      filterDisease: '',
      searchKey: '',
      showFilter: false
    })
    this.loadData()
  },

  // 筛选食谱
  filterRecipes() {
    let recipes = this.data.currentPet 
      ? recommend.getRecommendedRecipes(this.data.currentPet)
      : this.data.allRecipes

    const { searchKey, filterDisease } = this.data

    // 按关键词搜索
    if (searchKey) {
      const lowerKey = searchKey.toLowerCase()
      recipes = recipes.filter(r => 
        r.name.toLowerCase().includes(lowerKey) ||
        r.description.toLowerCase().includes(lowerKey)
      )
    }

    // 按疾病筛选
    if (filterDisease) {
      recipes = recipes.filter(r => 
        r.suitableFor && r.suitableFor.includes(filterDisease)
      )
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
  },

  // 阻止冒泡
  preventTap() {}
})
