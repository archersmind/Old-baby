// pages/recipe-detail/recipe-detail.js
const recommend = require('../../utils/recommend')
const storage = require('../../utils/storage')
const util = require('../../utils/util')

Page({
  data: {
    recipe: null,
    currentPet: null,
    isFavorited: false
  },

  onLoad(options) {
    if (options.id) {
      const recipe = recommend.getRecipeById(options.id)
      const currentPet = storage.getCurrentPet()
      const isFavorited = storage.isFavorite(options.id)

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
          currentPet,
          isFavorited
        })
        wx.setNavigationBarTitle({ title: recipe.name })
      }
    }
  },

  // 分享
  onShareAppMessage() {
    const { recipe } = this.data
    return {
      title: `${recipe.name} - 宝贝护理食谱`,
      path: `/pages/recipe-detail/recipe-detail?id=${recipe.id}`
    }
  },

  // 收藏/取消收藏
  onCollect() {
    const { recipe, isFavorited } = this.data
    if (isFavorited) {
      storage.removeFavorite(recipe.id)
      this.setData({ isFavorited: false })
      wx.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      storage.addFavorite(recipe.id)
      this.setData({ isFavorited: true })
      wx.showToast({ title: '已收藏', icon: 'success' })
    }
  }
})
