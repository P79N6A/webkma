<template>
  <div class="dialog-box">
    <div>
      <userChart :userData="userData" :type="parseInt($route.query.indexType) !== 2 ? 'customer': 'employee'" />
    </div>
    <div>
      <el-row class="navigator">
        <navigator :tabs="navigatorOpts.tabs" @navigator-event="transferTab"></navigator>
        <div class="header-goBack" @click="goBack" v-if="navigatorOpts.selectedKey === '6'">返回上一页</div>
      </el-row>
      <!-- 客户详情 -->
      <div v-if="parseInt($route.query.indexType) !== 2">
        <el-row v-if="navigatorOpts.selectedKey === '0'">
          <humanityPath :IDList="IDList" :indexType="$route.query.indexType"></humanityPath>
        </el-row>
        <el-row v-if="navigatorOpts.selectedKey === '1'">
          <sourceIndex :businessId="$route.query.business_id" :id="$route.query.id"></sourceIndex>
        </el-row>
        <el-row v-if="navigatorOpts.selectedKey === '2'">
          <visitTotal :businessId="$route.query.business_id" :id="$route.query.id"></visitTotal>
        </el-row>
        <el-row v-if="navigatorOpts.selectedKey === '3'">
          <forwardTotal :businessId="$route.query.business_id" :id="$route.query.id"></forwardTotal>
        </el-row>
        <el-row v-if="navigatorOpts.selectedKey === '4'">
          <customerInfo style="padding:30px" :id="$route.query.keyID"></customerInfo>
        </el-row>
      </div>
      <!-- 员工详情 -->
      <div v-else>
        <el-row v-if="navigatorOpts.selectedKey === '0'">
          <forwardTotal :businessId="$route.query.business_id" :id="$route.query.id"></forwardTotal>
        </el-row>
        <el-row v-if="navigatorOpts.selectedKey === '1'">
          <!-- 转发购买统计 -->
          <forwardBuyTotal :businessId="$route.query.business_id" :id="$route.query.id"></forwardBuyTotal>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import userChart from "components/user-dashbord";
import navigator from "components/navigator";
import humanityPath from "./components/humanityPath";
import sourceIndex from "./components/source";
import visitTotal from "./components/visitTotal";
import forwardTotal from "./components/forwardTotal";
import customerInfo from "components/customer-info";
import forwardBuyTotal from "./components/forwardBuyTotal";
export default {
  components: {
    userChart,
    navigator,
    humanityPath,
    sourceIndex,
    visitTotal,
    forwardTotal,
    customerInfo,
    forwardBuyTotal
  },
  data() {
    return {
      userData: {
        // user_id
        id: !!this.$route.query.id ? this.$route.query.id : 0,
        // 员工或者客户主键id
        keyID: !!this.$route.query.keyID ? this.$route.query.keyID : 0
      },
      dialogVisible: false,
      // 参数列表
      IDList: {
        merchantId: this.$route.query.business_id,
        taskId: this.$route.query.taskId,
        rootUserId: this.$route.query.rootUserId,
        userId: this.$route.query.id,
      },
      tableData: [{ "name": 1 }],
      navigatorOpts: {
        tabs: [
          { key: '0', title: "客户来源" },
          { key: '1', title: "客户营销力来源" },
          { key: '2', title: "浏览统计" },
          { key: '3', title: "转发统计" },
          { key: '4', title: "客户信息" },
        ],
        selectedKey: '0'
      },
    }
  },
  created() {
    if (parseInt(this.$route.query.indexType) == 2) {//员工
      this.navigatorOpts = {
        tabs: [
          { key: '0', title: "转发获客统计" },
          { key: '1', title: "转发购买统计" },
        ],
        selectedKey: '0'
      }
    }
    this.dialogVisible = !this.dialogVisible;
  },
  methods: {
    transferTab(tab) {
      var self = this;
      self.navigatorOpts.selectedKey = tab;
    },
  }
}
</script>
<style  scoped>
.dialog-box {
  /* width: 70%; */
  height: 700px;
  display: flex;
  background: #ffffff;
}
.user-dashbord {
  background: #ffffff !important;
}
.dialog-box > div:nth-of-type(1) {
  width: 20%;
  background: #ffffff !important;
  height: auto;
}
.dialog-box > div:nth-of-type(2) {
  width: 85%;
  border-left: 1px solid#E3E6EB;
}
</style>