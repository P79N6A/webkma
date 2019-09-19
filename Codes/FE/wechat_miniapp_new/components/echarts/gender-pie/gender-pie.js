import * as echarts from '../../../vendor/ec-canvas/echarts';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataSource: {
      type: Object,
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
  return {
    backgroundColor: "#ffffff",
    color: ["#69e4dd", "#ffcf7c", "#f3f3f3"],
    series: [{
      label: {
        normal: {
          fontSize: 12,
          rich: {}
        },
      },
      radius: '55%',
      type: 'pie',
      data: [{
        value: data.male,
        name: '男'
      }, {
        value: data.female,
        name: '女'
      }, {
        value: data.total - data.male - data.female,
        name: '未知',
        label: {
          color: '#B1BFCD'
        },
        
        labelLine: {
          lineStyle: {
            color: '#e3e3e3'
          }
        }
      }],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };
}