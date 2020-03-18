//app.js
App({
  onLaunch: function () {
    //初始化云开发环境 小程序端
    wx.cloud.init()
    
    //查询本地存储用户信息
    const userInfo = wx.getStorageSync('userInfo')
    //console.log(userInfo)
    if(userInfo){
      this.globalData.userInfo = userInfo
      //console.log(this.globalData.userInfo)
    }

  },
  globalData: {
    userInfo: null
  }
})