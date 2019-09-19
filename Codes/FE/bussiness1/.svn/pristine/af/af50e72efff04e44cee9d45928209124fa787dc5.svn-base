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
      this.getData()
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