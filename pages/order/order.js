// pages/order/order.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navType: ['nav-item', 'nav-item', 'nav-item', 'nav-item', 'nav-item'],
    navName: ['全部', '待支付', '待发货', '待收货','退款/售后'],
    order:[],
    selectOrder:[],
    state: 0
  },
  onLoad: function(options){
    // console.log(options)
    this.setData({
      state: options.state
    })
    this.getOrder()
  },
  /**
   * 导航选项
   */
  selectNav(e){
    const index = e.currentTarget.dataset.index
    const nav = this.data.navType
    for (let i = 0; i < nav.length; i++){
      if(i == index){
        nav[i] = 'nav-select'
      }
      else{
        nav[i] = 'nav-item'
      }
    }
    const order = this.data.order
    let selectOrder = []
    for (let i = 0; i < order.length; i++){
      if(index == 0){
        selectOrder = order
      }
      else if (order[i].station == index-1){
        selectOrder.push(order[i])
      }
    }
    this.setData({
      selectOrder: selectOrder,
      navType: nav,
      state: index
    })
  },
  /**
   * 查看详情
   */
  turnTodetail(e) {
    const index = e.currentTarget.dataset.index
    const order =this.data.selectOrder
    const thisorder = JSON.stringify(order[index])
    // console.log(index)
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?thisorder=' + thisorder,
    })
  },
  /**
   * 获取订单
   */
  getOrder(){
    db.collection('order').get({
      success: (res) => {
        const state = this.data.state
        const nav = this.data.navType
        for (let i = 0; i < nav.length; i++) {
          if (i == state) {
            nav[i] = 'nav-select'
          }
          else {
            nav[i] = 'nav-item'
          }
        }
        const order = res.data
        let selectOrder = []
        for (let i = 0; i < order.length; i++) {
          if (state == 0) {
            selectOrder = order
          }
          else if (order[i].station == state - 1) {
            selectOrder.push(order[i])
          }
        }
        this.setData({
          order: res.data,
          selectOrder: selectOrder,
          navType: nav,
          state: state
        })
      }
    })
  }
})