<template>
  <div class="promote-box">
    <fold title="推广数据报告">
      <div>
        <el-button style="margin-bottom: 16px;" type="primary" @click="action('addDataReport')">添加数据报告</el-button>
      </div>
      <el-table
              ref="bussinessTable"
              :data="reportData"
              tooltip-effect="dark"
              row-key="id"
              class="table"
              header-row-class-name="table-header"
              header-cell-class-name="table-header"
            >
              <el-table-column
                show-overflow-tooltip
                prop="name"
                label="数据报告名称"
                align="center"
                class-name="number_color"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="businessName"
                label="数据统计时间"
                align="center"
                class-name="number_color"
              >
                <template slot-scope="scope">
                  {{formateDate(scope.row.startTime)}} - {{formateDate(scope.row.endTime)}}
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                label="所属推广计划"
                align="center"
                class-name="number_color"
                width
              > 
                <template>
                  {{promotionPlanName}}
                </template>
              </el-table-column>
              <el-table-column
                prop="clickCount"
                label="点击次数"
                align="center"
                class-name="number_color"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="exposureCount"
                label="曝光次数"
                align="center"
                class-name="number_color"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="clickRate"
                label="点击率"
                align="center"
                class-name="number_color"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="conversionIndex"
                label="转化指标"
                align="center"
                class-name="number_color"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="conversionCost"
                label="转化成本"
                align="center"
                class-name="number_color"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop=""
                label="操作"
                align="center"
                width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="btn-plain" @click="action('editData',scope.row)">编辑</span>
                  <span class="btn-plain" @click="action('query',scope.row)">详情</span>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin:20px 10px;">
              <pagination
                v-if="paginationOpt.pageCount > 1"
                class="pull-right"
                :paginationOpt="paginationOpt"
                @switchPage="pagesFn"
              />
            </div>
    </fold>
  </div>
</template>

<script>
import api from "../../axios/api-service";
import fold from "../../components/com-fold";
import pagination from "../../components/ui-pagination";

export default {
  name: "weChat-promote",
  components:{ fold, pagination },
  data() {
    return {
      reportData: [], //数据报告
      promotionPlanName: "", //计划名
      paginationOpt: { //分页
        pageIndex: 1,
        pageCount: "",
        pageSize: 15
      },
    };
  },
  mounted(){
    this.promotionPlanName = sessionStorage.getItem('promotionPlanName') || '';
    this.mainId = this.$route.query.mainId || '';
    this.getPromotionDataList();
  },
  methods: {
    //获取数据报告列表
    getPromotionDataList(cb){ 
      var self = this;
      var _option = {
          mainId: self.mainId,
          pageIndex: self.paginationOpt.pageIndex,
          pageSize: self.paginationOpt.pageSize
      }
      api.request("getPromotionDataList",_option,result => {
        if (result.status == 0) {
          self.reportData = result.data.list;
          self.paginationOpt.totalCount = result.data.total;
          self.paginationOpt.pageCount = Math.ceil(
            self.paginationOpt.totalCount /self.paginationOpt.pageSize
          );
        } else {
          self.messenger.error(result.message);
        }
        !!cb && cb();
      })
    },
    //事件集合
    action(type,data){
      switch (type) {
        case 'addDataReport': //添加数据报告
          var param = `?mainId=${this.mainId}&edit=false`;
          break;
        case 'editData': //编辑
          var param = !!data ? `?mainId=${data.mainId}&id=${data.id}&edit=true` : '';
          break;
        case 'query': //详情
          var param = !!data ? `?mainId=${data.mainId}&id=${data.id}&edit=info` : '';
          break;
      }
      this.$router.push({
        path: `/wechat-promote-edit${param}`
      });
    },
    //分页
    pagesFn(pageIndex, cb) {
      this.paginationOpt.pageIndex = pageIndex;
      this.getPromotionDataList(cb);
    },
    //时间格式转换
    formateDate(datetime) {
        function addDateZero(num) {
            return (num < 10 ? "0" + num : num);
        }
        var d = new Date(datetime);
        var formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
        return formatdatetime;
    }
  }
};
</script>
<style scoped>
</style>
