// pages/recipe-detail/recipe-detail.js
const recommend = require('../../utils/recommend')

Page({
  data: {
    recipe: null,
    activeTab: 'ingredients'
  },

  onLoad(options) {
    if (options.id) {
      const recipe = recommend.getRecipeById(options.id)
      if (recipe) {
        this.setData({ recipe })
        wx.setNavigationBarTitle({ title: recipe.name })
      }
    }
  },

  // 切换标签
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
  },

  // 分享
  onShareAppMessage() {
    const { recipe } = this.data
    return {
      title: `${recipe.name} - 老年犬自制粮食谱`,
      path: `/pages/recipe-detail/recipe-detail?id=${recipe.id}`
    }
  },

  // 收藏
  onCollect() {
    wx.showToast({
      title: '收藏功能开发中',
      icon: 'none'
    })
  }
})
