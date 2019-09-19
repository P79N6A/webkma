<template>
  <el-container class="award-data-m">
    <el-main style="display: flex;">
      <div class="department">
        <el-tree
          ref="departmentTree"
          :data="departmentTree"
          :expand-on-click-node="false"
          node-key="id"
          highlight-current
          default-expand-all
          @node-click="selectDep"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }" style="position: relative;">
            <span v-if="!data.isEdit" class="node-label">{{ node.label }}</span>
            <el-input
              v-model="editDepObj.label"
              placeholder="请输入部门名称"
              :autofocus="true"
              v-if="data.isEdit"
              class="dep-name-input"
              maxlength="10"
            ></el-input>
            <span class="emp-count" v-if="!data.isEdit">{{data.employeeCount}}</span>
          </span>
        </el-tree>
      </div>

      <div class="content-body clear-padding">
        <div style="width:100%;">
          <el-header class="clear-padding">
            <pageTitle :pageTitle="pageTitleOpt" @search-event="search"/>
          </el-header>
          <div style="padding:0 25px;">
            <div class="team-awards">
              <el-row style="    height: 34px;">
                <i class="iconfont icon-zuzhijiagou"></i>
                <span class="title">团队奖励</span>
                <span class="money-awards" v-if="isSetTeamAwards">
                  奖励金额：
                  <span style="color: #ff676d;">{{teamAwardsInfo.money}}</span>
                </span>
                <span class="pull-right" style="font-size:14px;"  v-if="isSetTeamAwards"> 
                  <i
                    class="iconfont"
                    :class="teamAwardsInfo.finishStatus==0?'icon-warning red-deep':'icon-right'"
                  ></i>
                  目标{{teamAwardsInfo.finishStatus==0?"未":""}}达成
                </span>
              </el-row>
              <div class="data-info">
                <div v-if="!isSetTeamAwards">
                  <el-row>当前团队未设置团队奖励目标</el-row>
                </div>
                <div v-if="isSetTeamAwards">
                  <el-row style="height:25px;">
                    <el-col :span="8">目标访问数：{{teamAwardsInfo.targetAccess}}</el-col>
                    <el-col :span="8">目标访客数：{{teamAwardsInfo.targetVisitor}}</el-col>
                    <el-col :span="8">目标分享数：{{teamAwardsInfo.targetShare}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8">当前访问数：{{teamAwardsInfo.access}}</el-col>
                    <el-col :span="8">当前访客数：{{teamAwardsInfo.visitor}}</el-col>
                    <el-col :span="8">当前分享数：{{teamAwardsInfo.share}}</el-col>
                  </el-row>
                </div>
              </div>
            </div>
            <div class="employee-awards">
              <el-row style="margin: 20px 0;">
                <i class="iconfont icon-tuandui1"></i>
                <span class="title">部门人员</span>
              </el-row>
              <div class="data-info">
                <el-row>
                  <el-col :span="8">目标访问数：{{employeeAwardsInfo.targetAccess}}</el-col>
                  <el-col :span="8">目标访客数：{{employeeAwardsInfo.targetVisitor}}</el-col>
                  <el-col :span="8">目标分享数：{{employeeAwardsInfo.targetShare}}</el-col>
                </el-row>
              </div>
            </div>

            <el-table
              ref="employeesTable"
              :data="list"
              tooltip-effect="dark"
              row-key="id"
              class="table"
              header-row-class-name="table-header"
              header-cell-class-name="table-header"
              @sort-change="sortChangeHandler"
            >
              <el-table-column
                prop="name"
                label="姓名"
                align="center"
                class-name="number_color"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="access"
                label="推广访问数"
                align="center"
                sortable="custom"
                class-name="number_color"
                width
              ></el-table-column>
              <el-table-column
                prop="visitor"
                label="推广访客数"
                align="center"
                sortable="custom"
                class-name="number_color"
                width
              ></el-table-column>
              <el-table-column
                prop="share"
                label="推广分享数"
                align="center"
                sortable="custom"
                class-name="number_color"
              ></el-table-column>
              <el-table-column prop="money" label="奖励金额" align="center" class-name="number_color"></el-table-column>
              <el-table-column
                prop="finishStatus"
                label="是否达成推广目标"
                align="center"
                class-name="number_color"
              >
                <template slot-scope="scope">{{scope.row.finishStatus==0?'否':'是'}}</template>
              </el-table-column>
            </el-table>
            <pagination
              v-if="paginationOpt.pageCount > 1"
              class="pull-right"
              :paginationOpt="paginationOpt"
              @switchPage="pagesFn"
            />
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import pageTitle from "../../components/page-title";
import slideBtn from "../../components/slide-btn";
import pagination from "../../components/ui-pagination";
import api from "api";
import defaultHead from "../../assets/images/default-headImg.png";
import httpConfig from "config/http";
import treeTransfer from "../../components/tree-transfer";

export default {
  components: {
    pageTitle,
    slideBtn,
    pagination,
    treeTransfer
  },
  name: "award-data-management",
  data: function() {
    return {
      pageTitleOpt: {
        text: "推广奖励数据",
        search: {
          value: "",
          placeholder: "请输入关键词搜索"
        },
        showSearch: false
      },
      paginationOpt: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        pageCount: 0
      },
      list: [], //员工列表数据
      selectAll: false, //全选

      isSetTeamAwards: false,
      teamAwardsInfo: {}, //团队奖励信息
      employeeAwardsInfo: {}, //员工奖励信息
      awardId: "",
      orderBys: "",

      departmentTree: [], //部门树
      editDepObj: {},
      selectedDep: {}, //选中部门
      actionDep: {} //要操作部门
    };
  },
  computed: {},
  mounted() {
    this.awardId = this.$route.query.id;
    return new Promise((resolve, reject) => {
      this.getDepartmentTreeAwards(() => {
        resolve(true);
      });
    })
      .then(data => {
        this.getAwardTeamInfo();
        this.getAwardEmployee();
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    getDepartmentTreeAwards(cb) {
      let _this = this;
      _this.actionDep.id = "";
      _this.editDepObj.label = "";
      let _option = { id: _this.awardId };
      api.request("getDepartmentTreeAwards", _option, result => {
        if (result.status == 0) {
          _this.departmentTree = result.data.map(item => {
            item.isEdit = false;
            return item;
          });
          if (!_this.selectedDep.id)
            _this.selectedDep = _this.departmentTree[0];
          setTimeout(() => {
            _this.$refs.departmentTree.setCurrentKey(_this.selectedDep.id);
          });
        } else {
          _this.$message.error(result.message);
        }
        !!cb && cb();
      });
    },
    //选择部门
    selectDep(data, node, nodeTarget) {
      this.selectedDep = data;
      this.paginationOpt.pageIndex = 1;
      this.getAwardTeamInfo();
      this.getAwardEmployee();
    },
    //获取团队奖励
    getAwardTeamInfo() {
      let _this = this,
        _option = {
          id: this.awardId,
          deptId: _this.selectedDep.id
        };
      api.request("getAwardTeamInfo", _option, result => {
        if (result.status == 0) {
          if (result.data.length == 0) {
            _this.isSetTeamAwards = false;
          } else {
            _this.isSetTeamAwards = true;
            _this.teamAwardsInfo = result.data[0];
          }
        } else {
          _this.$message.error(result.message);
        }
      });
    },
    //获取员工奖励列表
    getAwardEmployee(cb) {
      let _this = this,
        _option = {
          id: this.awardId,
          deptId: _this.selectedDep.id,
          pageIndex: _this.paginationOpt.pageIndex,
          pageSize: _this.paginationOpt.pageSize,
          orderBy: _this.orderBys
        };
      api.request("getAwardEmployee", _option, result => {
        if (result.status == 0) {
          _this.employeeAwardsInfo = result.data.info;
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
      let _this = this;
      this.keyWords = data;
      this.paginationOpt.pageIndex = 1;
      this.getAwardEmployee(() => {}, {
        pageIndex: _this.paginationOpt.pageIndex,
        pageSize: _this.paginationOpt.pageSize,
        orderBy: _this.orderBys,
        keyWords: _this.keyWords
      });
    },
    //分页调用方法
    pagesFn(pageIndex, cb) {
      let _this = this;
      _this.pagination = pageIndex;
      _this.getAwardEmployee(cb);
    },
    //排序
    sortChangeHandler(orderBy) {
      let { order, prop } = orderBy;
      if (!!prop) {
        this.orderBys = [
          {
            [prop]: order === "descending" ? "desc" : "asc"
          }
        ];
        this.getAwardEmployee();
      }
    }
  }
};
</script>
<style>
.award-data-m {
  padding: 0;
}
.award-data-m .page-title {
  padding-left: 25px !important; 
}
.award-data-m .el-main {
  padding: 0;
}
.award-data-m .search-wrap {
  /* position:absolute !important;
right: 20px; */
}
.award-data-m .search-wrap input {
  font-size: 12px;
}
.award-data-m .department {
  padding: 40px 20px;
  max-width: 275px;
}
.award-data-m .department .icon-class {
  background-image: url("../../assets/images/employee/manager-icon.png");
}

.award-data-m .department .dep-name-input {
  height: 26px;
}
.award-data-m .department .dep-name-input input {
  background-color: #eff7fa;
  border: 0;
  font-size: 12px;
}
.award-data-m .icon-write {
  font-size: 12px;
}
.award-data-m .department .emp-count {
  margin-left: 10px;
}
.award-data-m .department .edit-btn {
  width: 12px;
  height: 12px;
  line-height: 12px;
  font-size: 12px;
  padding: 0;
  border: 0;
  color: #888;
}

.award-data-m .department .edit-btn:hover {
  background-color: #fff;
}
.award-data-m .department .edit-btn:visited {
  background-color: #fff;
}
.award-data-m .department .edit-btn:active {
  /* color: #fff; */
  background-color: #fff;
}

.award-data-m .department .action-menu {
  width: 70px;
  /* height: 100px; */
  position: absolute;
  text-align: center;
  padding: 3px;
  /* padding-bottom: 0; */
  border: 1px solid #ebeef5;
  background-color: #fff;
  right: -61px;
  z-index: 2;
  box-shadow: 0px 0px 10px 3px #ebeef5;
}

.award-data-m .department .action-menu .item {
  height: 32px;
  line-height: 32px;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
}

.award-data-m .department .action-menu .item:hover {
  background-color: #f4f9fb;
}

.award-data-m .department .action-menu .item:last-child {
  border: 0;
}

/* .department .node-label:hover {
  color: #00bad0;
}
.department .node-label:active {
  color: #00bad0;
} */

.award-data-m .content-body {
  /* width: 100%; */
  min-width: 930px;
  max-width: 990px;
  width: 100%;
  padding: 25px;
  border-left: 10px solid #eff7fa;
  height: calc(100vh - 50px);
  max-height: calc(100vh - 50px);
}

.award-data-m .content-body .team-awards .title,
.award-data-m .content-body .employee-awards .title {
  font-size: 14px;
}

.award-data-m .content-body .data-info {
  padding: 20px;
  background-color: #f7fbfc;
}

.award-data-m .content-body .employee-awards {
  margin-bottom: 10px;
}

.award-data-m .content-body .team-awards {
  margin-top: 20px;
}

.award-data-m .content-body .team-awards i,
.award-data-m .content-body .employee-awards i {
  color: #00bad0;
  font-size: 15px;
  margin-right: 10px;
}
.award-data-m .content-body .team-awards .money-awards {
  padding: 8px 15px;
  margin-left: 10px;
  background-color: #def4f8;
}

.award-data-m .content-body .manager-icon {
  width: 25px;
  height: 14px;
  position: absolute;
  top: 13px;
  left: -18px;
  background-image: url("../../assets/images/employee/manager-icon.png");
}

.award-data-m .content-body .export-btn {
  margin: 0 15px;
}
.award-data-m .content-body .export-btn:hover {
  text-decoration: none;
}

.award-data-m .checkFileBox {
  width: 370px;
  margin: 10px 0 0 23px;
  height: 34px;
  line-height: 34px;
}

.award-data-m .checkFileBox .importFileName {
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

.award-data-m .cust_importCon {
  width: 490px;
  margin: 10px auto 20px;
  height: auto;
}

.award-data-m .cust_tag_list {
  width: 550px;
  margin: 20px auto 0;
  min-height: 40px;
  padding-left: 12px;
}

.award-data-m .checkFileBox label {
  font: normal 14px/33px "Microsoft YaHei";
  display: block;
  width: 100px;
  text-align: right;
  padding-right: 4px;
  font-weight: normal;
}

.award-data-m .cust_Directions span {
  width: 100px;
  line-height: 22px;
  font-size: 14px;
  text-align: right;
  padding-right: 10px;
}

.award-data-m .cust_Directions p {
  color: #728492;
  line-height: 22px;
}

.award-data-m .cust_Directions a {
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
}

.award-data-m .custom-tree-node .node-label {
  display: inline-block;
  max-width: 170px;
  height: 11px;
  line-height: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.award-data-m .el-tree-node > .el-tree-node__children {
  overflow: inherit !important;
}
.award-data-m .el-tree-node__content {
  height: 30px;
}
.award-data-m .el-tree-node__content .emp-btn {
  /* display: none; */
  visibility: hidden;
}

.award-data-m .el-tree-node__content:hover .emp-btn {
  /* display: inline-block; */
  visibility: visible;
}

.award-data-m .transfer-empl-tree-node {
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  color: #606266;
}

.award-data-m .transfer-empl-tree-node .image-icon {
  margin: 4px 4px 0 0;
  float: left;
  width: 16px;
  height: 16px;
}
.award-data-m .transfer-empl-tree-node .image-icon.dept {
  background: url(../../assets/images/department.png) no-repeat;
  background-size: 16px;
}
.award-data-m .transfer-empl-tree-node .image-icon.empl {
  background: url(../../assets/images/person.png) no-repeat;
  background-size: 16px;
}
</style>



