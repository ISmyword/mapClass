//index.js
//获取应用实例
const app = getApp();
const mapInfo = require('../../data/map.js');
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,//顶部适配
    mapHeight: (app.globalData.windowHeigth - app.globalData.statusBarHeight) * 0.6,
    planHeight: (app.globalData.windowHeigth - app.globalData.statusBarHeight) * 0.4,
    scrollHeight: (app.globalData.windowHeigth - app.globalData.statusBarHeight) * 0.4 - 95,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    aroundList: mapInfo.aroundList,
    latitude:'',
    longitude:'',
    mapList: mapInfo.mapList,
    markers:'',
    points: '',
    tips:'',
    isShowPanel1: true,
    isShowPanel2: false,
    isShowPanel3: false,
    keywords:'',
  },
  //事件处理函数
  bindViewTap: function() {

  },
  getType(e) {//获取选择的附近关键词，同时更新状态
    var that = this;
    // that.setData({ status: e.currentTarget.dataset.type })
    // that.getMapList(e.currentTarget.dataset.type);
    wx.navigateTo({
      url: '../map/map?type=' + e.currentTarget.dataset.type + '&name=' + e.currentTarget.dataset.keywords,
    })

  },
  getMapList(type){
    var that=this;
    var mapList = that.data.mapList, markers=[];
    for (var i = 0; i < mapList.length; i++) {
      if (mapList[i].type == type){
        markers.push(mapList[i]);
      }
    }
    that.setData({
      markers: markers,
      points: markers,
    })
  },
  navigate(event) {
    var that = this;
    ////使用微信内置地图查看标记点位置，并进行导航
    wx.openLocation({
      // latitude: this.data.mapInfo.x,//要去的纬度-地址
      // longitude: this.data.mapInfo.y,//要去的经度-地址
      name: that.data.mapList[event.currentTarget.dataset.index].name,
      address: that.data.mapList[event.currentTarget.dataset.index].address,
      latitude: that.data.mapList[event.currentTarget.dataset.index].latitude,//要去的纬度-地址
      longitude: that.data.mapList[event.currentTarget.dataset.index].longitude,//要去的经度-地址
    })
  },
  // navigation: function (event) {
  //   var that=this;
  //   wx.navigateTo({
  //     url: '../map/map'
  //   })
  // },
  makePhoneCall: function (event) {
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone
    })

  },
  //搜索
  // bindInput: function (e) {
  //   var that = this;
  //   var url = '../inputtips/input';
  //   if (e.target.dataset.latitude && e.target.dataset.longitude && e.target.dataset.city) {
  //     var dataset = e.target.dataset;
  //     url = url + '?lonlat=' + dataset.longitude + ',' + dataset.latitude + '&city=' + dataset.city;
  //   }
  //   wx.navigateTo({
  //     url: url
  //   })
  // },
  bindInput: function (e) {
    var that = this;
    var keywords = e.detail.value;

    var mapList = that.data.mapList, tips = [];
    for (var i = 0; i < mapList.length; i++) {
      var str = mapList[i].name;
      if (str.indexOf(keywords) != -1) {
        tips.push(mapList[i]);
      }
    }


    that.setData({
      tips: tips,
      isShowPanel1 :false,
      isShowPanel2: true,
      isShowPanel3: false,
      points: tips,
    })
    console.log(tips);
  },
  navigate(event) {
    var that = this;
    ////使用微信内置地图查看标记点位置，并进行导航
    var i = event.currentTarget.dataset.index;
    wx.openLocation({
      name: that.data.mapList[i].name,
      address: that.data.mapList[i].address,
      latitude: that.data.mapList[i].latitude,//要去的纬度-地址
      longitude: that.data.mapList[i].longitude,//要去的经度-地址
    })
  },
  onClickBack2: function(){
    var that=this;
    that.setData({
      isShowPanel1: true,
      isShowPanel2: false,
      isShowPanel3: false,
      keywords:'',
    })
  },
  onClickSearch: function(){
    var that = this;
    debugger
    that.setData({
      isShowPanel1: false,
      isShowPanel2: false,
      isShowPanel3: true,
    })
  },
  onLoad: function () {
    var that=this;
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    // console.log(mapInfo);
    // this.loadGyms(); //健身房信息
    that.findXy(mapInfo.mapList); //查询用户与商家的距离
    var mapList=[];
    for(var i=0;i<10;i++){
      mapList.push(that.data.mapList[i])
    }
    this.setData({
      markers: mapList,
      points: mapList,
    })

    },
    loadGyms: function () {
      var that = this;
      // wx.showLoading({
      //   title: '玩命加载...',
      // });
      /**
       *jwxa.get(url, data, success, fail, dateType)
      *url    String        请求服务器接口地址
      *data    Object        请求的参数
      *success    Function        接口调用成功回调函数
      *fail    Function        接口调用失败回调函数
      *dateType    String        返回数据类型，默认为json
      */
      //获取健身房列表
      var data = {};

    },
  findXy(mapList) { //获取用户的经纬度
      var that = this;
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          console.log("您位置的经度：" + res.longitude);
          console.log("您位置的维度：" + res.latitude);
          for (var i = 0; i < mapList.length; i++) {

            var km = that.getDistance(res.latitude, res.longitude, mapList[i].latitude, mapList[i].longitude);
            mapList[i].km = km;
          }
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            mapList: mapList,
          })
        }
      })
    },
    Rad: function (d) { //根据经纬度判断距离
      return d * Math.PI / 180.0;
    },
    /**
     * lat1用户的纬度,lng1用户的经度,lat2商家的纬度，lng2商家的经度
     */
    getDistance: function (lat1, lng1, lat2, lng2) {
      var radLat1 = this.Rad(lat1);
      var radLat2 = this.Rad(lat2);
      var a = radLat1 - radLat2;
      var b = this.Rad(lng1) - this.Rad(lng2);
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;
      s = Math.round(s * 10000) / 10000;
      s = s.toFixed(2); //保留两位小数
      console.log('经纬度计算的距离:' + s)
      return s
    },
    getUserInfo: function(e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    },
    goToManEn: function(){
      wx.navigateToMiniProgram({
        appId: 'wx1f64860225319d0d',//要打开的小程序 appId
        path: 'page/index/index',//打开的页面路径，如果为空则打开首页
        extraData: {
          foo: 'back'//需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据
        },
        envVersion: 'trial',//要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
        success(res) {
          // 打开成功
        }
      })
    }

})
