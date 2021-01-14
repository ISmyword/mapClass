var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
const app = getApp();
const mapInfo = require('../../data/map.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,//顶部适配
    mapHeight: (app.globalData.windowHeigth - app.globalData.statusBarHeight) * 0.6,
    planHeight: (app.globalData.windowHeigth - app.globalData.statusBarHeight) * 0.4,

    // planHeight: app.globalData.windowHeigth -app.globalData.statusBarHeight- 810,
    scrollHeight: (app.globalData.windowHeigth - app.globalData.statusBarHeight) * 0.4 - 175,
    scrollTop: 0,
    title: '',
    mapList: mapInfo.mapList,
    //设置标记点
    markers: '',
    points: '',
    //当前定位位置
    latitude: 36.08732,
    longitude: 120.38183,
    city: '',
    keywords: '',
    textData: {},
    markerIndex: 0,
    markersData:'',
    isJump: false,
  },
  makePhoneCall: function (event) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    if (options && options.type){
      that.getAround(options.type);
    }
    if (options.isManEn && options.isManEn==1){
      that.setData({
        isJump: true,
      })
    }
    //获取当前位置
    wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          console.log(res)
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            title: options.name
          })
        }
      })
  },
  getType(e) {//获取选择的附近关键词，同时更新状态
    this.setData({ status: e.currentTarget.dataset.id })
    this.getAround(e.currentTarget.dataset.keywords);
  },
  bindInput: function (e) {
    var that = this;
    var url = '../inputtips/input';
    if (e.target.dataset.latitude && e.target.dataset.longitude && e.target.dataset.city) {
      var dataset = e.target.dataset;
      url = url + '?lonlat=' + dataset.longitude + ',' + dataset.latitude + '&city=' + dataset.city;
    }
    wx.navigateTo({
      url: url
    })
  },
  getAround(type) {//通过关键词获取附近的点
    var that = this;
    var mapList = that.data.mapList, markers = [];
    for (var i = 0; i < mapList.length; i++) {
      if (mapList[i].type == type) {
        markers.push(mapList[i]);
      }
    }
    if (markers.length>0){
      markers[0].iconPath = "../../images/addssselect.png";
      markers[0].ischecked = true;
    }
    var mapListf = markers.concat();
    that.setData({
      markersData: markers,
      markers: markers,
      points: markers,
      textData: markers[0],
    })

  },
  makertap: function (e) {
    var id = e.markerId;
    var that = this;
    that.showMarkerInfo(that.data.markersData, id);
    that.changeMarkerColor(that.data.markersData, id);
  },
  showMarkerInfo: function (data, id) {
    var that = this, markers={};
    for (var i = 0; i < data.length;i++){
      if (data[i].id == id){
        that.setData({
          textData: {
            id: data[i].id,
            name: data[i].name,
            desc: data[i].address,
            phone: data[i].phone,
            address: data[i].address,
            latitude: data[i].latitude,
            longitude: data[i].longitude,
            contacts: data[i].contacts,
            remake: data[i].remake,
            businessHours: data[i].businessHours,
          }
        });
      }
    }
    
  },
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (data[j].id == i) {
        data[j].iconPath = "../../images/addssselect.png";
        data[j].ischecked = true;
      } else {
        data[j].iconPath = "../../images/addss.png";
        data[j].ischecked= false;
      }
      markers.push({
        id: data[j].id,
        name: data[j].name,
        phone: data[j].phone,
        address: data[j].address,
        latitude: data[j].latitude,
        longitude: data[j].longitude,
        iconPath: data[j].iconPath,
        ischecked: data[j].ischecked,
        contacts: data[j].contacts,
        remake: data[j].remake,
        businessHours: data[j].businessHours,
        width: 32,
        height: 32,
      })
    }

    that.setData({
      markers: markers,
      markerIndex: i,
    });
  },
  onPullDownRefresh: function (e) { //下拉刷新
    var that=this;
    that.setData({
      planHeight: app.globalData.windowHeigth - 200
    })
  },
  onReachBottom: function () { //上拉加载
  },

  bindSearch: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var url = '../place/place?mapInfo=' + JSON.stringify(that.data.markers[index]);
    wx.navigateTo({
      url: url,
      success() {
      }
    })
  },
  bindSearchFirst: function (e) {
    var that = this;
    var url = '../place/place?mapInfo=' + JSON.stringify(that.data.textData);
    wx.navigateTo({
      url: url,
      success() {
      }
    })
  },
  //返回主页
  bindBackIndex: function () {
    var that = this;
    if (!that.data.isJump) {
      wx.navigateTo({
        url: '../index/index'
      })
    } else {
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