// utils/util.js - 通用工具函数

/**
 * 格式化时间
 */
function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
 * 计算狗狗年龄描述
 */
function getAgeDescription(age) {
  if (age < 1) return '幼犬'
  if (age < 7) return '成年犬'
  if (age < 10) return '老年犬'
  return '高龄犬'
}

/**
 * 根据体重计算每日建议喂食量（大约值）
 * @param {number} weight - 体重(kg)
 * @param {string} activityLevel - 活动水平
 */
function calculateDailyFood(weight, activityLevel = 'normal') {
  // 基础代谢率计算
  let baseAmount = weight * 30  // 每公斤约30g
  
  switch (activityLevel) {
    case 'low':
      baseAmount *= 0.8
      break
    case 'normal':
      baseAmount *= 1
      break
    case 'high':
      baseAmount *= 1.2
      break
  }
  
  return Math.round(baseAmount)
}

/**
 * 根据宠物体重缩放食材用量
 * @param {string} amountStr - 原始用量字符串 (例: "300g")
 * @param {number} petWeight - 宠物体重(kg)
 * @param {number} baseWeight - 食谱基准体重(kg)，默认为15kg (中型犬)
 */
function scaleAmount(amountStr, petWeight, baseWeight = 15) {
  if (!petWeight || !amountStr) return amountStr

  // 匹配数字和单位 (例: 300, g, 1汤匙, 1茶匙)
  const match = amountStr.match(/^(\d+(\.\d+)?)([a-zA-Z\u4e00-\u9fa5]*)$/)
  if (!match) return amountStr

  const value = parseFloat(match[1])
  const unit = match[3]

  // 计算缩放比例 (线性缩放)
  const ratio = petWeight / baseWeight
  const scaledValue = Math.round(value * ratio)

  // 如果缩放后为0，则保留原值或至少为1
  const finalValue = scaledValue > 0 ? scaledValue : (value > 0 ? 1 : 0)

  return `${finalValue}${unit}`
}

/**
 * 防抖函数
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 显示加载提示
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading()
}

/**
 * 显示提示消息
 */
function showToast(title, icon = 'none') {
  wx.showToast({
    title,
    icon,
    duration: 2000
  })
}

/**
 * 显示确认弹窗
 */
function showConfirm(content, title = '提示') {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success(res) {
        resolve(res.confirm)
      }
    })
  })
}

module.exports = {
  formatTime,
  formatNumber,
  getAgeDescription,
  calculateDailyFood,
  scaleAmount,
  debounce,
  showLoading,
  hideLoading,
  showToast,
  showConfirm
}
