// pages/orderdetail/orderdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thisorder: {},
    state: ['待支付', '待发货', '待收货', '退款售后']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取上个页面传来的参数
    this.setData({
      thisorder: JSON.parse(options.thisorder),
    })
  },
  
})