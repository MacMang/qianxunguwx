import {baseURL,findMusic} from '../../apis/index'
import regeneratorRuntime from '../../utils/runtime'
import {formatTime,getWeek,wxRequest} from '../../utils/util'
import  * as watch from '../../utils/watch'
// pages/music/music.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseURL:baseURL,
    musics: [],
    baseURL:baseURL,
    style: '',
    musicTitle:'',
    backgroundColors: ['187,255,255,0.3','255,255,240,0.3','233,150,122,0.3','191,239,255,0.3','155,48,255,0.3','193,205,205,0.3','255,255,224,0.3'],
    musicInfo:{},
    isHideMusicList:true,
    musicListStyle:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    watch.setWatcher(this);

    var rs = await wxRequest(findMusic);
    console.log("我先触发",rs);
    /** 
     * 设置默认的播放背景图,是获取到的数组的第一张
     * */ 
    var style = `background:url(${baseURL}${rs.data[0].icon}) no-repeat center;background-size:auto 100%;background-position-x:-60px;height:100%`
    this.setData({
      musics:rs.data,
      musicInfo:rs.data[0],
      style:style,
      musicTitle:rs.data[0].name
    })
    // this.startPlay();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  watch:{
    musicInfo:{
      handler(newValue) {
        console.log("新的值",newValue);
        var _this = this;
        setTimeout(function(){
          _this.startPlay();
        },0)
      },
      deep:true
    },
  },
  startPlay(){
    var musicInfo = this.data.musicInfo;
    console.log("开始播放",musicInfo);
    if(musicInfo.name){
      const backgroundAudioManager = wx.getBackgroundAudioManager()
      backgroundAudioManager.title = musicInfo.name
      backgroundAudioManager.epname = musicInfo.name
      backgroundAudioManager.coverImgUrl = baseURL+musicInfo.icon;
      // 设置了 src 之后会自动播放
      backgroundAudioManager.src = baseURL+musicInfo.xm4aPath;

    }
  },
  closePlayView(){
    wx.navigateBack({
      delta: 1
    })
  },
  stop(){
    wx.pauseBackgroundAudio()
  },
  changeMusic(ev){
    console.log(ev);
    var musics = this.data.musics;
    this.setData({
        musicTitle:musics[ev.detail.current].name,
        musicInfo: musics[ev.detail.current]
    })
  },
  showMusicList(){
    this.setData({
      musicListStyle: 'musicList-transition musicList-show',
    })
  },
  closeMusiceList(){
    this.setData({
      musicListStyle: 'musicList-transition'
    })
  },
  transitionEnd(){

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