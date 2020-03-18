// pages/profile/profile.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
  },
  /**
   * 地址管理
   */
  updateAddress(){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  /**
   * 跳转至我的订单
   */
  turnToOrder(e){
    // console.log(e)
    const state = e.currentTarget.dataset.state
    wx.navigateTo({
      url: '/pages/order/order?state=' + state,
    })
  },
})