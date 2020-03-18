// pages/uptoaddress/uptoaddress.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reservoir: '',
    phone: '',
    address: '',
    addressInfo:[]
  },
  /**
   * 加载页面
   */
  onLoad: function (options){
    // console.log(options)
    if (options.thisAd != ''){
      const addressInfo = JSON.parse(options.thisAd)
      this.setData({
        addressInfo,
        reservoir: addressInfo.reservoir,
        phone: addressInfo.phone,
        address: addressInfo.address
      })
    }
  },
  /**
   * 获取收件人
   */
  getReservoir(e){
    this.setData({
      reservoir: e.detail.value
    })
  },
  /**
   * 获取联系方式
   */
  getPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  /**
   * 获取地址
   */
  getAddress(e){
    this.setData({
      address: e.detail.value
    })
  },
  /**
   * 新增地址
   */
  addNewAddress(){
    const reservoir = this.data.reservoir
    const phone = this.data.phone
    const address = this.data.address
    if (reservoir == ''){
      wx.showToast({
        title: '收件人不能为空',
        icon: 'none'
      })
    } else if (phone == ''){
      wx.showToast({
        title: '联系方式不能为空',
        icon: 'none'
      })
    } else if (address == ''){
      wx.showToast({
        title: '地址不能为空',
        icon: 'none'
      })
    }
    else{
      db.collection('address').add({
        data: {
          user: app.globalData.userInfo,
          reservoir: this.data.reservoir,
          phone: this.data.phone,
          address: this.data.address
        }
      }).then(res =>{
        wx.showToast({
          title: '新增成功',
          icon: 'none',
          duration: 2000
        })
      })
      
      wx.navigateTo({
        url: '/pages/address/address',
      })
    }
  },
  /**
   * 修改地址
   */
  updateAddress(){
    const reservoir = this.data.reservoir
    const phone = this.data.phone
    const address = this.data.address
    const addressInfo = this.data.addressInfo
    if (reservoir == '') {
      wx.showToast({
        title: '收件人不能为空',
        icon: 'none'
      })
    } else if (phone == '') {
      wx.showToast({
        title: '联系方式不能为空',
        icon: 'none'
      })
    } else if (address == '') {
      wx.showToast({
        title: '地址不能为空',
        icon: 'none'
      })
    }
    else {
      db.collection('address').where({
        _id : addressInfo._id,
        _openid : addressInfo._openid
      }).update({
        data: {
          reservoir: this.data.reservoir,
          phone: this.data.phone,
          address: this.data.address
        }
      }).then(res =>{
        wx.showToast({
          title: '修改成功',
          icon: 'none',
          duration: 2000
        })
      })
      wx.navigateTo({
        url: '/pages/address/address',
      })
    }
  }
})