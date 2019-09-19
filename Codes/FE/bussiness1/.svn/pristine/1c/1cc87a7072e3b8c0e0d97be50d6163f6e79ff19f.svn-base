<template>
  <div>
    <div class="search">
      <search placeholder="请输入用户信息进行搜索" @searchHandler="searchHander" :style="{ width: '320px'}">
      </search>
    </div>
    <div class="export">
      <el-button @click="importExcel" type="primary" size="small"
        style="width:130px;height:30px;margin-left: 4px; line-height:10px;">
        <a target="_blank" style="color:#ffffff">
          <i class="iconfont icon-excel-out" style="color:#ffffff"></i>excel导出数据
        </a>
      </el-button>
    </div>
    <el-table :header-cell-style="getRowClass" :data="luckdrawList" tooltip-effect="dark" style="width: 100%"
      row-key="id" class="table" header-row-class-name="table-header" header-cell-class-name="table-header">
      <el-table-column label="用户信息" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="userInfo">
            <img :src="scope.row.face" class="userFace">
            <span class="userName">{{scope.row.nickname}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" show-overflow-tooltip align="center">
        <template slot-scope="scope">{{scope.row.phone?scope.row.phone:'-'}}</template>
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
          <span>{{scope.row.userCashType==1?"线上兑奖":'线下兑奖'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑奖状态" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <span>{{scope.row.isProvide == 1 ? '已兑奖' : '未兑奖'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <div style="color:#00BAD0">
            <span @click="queryDetail(scope.row)" style="cursor:pointer;">详情</span>
            <span v-if="scope.row.isProvide == 0 &&scope.row.userCashType==1" style="margin:10px;cursor:pointer;"
              @click="prividePrize(scope.row.id)">兑奖</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-if="prizeDataDetail.visible" :visible.sync="prizeDataDetail.visible" :center="true"
      @close="prizeDataDetail.visible = false;">
      <el-row style="height:30px;text-align:left;font-weight:bold;">中奖信息</el-row>
      <el-row style="height:30px;text-align:left;">
        活动时间：{{prizeDataDetail.detail.actStartTime}}--{{prizeDataDetail.detail.actEndTime}}</el-row>
      <el-row style="height:30px;text-align:left;">奖项名称：{{prizeDataDetail.detail.optionName}}</el-row>
      <el-row style="height:30px;text-align:left;">奖品名称：{{prizeDataDetail.detail.prizeName}}</el-row>
      <el-row style="height:30px;text-align:left;">中奖时间：{{prizeDataDetail.detail.drawPrizeTime}}</el-row>
      <el-row style="height:30px;text-align:left;font-weight:bold;" v-if="prizeDataDetail.detail.userCashType==1">预留信息
      </el-row>
      <el-row style="height:30px;text-align:left;" v-for="(item,idx) in prizeDataDetail.detail.content" :key="idx">
        {{item.name}}：{{item.content}}</el-row>
      <el-row style="height:30px;text-align:left;">兑奖状态：{{prizeDataDetail.detail.isProvide == 1 ? '已兑奖' : '未兑奖'}}
      </el-row>
      <el-row style="height:30px;text-align:left;" v-if="prizeDataDetail.detail.userCashType == 1">
        兑奖人员：{{prizeDataDetail.detail.nickname}}</el-row>
      <el-row style="height:30px;text-align:left;" v-if="prizeDataDetail.detail.isProvide == 1">
        兑奖时间：{{prizeDataDetail.detail.provideTime==null?"":prizeDataDetail.detail.provideTime }}</el-row>
    </el-dialog>
    <el-dialog v-if="imgScale.visible" :visible.sync="imgScale.visible" :center="true"
      @close="imgScale.visible = false;">
      <el-row style="height:auto;text-align:center;">
        <img :src="imgScale.src" style="width:auto;max-width:600px;height:auto;">
      </el-row>
    </el-dialog>
    <pagination v-if="luckdrawList.length>0" class="pull-right pageination" :paginationOpt="pagination"
      @switchPage="pagesFn" />
  </div>
</template>
<script>
import api from "api";
import navigator from "components/navigator";
import search from "components/com-search";
import pagination from "components/ui-pagination";
import httpConfig from "config/http";
export default {
  components: {
    navigator,
    search,
    pagination
  },
  data() {
    return {
      luckdrawList: [], //中奖信息列表    
      keyWords: "",
      importExcelUrl: "",
      prizeDataDetail: {
        //中奖信息详情弹窗
        visible: false,
        detail: {}
      },
      rewardCont: {
        relationId: this.$route.query.id,
        keywords: '',
        pageIndex: 1,
        pageSize: 10
      },
      pagination: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 1,
        pageCount: 0
      },
      imgScale: {
        //图片放大镜
        visible: false,
        src: ""
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background:#fafbff !important;"
      } else {
        return ""
      }
    },
    searchHander(data) {
      this.rewardCont.keyWords = data;
      this.getList()
    },
    getList(cb) {
      let self = this
      api.request("pluginDrawprize", self.rewardCont, result => {
        if (result.status == 0) {
          self.luckdrawList = result.data.list
          self.pagination.totalCount = result.data.total
          self.pagination.pageCount = Math.ceil(result.data.total / self.rewardCont.pageSize)
        }
      })
      !!cb && cb()
    },
    //投票列表数据分页调取
    pagesFn(pageIndex, cb) {
      let self = this;
      self.pagination.pageIndex = pageIndex;
      self.rewardCont.pageIndex = pageIndex
      self.getList(cb);
    },
    //中奖记录详情
    queryDetail: function (row) {
      this.prizeDataDetail.visible = true;
      this.prizeDataDetail.detail = row
    },
    // 兑奖
    prividePrize: function (id) {
      let self = this;
      api.request(
        "provideOnline",
        {
          id: id
        },
        result => {
          if (result.status == 0) {
            switch (result.data) {
              case 1:
                self.$message.error("找不到中奖记录");
                break;
              case 2:
                self.$message.error("已经兑奖");
                break;
              case 3:
                self.$message.error("不支持线上兑奖方式");
                break;
              case 4:
                self.$message.error("商家不存在");
                break;
              case 5:
                self.$message.error("稿件不存在");
                break;
              case 6:
                self.$message.error("活动不属于此商家");
                break;
              case 200:
                Kdo.utils.messenger.success("兑奖成功");
                self.getList();
                self.prizeDataDetail.detail = {};
                self.prizeDataDetail.visible = false;
                break;
            }
          }
        }
      );
    },
    // 导出表格数据
    importExcel() {
      this.importExcelUrl = httpConfig.apiHost +
        "activity/plugin/price/excel?relationId=" +
        this.rewardCont.relationId +
        "&&session_id=" +
        localStorage.getItem("sessionId");
      location.href = this.importExcelUrl
    },
    //图片放大镜
    scaleImg: function (img) {
      this.imgScale.src = img;
      console.log("图片路径")
      this.imgScale.visible = true;
    },
  },
}
</script>
<style scoped>
.export {
  height: 34px;
  padding-right: 10px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.export a:hover,
a:focus {
  text-decoration: none;
}
.search {
  text-align: right;
  padding-top: 15px;
}
.table {
  padding: 0 20px;
}
.userFace {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.pageination {
  padding-right: 20px;
}
</style>