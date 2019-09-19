<template>
  <el-container class="award-list">
    <el-header class="clear-padding">
      <pageTitle :pageTitle="pageTitleOpt" @search-event="search"/>
    </el-header>
    <el-main style="padding: 0 40px;">
      <el-row style="height:30px; line-height:30px; margin:20px 0; box-sizing: border-box; ">
        <span>奖励活动时间：
          <el-date-picker
            v-model="searchParam.time"
            type="datetime"
            @change="search()"
            class="time-data-picker"
            placeholder="选择日期时间"
          ></el-date-picker>
        </span>
        <span style="padding-left: 15px;">活动状态：
          <el-select
            class="state-select"
            v-model="searchParam.state"
            placeholder="请选择"
            @change="search()"
            :popper-append-to-body="false"
          >
            <el-option value label="全部"></el-option>
            <el-option value="1" label="推广中"></el-option>
            <el-option value="2" label="已结束"></el-option>
          </el-select>
        </span>
        <el-button class="pull-right" type="primary" size="small" @click="addAward">添加奖励</el-button>
      </el-row>
      <el-table
        ref="customerTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
        row-key="id"
        class="table"
        header-row-class-name="table-header"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="name"
          label="推广奖励计划"
          align="center"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="endTime" label="奖励截止时间" align="center" width="140"></el-table-column>
         <el-table-column
              prop="address"
              label="活动状态"
              align="center"
              width="80"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{scope.row.state==1?"推广中":"已结束"}}</span>
              </template>
            </el-table-column>
        <el-table-column
          label="奖励参与部门"
          align="center"
          width="105"
          prop="groupFullName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="奖励目标活动"
          prop="activityName"
          align="center"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="peopleNumber" label="达成人数/总人数" align="center" width="120"></el-table-column>
        <el-table-column prop="teamNumber" label="达成团队数/总团队数" align="center" width="135"></el-table-column>
        <el-table-column prop="moneyNumber" label="发放金额/总金额" align="center" width="120"></el-table-column>
        <el-table-column label="操作" align="center" show-overflow-tooltip width="160">
          <template slot-scope="scope">
            <a :href="'#/detail-rewards/'+ scope.row.id" target="_blank" style="text-decoration: none;margin-right:15px;"><i class="btn-plain">查看</i></a>
            <i class="btn-plain btn-delete" @click="deleteAward(scope.row)">删除</i>
            <i class="btn-plain" @click="data(scope.row)">推广数据</i>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="paginationOpt.pageCount > 1"
        class="pull-right"
        :paginationOpt="paginationOpt"
        @switchPage="pagesFn"
      />
    </el-main>
  </el-container>
</template>

<script>
import pageTitle from "../../components/page-title";
import slideBtn from "../../components/slide-btn";
import pagination from "../../components/ui-pagination";
import api from "api";
import defaultHead from "../../assets/images/default-headImg.png";
import eventBus from "../../utils/eventBus";
import httpConfig from "../../config/http";

export default {
  components: {
    pageTitle,
    slideBtn,
    pagination
  },
  name: "employee-management",
  data: function() {
    return {
      pageTitleOpt: {
        text: "员工推广奖励",
        search: {
          value: "",
          size: "360px",
          placeholder: "请输入推广奖励计划名称/部门名称/活动名称进行搜索"
        },
        showSearch: true
      },
      paginationOpt: {
        //列表分页参数
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        pageCount: 0
      },
      searchParam: {
        search: "",
        state: "",
        time: ""
      },
      list: []
    };
  },
  computed: {},
  mounted() {
    this.getAwardList();
  },
  methods: {
    //获取员工列表
    getAwardList(cb) {
      let _this = this;
      let _option = {
        pageIndex: _this.paginationOpt.pageIndex,
        pageSize: _this.paginationOpt.pageSize,
        search: _this.searchParam.search,
        time: window.timeFormdate(_this.searchParam.time),
        state: _this.searchParam.state
      };
      api.request("getAwardList", _option, result => {
        if (result.status == 0) {
          if (result.data.list.length > 0) {
            $.each(result.data.list, (index, item) => {
              item.peopleNumber =
                item.employeeFinishCount + "/" + item.employeeTotalCount;
              item.teamNumber =
                item.groupFinishCount + "/" + item.groupTotalCount;
              item.moneyNumber =
                ((item.groupIssueMoney + item.employeeIssueMoney) == 0 ? 0 : parseFloat(item.groupIssueMoney + item.employeeIssueMoney).toFixed(2)) +
                "/" +
                ((item.groupTotalMoney + item.employeeTotalMoney) == 0 ? 0 : parseFloat(item.groupTotalMoney + item.employeeTotalMoney).toFixed(2));
            });
          }
          _this.list = result.data.list;
          _this.paginationOpt.totalCount = result.data.total;
          _this.paginationOpt.pageCount = Math.ceil(
            _this.paginationOpt.totalCount / _this.paginationOpt.pageSize
          );
        } else {
          _this.$message.error(result.message);
        }
        !!cb && cb();
      });
    },
    //搜索
    search(data) {
      if (!!data) {
        this.searchParam.search = data;
      }else{
        this.searchParam.search ="";
      }
      if(this.searchParam.time==null){
        this.searchParam.time="";
      }
      this.paginationOpt.pageIndex = 1;
      this.getAwardList();
    },
    //分页调用方法
    pagesFn(pageIndex, cb) {
      let _this = this;
      _this.paginationOpt.pageIndex = pageIndex;
      _this.getAwardList(cb);
    },
    //删除客户
    deleteAward(item) {
      let _this = this;
      this.$confirm("确定要删除当前推广奖励吗？", "提示", {
        center: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        api
          .request("deleteAward", {
            id: item.id
          })
          .then(function(result) {
            if (result.status == 0) {
              _this.$message({
                message: "操作成功!",
                type: "success"
              });
              _this.paginationOpt.pageIndex = 1;
              _this.getAwardList();
            } else {
              _this.$message.error(result.message || "操作失败!");
            }
          })
          .catch(function(error) {
            _this.$message.error(error.message);
          });
      });
    },
    //跳转去详情
    detail(item) {
      this.$router.push({
        path: "/detail-rewards/" + item.id
      });
    },
     //跳转推广数据
    data(item) {
      this.$router.push({
        path: "/awards-data?id=" + item.id
      });
    },
    //添加奖励
    addAward() {
      this.$router.push({
        path: "/add-promotion-awards"
      });
    }
  }
};
</script>
<style scoped>
.award-list .state-select >>> .el-input__inner {
  width: 110px;
}
.award-list .time-data-picker >>> .el-input__inner,
.award-list .state-select >>> .el-input__inner {
  font-size: 12px;
  height: 30px !important;
  line-height: 30px !important;
}

.award-list .time-data-picker >>> i,
.award-list .state-select >>> i {
  line-height: initial;
}

/* .checkFileBox {
  width: 370px;
  margin: 10px 0 0 23px;
  height: 34px;
  line-height: 34px;
}

.checkFileBox .importFileName {
  width: 185px;
  height: 34px;
  font: normal 12px/33px "Microsoft YaHei" !important;
  border: 1px solid #c4ced8;
  border-radius: 3px;
  color: #a0a0a0;
  text-indent: 5px;
  background: url(../../assets/images/ipm_name_bg.jpg) no-repeat;
  padding-right: 25px;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
  margin-right: 10px;
}

.cust_importCon {
  width: 490px;
  margin: 10px auto 20px;
  height: auto;
}

.cust_tag_list {
  width: 550px;
  margin: 20px auto 0;
  min-height: 40px;
  padding-left: 12px;
}

.checkFileBox span {
  font: normal 14px/33px "Microsoft YaHei";
  display: block;
  width: 100px;
  text-align: right;
  padding-right: 4px;
}

.cust_Directions span {
  width: 100px;
  line-height: 22px;
  font-size: 14px;
  text-align: right;
  padding-right: 10px;
}

.cust_Directions p {
  color: #728492;
  line-height: 22px;
}

.cust_Directions a {
  background: #f6f7fc;
  border: 1px solid #c4ced8;
  color: #3c4a55;
  width: 120px;
  height: 30px;
  line-height: 30px;
  display: block;
  text-align: center;
  border-radius: 3px;
  text-decoration: none;
  margin-top: 10px;
} */
</style>





