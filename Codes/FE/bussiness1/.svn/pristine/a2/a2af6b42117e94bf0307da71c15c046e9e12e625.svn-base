<template>
  <div class="forward-box">
    <p class="title">累计转发任务个数：<span style="margin-right: 10px;">{{forwardData.totalTaskCount}}</span> 累计转发次数：<span
        style="margin-right: 10px;">{{forwardData.totalForwardCount}}</span>
      累计获客人数：<span>{{forwardData.totalUserCount}}</span></p>
    <el-table :data="forwardData.list" border style="width: 100%" :header-cell-style="{background:'#F7FBFC'}"
      @sort-change="sortChangeHandler">
      <el-table-column prop="taskName" label="任务名称">
      </el-table-column>
      <el-table-column prop="forwardTime" label="最近转发时间">
      </el-table-column>
      <el-table-column prop="forwardCount" sortable label="转发次数">
      </el-table-column>
      <el-table-column prop="userCount" sortable label="获客人数">
      </el-table-column>
    </el-table>
    <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt"
      @switchPage="pagesFn" />
  </div>
</template>

<script>
import api from 'api';
import pagination from "../../../components/ui-pagination";
export default {
  name: "customer-detail-forward",
  components: {
    pagination
  },
  props: {
    businessId: '',
    id: '',
    type: ''
  },
  data() {
    return {
      forwardData: {},
      paginationOpt: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        pageCount: 0
      },
      sorts: {} //带来曝光量(browseCount)/带来客户量(userCount)/带来咨询量(serviceCount)/带来成交量(orderCount),0:升序，1降序
    }
  },
  mounted() {
    this.taskForwardList();
  },
  methods: {
    taskForwardList(cb) {
      let self = this;
      console.log(self.id)
      console.log(parseInt(this.$route.query.indexType))
      let id = this.$route.query.id
      api.request('taskForwardList', {
        "businessId": self.businessId,
        "rootUserId": parseInt(this.$route.query.indexType) == 2 ? id : "",
        "targetUserId": parseInt(this.$route.query.indexType) == 2 ? "" : id,
        "sorts": self.sorts,
        "pageIndex": self.paginationOpt.pageIndex,
        "pageSize": self.paginationOpt.pageSize,
      }, result => {
        if (result.status === 0) {
          self.forwardData = result.data;

          self.paginationOpt.totalCount = result.data.totalCount;
          self.paginationOpt.pageCount = Math.ceil(
            self.paginationOpt.totalCount / self.paginationOpt.pageSize
          );
        }
        !!cb && cb();
      })
    },
    //排序
    sortChangeHandler(orderBy) {
      let { order, prop } = orderBy;
      if (!!prop) {
        this.sorts[prop] = order === "descending" ? 1 : 0;
        this.taskForwardList();
      }
    },
    //分页调用方法
    pagesFn(pageIndex, cb) {
      this.paginationOpt.pageIndex = pageIndex;
      this.taskForwardList(cb);
    }
  }
}
</script>

<style scoped>
.forward-box {
  width: 95%;
  margin: 0 auto;
  margin-top: 30px;
}
.title {
  color: #3c4a55;
  font-size: 12px;
  padding-bottom: 10px;
}
.title span {
  color: #f68411;
}
</style>
