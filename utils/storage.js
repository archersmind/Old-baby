// utils/storage.js - 本地存储封装

const STORAGE_KEYS = {
  PETS: 'pets',
  CURRENT_PET: 'currentPetId',
  USER_INFO: 'userInfo'
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
  getCurrentPet
}
