<template>
  <div>
    <div class="search">
      <search placeholder="请输入用户信息进行搜索" @searchHandler="searchHander" :style="{ width: '320px'}">
      </search>
    </div>
    <div class="export">
      <a target="_blank" :href="exportUrl" class="pull-right">
        <span class="btn-plain color-blue font-14">excel导出数据</span>
      </a>
    </div>
    <el-table :data="luckdrawList" tooltip-effect="dark" :header-cell-style="getRowClass"  style="width: 100%" row-key="id" class="table"
      header-row-class-name="table-header" header-cell-class-name="table-header">
      <el-table-column label="用户信息" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="userInfo">
            <img :src="scope.row.face" class="userFace">
            <span class="userName">{{scope.row.nickname}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" show-overflow-tooltip align="center">
        <template slot-scope="scope">{{scope.row.phone==""?'-':scope.row.phone}}</template>
      </el-table-column>
      <el-table-column label="奖项" prop="optionName" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="奖品" prop="prizeName" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="奖品图片" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="width:25px;height:25px;" @click="scaleImg(scope.row.icon)"
            v-if="!!scope.row.icon">
        </template> 
      </el-table-column>
      <el-table-column label="兑奖方式" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <span>{{scope.row.exchangeType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑奖状态" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isProvide == 1 ? '已兑奖' : '未兑奖'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <div>
            <span @click="queryDetail(scope.row)" style="cursor:pointer;">详情</span>
            <span v-if="scope.row.userCashType == 1 && scope.row.isProvide != 1" style="margin:10px;cursor:pointer;"
              @click="prividePrize(scope.row.id)">发放奖品</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-if="luckdrawList.length>0" class="pull-right" :paginationOpt="luckdrawPagination"
      @switchPage="luckDrawPagesFn" />
  </div>
</template>
<script>
import api from "api";
import navigator from "components/navigator";
import search from "components/com-search";
import pagination from "components/ui-pagination";
import httpConfig from "config/http";
export default {
    components:{
       navigator,
        search,
        pagination
    },
    data(){
        return{
            luckdrawList: [], //中奖信息列表    
            keywords:"",
            exportUrl:"",
            pagination: { 
                pageIndex: 1,
                pageSize: 10,
                totalCount: 1,
                pageCount: 0
            }
        }
    },
    methods:{
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return "background:#fafbff !important;"
            } else {
                return ""
            }
        },
        searchHander(data){
            this.votePlugin.keyWords = data;
        },
        //投票列表数据分页调取
        pagesFn(pageIndex, cb) {
            let self = this;
            self.pagination.pageIndex = pageIndex;
        }
    }
}
</script>
<style scoped>

.export{
    height:34px;
    padding-right:33px;
  }
.export a:hover, a:focus{
    text-decoration: none;
  }
.search{
    text-align: right;
    padding: 20px;
  }
.table{
    padding: 0 20px;
  }
</style>