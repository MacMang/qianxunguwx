import regeneratorRuntime from './runtime.js'

exports.formatTime = currentDate => {
  const date = new Date(currentDate)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

exports.getWeek = function(num){
     //获取当前日期的时间戳
     const currentDate = Date.now();
     //获取当前天所在的位置 
     const currentDay = new Date().getDay(); 
     var myNum = num?num*7:0;
     return Array.from(new Array(7)).map((item,i)=>{
       //   经历的天的毫秒数
       var ms = (i-currentDay+myNum)*1000*60*60*24;
       const date = new Date(currentDate+ms);
      //  return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
      return [date.getFullYear(),(date.getMonth()+1),date.getDate()].map(formatNumber).join('-');
     })
}

exports.wxRequest = async (url, params = {}) => {
  Object.assign(params, {
    token: wx.getStorageSync('token')
  })
  // 所有的请求，header默认携带token
  let header = params.header || {
    'Content-Type': 'application/json',
    'token': params.token || ''
  }
  let data = params.data || {}
  let method = params.method || 'GET'
  // hideLoading可以控制是否显示加载状态
  if (!params.hideLoading) {
   wx.showLoading({
     title: '加载中...',
   })
  }
  let res = await new Promise((resolve, reject) => {
    console.log("请求参数",data);
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        if (res && res.statusCode == 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      },
      complete: (e) => {
        wx.hideLoading()
      }
    })
  })
  return res
}