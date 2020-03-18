// 云函数入口文件
const cloud = require('wx-server-sdk')
//初始化云环境
cloud.init()

// 云函数入口函数
exports.main = (event) => {
  //获取用户的所有信息
  const wxInfo = cloud.getWXContext()

  return {
    wxInfo
  }
}