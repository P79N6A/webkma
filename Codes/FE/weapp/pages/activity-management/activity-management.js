import * as echarts from '../../components/ec-canvas/echarts';
let self;
const config = require('../../config.js'),
  utils = require('../../utils/util.js'),
  activityService = require('../../services/activity-service.js'),
  statisticsService = require('../../services/statistics-service.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spreadType:'scan_share',
    user_uuid:'',
    moduleId:'',
    activityInfo:{},
    dataList:[],
    canvas_share:{
      lazyLoad:true
    },
    aggregateData:{},
    nameMap:{
      'scan_share': '分享',
      'scan_visitor': '访客',
      'scan_access': '访问'
    },
    scan_share: {
      lazyLoad: true 
    },
    scan_visitor: {
      lazyLoad: true
    },
    scan_access: {
      lazyLoad: true
    },
    sliderLeft: 0,
    sliderWidth:0,
    sliderOffset: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self=this;
    self.data.user_uuid = getApp().globalData.userInfo.data[0].user_uuid;
    self.data.moduleId = options.id;
    // 获取活动基本信息；
    activityService.activityDetail({ id: self.data.moduleId},(err,res)=>{
      if (res.status==0){
        res.data.createTime = utils.dateString(res.data.createTime,'/');
        self.data.activityInfo = res.data;
        self.setData({
          activityInfo: self.data.activityInfo
        })
      }
    })

    //获取活动分享、访问、访客总数
    statisticsService.aggsTypeByBelongModule({ as_belong_module: [self.data.moduleId]}, (err, res) => {
      if (res.status==0){
        self.data.allCount = res.data.group[0];
        res.data.group[0].scan_access = utils.convertCount(res.data.group[0].scan_access);
        res.data.group[0].scan_share = utils.convertCount(res.data.group[0].scan_share);
        res.data.group[0].scan_visitor = utils.convertCount(res.data.group[0].scan_visitor);
        self.setData({
          allCount: self.data.allCount
        })
      }
    })
    //获取活动推广分享、访问、访客总数
    statisticsService.aggsTypeByBelongModule({ as_belong_module: [self.data.moduleId], as_belong_user: [self.data.user_uuid] }, (err, res) => {
      if (res.status == 0) { 
        self.data.spreadCount =res.data.group[0];
        res.data.group[0].scan_access = utils.convertCount(res.data.group[0].scan_access);
        res.data.group[0].scan_share = utils.convertCount(res.data.group[0].scan_share);
        res.data.group[0].scan_visitor = utils.convertCount(res.data.group[0].scan_visitor);
        self.setData({
          spreadCount: self.data.spreadCount
        })
      }
    })
    self.lineCanvas();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
        wx.createSelectorQuery().select('.pg-tab').boundingClientRect(function (rect) {
          wx.createSelectorQuery().select('.weui-navbar__slider').boundingClientRect(function (slider) {
            self.setData({
              sliderWidth: rect.width / 3
            });
          }).exec();
        }).exec();
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
    var self=this;
    let data = self.data.activityInfo;
    return {
      title: data.name,
      path:`/pages/index/index?target=`+ encodeURIComponent(`/pages/activity-detail/activity-detail?activityUrl=${data.url}&title=${data.name}&id=${data.relationId}&as_belong_user=${self.data.user_uuid}`),
      imageUrl: data.cover||null,
      success:function(e){
        activityService.analysisSave({ as_type: 'scan_share', as_belong_module: data.relationId, as_belong_user: self.data.user_uuid, as_belong_id: data.businessInfo.businessId }, function (err,res){
          console.log(res.message);
          if(res.status!=0){
            console.log(res.message);
          }
        })
      }
    }
  },
  previewActivity:function(){
    let detail = this.data.activityInfo;
    wx.navigateTo({
      url: `/pages/activity-detail/activity-detail?activityUrl=${detail.url}&title=${detail.name}&id=${detail.relationId}`,
    })
  },
  clickTab:function(e){
    self.setData({
      sliderOffset: e.currentTarget.offsetLeft
    });
    let dataset = e.currentTarget.dataset;
    let spreadType =self.data.spreadType = dataset.spreadtype;
    let data = self.data.aggregateData;
    self.setData({
      spreadType: spreadType
    });
    self.showChart({ name: self.data.nameMap[spreadType], dataList: data.dataList, series1: data.allCout[spreadType], series2: data.personCout[spreadType] });
  },
  //统计图绘制；
  lineCanvas:function(){
    //统计总数
   self.aggsTime().then((data)=>{
     
     self.setData({
       aggregateData:data,
     })
     self.showChart({ name: self.data.nameMap['scan_share'], dataList: data.dataList, series1: data.allCout.scan_share, series2: data.personCout.scan_share });
   });
    
  },
  showChart:function(data){
    wx.showLoading({
      title: '加载中...',
    })
    self.init_echarts(this.selectComponent("#canvas_share"), data);
  },
  aggsTime:function(){
    return Promise.all([
      new Promise((resolve, reject) => {
        statisticsService.aggsTime({
          as_belong_module: self.data.moduleId
        }, (err, res) => {
          if (res.status !== 0) { return reject(res.message) };
          var dataList = [];
          var allCout = {};
          res.data.group.forEach(gp=>{
            dataList = Object.keys(gp).filter(k => k != "count" && k != 'key').sort();
            allCout[gp['key']] = dataList.map(k => gp[k]);
          });
          resolve({ dataList: dataList, allCout: allCout });
        })
      }),
      new Promise((resolve, reject) => {
        statisticsService.aggsTime({
          as_belong_module: self.data.moduleId,
          as_belong_user: self.data.user_uuid
        }, (err, res) => {
          if (res.status !== 0) { return reject(res.message) }
          var personCout = {};
          res.data.group.forEach(gp => {
            let keys = Object.keys(gp).filter(k => k != "count" && k != 'key').sort();
            personCout[gp['key']] = keys.map(k => gp[k]);
          });
          resolve(personCout);
        })
      })
    ]) 
    .then((rets)=>{
      let data =rets[0];
      data.personCout = rets[1];
      return data;
    })
  },
  //初始化图表
  init_echarts:function (componnetEl,dataObj) {
    if (!!self.Chart){
      self.Chart.dispose();
      self.Chart=void 0;
    }
    setTimeout(()=>{
      componnetEl.init((canvas, width, height) => {
        // 初始化图表
        const Chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        Chart.on('finished', () => {
          wx.hideLoading();
          Chart.off('finished');
        });
        Chart.setOption(this.getOption(dataObj));
        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        self.Chart = Chart;
        return Chart;
      });
    },100);

  },
  getOption: function (dataObj) {
    var dateList=[];
    dataObj.dataList.forEach(dt=>{
      let dataSplit = dt.split('-');
      dateList.push(dataSplit[1] + '-' + dataSplit[2]);
    });
    var series = dataObj.series1.concat(dataObj.series1);
    var maxseriesItem=5;
    for (let i = 0; i < series.length;i++){
      maxseriesItem = maxseriesItem < series[i] ? series[i] : maxseriesItem;
    }
    var option = {
      title: {
        text: `${dataObj.name}趋势`,
        left: 'left',
        left:10,
        textStyle :{
          fontSize :14,
          fontWeight: "normal",
          color:"#3c4a55"
        }
      },
      color: ["#37A2DA", "#67E0E3"],
      legend: {
        data: [`${dataObj.name}总数`, '推广总数'],
        left: 'right',
        right:16,
        backgroundColor: 'none',
        z: 100
      },
      grid: {
        containLabel: true,
        top:36,
        left:10,
        right:16
      },
      xAxis: {
        position:'bottom',
        type: 'category',
        boundaryGap:false,
        data: dateList,
        axisTick:{
          interval:0
        },
        axisLabel:{
          fontSize :12,
          interval :0
        },
        max: 6
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'solid'
          },
          axisLabel:{
            fontSize: 10,
            interval: 0
          }
        },
        min:0,
        max:function(){
          for (let i = 0; i < 10; i++) {
            if ((maxseriesItem + i) % 5 == 0) {
              return maxseriesItem + i;
            }
          }
        }
      },
      series: [{
        name: `${dataObj.name}总数`,
        type: 'line',
        data: dataObj.series1 //.reverse()
      }, {
        name: '推广总数',
        type: 'line',
          data: dataObj.series2 //.reverse()
      }]
    };
    return option;
  }
})
  