// pages/community/community.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    essay:[],
    commentCt:'',
    user: app.globalData.userInfo
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getEssay()
  },
 
  /**
   * 发布消息
   */
  turnToUp: function(){
    wx.navigateTo({
      url: '/pages/uptocommunity/uptocommunity',
    })
  },
  /**
   * 获取文章数据
   */
  getEssay(){
    let that = this
    db.collection('essay').get({
      success: (res) => {
        that.setData({
          essay: res.data
        })
        that.findLike()
      }
    })
  },
  /**
   * 预览图片
   */
  previewImage(e){
    //console.log(e)
    const index = e.currentTarget.dataset.index
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.essay[index].image
    })
  },
  /**
   * 获取评论内容
   */
  getComment(e) {
    this.setData({
      commentCt: e.detail.value
    })
  },
  /**
   * 添加评论
   */
  addComment(e){
    const index = e.currentTarget.dataset.index
    let essays = this.data.essay
    const content = { user: this.data.user, content: this.data.commentCt}
    
    if (this.data.commentCt != ''){
      essays[index].comment.push(content)
      this.setData({
        commentCt: '',
        essay: essays
      })

      db.collection('essay').where({
        _id: essays[index]._id,
        _openid: app.globalData.userInfo.openid
      }).update({
        data: {
          comment: essays[index].comment
        }
      })
    }else{
      wx.showToast({
        title: '评论不能为空',
        icon: 'none',
        duration: 1000
      })
    }

  }
})