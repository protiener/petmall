// pages/home/home.js

//获取应用实例
const app = getApp()

//获取云数据库实例
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ad:[],
    tophotcat:[],
    tophotdog:[],
    tophottool:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperdata()
    this.getTopcat()
    this.getTopdog()
    this.getToptool()
  },

  skinTogoods: function(e){
    //console.log(e)
    var catename = JSON.stringify(e.currentTarget.dataset.catename)
    wx.navigateTo({
      url: '/pages/goods/goods?catename=' + catename,
    })
  },
  skinTogooddet: function(e){
    //console.log(e)
    var catedet = JSON.stringify(e.currentTarget.dataset.detcontent)
    wx.navigateTo({
      url: '/pages/gooddetail/gooddetail?catedet=' + catedet,
    })
  },




  //获取数据库中轮播图的数据
  getSwiperdata(){
    db.collection('ad').get({
      success: (res) => {
        this.setData({
          ad: res.data
        })
      }
    })
  },
  //获取点击量最多的4个品种
  getTopcat(){
    db.collection('pet_type').where({
      category: "cat"
    }).orderBy('count', 'desc').limit(4).get({
      success: (res) => {
        this.setData({
          tophotcat: res.data
        })
      }
    })
  },
  getTopdog() {
    db.collection('pet_type').where({
      category: "dog"
    }).orderBy('count', 'desc').limit(4).get({
      success: (res) => {
        this.setData({
          tophotdog: res.data
        })
      }
    })
  },
  //获取销量最多的六个用品
  getToptool(){
    db.collection('articles').orderBy('sale', 'desc').limit(6).get({
      success: (res) =>{
        this.setData({
          tophottool: res.data
        })
        // console.log(res.data)
      }
    })
  }
})