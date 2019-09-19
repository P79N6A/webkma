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
  name: "echart-connection-tree",
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
        treeNodes = {};
      ((data) => {
        let cacheKeys = [];
        let eachNodes = (parentNode) => {
          if (!parentNode) {
            // 获取根节点
            let rootNode = data.find(item => { return !item.parent });
            cacheKeys.push(rootNode.id);
            treeNodes = {
              id: rootNode.id,
              name: rootNode.name.length > 16 ? rootNode.name.substr(0, 14) + "..." : rootNode.name,
              label: {
                normal: {
                  position: 'bottom',
                  distance: 12,
                  verticalAlign: 'middle',
                  align: 'center',
                  fontSize: 12
                }
              }
            };
            eachNodes(treeNodes);
          } else {
            // 当前级别所有节点
            let nodeChildren = data.filter(item => { return item.parent == parentNode.id && !cacheKeys.includes(item.id) });
            parentNode.children = nodeChildren.map(item => {
              cacheKeys.push(item.id);
              return { id: item.id, name: item.name + (item.empId ? "（员工）" : "") }
            });
            parentNode.children.forEach(node => {
              eachNodes(node);
            });
          }
        }
        eachNodes(undefined);
      })(self.dataSource);
      let option = {
        series: [
          {
            type: 'tree',
            data: [treeNodes],
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '14%',
            symbolSize: 12,
            initialTreeDepth: 3,
            label: {
              normal: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 12
              }
            },
            leaves: {
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              }
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
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
            "empId": "",
            "photo": ""
          }]
          self.dataSource = self.dataSource.concat(result.data.map(item => {
            return {
              "id": item.id,
              "parent": item.parentId || self.$route.query.id,
              "name": item.userName,
              "empId": item.empId,
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
  },
};
</script>
