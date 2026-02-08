// pages/reminders/reminders.js
const storage = require('../../utils/storage')

Page({
  data: {
    reminders: [],
    pets: [],
    showAddModal: false,
    selectedPetName: '',
    // 新增提醒表单
    newReminder: {
      type: 'feeding',
      petId: '',
      title: '',
      time: '08:00',
      date: '',
      repeat: 'daily'
    },
    typeOptions: [
      { id: 'feeding', name: '喂食提醒', icon: '🍽' },
      { id: 'medication', name: '用药提醒', icon: '💊' },
      { id: 'checkup', name: '体检提醒', icon: '🏥' }
    ],
    repeatOptions: [
      { id: 'daily', name: '每天' },
      { id: 'once', name: '仅一次' }
    ]
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const reminders = storage.getReminders()
    const pets = storage.getPets()

    // 按类型分组
    const feedingReminders = reminders.filter(r => r.type === 'feeding')
    const medicationReminders = reminders.filter(r => r.type === 'medication')
    const checkupReminders = reminders.filter(r => r.type === 'checkup')

    this.setData({
      reminders,
      feedingReminders,
      medicationReminders,
      checkupReminders,
      pets
    })
  },

  // 显示添加弹窗
  showAdd() {
    const today = new Date().toISOString().split('T')[0]
    const pets = this.data.pets
    this.setData({
      showAddModal: true,
      selectedPetName: pets.length > 0 ? pets[0].name : '',
      newReminder: {
        type: 'feeding',
        petId: pets.length > 0 ? pets[0].id : '',
        title: '该喂饭啦',
        time: '08:00',
        date: today,
        repeat: 'daily'
      }
    })
  },

  // 隐藏添加弹窗
  hideAdd() {
    this.setData({ showAddModal: false })
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，仅用于阻止事件冒泡
  },

  // 选择提醒类型
  onTypeChange(e) {
    const type = e.currentTarget.dataset.type
    let title = ''
    if (type === 'feeding') title = '该喂饭啦'
    if (type === 'medication') title = '该吃药啦'
    if (type === 'checkup') title = '该体检啦'

    this.setData({
      'newReminder.type': type,
      'newReminder.title': title,
      'newReminder.repeat': type === 'checkup' ? 'once' : 'daily'
    })
  },

  // 选择宠物
  onPetChange(e) {
    const index = e.detail.value
    const pet = this.data.pets[index]
    this.setData({
      'newReminder.petId': pet.id,
      selectedPetName: pet.name
    })
  },

  // 输入标题
  onTitleInput(e) {
    this.setData({
      'newReminder.title': e.detail.value
    })
  },

  // 选择时间
  onTimeChange(e) {
    this.setData({
      'newReminder.time': e.detail.value
    })
  },

  // 选择日期
  onDateChange(e) {
    this.setData({
      'newReminder.date': e.detail.value
    })
  },

  // 选择重复
  onRepeatChange(e) {
    const index = e.detail.value
    this.setData({
      'newReminder.repeat': this.data.repeatOptions[index].id
    })
  },

  // 保存提醒
  saveReminder() {
    const { newReminder, pets } = this.data

    if (!newReminder.title) {
      wx.showToast({ title: '请输入提醒内容', icon: 'none' })
      return
    }

    const pet = pets.find(p => p.id === newReminder.petId)

    storage.addReminder({
      ...newReminder,
      petName: pet ? pet.name : ''
    })

    wx.showToast({ title: '添加成功', icon: 'success' })
    this.hideAdd()
    this.loadData()
  },

  // 切换提醒开关
  onToggle(e) {
    const id = e.currentTarget.dataset.id
    const enabled = e.detail.value
    storage.updateReminder(id, { enabled })
    this.loadData()
  },

  // 删除提醒
  onDelete(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个提醒吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteReminder(id)
          wx.showToast({ title: '已删除', icon: 'success' })
          this.loadData()
        }
      }
    })
  }
})
