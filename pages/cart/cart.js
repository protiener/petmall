// pages/cart/cart.js
const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cartInfo:[],
    checkedCart:[],
    totalPrice:0,
    checkedAll:false,
    isDelete:false,
    cartNum:0,
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function (){
    this.updateSynCart()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCart()
    this.setData({
      totalPrice: 0,
      cartNum: 0,
      checkedCart:[]
    })
  },
  //事件操作
  /**
   * 数量增加
   */
  numPlus(e){
    //console.log(e)
    const index = e.target.dataset.index
    const cartInfo = this.data.cartInfo
    let checkedCart = this.data.checkedCart
    //console.log(cartInfo[index].count)
    cartInfo[index].count += 1
    if (cartInfo[index].selected == true) {
      for (let i = 0; i < checkedCart.length; i++) {
        if (checkedCart[i]._id == cartInfo[index]._id) {
          checkedCart[i].count = cartInfo[index].count
        }
      }
    }
    this.setData({
      cartInfo: cartInfo,
      checkedCart: checkedCart
    })
    this.getSumPrice()
  },
  /**
   * 数量减少
   */
  numSub(e){
    const index = e.target.dataset.index
    const cartInfo = this.data.cartInfo
    let checkedCart = this.data.checkedCart
    //console.log(cartInfo[index].count)
    if (cartInfo[index].count > 1)
      cartInfo[index].count -= 1
      if (cartInfo[index].selected == true) {
        for (let i = 0; i < checkedCart.length; i++) {
          if (checkedCart[i]._id == cartInfo[index]._id) {
            checkedCart[i].count = cartInfo[index].count
          }
        }
    }
    this.setData({
      cartInfo: cartInfo,
      checkedCart: checkedCart
    })
    this.getSumPrice()
  },
  /**
   * 购物车单选
   */
  singleSelected(e){
    //console.log(e)
    const index = e.target.dataset.index
    const cartInfo = this.data.cartInfo
    const checkedCart = this.data.checkedCart
    let selected = cartInfo[index].selected
    //console.log(selected)
    cartInfo[index].selected = !selected
    //判断当前选中状态
    if (!selected){
      checkedCart.push(cartInfo[index])
    }
    else{
      for (let i = 0; i < checkedCart.length; i++){
        if (checkedCart[i]._id == cartInfo[index]._id){
          checkedCart.splice(i,1)
        }
      }
    }
    //判断是否全选
    if (checkedCart.length == cartInfo.length){
      this.setData({
        checkedAll: true
      })
    }
    else{
      this.setData({
        checkedAll: false
      })
    }
    //console.log(checkedCart)
    // 计算总价
    this.getSumPrice()
  },
  /**
   * 全选
   */
  allSelected(){
    let cartInfo = this.data.cartInfo
    let checkedAll = this.data.checkedAll
    let checkedCart = this.data.checkedCart
    checkedAll = !checkedAll
    if (checkedAll){
      checkedCart = cartInfo
      for (let i = 0; i < cartInfo.length; i++) {
        cartInfo[i].selected = true
      }
    }
    else{
      checkedCart =[]
      for (let i = 0; i < cartInfo.length; i++) {
        cartInfo[i].selected = false
      }
    }
    this.setData({
      checkedCart: checkedCart,
      checkedAll: checkedAll,
      cartInfo: cartInfo
    })
    this.getSumPrice()
  },
  /**
   * 转至删除模式
   */
  turnToDelete(){
    let isdelete = this.data.isDelete
    isdelete = !isdelete
    if (isdelete == true){
      this.setData({
        isDelete: isdelete
      })
    }
  },
  /**
   * 转回结算页面
   */
  turnToMain(){
    let isdelete = this.data.isDelete
    isdelete = !isdelete
    if (isdelete == false) {
      this.setData({
        isDelete: isdelete
      })
    }
  },
  /**
   * 删除购物车内容
   */
  cartDelete(){
    let checkedCart = this.data.checkedCart
    let cartInfo = this.data.cartInfo
    const isDelete = this.data.isDelete
    for (let i = 0; i < checkedCart.length; i++) {
      for (let j = 0; j < cartInfo.length; j++) {
        if (cartInfo[j]._id == checkedCart[i]._id) {
          cartInfo.splice(j, 1)
          console.log(cartInfo)
        }
      }
      db.collection('cart').where({
        _openid: app.globalData.userInfo.openid,
        num_id: checkedCart[i].num_id
      }).remove()
    }
    wx.showToast({
      title: '删除成功',
      duration: 2000
    })
    this.setData({
      checkedCart: [],
      cartNum: 0,
      totalPrice: 0,
      cartInfo
    })
  },
  /**
   * 跳转至结算
   */
  turnToPaying(){
    const selectedCart = this.data.checkedCart
    let isPay = true
    for (let i = 0; i < selectedCart.length; i++){
      if (selectedCart[i].count > selectedCart[i].stock){
        isPay = false
      }
    }
    if (isPay){
      const waitPaying = JSON.stringify(selectedCart)
      wx.navigateTo({
        url: '/pages/paying/paying?waitPaying=' + waitPaying,
      })
    }else{
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //数据库操作
  /**
   * 获取购物车数据
   */
  getCart(){
    db.collection('cart').get({
      success: (res) =>{
        this.setData({
          cartInfo: res.data,
        })
      }
    })
  },
  /**
   * 同步购物车信息
   */
  updateSynCart(){
    const cartInfo = this.data.cartInfo
    for (let i = 0; i < cartInfo.length ; i++){
      db.collection('cart').where({
        _openid: app.globalData.userInfo.openid,
        num_id: cartInfo[i].num_id
      }).update({
        data:{
          count: cartInfo[i].count
        }
      }).then(res =>{
        //console.log(res)
      })
    }
  },
  //其他
  /**
   * 获取总价
   */
  getSumPrice(){
    const checkedCart = this.data.checkedCart 
    let sum = 0
    let num = 0  
    for (let i = 0; i < checkedCart.length; i++) {
      sum = sum + checkedCart[i].price * checkedCart[i].count
      num = num + checkedCart[i].count
    }
    this.setData({
      totalPrice: sum,
      cartNum: num
    })
  },
  
})