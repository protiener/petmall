// pages/uptocommunity/uptocommunity.js
const db = wx.cloud.database()
const app = getApp()
const util = require('../../utils/utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:[],
    newImage:[],
    imagenum: 0,
    contentTitle:'',
    contentText: '',
    time:''
  },
/**
 * 获取输入标题及内容
 */
  getContentTitle(e){
    this.setData({
      contentTitle: e.detail.value
    })
  },
  getContentText(e) {
    this.setData({
      contentText: e.detail.value
    })
  },
/**
 * 上传图片
 */
  chooseImage(){
    var that = this
    let images = that.data.image
    wx.chooseImage({
      success: function(res) {
        // console.log(res)
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
        })
        const image = res.tempFilePaths
        if (images.length != 0)
        {
          for (let i = 0; i < image.length; i++){
            images.push(image[i])
          }
        }
        else{
          images = image
        }
        that.setData({
          image: images
        })
        that.uploadToCloud()
      },      
    })
  },

/**
 * 预览图片
 */
  previewImage(e){
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.newImage
    })
    //console.log(e)
  },
/**
 * 长按删除图片
 */
  deleteImage(e){
    var that = this;
    var images = that.data.newImage;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '系统提醒',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          images.splice(index, 1);
        }
        that.setData({
          newImage: images
        });
      }
    })
  },
/**
 * 将帖子存至数据库后返回上一页
 */
inputEssay(){
  let contentTitle = this.data.contentTitle
  let contentText = this.data.contentText
  let newImage = this.data.newImage
  var time = util.formatTime(new Date());
  this.setData({
    time: time
  }); 

  db.collection('essay').add({
    data: {
      title: contentTitle,
      content: contentText,
      comment: [],
      like: [],
      date: time,
      image: newImage,
      userinfo: app.globalData.userInfo
    },
    success: (res) => {
      wx.showToast({
        title: '发布成功',
        duration: 2000
      })
    }
  })
  wx.switchTab({
    url: '/pages/community/community',
  })
},
/**
 * 上传至云储存
 */
  uploadToCloud(){
    //console.log("aaaaa")
    let images = this.data.image
    let newImages = this.data.newImage

    for (let i = this.data.imagenum; i < images.length; i++){
      let imageurl = images[i].split("/")
      let name = imageurl[imageurl.length - 1];
      //console.log(imageurl)
      wx.cloud.uploadFile({
        cloudPath: 'image/'+name,     //自定义云存储路径
        filePath: images[i],
        success: (res) =>{
          newImages.push(res.fileID)
          this.setData({
            newImage: newImages
          })
        }
      })
      this.setData({
        imagenum: images.length
      })
    }
  }
})