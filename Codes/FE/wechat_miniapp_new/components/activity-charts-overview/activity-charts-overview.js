import * as echarts from '../../vendor/ec-canvas/echarts';

const
  activityService = require('../../services/activity-service.js'),
  statisticsService = require('../../services/statistics-service.js'),
  utils = require('../../utils/util.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tid: String,
    uid: String,
    articleSign: String 
  },

  /**
   * 组件的初始数据
   */
  data: {
    articleSign:'',
    canvas_share: {
      lazyLoad: true
    },
    user_uuid: null,
    dataList: [{
      key: "share",
      title: "分享数",
      bgColorCss: 'bg-blue',
      bgColor: "#3CA6F0",
      target: 0,
      spread: 0,
      rank: 0,
      trend: 0,
      _target: "",
      _spread: ""
    }, {
      key: "visitor",
      title: "访客数",
      bgColorCss: 'bg-orange',
      bgColor: "#FA7041",
      target: 0,
      spread: 0,
      rank: 0,
      trend: 0,
      _target: "",
      _spread: ""
    }, {
      key: "access",
      title: "访问数",
      bgColorCss: 'bg-purple',
      bgColor: "#B590F6",
      target: 0,
      spread: 0,
      rank: 0,
      trend: 0,
      _target: "",
      _spread: ""
    }],
    avgLifeTime: "", // 平均访问时长
    areaTopList: "" // 访问地区TOP排名
  },

  lifetimes: {
    ready() {
      let self = this;
      let user_uuid = getApp().globalData.userInfo ? getApp().globalData.userInfo.data[0].user_uuid : null;
      if (!self.properties.tid || (!self.properties.uid && !user_uuid)) return console.error("缺少参数");
      console.log("文章iiiid", self.data.articleSign)
      if (self.data.articleSign=='undefined'){
        Promise.all([
          new Promise((resolve, reject) => {
            //获取获取活动 - 统计目标
            activityService.activitySimple({
              id: self.properties.tid,
              userId: self.properties.uid || user_uuid
            }, (err, res) => {
              if (err) return reject(err);
              if (res.status != 0) return reject(res.message);
              resolve({
                target: {
                  share: res.data.target.share,
                  visitor: res.data.target.visitor,
                  access: res.data.target.access,
                },
                rank: {
                  share: res.data.rank.rankShare,
                  visitor: res.data.rank.rankVisitor,
                  access: res.data.rank.rankAccess,
                },
                trend: {
                  share: res.data.rank.trendShare,
                  visitor: res.data.rank.trendVisitor,
                  access: res.data.rank.trendAccess,
                }
              });
            })



          }),
          new Promise((resolve, reject) => {
            //获取获取活动 - 统计现状
            statisticsService.aggsTypeByBelongModule({
              as_belong_module: [self.properties.tid],
              as_belong_user: self.properties.uid || user_uuid
            }, (err, res) => {
              if (err) return reject(err);
              if (res.status != 0) return reject(res.message);
              resolve({
                share: res.data.group[0].scan_share,
                visitor: res.data.group[0].scan_visitor,
                access: res.data.group[0].scan_access,
                avgLifeTime: res.data.avg_life_time,
                areaTopList: res.data.area_top_list
              });
            });
          })
        ]).then(result => {
          let formatNumber = function (num) {
            let format = num;
            if (num > 10000) {
              format = Math.round(num / 10000) + "w"
            }
            return format;
          }
          // test
          // result[0] = {
          //   target: {
          //     share: 32144210,
          //     visitor: 23214,
          //     access: 15435654,
          //   },
          //   rank: {
          //     share: 23,
          //     visitor: 11,
          //     access: 3,
          //   },
          //   trend: {
          //     share: 1,
          //     visitor: -1,
          //     access: 0,
          //   }
          // }
          // result[1] = {
          //   share: 128300,
          //   visitor: 6543213,
          //   access: 3783323,
          //   avgLifeTime: 321,
          //   areaTopList: ["成都市", "重庆市", "广州", "郑州", "西安"]
          // }
          console.log("个人统计数", result)

          self.data.dataList.forEach(item => {
            console.log("数据", item)
            item.target = result[0].target[item.key];
            item._target = formatNumber(item.target);
            item.spread = result[1][item.key];
            item._spread = formatNumber(item.spread);
            item.rank = result[0].rank[item.key];
            item.trend = result[0].trend[item.key];
          });
          self.data.avgLifeTime = ((time) => {
            if (!time) return "";
            if (time < 60) return `${time}秒`;
            return `${Math.floor(time / 60)}分${Math.floor(time % 60)}秒`;
          })(result[1].avgLifeTime);
          self.data.areaTopList = result[1].areaTopList.slice(0, 5).join("、");
          self.setData(self.data);
          self.renderChart();
        }).catch(err => {
          console.error(err);
        });
      }else{
        Promise.all([
          new Promise((resolve, reject) => {
            //获取获取活动 - 统计现状
            statisticsService.aggsTypeByBelongModule({
              as_belong_module: [self.properties.tid],
              as_belong_user: self.properties.uid || user_uuid
            }, (err, res) => {
              if (err) return reject(err);
              if (res.status != 0) return reject(res.message);
              resolve({
                share: res.data.group[0].scan_share,
                visitor: res.data.group[0].scan_visitor,
                access: res.data.group[0].scan_access,
                avgLifeTime: res.data.avg_life_time,
                areaTopList: res.data.area_top_list
              });
            });
          })
        ]).then(result => {
          let formatNumber = function (num) {
            let format = num;
            if (num > 10000) {
              format = Math.round(num / 10000) + "w"
            }
            return format;
          }
          console.log("个人统计数", result)
          self.data.dataList.forEach(item => {
            item.spread = result[0][item.key];
            item._spread = formatNumber(item.spread);
          });
          self.data.avgLifeTime = ((time) => {
            if (!time) return "";
            if (time < 60) return `${time}秒`;
            return `${Math.floor(time / 60)}分${Math.floor(time % 60)}秒`;
          })(result[0].avgLifeTime);
          self.data.areaTopList = result[0].areaTopList.slice(0, 5).join("、");
          self.setData(self.data);
          self.renderChart();
        }).catch(err => {
          console.error(err);
        });
      }

    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    renderChart() {
      let self = this,
        reportData = self.data.reportData,
        percentage = function(spreadVal, targetVal) {
          if (!targetVal) return;
          return parseFloat((spreadVal / targetVal * 100).toFixed(2))
        }
      //调用圆形统计图
      self.data.dataList.forEach(item => {
        self.init_pie_echarts(self.selectComponent(".pie-" + item.key), item.bgColor, percentage(item.spread, item.target));
      });
    },
    //初始化圆形统计图
    init_pie_echarts: function(componnetEl, mainColor, sumRate) {
      let self = this;
      if (!!self.Chart) {
        self.Chart.dispose();
        self.Chart = void 0;
      }
      setTimeout(() => {
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
          Chart.setOption(self.pieOpts(mainColor, sumRate));
          // 注意这里一定要返回 chart 实例，否则会影响事件处理等
          self.Chart = Chart;
          return Chart;
        });
      }, 100);
    },
    //圆形统计图配置
    pieOpts: function (mainColor, sumRate) {
      // 兼容安卓机在空圆情况下会填充颜色为实心的问题
      let tempColor = sumRate == 0 ? '#ffffff' : mainColor;
      return {
        color: [tempColor, '#E0E9FC'],
        textStyle: {
          fontSize: 14,
          color: mainColor
        },
        series: [{
          name: '访问来源',
          type: 'pie',
          radius: ['80%', '90%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
            },
            formatter: '{d}%'
          },
          silent: true,
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
              value: sumRate,
              name: Number.isFinite(sumRate) ? (sumRate + "%") : "--"
            },
            {
              value: 100 - (Number.isFinite(sumRate) ? Math.min(100, sumRate) : 0)
            }
          ]
        }]
      };
    }
  }
})