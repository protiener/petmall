// pages/gooddetail/gooddetail.js

const app = getApp()

const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsdetail:[],
    cartInfo:[],
    cartisexist: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取上个页面传来的参数
    this.setData({
      goodsdetail: JSON.parse(options.catedet)
    })
  },
  addTocart: function(){
    const goodsdetail = this.data.goodsdetail
    this.findCart(this.data.goodsdetail._id)

    wx.showModal({
      title: '是否加入购物车？',
      success: (res) => {
        if (res.confirm) {
          // console.log('用户点击确定')
          const cartInfo = this.data.cartInfo
          if (this.data.cartisexist){
            db.collection('cart').where({
              _openid: app.globalData.userInfo.openid,
              num_id: goodsdetail._id
            }).update({
              data:{
                count: cartInfo.count + 1
              }
            }).then(res => {
              console.log(res)
              wx.showToast({
                title: '成功加入购物车',
                duration: 2000
              })
            }).catch(err => {
              console.log(err)
            })
          }
          else{
            db.collection('cart').add({
              data: {
                num_id: goodsdetail._id,
                count: 1,
                type: goodsdetail.articles_type,
                price: goodsdetail.price,
                image: goodsdetail.image,
                name: goodsdetail.articles_type == "tool" ? goodsdetail.title : goodsdetail.category_title,
                stock: goodsdetail.articles_type == "tool" ? goodsdetail.stock : 1,
                selected: false
              },
              success: (res) => {
                wx.showToast({
                  title: '成功加入购物车',
                  duration: 2000
                })
              }
            })
          }
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  findCart(goodsid){
    db.collection('cart').where({
      num_id: goodsid
    }).get({
      success:(res) =>{
        //console.log(res.data)
        if (res.data.length > 0){
          //console.log(res.data[0])
          this.setData({
            cartInfo:res.data[0],
            cartisexist: true
          })
        }
        else{
          this.setData({
            cartisexist: false
          })
        }
      }
    })
  }
})