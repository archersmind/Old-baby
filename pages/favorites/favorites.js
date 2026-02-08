// pages/favorites/favorites.js
const storage = require('../../utils/storage')
const recommend = require('../../utils/recommend')

Page({
  data: {
    recipes: []
  },

  onShow() {
    this.loadFavorites()
  },

  loadFavorites() {
    const favoriteIds = storage.getFavorites()
    const recipes = favoriteIds
      .map(id => recommend.getRecipeById(id))
      .filter(r => r !== null)

    this.setData({ recipes })
  },

  onRecipeTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/recipe-detail/recipe-detail?id=${id}`
    })
  },

  goRecipeList() {
    wx.switchTab({
      url: '/pages/recipe-list/recipe-list'
    })
  }
})
