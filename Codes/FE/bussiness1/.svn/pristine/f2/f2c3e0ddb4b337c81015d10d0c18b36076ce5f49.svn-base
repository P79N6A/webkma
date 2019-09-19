<template>
  <div class="transmit-customer-container">
    <div class="table-top">
      <div class="customer-content">
          <span class="customer-content-label">累计转发活动内容：</span>
          <span class="customer-content-value">50</span>
      </div>
      <div class="customer-content">
          <span class="customer-content-label">累计转发次数：</span>
          <span class="customer-content-value">5000</span>
      </div>
      <div class="customer-content">
          <span class="customer-content-label">累计获客人数：</span>
          <span class="customer-content-value">5000</span>
      </div>
    </div>
    <el-table ref="multipleTable" :data="customerList" @sort-change="sortChangeHandler" tooltip-effect="dark"
      style="width: 100%" row-key="id" class="table" header-row-class-name="table-header"
      header-cell-class-name="table-header">
      <el-table-column label="内容" show-overflow-tooltip align="center" prop="a"></el-table-column>
      <el-table-column label="最近转发时间" show-overflow-tooltip align="center" prop="b" sortable="custom"></el-table-column>
      <el-table-column label="转发次数" show-overflow-tooltip align="center" prop="c"></el-table-column>
      <el-table-column label="获客数量" show-overflow-tooltip align="center" prop="d" sortable="custom"></el-table-column>
    </el-table>
    <pagination v-if="customerList.length>0" class="pull-right" :paginationOpt="transmitPagination"
        @switchPage="transmitPagesFn" style="margin-top: 0" />
  </div>
</template>

<script>
import pagination from "components/ui-pagination";

export default {
  name: 'transmit-customer',
  data() {
    return {
      customerList: [
        {
          id: 0,
          a: '1',
          b: '1',
          c: '1',
          d: '1'
        }
      ],
      transmitPagination: {
        //人员分派分页
        pageIndex: 1,
        pageSize: 4,
        totalCount: 1,
        pageCount: 0
      }
    }
  },
  components: {
    pagination
  },
  methods: {
    sortChangeHandler() { },
    transmitPagesFn() { }
  }
}
</script>

<style scoped>
.transmit-customer-container {
  width: 100%;
  padding: 10px 18px;
}
/* 列表 */
.table-top {
  overflow: hidden;
  padding: 15px 0;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
}
.customer-content{
    margin-right: 12px;
}
.customer-content-label{
    color: #3C4A55;
}
.customer-content-value{
    color: #F68B1F;
}
</style>
