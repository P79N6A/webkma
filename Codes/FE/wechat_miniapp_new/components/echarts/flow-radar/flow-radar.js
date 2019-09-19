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
        console.log(newVal)
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
      console.log(data)
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
  let optionsData = []
  data.value.forEach((it,n)=>{
    if(it > data.label[n]){
      optionsData.push(data.label[n])
    }else{
      optionsData.push(it)
    }
  })
  return {
    backgroundColor: "#ffffff",
    color: ["#F68411"],
    tooltip: {
      backgroundColor: "rgba(0,0,0,0.5)",
      position: function (point, params, dom, rect, size) {
        return {
          right: 30,
          top: 10
        }
      },
      formatter: function(params, ticket, callback) {
        let arr = []
        params.value.forEach((item, index) => {
          let num = (data.value[index] / data.label[index]) ? (((data.value[index] / data.label[0]).toFixed(4)) * 100) + '%' : (data.label[index]>0?'0%':'100%')
          arr.push(num)
        })
        return [
          `● 曝光: ${arr[0]}`,
          `● 访客: ${arr[1]}`,
          `● 咨询: ${arr[2]}`,
          `● 成交: ${arr[3]}`,
        ].join("\n");
      }
    },
    radar: {
      radius:"60%",
      name: {
        formatter: function(value, indicator) {
          return `${value} ${indicator.num}`
        },
        rich:{}
      },
      rich: {
        a: {
          fontSize: 22,
          color: '#B1BFCD',
          align: 'center'
        },
        b: {
          fontSize: 22,
          color: '#B1BFCD',
          align: 'center'
        }
      },
      indicator: [{
          name: '曝光',
          max: data.label[0],
          num: data.label[0]
        },
        {
          name: '访客',
          max: data.label[1],
          num: data.label[1]
        },
        {
          name: '咨询',
          max: data.label[2],
          num: data.label[2]
        },
        {
          name: '成交',
          max: data.label[3],
          num: data.label[3]
        }
      ]
    },
    series: [{
      type: 'radar',
      name: '统计',
      data: [{
        value: optionsData,
        name: '雷达图'
      }],
      lineStyle: {
        normal: {
          width: 2,
          opacity: 0.3
        }
      },
      areaStyle: {
        normal: {
          opacity: 0.3
        }
      }
    }]
  };
}