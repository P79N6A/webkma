import * as echarts from '../../vendor/ec-canvas/echarts';
const statisticsService = require('../../services/statistics-service.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tid: String,
    uid: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeNavTab: "share",
    dataSource: {},
    loadingCharts: false
  },

  lifetimes: {
    ready() {
      let self = this,
        user_uuid = getApp().globalData.userInfo ? getApp().globalData.userInfo.data[0].user_uuid : null;
      if (!self.properties.tid || (!self.properties.uid && !user_uuid)) return console.error("缺少参数");
      console.log("tid", self.properties.tid, "uuid", user_uuid, "uu2",self.properties.uid)
      Promise.all([
        new Promise((resolve, reject) => {
          statisticsService.aggsTime({
            as_belong_module: self.properties.tid
          }, (err, res) => {
            if (err) return reject(err);
            if (res.status != 0) return reject(res.message);
            let dataList = [],
              allCount = {};
            res.data.group.forEach(item => {
              dataList = Object.keys(item).filter(key => key != "count" && key != 'key').sort();
              allCount[item['key']] = dataList.map(key => item[key]);
            });
            resolve({
              dataList: dataList,
              allCount: allCount
            });
          });
        }),
        new Promise((resolve, reject) => {
          statisticsService.aggsTime({
            as_belong_module: self.properties.tid,
            as_belong_user: self.properties.uid || user_uuid
          }, (err, res) => {
            if (err) return reject(err);
            if (res.status != 0) return reject(res.message);
            let personCount = {};
            res.data.group.forEach(item => {
              let keys = Object.keys(item).filter(key => key != "count" && key != 'key').sort();
              personCount[item['key']] = keys.map(key => item[key]);
            });
            resolve({
              personCount: personCount
            });
          });
        })
      ]).then(result => {
        self.setData({
          dataSource: Object.assign(result[0], result[1])
        });
        self.renderCharts();
      }).catch(err => {
        console.error(err);
      });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navbarTabChange: function(e) {
      this.setData({
        activeNavTab: e.detail.key
      });
      this.renderCharts();
    },
    renderCharts: function() {
      let self = this;
      self.setData({
        loadingCharts: true
      });

      self.init_echarts(self.selectComponent(".canvas_line_chatrs"), {
        name: (() => {
          switch (self.data.activeNavTab) {
            case "share":
              return "分享";
            case "visitor":
              return "访客";
            case "access":
              return "访问";
          }
        })(),
        dataList: self.data.dataSource.dataList,
        series1: self.data.dataSource.allCount["scan_" + self.data.activeNavTab],
        series2: self.data.dataSource.personCount["scan_" + self.data.activeNavTab]
      });
    },
    //初始化图表
    init_echarts: function(componnetEl, data) {
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
            self.setData({
              loadingCharts: false
            });
            Chart.off('finished');
          });
          Chart.setOption(this.getOption(data));
          // 注意这里一定要返回 chart 实例，否则会影响事件处理等
          self.Chart = Chart;
          return Chart;
        });
      }, 100);

    },
    getOption: function(data) {
      var dateList = [];
      data.dataList.forEach(dt => {
        let dataSplit = dt.split('-');
        dateList.push(dataSplit[1] + '-' + dataSplit[2]);
      });
      var series = data.series1.concat(data.series1);
      var maxseriesItem = 5;
      for (let i = 0; i < series.length; i++) {
        maxseriesItem = maxseriesItem < series[i] ? series[i] : maxseriesItem;
      }
      var option = {
        title: {
          text: `${data.name}趋势`,
          left: 'left',
          left: 10,
          textStyle: {
            fontSize: 14,
            fontWeight: "normal",
            color: "#3c4a55"
          }
        },
        color: ["#37A2DA", "#67E0E3"],
        legend: {
          data: [`${data.name}总数`, '推广总数'],
          left: 'right',
          right: 16,
          backgroundColor: 'none',
          z: 100
        },
        grid: {
          containLabel: true,
          top: 36,
          left: 20,
          right: 16,
          bottom: 20
        },
        xAxis: {
          position: 'bottom',
          type: 'category',
          boundaryGap: false,
          data: dateList,
          axisTick: {
            interval: 0
          },
          axisLabel: {
            fontSize: 12,
            interval: 0
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
            axisLabel: {
              fontSize: 10,
              interval: 0,
              margin: 20
            }
          },
          min: 0,
          max: function() {
            for (let i = 0; i < 10; i++) {
              if ((maxseriesItem + i) % 5 == 0) {
                return maxseriesItem + i;
              }
            }
          }
        },
        series: [{
          name: `${data.name}总数`,
          type: 'line',
          data: data.series1 //.reverse()
        }, {
          name: '推广总数',
          type: 'line',
          data: data.series2 //.reverse()
        }]
      };
      return option;
    }
  }
})