<template>
  <div>
    <div style="width:100%;height:100%;">
      <echart-customer-line :dataSource="customerLineDataSource"></echart-customer-line>
    </div>
    <!-- <div style="width:100%;height:100%">
      <echart-connection-tree :dataSource="connectionDataSource"></echart-connection-tree>
    </div>
    <div style="width:100%;height:100%">
      <echart-connection-force :dataSource="connectionDataSource"></echart-connection-force>
    </div> -->
  </div>
</template>

<script>
import echartConnectionForce from "../components/echart-connection-force";
import echartConnectionTree from "../components/echart-connection-tree";
import echartCustomerLine from "../components/echart-customer-line";
export default {
  name: "echarts-demo",
  components: {
    echartConnectionForce,
    echartConnectionTree,
    echartCustomerLine
  },
  data() {
    return {
      customerLineDataSource: [],
      connectionDataSource: []
    };
  },
  mounted() {
    let self = this;
    setTimeout(() => {
      self.connectionDataSource = (() => {
        let dataSource = [];
        for (let index = 0; index < 300; index++) {
          dataSource.push({ "name": `节点${index}`, "id": index, "parent": index == 0 ? null : dataSource[parseInt(Math.random() * (dataSource.length - 1))].id })
        }
        return dataSource;
      })();
      self.customerLineDataSource = [
        { "name": `节点0`, "id": 0, "parent": null },
        { "name": `节点1`, "id": 1, "parent": 0 },
        { "name": `节点2`, "id": 2, "parent": 1 },
        { "name": `节点3`, "id": 3, "parent": 2 },
        { "name": `节点4`, "id": 4, "parent": 3 },
        { "name": `节点5`, "id": 5, "parent": 4 },
        { "name": `节点6`, "id": 6, "parent": 5 },
        { "name": `节点7`, "id": 7, "parent": 6 },
        { "name": `节点8`, "id": 8, "parent": 7 },
        { "name": `节点9`, "id": 9, "parent": 8 },
        { "name": `节点10`, "id": 10, "parent": 9 },
        { "name": `节点11`, "id": 11, "parent": 10 },
        { "name": `节点12`, "id": 12, "parent": 11 },
        { "name": `节点13`, "id": 13, "parent": 12 },
        { "name": `节点14`, "id": 14, "parent": 13 },
        { "name": `节点15`, "id": 15, "parent": 14 },
        { "name": `节点16`, "id": 16, "parent": 15 },
        { "name": `节点17`, "id": 17, "parent": 16 },
        { "name": `节点18`, "id": 18, "parent": 17 },
        { "name": `节点19`, "id": 19, "parent": 18 },
        { "name": `节点20`, "id": 20, "parent": 19 },
        { "name": `节点21`, "id": 21, "parent": 20 },
        { "name": `节点22`, "id": 22, "parent": 21 },
        { "name": `节点23`, "id": 23, "parent": 22 },
        { "name": `节点24`, "id": 24, "parent": 23 },
        { "name": `节点25`, "id": 25, "parent": 24 },
        { "name": `节点26`, "id": 26, "parent": 25 },
        { "name": `节点27`, "id": 27, "parent": 26 },
        { "name": `节点28`, "id": 28, "parent": 27 },
        { "name": `节点29`, "id": 29, "parent": 28 }
      ];
    }, 2000);
  },
  computed: {
  }
};
</script>
