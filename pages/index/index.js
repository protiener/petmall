//index.js
//获取应用实例
const app = getApp()

//云数据库环境设置
const db = wx.cloud.database({
  env: 'petmall-g5tlq'
})

Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //food: {}
  },
  
  onLoad: function () {
    //判断当前是否已经登录
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
      this.setTimetopages('../../pages/home/home')
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //云数据库查询
    // DB.collection('food').doc('MS81UJn9wT8rXT485fwgkrHXD3yMWihw9Bt6Z1cIYComKRFi').get({
    //   success: res => {
    //     //console.log(res.data)
    //     this.setData({
    //       food: res.data
    //     })
    //   }
    // })
  },
  //获取用户信息
  getUserInfo: function(e) {
    //调用原函数获取用户的openid
    wx.cloud.callFunction({
      name:'login',
      success: res => {
        //console.log(res.result.wxInfo)
        //将当前用户的信息整合 存储在userInfo中
        e.detail.userInfo.openid = res.result.wxInfo.OPENID
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        //将用户信息存在本地
        wx.setStorageSync('userInfo', e.detail.userInfo)
        //跳转至首页
        this.setTimetopages('../../pages/home/home')
      }
    })
  },

//定时2跳转页面
  setTimetopages:(pagesurl) => {
    setTimeout(function () {
      if (app.globalData.userInfo) {
        wx.switchTab({
          url: pagesurl,
        })
      }
    }, 2000);
  }
})
