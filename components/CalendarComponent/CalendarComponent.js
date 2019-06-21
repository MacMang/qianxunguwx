import regeneratorRuntime from '../../utils/runtime'
import {dailyBGURL,baseURL} from '../../apis/index'
import {formatTime,getWeek,wxRequest} from '../../utils/util'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDesc:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeStyle:"",
    baseURL: baseURL,
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 500,
    current:0,
    activeDescView: "",//文字视图的样式
    activeTopBar:"",
    actvieDailyList:"",
    activeSwiper:"",
    weeks: [],
    weekDays:["S","M","T","W","T","F","S"],
    currentWeek:0,
    weekDaysImgUrls: []
  },
  lifetimes:{
    async attached(){
      const _this = this;
      var rs = getWeek(0);
      // weeks.unshift(rs);
      var arr = this.data.weeks;
      arr.unshift(rs);
      arr.unshift(getWeek(-1))
      this.setData({
        weeks: arr,
        currentWeek:arr.length-1
      })
      var params = {
        data:{
          from:rs[0],
          to: rs[rs.length-1]
        }
      }
      var rs = await wxRequest(dailyBGURL,params).then((resp)=>{
        return resp.data;
      })
      var weekDaysImgUrls = this.data.weekDaysImgUrls;
      weekDaysImgUrls[0] = rs;
      this.setData({
        imgUrls:weekDaysImgUrls[0],
        weekDaysImgUrls:weekDaysImgUrls
      })
      setTimeout(function(){
        _this.setData({
          activeStyle: "opacity:1",
          activeDescView:"descriptionView-transition descriptionView-show",
          current:_this.data.imgUrls.length-1
        })
      },3000)
    }
  },
  observers:{
    activeStyle(newValue,oldValue){
      var _this = this;
      if(newValue=="opacity:1"){
          setTimeout(function(){
            //  通知MASK视图可以渲染了
            _this.triggerEvent("showMaskView");
            _this.setData({
              activeDescView:"descriptionView-transition"
            })
          },2000)
      }
    },
    showDesc(newValue){
        if(newValue){
          this.setData({
            activeDescView:"descriptionView-transition descriptionView-show",
            activeTopBar: "topBar-transition topBar-show "
          })
        }else{
          this.setData({
            activeDescView:"descriptionView-transition",
            activeTopBar:"topBar-transition"
          })
        }
       
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    transitionend(){
    
    },
   
    // 点击x的时候回maskView中
    closeCalendar(){
      this.triggerEvent("showMaskView");
      this.setData({
        showDesc:false
      })
    },
    // 显示头部的日期列表
    /**
     * 从上往下滑动,图片也跟着滑动
     */
    showDaliyList(){
        this.setData({
          actvieDailyList:"dailyList-transition daily-show",
          activeSwiper:"swiper-transition swiper-translate"
        })
    },
    async swiperTransition(ev){
      var weeks = this.data.weeks;
      var weekDaysImgUrls = this.data.weekDaysImgUrls;
      var imgUrls = this.data.imgUrls;
      
      if(ev.detail.source==""){
        var params = {
          data: {
            from:weeks[1][0],
            to:weeks[1][6]
          }
        }
        var preWeek = await wxRequest(dailyBGURL,params).then((resp)=>{
          return resp.data;
        })
        // 获取该周没有图片的日期长度
        var length = 7-preWeek.length;
        var arr = new Array(length).map(function(_,index){
          return index;
        })
        preWeek = [...arr,...preWeek];
        weekDaysImgUrls.unshift(preWeek);
        imgUrls = weekDaysImgUrls[0]
        this.setData({
          weekDaysImgUrls:weekDaysImgUrls,
          imgUrls:imgUrls
        })
      }
      if(ev.detail.current!=0){
        imgUrls = weekDaysImgUrls[ev.detail.current-1];
        this.setData({
          imgUrls:imgUrls,
          current:6
        })
        return;
      }
      /**
       * 滑动的时候如果current不等于0,则需要再次发起请求,将请求到的数据放入到
       * weekDaysImgUrls数组中,在视图dailyList中的图片就从这里来
       *  */ 
      // 如果current等于0,再获取往前一周的时间getWeek
      // 由于ev.detail.current为0,
      var rs = getWeek(-weeks.length);
      weeks.unshift(rs);
      this.setData({
        weeks:weeks,
        currentWeek:ev.detail.current+1
      })
    },
    changeCurrentImg(ev){
      var index = ev.currentTarget.dataset.index;
      this.setData({
        current:index
      })
    },
    closeDailyList(){
      this.setData({
        actvieDailyList:"dailyList-transition",
        activeSwiper:"swiper-transition"
      })
    }
  }
})
