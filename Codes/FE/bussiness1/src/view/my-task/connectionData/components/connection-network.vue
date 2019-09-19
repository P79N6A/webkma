<template>
  <div class="connection-network">
    <el-row>
      <el-button :type="tab == 'tree' ? 'primary': 'default'" size="small" @click="tab = 'tree'">树状图</el-button>
      <el-button :type="tab == 'list' ? 'primary': 'default'" size="small" @click="tab = 'list'">关系列表</el-button>
      <el-button :type="tab == 'force' ? 'primary': 'default'" size="small" @click="tab = 'force'">散点图</el-button>
    </el-row>
    <el-row class="content" style="height:calc(100% - 40px);">
      <el-row v-if="tab === 'tree'" style="width:100%;height:100%">
        <echart-connection-tree></echart-connection-tree>
      </el-row>
      <el-row v-else-if="tab === 'force'" style="width:100%;height:100%">
        <echart-connection-force></echart-connection-force>
      </el-row>
      <el-row v-else>
        <treeTable ref="tabs" v-if="businessId" :business-id="businessId" :taskId="$route.query.id"></treeTable>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import echartConnectionForce from "../../../../components/echart-connection-force";
import echartConnectionTree from "../../../../components/echart-connection-tree";
import treeTable from "./connection-list";
export default {
  name: 'connection-network',
  data() {
    return {
      tab: 'tree', // tree -- 树状图， list -- 关系列表， force -- 散点图
      businessId: localStorage.getItem('businessId') || '',
    }
  },
  components: {
    echartConnectionForce,
    echartConnectionTree,
    treeTable
  },
  methods: {

  }
}
</script>

<style scoped>
.connection-network {
  width: 100%;
  height: 100%;
  padding: 10px 18px;
}
.connection-network >>> .el-button--small {
  width: 100px;
  height: 30px;
  padding-top: 8px;
}
.connection-network .content {
  margin: 10px auto 0;
}
</style>
