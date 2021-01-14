var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
const mapInfo = require('../../data/map.js');
const app = getApp();
var lonlat;
var city;
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,//顶部适配
    mapList: mapInfo.mapList,
    tips: {},
    historyData:[],
  },
  onLoad: function(e){
    var that=this;
    lonlat = e.lonlat;
    city = e.city;
    wx.getStorage({
      key: 'historyData',
      success(res) {
        if (res.data) {
          that.setData({
            historyData: res.data.reverse(),
            tips: res.data.reverse(),
          })
        }
      },
    })
  },
  bindInput: function(e){
    var that = this;
    var keywords = e.detail.value; 
    // var key = config.Config.key;
    // var myAmapFun = new amapFile.AMapWX({key: key});
    // myAmapFun.getInputtips({
    //   keywords: keywords,
    //   location: lonlat,
    //   city: city,
    //   success: function(data){
    //     if(data && data.tips){
    //       that.setData({
    //         tips: data.tips
    //       });
    //     }
    //   }
    // })

    var mapList = that.data.mapList, tips = [];
    for (var i = 0; i < mapList.length; i++) {
      var str = mapList[i].name;
      if (str.indexOf(keywords)!=-1) {
        tips.push(mapList[i]);
      }
    }
    that.setData({
      tips: tips,
      // points: markers,
    })
  },
  bindSearch: function(e){
    var that=this;
    var index = e.target.dataset.index;
    var url = '../place/place?mapInfo=' + JSON.stringify(that.data.tips[index]);
    var historyData = that.data.historyData;
    wx.navigateTo({
      url: url,
      success(){
        if (historyData.length>0){
          var ishave=false;
          for (var i = 0; i < historyData.length; i++) {
            if (historyData[i].id == that.data.tips[index].id){
              ishave=true;
            }
          }
          if (!ishave){
            historyData.push(that.data.tips[index]);
          }
        }
        wx.setStorage({
          key: "historyData",
          data: historyData
        })
      }
    })
  },
  //返回主页
  bindBackIndex: function () {
    wx.navigateBack({
      delta: -1
    })
  },

})