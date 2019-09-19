<template>
  <div>
    <div style="width:100%;height:650px;overflow: hidden;margin:0 auto">
      <echart-customer-line :dataSource="customerLineDataSource" style="width:100%;height:100%;"></echart-customer-line>
    </div>
  </div>
</template>

<script>
import echartCustomerLine from "components/echart-customer-line";
import api from 'api'

export default {
  name: "echarts-demo",
  props: {
    IDList: {
      type: Object,
      default: () => {
        return {
          merchantId: 0,
          taskId: 0,
          rootUserId: 0,
          userId: 0,
        }
      }
    },
    indexType: {
      type: [Number, String],
      default: 1
    }
  },
  components: {
    echartCustomerLine
  },
  data() {
    return {
      customerLineDataSource: [],
    };
  },
  mounted() {
    let self = this;
    // setTimeout(() => {
    //   self.connectionDataSource = (() => {
    //     let dataSource = [];
    //     for (let index = 0; index < 300; index++) {
    //       dataSource.push({ "name": `节点${index}`, "id": index, "parent": index == 0 ? null : dataSource[parseInt(Math.random() * (dataSource.length - 1))].id })
    //     }
    //     return dataSource;
    //   })();
    // }, 1000);
    if (this.indexType != 2) {
      this.getData()
    }
  },
  methods: {
    getData() {
      api.request('getSourcePath', this.IDList, res => {
        if (res.status === 0) {
          this.customerLineDataSource = res.data
        }
      })
    }
  },
  computed: {
  }
};
</script>