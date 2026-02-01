// utils/recommend.js - 食谱推荐算法

const recipesData = require('../data/recipes.js')
const diseasesData = require('../data/diseases.js')

// 疾病映射表 ID -> Name
const diseaseMap = {}
diseasesData.forEach(d => {
  diseaseMap[d.id] = d.name
})

/**
 * 翻译体征/疾病 ID 为中文名
 */
function translateDiseases(diseaseIds) {
  if (!diseaseIds) return []
  return diseaseIds.map(id => diseaseMap[id] || id)
}

/**
 * 为食谱对象添加中文体征名称
 */
function enhanceRecipe(recipe) {
  return {
    ...recipe,
    suitableNames: translateDiseases(recipe.suitableFor)
  }
}

/**
 * 根据宠物信息推荐食谱
 * @param {Object} pet - 宠物信息
 * @returns {Array} - 推荐的食谱列表，按匹配度排序
 */
function getRecommendedRecipes(pet) {
  if (!pet) {
    return getAllRecipes()
  }

  const petDiseases = pet.diseases || []
  const petAllergens = pet.allergens || []
  
  // 计算每个食谱的匹配分数
  const scoredRecipes = recipesData.map(recipe => {
    let score = 0
    let matchedDiseases = []
    let isAvoided = false

    // 检查是否包含过敏原
    if (petAllergens.length > 0 && recipe.avoidFor && recipe.avoidFor.length > 0) {
      const hasAllergen = recipe.avoidFor.some(avoid => petAllergens.includes(avoid))
      if (hasAllergen) {
        isAvoided = true
      }
    }

    // 如果宠物有疾病，检查食谱是否适合
    if (petDiseases.length > 0) {
      recipe.suitableFor.forEach(disease => {
        if (petDiseases.includes(disease)) {
          score += 10  // 每匹配一个疾病加10分
          matchedDiseases.push(diseaseMap[disease] || disease)
        }
      })
    } else {
      // 健康狗狗，通用食谱得分更高
      if (recipe.suitableFor.length === 0) {
        score += 5
      }
    }

    // 难度简单的食谱加分
    if (recipe.difficulty === '简单') {
      score += 2
    }

    return {
      ...recipe,
      suitableNames: translateDiseases(recipe.suitableFor),
      score,
      matchedDiseases,
      isAvoided
    }
  })

  // 过滤掉包含过敏原的食谱，按分数排序
  const filteredRecipes = scoredRecipes
    .filter(r => !r.isAvoided)
    .sort((a, b) => b.score - a.score)

  return filteredRecipes
}

/**
 * 获取所有食谱
 */
function getAllRecipes() {
  return recipesData.map(enhanceRecipe)
}

/**
 * 根据ID获取食谱详情
 */
function getRecipeById(recipeId) {
  const recipe = recipesData.find(r => r.id === recipeId)
  return recipe ? enhanceRecipe(recipe) : null
}

/**
 * 根据疾病筛选食谱
 */
function getRecipesByDisease(diseaseId) {
  return recipesData
    .filter(r => r.suitableFor.includes(diseaseId))
    .map(enhanceRecipe)
}

/**
 * 搜索食谱
 */
function searchRecipes(keyword) {
  if (!keyword) return getAllRecipes()
  const lowerKeyword = keyword.toLowerCase()
  return recipesData
    .filter(r =>
      r.name.toLowerCase().includes(lowerKeyword) ||
      r.description.toLowerCase().includes(lowerKeyword) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(lowerKeyword))
    )
    .map(enhanceRecipe)
}

module.exports = {
  getRecommendedRecipes,
  getAllRecipes,
  getRecipeById,
  getRecipesByDisease,
  searchRecipes
}
