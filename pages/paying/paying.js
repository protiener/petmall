// pages/paying/paying.js
const app = getApp()
const db = wx.cloud.database()
const util = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    waitPaying:[],
    address:{},
    allAddress:[],
    isSelect: false,
    totalPrice: 0,
    totalCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    const waitPaying = JSON.parse(options.waitPaying)
    this.setData({
      waitPaying: waitPaying,
    })
    this.getAddress()
    this.getSum()
  },
  /**
   * 获取地址
   */
  getAddress() {
    const userInfo = app.globalData.userInfo
    db.collection('address').where({
      _openid: userInfo.openid
    }).get({
      success: (res) => {
        this.setData({
          allAddress: res.data,
          address: res.data[0]
        })
      }
    })
  },
  /**
   * 选择地址
   */
  chooseAddress(e){
    let isSelect = this.data.isSelect
    if(isSelect == false){
      this.setData({
        isSelect: true
      })
    }else{
      const index = e.currentTarget.dataset.index
      const allAddress = this.data.allAddress
      this.setData({
        address: allAddress[index],
        isSelect: false
      })
    }
  },
  /**
   * 计算总价总数
   */
  getSum() {
    const goods = this.data.waitPaying
    let sum = 0
    let num = 0
    for (let i = 0; i < goods.length; i++) {
      sum = sum + goods[i].price * goods[i].count
      num = num + goods[i].count
    }
    this.setData({
      totalPrice: sum,
      totalCount: num
    })
  },

  /**
   * 提交订单支付
   */
  getPaying(){
    const goods = this.data.waitPaying
    const address = this.data.address
    const count = this.data.totalCount
    const price = this.data.totalPrice
    const user = app.globalData.userInfo
    var time = util.formatTime(new Date());

    //生成订单
    db.collection('order').add({
      data: {
        user: user,
        goods: goods,
        address: address,
        count: count,
        price: price,
        date: time,
        station: 1 //0待支付 1代发货 2待收货 3售后
      }
    })
    //删除购物车中已支付的商品
    for(let i = 0; i < goods.length; i++){
      db.collection('cart').where({
        _openid: app.globalData.userInfo.openid,
        num_id: goods[i].num_id
      }).remove()
      // //减少库存
      // if (goods[i].type == 'tool'){
      //   db.collection('articles').where({
      //     _id: goods[i].num_id
      //   }).update({
      //     data:{
      //       stock: goods[i].stock - goods[i].count
      //     }
      //   }).then(res =>{
      //     console.log(res)
      //   })
      // }else{
      //   db.collection('pet').where({
      //     _openid: app.globalData.userInfo.openid,
      //     num_id: goods[i].num_id
      //   }).remove()
      // }
    }
    wx.showToast({
      title: '下单成功',
      icon: 'none',
      duration: 2000
    })
    wx.redirectTo({
      url: '/pages/order/order?state=' + 0,
    })
  }
})