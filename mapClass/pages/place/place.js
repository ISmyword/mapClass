const app = getApp();
const mapInfos = require('../../data/map.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight ,//顶部适配
    mapHeight: (app.globalData.windowHeigth - app.globalData.statusBarHeight) * 0.6,
    planHeight: (app.globalData.windowHeigth - app.globalData.statusBarHeight) * 0.4,
    title:'',
    mapInfo:'',
    latitude:'',
    longitude:'',
    markers:'',
    isJump:false,
    classInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var mapList = [], mapInfo={};
    if (options.id){
      mapInfo = mapInfos.mapList[options.id];
      that.setData({
        isJump:true,
        classInfo: mapInfos.classList[options.classid],
      })
    }else{
      mapInfo = JSON.parse(options.mapInfo)
    }
    mapList.push(mapInfo);
    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          mapInfo: mapInfo,
          markers: mapList,
          points: mapList,
          title: mapInfo.name,
        })
      }
    })
  },
  makePhoneCall: function (event) {
    var that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.mapInfo.phone
    })
  },
  navigate(event) {
    var that = this;
    //使用微信内置地图查看标记点位置，并进行导航
    wx.openLocation({
      name: that.data.mapInfo.name,
      address: that.data.mapInfo.address,
      latitude: that.data.mapInfo.latitude,//要去的纬度-地址
      longitude: that.data.mapInfo.longitude,//要去的经度-地址
    })
  },
  //返回主页
  bindBackIndex: function () {
    var that=this;
    if (!that.data.isJump) {
      wx.navigateBack({
        delta: -1
      })
    }else{
      wx.navigateToMiniProgram({
        appId: 'wx1f64860225319d0d',//要打开的小程序 appId
        path: 'pages/SecondaryPage/SecondaryPage?id=87980',//打开的页面路径，如果为空则打开首页
        extraData: {
          foo: 'back'//需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据
        },
        envVersion: 'trial',//要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
        success(res) {
          // 打开成功
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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