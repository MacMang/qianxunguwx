import {baseURL,musicURL} from '../../apis/index'
// pages/music/music.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musics: [],
    baseURL:baseURL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(_this);
    wx.request({
      url: musicURL,
      header: {
        'Content-Type': 'application/json'
      },
      data:{
        pageSize: 10,
        pageNo:1
      },
      success: function(res) {
          console.log("获取到的音乐",res);
          _this.setData({
            musics: res.data.data
          })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  play(){
    console.log("播放");
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})