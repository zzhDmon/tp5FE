//index.js
//获取应用实例
const app = getApp()
const baseUrl = 'http://minip.com/api/v1/'
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindGetToken(){
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: baseUrl + 'token/user',
            method: 'post',
            data: {
              code: res.code
            },
            success:function(res){
              console.log(res)
              wx.setStorageSync('token', res.data.token)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    
  },
  createOrder(){
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + 'order',
      method: 'post',
      header:{
        token:token
      },
      data: {
        products: [
          {product_id:1,count:1},
          {product_id:2,count:1},
        ]
      },
      success: function (res) {
        console.log(res)
        
      },
      fail:function(err){
        console.log('err'+err)
      }
    })
  },
  pay() {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + 'order',
      method: 'post',
      header: {
        token: token
      },
      data: {
        products: [
          { product_id: 1, count: 1 },
          { product_id: 2, count: 1 },
        ]
      },
      success: function (res) {
        console.log(res)
        wx.getStorageSync('order_id',res.data.order_id);
        that.getPreOrder(token,res.data.order_id)
      },
      fail: function (err) {
        console.log('err' + err)
      }
    })
  },
  getPreOrder(token,orderID){
    if(token){
      wx.request({
        url: baseUrl + 'pay/pre_order',
        method: 'post',
        header: {
          token: token
        },
        data: {
          id:orderID
        },
        success: function (res) {
          console.log(res.data)
          // var preData = res.data;
          // wx.requestPayment({
          //   timeStamp: preData.timeStamp.toString(),
          //   nonceStr: preData.nonceStr,
          //   package: preData.package,
          //   signType: preData.signType,
          //   paySign: preData.paySign,
          //   success:function(){

          //   }
          // })

        },
        fail: function (err) {
          console.log('err' + err)
        }
      })
    }
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
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
  },
  getUserInfo: function(e) {
    console.log(e)
    // app.globalData.userInfo = e.detail.userInfo
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })
  }
})
