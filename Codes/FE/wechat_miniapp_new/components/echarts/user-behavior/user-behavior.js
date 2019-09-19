import * as echarts from '../../../vendor/ec-canvas/echarts';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataSource: {
      type: Object,
      value: [],
      observer: function (newVal, oldVal) {
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
    dispose: function () {
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
let genOptions = function (data) {
  return {
    grid: {
      left: '20',
      right: '20',
      top: 'middle',
      height: '60%' 
    },
    color: ['#ff9224', '#00ada3', '#32d9cf', '#54fbcf'],
    xAxis: {
      type: 'value',
      max: function(){
        var maxNum = 5;
        for(var i in data){
          maxNum = data[i] > maxNum ? data[i] : maxNum
        }
        return maxNum + 1
      },
      axisLabel: {
        fontSize:12,
        rich:{}
      },
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      show: false,
      type: 'category',
      data: ['用户行为']
    },
    series: [
      {
        type: 'bar',
        name: '曝光',
        label: {
          normal: {
            show: true,
            fontSize: 12,
            rich: {}
          }
        },
        data: [data.exposure]
      },
      {
        type: 'bar',
        name: '访客',
        label: {
          normal: {
            show: true,
            fontSize: 12,
            rich: {}
          }
        },
        data: [data.visitors]
      },
      {
        type: 'bar',
        name: '咨询',
        label: {
          normal: {
            show: true,
            fontSize: 12,
            rich: {}
          }
        },
        data: [data.consulting]
      },
      {
        type: 'bar',
        name: '成交',
        label: {
          normal: {
            show: true,
            fontSize: 12,
            rich: {}
          }
        },
        data: [data.trading]
      }
    ]
  };
}