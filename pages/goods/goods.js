// pages/goods/goods.js
const app = getApp();

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:[],
    catedetail:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取上个页面传来的参数
    this.setData({
      category: JSON.parse(options.catename)
    })
    //console.log(this.data.category)
    //查询商品详情
    if (this.data.category.category == "cat" || this.data.category.category == "dog"){
      this.getPetdetail(this.data.category.category_title)
    }
    else{
      this.getTooldetail(this.data.category.num_id)
    }

  },
  skinTogooddet: function (e) {
    //console.log(e)
    var catedet = JSON.stringify(e.currentTarget.dataset.detcontent)
    wx.navigateTo({
      url: '/pages/gooddetail/gooddetail?catedet=' + catedet,
    })
  },
  /**
   * 查询该类宠物中的所有数据
   */
  getPetdetail(catename){
    // console.log(catename)
    db.collection('pet').where({
      category_title: catename
    }).get({
      success: (res) =>{
        // console.log(res.data)
        this.setData({
          catedetail: res.data
        })
      }
    })
  },

  /**
   * 查询该类用品中的所有数据
   */
  getTooldetail(num_id) {
    // console.log(catename)
    db.collection('articles').where({
      category: num_id
    }).get({
      success: (res) => {
        //console.log(res.data)
        this.setData({
          catedetail: res.data
        })
      }
    })
  }
})