// pages/category/category.js
//获取应用实例
const app = getApp()

//获取云数据库实例
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll_height: 0,
    category:[],
    catedetail:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //导航栏分类
    this.getCategory()
    //判断是否选择分类
    if(!this.catedetail){
      this.getCatedetail()
    }

  },
  onReady: function(){
    //适应屏幕高
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    this.setData({
      scroll_height: windowHeight
    })
  },
  //导航栏分类点击
  changeDetail: function(e){
    //console.log(e)
    this.getCatedetail(e.target.dataset.cateitem)
  },
  //
  skinTogoods: function (e) {
    //console.log(e)
    var catename = JSON.stringify(e.currentTarget.dataset.catename)
    wx.navigateTo({
      url: '/pages/goods/goods?catename=' + catename,
    })
  },


  //数据库查询
  /**
   * 大分类的查询
   */
  getCategory(){
    db.collection('category').get({
      success: (res) =>{
        // console.log(res.data)
        this.setData({
          category: res.data
        })
      }
    })
  },
  /**
   * 分类细节查询
   */
  getCatedetail(category){
    db.collection('pet_type').where({
      category: category
    }).limit(100).get({
      success: (res) =>{
        this.setData({
          catedetail:res.data
        })
      }
    })
  }
})