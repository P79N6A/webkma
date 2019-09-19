<template>
  <div id="customer-chart" style="width:100%; height:100%;" ref="customer-chart"></div>
</template>

<script>
import echarts from "bdcharts";
import eventBus from "../utils/eventBus";
export default {
  name: "echart-customer-line",
  components: {
    echarts
  },
  props: {
    dataSource: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
    };
  },
  watch: {
    dataSource: function (newVal, oldVal) {
      let self = this,
        graph = { nodes: [], links: [] };
      ((data) => {
        let levelIndex = 0;
        let eachNodes = (parentNodes, levelIndex) => {
          let currentNodes = [];
          if (!parentNodes) {
            // 根级别所有节点
            currentNodes = data.filter(node => {
              return !data.find(item => { return item.id === node.parentId })
            });
          } else {
            // 当前级别所有节点
            parentNodes.forEach(node => {
              let nodeChildren = data.filter(item => { return item.parentId == node.id });
              currentNodes = currentNodes.concat(nodeChildren.map(item => {
                item.parentId = node.id; // 用于创建关系线
                return item;
              }));
            });
          }
          // 过滤已存在的节点（避免死循环）
          currentNodes = currentNodes.filter(node => { return !graph.nodes.find(item => { return item.id == node.id }) });
          if (currentNodes.length > 0) {
            graph.nodes = graph.nodes.concat(currentNodes.map(node => {
              let rowCellCount = 8;
              let data = {
                id: node.id,
                name: node.userName,
                symbol: `image://${node.userImage}`,
                symbolSize: this.$el.offsetWidth / rowCellCount / 2,
                x: parseInt(levelIndex % rowCellCount) * this.$el.offsetWidth / rowCellCount,
                y: parseInt(levelIndex / rowCellCount) * this.$el.offsetWidth / rowCellCount
              }
              // 奇数行逆向设置X坐标
              if (parseInt(levelIndex / rowCellCount) % 2 == 1) {
                data.x = (rowCellCount - 1) * (this.$el.offsetWidth / rowCellCount) - data.x;
              }
              return data;
            }));
            // 添加关系节点线
            graph.links = graph.links.concat(currentNodes.filter(item => { return item.parentId != undefined }).map(item => {
              let data = {
                "source": graph.nodes.findIndex(node => { return node.id === item.parentId }),
                "target": graph.nodes.findIndex(node => { return node.id === item.id }),
                "lineStyle": {
                  "normal": {
                    width: 3
                  }
                }
              }
              return data;
            }));
            levelIndex++
            eachNodes(currentNodes, levelIndex);
          }
        }
        eachNodes(undefined, levelIndex);
      })(self.dataSource);
      let option = {
        backgroundColor: "#fff",
        series: [
          {
            type: 'graph',
            data: graph.nodes,
            links: graph.links,
            edgeSymbol: ['none', 'arrow'],
            edgeSymbolSize: 8,
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1,
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
              }
            },
            lineStyle: {
              color: '#B1BFCD',
              curveness: 0
            },
            label: {
              normal: {
                show: true,
                position: "bottom",
                // offset: [0, 10],
                color: "#333"
              }
            }
          }
        ]
      };
      self.chart = echarts.init(self.$refs["customer-chart"]);
      self.chart.setOption(option);
      eventBus.$off('chart-resize').$on('chart-resize', () => {
        if (!self.connectionChart.isDisposed() && self.connectionChart.resize) self.connectionChart.resize();
      });
    }
  },
  mounted() { },
};
</script>
