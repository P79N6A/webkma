<template>
  <div style="width:100%; height:100%;">
    <div v-show="dataSource && dataSource.length == 0" id="placeholder" style="margin:20px 0; text-align:center;">
      <p style="margin-bottom:20px;">
        <img src="../assets/images/nothing.png" style="width: 200px; height: 154.05px;">
      </p>
      <p class="font-12 black-light">还没有人脉数据哟</p>
    </div>
    <div id="connection-chart" style="width:100%; height:100%;" ref="connection-chart"></div>
  </div>
</template>
<script>
import echarts from "bdcharts";
import api from 'api';
import eventBus from '../utils/eventBus'

export default {
  name: "echart-connection-force",
  components: {
    echarts
  },
  data() {
    return {
      dataSource: null
    };
  },
  methods: {
    render() {
      let self = this,
        graph = { nodes: [], links: [] };
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
                category: levelIndex == 0 ? "初始" : `${levelIndex}级`,
                symbol: node.photo ? `image://${node.photo}` : "circle",
                symbolSize: node.photo ? Math.max(60 - (levelIndex * 6), 20) : 20,
              }
              if (levelIndex == 0) {
                data.x = this.$el.offsetWidth / 2;
                data.y = this.$el.offsetHeight / 2
                data.fixed = true;
              }
              return data;
            }));
            // 添加关系节点线
            graph.links = graph.links.concat(currentNodes.filter(item => { return item.parent != undefined }).map(item => {
              let data = {
                "source": graph.nodes.findIndex(node => { return node.id === item.parent }),
                "target": graph.nodes.findIndex(node => { return node.id === item.id }),
                "lineStyle": {
                  "normal": {
                    width: (levelIndex == 1 ? 5 : 3)
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

      let categories = [
        { name: "初始", itemStyle: { color: '#0358c2' } },
        { name: "1级", itemStyle: { color: '#018cc6' } },
        { name: "2级", itemStyle: { color: '#37b3e7' } },
        { name: "3级", itemStyle: { color: '#8adcff' } },
        { name: "4级", itemStyle: { color: '#d2f2ff' } },
        { name: "5级", itemStyle: { color: '#ff9224' } },
        { name: "6级", itemStyle: { color: '#ffc890' } },
        { name: "7级", itemStyle: { color: '#ffe7ce' } },
        { name: "8级", itemStyle: { color: '#00ada3' } },
        { name: "9级", itemStyle: { color: '#32d9cf' } },
        { name: "10级", itemStyle: { color: '#54fbcf' } },
        { name: "11级", itemStyle: { color: '#d9fff5' } },
        { name: "12级", itemStyle: { color: '#f76854' } },
        { name: "13级", itemStyle: { color: '#ffa79b' } },
        { name: "14级", itemStyle: { color: '#ffd7d2' } },
        { name: "15级", itemStyle: { color: '#81b300' } },
        { name: "16级", itemStyle: { color: '#a5e500' } },
        { name: "17级", itemStyle: { color: '#d8ff75' } },
        { name: "18级", itemStyle: { color: '#edffc0' } },
        { name: "19级", itemStyle: { color: '#cdd7e1' } },
        { name: "20级", itemStyle: { color: '#f4f4f4' } },
      ];
      let option = {
        backgroundColor: "#fff",
        series: [
          {
            type: 'graph',
            layout: 'force',
            roam: true,
            //   focusNodeAdjacency: true,
            force: {
              repulsion: [50, 300],
              edgeLength: [30, 200],
              layoutAnimation: true
            },
            categories: categories,
            data: graph.nodes,
            links: graph.links,
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
            label: {
              normal: {
                position: "bottom",
                color: "#333"
              }
            }
          }
        ]
      };
      self.connectionChart = echarts.init(self.$refs["connection-chart"]);
      self.connectionChart.setOption(option);
      eventBus.$off('chart-resize').$on('chart-resize', () => {
        if (!self.connectionChart.isDisposed() && self.connectionChart.resize) self.connectionChart.resize();
      });
    }
  },
  mounted() {
    let self = this;
    new Promise((resolve,reject)=>{
      api.request("getTaskRelation", {
        merchantId: localStorage.getItem('businessId'),
        taskId: self.$route.query.id,
      }, (result) => {
        if (result.data && result.data.length > 0) {
          self.dataSource = [{
            "id": self.$route.query.id,
            "parent": "",
            "name": self.$route.query.myTitle,
            "photo": ""
          }]
          self.dataSource = self.dataSource.concat(result.data.map(item => {
            return {
              "id": item.id,
              "parent": item.parentId || self.$route.query.id,
              "name": item.userName,
              "photo": item.userImage
            }
          }));
          resolve(result)
        } else {
          self.dataSource = [];
        }
      });
    }).then(res=>{
      self.render();
    })
  }
};
</script>
