// utils/storage.js - 本地存储封装

const STORAGE_KEYS = {
  PETS: 'pets',
  CURRENT_PET: 'currentPetId',
  USER_INFO: 'userInfo',
  FAVORITES: 'favorites',
  REMINDERS: 'reminders'
}

/**
 * 生成唯一ID
 */
function generateId() {
  return 'pet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * 获取所有宠物列表
 */
function getPets() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.PETS) || []
  } catch (e) {
    console.error('获取宠物列表失败:', e)
    return []
  }
}

/**
 * 保存宠物列表
 */
function savePets(pets) {
  try {
    wx.setStorageSync(STORAGE_KEYS.PETS, pets)
    return true
  } catch (e) {
    console.error('保存宠物列表失败:', e)
    return false
  }
}

/**
 * 获取单个宠物信息
 */
function getPetById(petId) {
  const pets = getPets()
  return pets.find(p => p.id === petId) || null
}

/**
 * 添加新宠物
 */
function addPet(petData) {
  const pets = getPets()
  const newPet = {
    id: generateId(),
    createTime: Date.now(),
    updateTime: Date.now(),
    // 基本信息
    name: petData.name || '',
    avatar: petData.avatar || '',
    breed: petData.breed || '',
    breedName: petData.breedName || '',
    age: petData.age || 0,
    weight: petData.weight || 0,
    gender: petData.gender || 'unknown',
    neutered: petData.neutered || false,
    // 健康信息
    diseases: petData.diseases || [],
    medications: petData.medications || '',
    activityLevel: petData.activityLevel || 'normal',
    // 饮食信息
    allergens: petData.allergens || [],
    preferences: petData.preferences || '',
    currentDiet: petData.currentDiet || '',
    // 体检报告
    reports: petData.reports || []
  }
  pets.push(newPet)
  savePets(pets)
  return newPet
}

/**
 * 更新宠物信息
 */
function updatePet(petId, updateData) {
  const pets = getPets()
  const index = pets.findIndex(p => p.id === petId)
  if (index === -1) return null
  
  pets[index] = {
    ...pets[index],
    ...updateData,
    updateTime: Date.now()
  }
  savePets(pets)
  return pets[index]
}

/**
 * 删除宠物
 */
function deletePet(petId) {
  const pets = getPets()
  const filteredPets = pets.filter(p => p.id !== petId)
  savePets(filteredPets)
  return true
}

/**
 * 获取当前选中的宠物ID
 */
function getCurrentPetId() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.CURRENT_PET) || null
  } catch (e) {
    return null
  }
}

/**
 * 设置当前选中的宠物ID
 */
function setCurrentPetId(petId) {
  try {
    wx.setStorageSync(STORAGE_KEYS.CURRENT_PET, petId)
    return true
  } catch (e) {
    return false
  }
}

/**
 * 获取当前选中的宠物信息
 */
function getCurrentPet() {
  const petId = getCurrentPetId()
  if (!petId) return null
  return getPetById(petId)
}

/**
 * 获取收藏列表
 */
function getFavorites() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.FAVORITES) || []
  } catch (e) {
    console.error('获取收藏列表失败:', e)
    return []
  }
}

/**
 * 检查是否已收藏
 */
function isFavorite(recipeId) {
  const favorites = getFavorites()
  return favorites.includes(recipeId)
}

/**
 * 添加收藏
 */
function addFavorite(recipeId) {
  try {
    const favorites = getFavorites()
    if (!favorites.includes(recipeId)) {
      favorites.unshift(recipeId)
      wx.setStorageSync(STORAGE_KEYS.FAVORITES, favorites)
    }
    return true
  } catch (e) {
    console.error('添加收藏失败:', e)
    return false
  }
}

/**
 * 取消收藏
 */
function removeFavorite(recipeId) {
  try {
    const favorites = getFavorites()
    const filtered = favorites.filter(id => id !== recipeId)
    wx.setStorageSync(STORAGE_KEYS.FAVORITES, filtered)
    return true
  } catch (e) {
    console.error('取消收藏失败:', e)
    return false
  }
}

/**
 * 生成提醒ID
 */
function generateReminderId() {
  return 'reminder_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * 获取所有提醒
 */
function getReminders() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.REMINDERS) || []
  } catch (e) {
    console.error('获取提醒列表失败:', e)
    return []
  }
}

/**
 * 保存提醒列表
 */
function saveReminders(reminders) {
  try {
    wx.setStorageSync(STORAGE_KEYS.REMINDERS, reminders)
    return true
  } catch (e) {
    console.error('保存提醒列表失败:', e)
    return false
  }
}

/**
 * 添加提醒
 */
function addReminder(reminderData) {
  const reminders = getReminders()
  const newReminder = {
    id: generateReminderId(),
    createTime: Date.now(),
    type: reminderData.type || 'feeding',
    petId: reminderData.petId || '',
    petName: reminderData.petName || '',
    title: reminderData.title || '',
    time: reminderData.time || '08:00',
    date: reminderData.date || '',
    repeat: reminderData.repeat || 'daily',
    enabled: true,
    lastTriggered: null
  }
  reminders.unshift(newReminder)
  saveReminders(reminders)
  return newReminder
}

/**
 * 更新提醒
 */
function updateReminder(reminderId, updateData) {
  const reminders = getReminders()
  const index = reminders.findIndex(r => r.id === reminderId)
  if (index === -1) return null

  reminders[index] = {
    ...reminders[index],
    ...updateData
  }
  saveReminders(reminders)
  return reminders[index]
}

/**
 * 删除提醒
 */
function deleteReminder(reminderId) {
  const reminders = getReminders()
  const filtered = reminders.filter(r => r.id !== reminderId)
  saveReminders(filtered)
  return true
}

/**
 * 获取今日待办提醒
 */
function getTodayReminders() {
  const reminders = getReminders()
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const currentTime = today.getHours().toString().padStart(2, '0') + ':' +
                      today.getMinutes().toString().padStart(2, '0')

  return reminders.filter(r => {
    if (!r.enabled) return false

    // 体检提醒：检查日期
    if (r.type === 'checkup') {
      return r.date === todayStr
    }

    // 喂食/用药提醒：检查是否到时间且今天未触发
    const lastTriggeredDate = r.lastTriggered ?
      new Date(r.lastTriggered).toISOString().split('T')[0] : null

    if (r.repeat === 'daily') {
      return lastTriggeredDate !== todayStr && r.time <= currentTime
    }

    if (r.repeat === 'once') {
      return r.date === todayStr && !r.lastTriggered
    }

    return false
  })
}

/**
 * 标记提醒已完成
 */
function markReminderDone(reminderId) {
  return updateReminder(reminderId, { lastTriggered: Date.now() })
}

module.exports = {
  STORAGE_KEYS,
  generateId,
  getPets,
  savePets,
  getPetById,
  addPet,
  updatePet,
  deletePet,
  getCurrentPetId,
  setCurrentPetId,
  getCurrentPet,
  getFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
  getReminders,
  addReminder,
  updateReminder,
  deleteReminder,
  getTodayReminders,
  markReminderDone
}
