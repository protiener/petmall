// pages/address/address.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function (){
    this.getAddress()
  },
  /**
   * 新增地址
   */
  addNewAddress(){
    wx.navigateTo({
      url: '/pages/uptoaddress/uptoaddress?thisAd=' + '',
    })
  },
  /**
   * 获取地址
   */
  getAddress(){
    const userInfo = app.globalData.userInfo
    db.collection('address').where({
      _openid: userInfo.openid
    }).get({
      success: (res) =>{
        this.setData({
          address: res.data
        })
      }
    })
  },
  /**
   * 修改地址
   */
  updateAddress(e){
    // console.log(e)
    const index = e.currentTarget.dataset.index
    const adInfo = this.data.address
    const thisAd = JSON.stringify(adInfo[index])
    console.log(thisAd)

    wx.navigateTo({
      url: '/pages/uptoaddress/uptoaddress?thisAd=' + thisAd,
    })
  },
  /**
   * 删除地址
   */
  deleteAddress(e){
    const index = e.currentTarget.dataset.index
    const adInfo = this.data.address
    var that = this;
    wx.showModal({
      title: '系统提醒',
      content: '确定要删除此地址吗？',
      success: function (res) {
        if (res.confirm) {
          db.collection('address').where({
            _openid: adInfo[index]._openid,
            _id: adInfo[index]._id
          }).remove()
          adInfo.splice(index, 1);
        }
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          address: adInfo
        })
      }    
    })
  }
})