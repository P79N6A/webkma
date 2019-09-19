import * as echarts from '../../../vendor/ec-canvas/echarts';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataSource: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        let funnelData = [
          { value: 92, name: '浏览', cont: '' },
          { value: 70, name: '客户', cont: '' },
          { value: 48, name: '咨询', cont: '' },
          { value: 24, name: '成交', cont: '' }
        ]
        new Promise((resolve,reject)=>{
          if (newVal) {
            newVal.map((item, index) => {
              funnelData[index].cont = item.value
              if(index>2){
                resolve(funnelData)
              }
            })
          }
        }).then(res=>{
          if (this.ecComponent) {
            if (this.isLoaded) {
              this.dispose();
            }
            console.log(funnelData)
            this.init(funnelData);
          }
        })
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
    backgroundColor: '#ffffff',
    // 金字塔块的颜色
    color: ["#54fbcf","#32d9cf", "#00ada3", "#ff9224"],
    calculable: true,
    series: [{
      name: '漏斗图',
      type: 'funnel',
      top: 0,
      //x2: 80,
      bottom: 0,
      left:"10%",
      width: '80%',
      // height: {totalHeight} - y - y2,
      min: 0,
      max: 100,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      label: {
        normal: {
          show: true,
          position: 'inside',
          fontSize: 12,
          rich: {}
        },
        emphasis: {
          textStyle: {
            fontSize: 20
          }
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1,
        normal: {
          label: {
            position: 'inner',
            formatter: function (params) { 
              console.log(params)
              return params.name + params.data.cont
            }
          },
          labelLine: {
            show: false
          }
        }
      },
      labelLine: {
        normal: {
          length: 10,
          lineStyle: {
            width: 2,
            type: 'solid'
          }
        }
      },
      data
    }]
  };
}