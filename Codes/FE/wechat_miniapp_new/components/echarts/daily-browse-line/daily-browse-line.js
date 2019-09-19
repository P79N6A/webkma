import * as echarts from '../../../vendor/ec-canvas/echarts';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataSource: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        if (this.ecComponent) {
          if (this.isLoaded) {
            this.dispose();
          }
          this.init(newVal);
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ecComponent: {},
    uid: Date.now(),
    ec: {
      lazyLoad: true // 将 lazyLoad 设为 true 后，需要手动初始化图表
    },
    isLoaded: false,
    isDisposed: false
  },

  ready() {
    this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
  },

  lifetimes: {
    ready() {
      this.ecComponent = this.selectComponent(`#chart_${this.data.uid}`);
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化图表
    init(data) {
      this.ecComponent.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart);

        chart.setOption(genOptions(data));

        this.chart = chart;
        this.setData({
          isLoaded: true,
          isDisposed: false
        });
        return chart;
      });
    },
    // 释放图表
    dispose: function() {
      if (this.chart) {
        this.chart.dispose();
      }
      this.setData({
        isDisposed: true
      });
    }
  }
});
// 生成图标的配置项
let genOptions = function(data) {
  let hourArray = [
    "凌晨3点", "凌晨4点", "凌晨5点",
    "上午6点", "上午7点", "上午8点", "上午9点", "上午10点", "上午11点",
    "下午12点", "下午1点", "下午2点", "下午3点", "下午4点", "下午5点",
    "晚上6点", "晚上7点", "晚上8点", "晚上9点", "晚上10点", "晚上11点",
    "凌晨0点", "凌晨1点", "凌晨2点", "凌晨3点"
  ];
  return {
    backgroundColor: "#fff",
    color: ["#24d0c6"],
    tooltip: {
      show: true,
      backgroundColor: "rgba(0,0,0,0.5)",
      position: function(point, params, dom, rect, size) {
        return {
          right: "10%",
          top: "5%"
        }
      },
      trigger: 'axis',
      formatter: function(params, ticket, callback) {
        return `${hourArray[params[0].dataIndex]}至${hourArray[params[0].dataIndex + 1]} ${params[0].data}次`;
      }
    },
    grid: {
      containLabel: false,
      top: "20%",
      bottom: "20%"
    },
    xAxis: {
      type: 'category',
      data: ['', '', '', '上午', '', '', '', '', '', '下午', '', '', '', '', '', '晚上', '', '', '', '', '', '凌晨', '', ''],
      axisLabel: {
        interval: 0,
        rotate:360  ,
        rich: {}
      },
      axisLine:{
        lineStyle:{
          color: "#999"
        }
      },
    },
    yAxis: {
      show: false
    },
    series: [{
      type: 'line',
      areaStyle: {
        normal: {
          opacity: 0.3
        }
      },
      smooth: true,
      data: data
    }]
  }
}