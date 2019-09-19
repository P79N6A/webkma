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
    color: ["#24D0C6", "#F68411"],
    grid: {
      left: '20',
      right: '20',
      top: 'middle',
      height: '60%'
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      axisLabel: { 
        textStyle: {
          fontSize: 12,
          rich: {}
        },
      },
    },
    yAxis: {
      show: false,
      type: 'category',
      data: ['员工战绩']
    },
    series: [
      {
        type: 'bar',
        name: '员工总数',
        label: {
          normal: {
            show: true
          }
        },
        data: [data.total]
      },
      {
        type: 'bar',
        name: '满分员工',
        label: {
          normal: {
            show: true
          }
        },
        data: [data.value]
      }
    ]
  };
}