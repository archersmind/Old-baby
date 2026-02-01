// pages/recipe-detail/recipe-detail.js
const recommend = require('../../utils/recommend')
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    recipe: null,
    activeTab: 'ingredients',
    currentPet: null
  },

  onLoad(options) {
    if (options.id) {
      const recipe = recommend.getRecipeById(options.id)
      const currentPet = storage.getCurrentPet()

      if (recipe) {
        // 如果有当前宠物，且有体重，则缩放食材用量
        if (currentPet && currentPet.weight) {
          recipe.ingredients = recipe.ingredients.map(ing => ({
            ...ing,
            originalAmount: ing.amount,
            amount: util.scaleAmount(ing.amount, currentPet.weight)
          }))
        }

        this.setData({
          recipe,
          currentPet
        })
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
      title: `${recipe.name} - 赛博宠物能量补给`,
      path: `/pages/recipe-detail/recipe-detail?id=${recipe.id}`
    }
  },

  // 收藏
  onCollect() {
    wx.showToast({
      title: '收藏协议开发中',
      icon: 'none'
    })
  }
})
