// pages/pet-profile/pet-profile.js
const storage = require('../../utils/storage')
const util = require('../../utils/util')
const breedsData = require('../../data/breeds.js')

Page({
  data: {
    isEdit: false,
    petId: null,
    // 表单数据
    form: {
      name: '',
      avatar: '',
      breed: '',
      breedName: '',
      age: '',
      weight: '',
      gender: 'unknown',
      neutered: false
    },
    // 品种选择
    breeds: breedsData,
    filteredBreeds: breedsData,
    showBreedPicker: false,
    breedSearchKey: '',
    // 性别选项
    genderOptions: [
      { value: 'male', label: '公' },
      { value: 'female', label: '母' },
      { value: 'unknown', label: '未知' }
    ]
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ 
        isEdit: true, 
        petId: options.id 
      })
      this.loadPetData(options.id)
      wx.setNavigationBarTitle({ title: '编辑宠物档案' })
    } else {
      wx.setNavigationBarTitle({ title: '添加宠物档案' })
    }
  },

  loadPetData(petId) {
    const pet = storage.getPetById(petId)
    if (pet) {
      this.setData({
        form: {
          name: pet.name || '',
          avatar: pet.avatar || '',
          breed: pet.breed || '',
          breedName: pet.breedName || '',
          age: pet.age ? String(pet.age) : '',
          weight: pet.weight ? String(pet.weight) : '',
          gender: pet.gender || 'unknown',
          neutered: pet.neutered || false
        }
      })
    }
  },

  // 选择头像
  onChooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({
          'form.avatar': tempFilePath
        })
      }
    })
  },

  // 输入框变化
  onInputChange(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`form.${field}`]: e.detail.value
    })
  },

  // 性别选择
  onGenderChange(e) {
    const gender = e.currentTarget.dataset.value
    this.setData({
      'form.gender': gender
    })
  },

  // 绝育开关
  onNeuteredChange(e) {
    this.setData({
      'form.neutered': e.detail.value
    })
  },

  // 显示品种选择器
  showBreedSelector() {
    this.setData({
      showBreedPicker: true,
      filteredBreeds: this.data.breeds,
      breedSearchKey: ''
    })
  },

  // 隐藏品种选择器
  hideBreedSelector() {
    this.setData({
      showBreedPicker: false
    })
  },

  // 搜索品种
  onBreedSearch(e) {
    const key = e.detail.value.toLowerCase()
    const filtered = this.data.breeds.filter(b => 
      b.name.toLowerCase().includes(key)
    )
    this.setData({
      breedSearchKey: key,
      filteredBreeds: filtered
    })
  },

  // 选择品种
  onSelectBreed(e) {
    const breed = e.currentTarget.dataset.breed
    this.setData({
      'form.breed': breed.id,
      'form.breedName': breed.name,
      showBreedPicker: false
    })
  },

  // 阻止冒泡
  preventTap() {},

  // 保存
  async onSave() {
    const { form, isEdit, petId } = this.data

    // 验证必填项
    if (!form.name.trim()) {
      util.showToast('请输入宝贝的名字')
      return
    }

    if (!form.age || isNaN(Number(form.age))) {
      util.showToast('请输入正确的年龄')
      return
    }

    if (!form.weight || isNaN(Number(form.weight))) {
      util.showToast('请输入正确的体重')
      return
    }

    const petData = {
      ...form,
      age: Number(form.age),
      weight: Number(form.weight)
    }

    util.showLoading('保存中...')

    try {
      if (isEdit) {
        storage.updatePet(petId, petData)
      } else {
        const newPet = storage.addPet(petData)
        storage.setCurrentPetId(newPet.id)
      }

      util.hideLoading()
      util.showToast('保存成功', 'success')
      
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    } catch (e) {
      util.hideLoading()
      util.showToast('保存失败')
    }
  },

  // 继续填写健康信息
  onContinueHealth() {
    this.onSave().then(() => {
      const petId = this.data.petId || storage.getCurrentPetId()
      if (petId) {
        wx.redirectTo({
          url: `/pages/health-info/health-info?id=${petId}`
        })
      }
    })
  },

  // 删除宠物
  async onDelete() {
    const confirmed = await util.showConfirm('确定要删除这个档案吗？数据将被永久清除。')
    if (confirmed) {
      storage.deletePet(this.data.petId)
      util.showToast('已删除')
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    }
  }
})
