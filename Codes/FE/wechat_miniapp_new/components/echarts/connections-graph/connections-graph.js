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
  let graph = { nodes: [], links: [] };
  ((data) => {
    let levelIndex = 0;
    let eachNodes = (parentNodes, levelIndex) => {
      let currentNodes = [];
      if (!parentNodes) {
        // 根级别所有节点
        currentNodes = data.filter(node => {
          return !data.find(item => { return item.id === node.parent })
        });
      } else {
        // 当前级别所有节点
        parentNodes.forEach(node => {
          let nodeChildren = data.filter(item => { return item.parent == node.id });
          currentNodes = currentNodes.concat(nodeChildren.map(item => {
            item.parent = node.id; // 用于创建关系线
            return item;
          }));
        });
      }
      // 过滤已存在的节点（避免死循环）
      currentNodes = currentNodes.filter(node => { return !graph.nodes.find(item => { return item.id == node.id }) });
      if (currentNodes.length > 0) {
        graph.nodes = graph.nodes.concat(currentNodes.map(node => {
          let data = {
            id: node.id,
            name: node.name,
            category: `人脉${levelIndex}`,
            symbolSize: Math.max(30 - (levelIndex * 4), 10)
          }
          if (levelIndex == 0) {
            data.x = 375;
            data.y = 250;
            data.fixed = true;
          }
          return data;
        }));
        // 添加关系节点线
        graph.links = graph.links.concat(currentNodes.filter(item => { return item.parent != undefined }).map(item => {
          return {
            "source": graph.nodes.findIndex(node => { return node.id === item.parent }),
            "target": graph.nodes.findIndex(node => { return node.id === item.id })
          }
        }));
        levelIndex++
        eachNodes(currentNodes, levelIndex);
      }
    }
    eachNodes(undefined, levelIndex);
  })(data);

  let categories = [
    { name: "人脉0", itemStyle: { color: '#c23531' } },
    { name: "人脉1", itemStyle: { color: '#2f4554' } },
    { name: "人脉2", itemStyle: { color: '#61a0a8' } },
    { name: "人脉3", itemStyle: { color: '#d48265' } },
    { name: "人脉4", itemStyle: { color: '#91c7ae' } },
    { name: "人脉5", itemStyle: { color: '#749f83' } },
    { name: "人脉6", itemStyle: { color: '#ca8622' } },
    { name: "人脉7", itemStyle: { color: '#bda29a' } },
    { name: "人脉8", itemStyle: { color: '#6e7074' } },
    { name: "人脉9", itemStyle: { color: '#ff4fdc' } }
  ];
  return {
    backgroundColor: "#ffffff",
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    legend: { data: categories },
    series: [{
      type: 'graph',
      layout: 'force',
      force: {
        // repulsion: 100,
        // edgeLength: 200
      },
      // roam: true,
      // edgeSymbol: ['circle', 'arrow'],
      // edgeSymbolSize: [2, 4],
      itemStyle: {
        normal: {
          borderColor: '#fff',
          borderWidth: 1,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3
      },
      categories: categories,
      data: graph.nodes,
      links: graph.links,
    }]
  }
}