<template>
  <el-row>
    <!-- 任务分派顶部信息 -->
    <div class="command-header">
      <div class="command-hederLeft">
        <div class="command-headerLeft-img" :style="{backgroundImage: `url(${assignmentInfo.cover})`}">
        </div>
      </div>
      <div class="command-hederRight">
        <div class="command-hederRight-top">
          {{assignmentInfo.name}}
        </div>
        <div class="command-hederRight-bottom">
          <div :class="['command-bottom-left', assignmentInfo.plan !== 0 ? '' : 'noBorder']">
            <div class="command-hederRight-line command-hederRight-gray">
              <span>{{assignmentInfo.create_time}}</span>
              <span>创建</span>
            </div>
            <div class="command-hederRight-line command-hederRight-gray">
              <span class="rightMargin">任务周期: </span>
              <span>{{assignmentInfo.activeStartDate}}</span>
              <span>-</span>
              <span>{{assignmentInfo.activeEndDate}}</span>
            </div>
            <div class="command-hederRight-line command-hederRight-gray">
              <span class="rightMargin">激励计划: </span>
              <span>{{assignmentInfo.plan === 0 ? '无' : '红包奖励'}}</span>
            </div>
            <div class="command-hederRight-target" v-if="assignmentInfo.plan !== 0">
              <div class="command-target-title">任务目标：</div>
              <div class="command-target-values">
                <div class="command-values-item">
                  <span class="command-item-label">曝光量</span>
                  <span style="color: #F68411;">{{assignmentInfo.target_access}}</span>
                </div>
                <div class="command-values-item">
                  <span class="command-item-label">咨询量</span>
                  <span style="color: #F68411;">{{assignmentInfo.target_service}}</span>
                </div>
                <div class="command-values-item">
                  <span class="command-item-label">访客量</span>
                  <span style="color: #F68411;">{{assignmentInfo.target_visitor}}</span>
                </div>
                <div class="command-values-item">
                  <span class="command-item-label">成交量</span>
                  <span style="color: #F68411;">{{assignmentInfo.target_deal}}</span>
                </div>
                <br>
                <!-- <div class="command-values-item">
                  <span class="command-item-label">点击量</span>
                  <span style="color: #F68411;">{{assignmentInfo.target_click}}</span>
                </div> -->
              </div>
            </div>
          </div>
          <div class="command-bottom-right" v-if="assignmentInfo.plan !== 0">
            <div class="command-total-people">
              <div class="command-total-title">任务总人数</div>
              <div class="command-value big">{{assignmentInfo.count}}</div>
              <div style="margin-bottom: 11px;">
                <span class="command-label">已完成人数</span>
                <span class="command-value">{{assignmentInfo.count_finish_yes}}</span>
              </div>
              <div>
                <span class="command-label">未完成人数</span>
                <span class="command-value">{{assignmentInfo.count_finish_no}}</span>
              </div>
            </div>
            <div class="command-total-people">
              <div class="command-total-title">奖励总金额</div>
              <div class="command-value big red">
                <span
                  class="small">¥</span><span>{{!!assignmentInfo.money_count ? (assignmentInfo.money_count).toFixed(2) : 0}}</span>
              </div>
              <div style="margin-bottom: 11px;">
                <span class="command-label">任务奖励额</span>
                <span class="command-value red">{{!!assignmentInfo.money ? (assignmentInfo.money).toFixed(2) : 0}}</span>
              </div>
              <div>
                <span class="command-label">已发放奖励</span>
                <span class="command-value red">{{assignmentInfo.money_send}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="split-line"></div>
    <div class="comand-footer">
      <div class="comand-footer-title">员工指派</div>
      <div class="table-top">
        <el-checkbox class="table-top-title" v-model="checkAll" :indeterminate="isIndeterminate"
          @change="toggleSelection">
          <span class="selectAll-btn">全选</span>
        </el-checkbox>
        <button class="table-top-AssignmentBtn" @click="employeeTargetGroup(1)">分派</button> <button
          class="table-top-RevokeBtn" @click="employeeTargetGroup(0)">撤销</button>
        <div class="search-wrap">
          <span class="search-total">{{ `共有${employeePagination.totalCount}条` }}</span>
          <el-select v-if="manuscriptType != 2" v-model="searchOpt.finishStatus" placeholder="请选择任务进度"
            style="width: 132px; margin-right: 10px; color: #8694A2" @change="searchFn">
            <el-option v-for="item in comList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-if="manuscriptType != 2" v-model="searchOpt.awardStatus" placeholder="请选择奖励状态"
            style="width: 132px; margin-right: 10px; color: #8694A2" @change="searchFn">
            <el-option v-for="item in taskList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="searchOpt.dispatch" placeholder="请选择分派状态" style="width: 132px; margin-right: 10px;"
            @change="searchFn">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="searchOpt.keyWords" placeholder="请输入员工姓名/手机号/微信昵称" style="width: 240px;"></el-input>
          <span class="search-btn" @click="searchFn">查询</span>
        </div>
      </div>
      <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="employeeList"
        @sort-change="sortChangeHandler" tooltip-effect="dark" style="width: 100%" row-key="id" class="table"
        header-row-class-name="table-header" header-cell-class-name="table-header">
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column label="昵称/身份" width="220" align="center" prop="name" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="name-cell">
              <div class="cell-img name-cell-item"
                :style="{backgroundImage: `url(${!!scope.row.face ? scope.row.face : (!!scope.row.WXface ? scope.row.WXface : require('.././../.././../assets/images/default-headImg.png'))})`}">
              </div>
              <div class="cell-info name-cell-item">
                <div class="cell-info-petName" v-if="!!scope.row.WXname">{{ scope.row.WXname }}</div>
                <div class="cell-info-name">
                  <span v-if="scope.row.isManager === 1" style="padding: 1px 4px; background: #FA766B; color: #fff">BOSS</span>
                  <span v-else>员工:</span>
                  <span>{{ scope.row.name }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="manuscriptType != 2" label="任务指数" width="240px" prop="phone" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <p class="table-cell-item first">
              <span>曝光量</span>
              <span class="table-cell-value">{{ scope.row.target_access }}</span>
            </p>
             <p class="table-cell-item">
              <span>咨询量</span>
              <span class="table-cell-value">{{ scope.row.target_service }}</span>
            </p>
            <p class="table-cell-item">
              <span>访客量</span>
              <span class="table-cell-value">{{ scope.row.target_visitor }}</span>
            </p>
            <p class="table-cell-item end">
              <span>成交量</span>
              <span class="table-cell-value">{{ scope.row.target_deal }}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column v-if="manuscriptType != 2" label="任务进度" width="150" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ assignmentInfo.plan !== 0 ? (scope.row.distribution === 0 ? '-' : (scope.row.finish_status === 0 ? '未完成' : '已完成')) : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="manuscriptType != 2" label="奖励状态" width="150" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>{{ assignmentInfo.plan !== 0 ? (scope.row.distribution === 0 ? '-' : payGiftList[scope.row.issue_status]) : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="manuscriptType != 2" label="当前任务营销力" show-overflow-tooltip align="center" sortable="custom" width="180">
          <template slot-scope="scope">
            <span style="color: #F68411">{{ scope.row.marketing }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" show-overflow-tooltip prop="phone" align="center"></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip width="160" align="center">
          <template slot-scope="scope">
            <!-- <el-button>123</el-button> -->
            <div @click="employeeTargetSingle(scope.row)">
              <slideBtn :selfCtr="true" :slideBtnOpt="scope.row" active-text="分派" inactive-text="撤销"
                :prop-value-map="{0:1,1:0}" prop-key="distribution"></slideBtn>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="employeeList.length>0" class="pull-right" :paginationOpt="employeePagination"
        @switchPage="employeePagesFn" style="margin-top: 0" />
      <el-dialog :title=" type === 1 ? '分派任务' : '撤销任务'" :visible.sync="revokeReward" @close="handleClose" width="500px"
        top="20vh" :center="true" class="AssignmentMc-box">
        <!-- " -->
        <div class="AssignmentMc-form-text">
          <div class="totalMoney">
            <span style="color:#555555; margin-right:5px;">奖励金额 / 账户余额: </span>
            <span>{{assignmentInfo.money !==0 ? parseFloat(assignmentInfo.money).toFixed(2) : 0}}</span>
            <span>/</span>
            <span>{{assignmentInfo.balance !== 0 ? parseFloat(assignmentInfo.balance).toFixed(2) : 0}}</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="employeeTargetSet">{{ type === 1 ? '分派' : '撤销'}}</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </el-row>
</template>

<script>
import slideBtn from "components/slide-btn";
import pagination from "components/ui-pagination";
import api from "api";

export default {
  name: 'taskAssignment',
  components: {
    slideBtn,
    pagination
  },
  props: {
    manuscriptType: {
      type: [String, Number],
      default: 1
    }
  },
  data() {
    return {
      // 任务状态
      comList: [
        {
          label: '全部任务状态',
          value: ''
        },
        {
          label: '未完成',
          value: '0'
        },
        {
          label: '已完成',
          value: '1'
        }
      ],
      // 分派状态
      statusList: [
        {
          label: '全部分派状态',
          value: ''
        },
        {
          label: '已分派',
          value: 'already'
        },
        {
          label: '未分派',
          value: 'notyet'
        }
      ],
      // 发放状态
      payGiftList: ['未发放', '已发放'],
      // 分派状态
      type: 0,
      // 任务筛选
      taskList: [
        {
          label: '全部奖励状态',
          value: ''
        },
        {
          label: '未发放',
          value: 0
        },
        {
          label: '已发放',
          value: 1
        }
      ],
      assignmentInfo: {
        // 任务奖励
        money: 0,
        balance: 0,
        // 是否展示活动
        award_count: -1,
        // 活动状态
        actStatus: 1,
        // 任务状态
        status: 1,
        cover: require('.././../.././../assets/images/cover-empty.jpg'),
        name: '',
        create_time: '',
        // 激励计划.任务周期
        plan: 0,
        activeStartDate: '',
        activeEndDate: '',
        target_access: 0,
        target_visitor: 0,
        target_deal: 0,
        target_click: 0,
        target_service: 0,
        // 任务人数
        count: 0,
        count_finish_no: 0,
        count_finish_yes: 0,
        // 奖励总金额
        money_count: 0,
        money_remain: 0,
        money_send: 0
      },
      userId: 0,
      targetType: 1,
      // 弹窗
      revokeReward: false,
      // 奖励列表
      rewardList: [],
      // 活动状态
      checkAll: false,
      isIndeterminate: false,
      hasThumbup: true,
      multipleSelection: [],
      searchOpt: {
        keyWords: '',
        dispatch: '',
        awardStatus: '',
        finishStatus:'',
        manuscriptId: this.$route.query.id,
        orderBy: null,
        state: 0
      },
      employeeList: [],
      employeePagination: {
        //人员分派分页
        pageIndex: 1,
        pageSize: 4,
        totalCount: 1,
        pageCount: 0
      }
    }
  },
  mounted() {
    this.getAssignmentInfo()
    this.getList()
  },
  methods: {
    // 获取基础信息
    getAssignmentInfo() {
      let businessId = 0
      if (typeof this.$store.state.login.userInfo === 'object') {
        businessId = this.$store.state.login.userInfo.businessInfo.businessId
      } else {
        businessId = JSON.parse(this.$store.state.login.userInfo).businessInfo.businessId
      }
      api.request("getAssignmentInfo", {
        id: this.$route.query.id,
        businessId
      }, result => {
        if (result.status === 0) {
          const data = result.data
          for (let key in this.assignmentInfo) {
            if (!!data[key] || data[key] === 0) {
              if (key === 'create_time' || key === 'activeStartDate' || key === 'activeEndDate') {
                this.assignmentInfo[key] = window.timeFormdate(data[key])
              } else {
                this.assignmentInfo[key] = data[key]
              }
            }
          }
        } else {
          this.$message({
            type: 'warning',
            message: result.message
          })
        }
      })
    },
    // 获取列表
    getList(cb) {
      var self = this
      api.request('getEmployeearchList', {
        ...this.searchOpt,
        pageIndex: this.employeePagination.pageIndex,
        pageSize: this.employeePagination.pageSize
      }, result => {
        if (result.status === 0) {
          this.employeeList = result.data.list
          self.employeePagination.totalCount = result.data.total;
          self.employeePagination.pageCount = Math.ceil(
            self.employeePagination.totalCount /
            self.employeePagination.pageSize
          );
        } else {
          this.$message({
            type: 'warning',
            message: result.message
          })
        }
        !!cb && cb();
      })
    },
    searchFn() {
      this.employeePagination.pageIndex = 1;
      this.searchOpt.orderBy = null
      this.$refs.multipleTable.clearSort()
      this.employeeList = [];
      this.getList();
    },
    // 列表排序
    sortChangeHandler(orderBy) {
      let { order, prop } = orderBy;
      if (!!order) {
        this.searchOpt.orderBy = [
          {
            [prop]: order === "descending" ? "desc" : "asc"
          }
        ];
      } else {
        this.searchOpt.orderBy = null;
      }
      this.employeePagination.pageIndex = 1
      this.getList()
    },
    //全选按钮
    toggleSelection(val) {
      let row = this.employeeList;
      if (
        this.multipleSelection.length > 0 &&
        this.multipleSelection.length != this.employeeList.length
      ) {
        row = this.employeeList.filter(
          item => !this.multipleSelection.some(ele => ele.id === item.id)
        );
      }
      row.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      });
      console.log(this.multipleSelection)
    },
    // 列表复选框事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
      const checkedCount = val.length;
      this.checkAll = checkedCount === this.employeeList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.employeeList.length;
    },
    // 员工分页
    employeePagesFn(pageIndex, cb) {
      let self = this;
      self.employeePagination.pageIndex = pageIndex;
      self.getList(cb);
    },
    // 分派撤销
    employeeTargetSet() {
      const self = this
      if (this.assignmentInfo.money > this.assignmentInfo.balance) {
        this.$message({
          type: 'warning',
          message: '账户金额不足，分派失败'
        })
      } else {
        api.request('assignEmployee', {
          manuscriptId: self.$route.query.id,
          distribution: self.type,
          employeeId: self.sendData
        }, result => {
          if (result.status === 0) {
            self.getAssignmentInfo()
            self.getList()
            this.handleClose()
          } else {
            self.$message({
              type: 'warning',
              message: result.message
            })
          }
        })
      }
    },
    // 独立分派撤销
    employeeTargetSingle(row) {
      if ((this.assignmentInfo.status === 2 || this.assignmentInfo.status === 4) && row.distribution === 1) {
        this.$message({
          type: 'warning',
          message: '任务开始后只能分派员工,无法撤销员工'
        })
      } else if (this.assignmentInfo.status === 3) {
        this.$message({
          type: 'warning',
          message: '任务已经结束,无法进行分派撤销操作'
        })
      } else {
        this.sendData = []
        this.sendData.push(row.id)
        this.type = row.distribution === 1 ? 0 : 1
        this.openTargetDialog()
      }
    },
    // 批量分派撤销(0为撤销, 1为分派)
    employeeTargetGroup(type) {
      if ((this.assignmentInfo.status === 2 || this.assignmentInfo.status === 4) && type === 0) {
        this.$message({
          type: 'warning',
          message: '任务开始后只能分派员工,无法撤销员工'
        })
      } else if (this.assignmentInfo.status === 3) {
        this.$message({
          type: 'warning',
          message: '任务已经结束,无法进行分派撤销操作'
        })
      } else {
        this.sendData = []
        this.type = type
        if (this.multipleSelection.length > 0) {
          if (this.multipleSelection.some(ele => ele.distribution !== type)) {
            this.multipleSelection.forEach((ele, index) => {
              if (ele.distribution !== type) {
                this.sendData.push(ele.id)
              }
            })
            this.openTargetDialog()
          } else {
            this.$message({
              type: 'warning',
              message: type === 1 ? '已经为分派状态' : '已经为撤销状态'
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请先选择员工'
          })
        }
      }
    },
    // 弹窗控制
    openTargetDialog() {
      console.log(this.sendData)
      this.revokeReward = true
    },
    handleClose() {
      this.revokeReward = false
    },
    // 清空选中项
    clearChecked() {
      this.checkAll = false;
      this.isIndeterminate = false;
      this.$refs.multipleTable.clearSelection();
    }
  }
}
</script>
<style>
/* 取消第一行表格的选中框 */
.table .has-gutter .el-checkbox {
  display: none;
}
.comand-footer .table-top .el-input__inner {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  /* width: 132px; */
}
.el-message{
  min-width: 320px !important;
}
</style>

<style scoped>
/* 任务分派顶部信息 */
.command-header {
  width: 100%;
  padding: 32px 0 32px 50px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
/* 左侧 */
/* .command-header .command-hederLeft {
  
} */
.command-header .command-hederLeft .command-headerLeft-img {
  width: 100px;
  height: 187px;
  background-repeat: no-repeat;
  background-size: contain;
}
.command-header .command-hederRight {
  width: calc(100% - 100px);
  height: 187px;
  padding-left: 29px;
  /* background: #999; */
}
.command-header .command-hederRight .command-hederRight-top {
  font-size: 14px;
  color: #3c4a55;
  margin-bottom: 16px;
}
.command-header .command-hederRight .command-hederRight-bottom {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;
}
.command-hederRight .command-hederRight-bottom .command-bottom-left {
  width: 60%;
  height: 150px;
  padding-right: 30px;
  border-right: 1px solid #e3e6eb;
}
.command-hederRight .command-hederRight-bottom .command-bottom-left.noBorder {
  border-right: none;
}
.command-header .command-hederRight .command-hederRight-gray span {
  font-size: 12px;
  color: #b1bfcd;
}
.command-header .command-hederRight .command-hederRight-line {
  margin-bottom: 10px;
}
.command-hederRight .command-hederRight-target {
  background: rgba(247, 251, 252, 1);
  padding: 15px 0 15px 11px;
  display: flex;
}
.command-hederRight .command-hederRight-target .command-target-title {
  margin-right: 12px;
  width: 70px;
}
.command-hederRight .command-hederRight-target div {
  display: inline-block;
}
.command-hederRight-target .command-target-values .command-values-item {
  margin-right: 50px;
  color: #3c4a55;
  min-width: 100px;
}
.command-hederRight-target
  .command-target-values
  .command-values-item:first-child {
  margin-bottom: 5px;
}
.command-hederRight-target
  .command-target-values
  .command-values-item
  .command-item-label {
  margin-right: 4px;
}
/* 任务总人数 */
.command-hederRight .command-hederRight-bottom .command-bottom-right {
  padding: 17px 0 13px 80px;
  font-size: 12px;
  color: #3c4a55;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  align-content: flex-start;
}
.command-hederRight-bottom .command-bottom-right .command-total-people {
  /* margin-right: 80px; */
  width: 50%;
}
.command-hederRight-bottom .command-bottom-right .command-total-title {
  margin-bottom: 4px;
}
.command-hederRight .command-hederRight-bottom .command-bottom-right .big {
  font-size: 24px;
  margin-bottom: 16px;
}
.command-hederRight-bottom .command-bottom-right .big .small {
  font-size: 12px;
  margin-right: 2px;
  margin-bottom: 26px;
}
.command-hederRight
  .command-hederRight-bottom
  .command-bottom-right
  .command-value {
  color: #f68411;
}
.command-hederRight
  .command-hederRight-bottom
  .command-bottom-right
  .command-value.red {
  color: #fa766b;
}
.command-hederRight
  .command-hederRight-bottom
  .command-bottom-right
  .command-label {
  color: #b1bfcd;
  margin-right: 5px;
}
.command-hederRight
  .command-hederRight-bottom
  .command-bottom-right
  .command-label.first {
  margin-bottom: 17px;
}
/* 下部列表 */
.comand-footer {
  padding: 28px 20px 0;
}
.comand-footer .comand-footer-title {
  font-size: 14px;
  margin-bottom: 16px;
}
/* 列表 */
.table-top {
  overflow: hidden;
  line-height: 50px;
  height: 50px;
  padding: 0 14px;
  /* margin-top: 18px; */
  position: relative;
}
.table-top .table-top-title {
  float: left;
  font: 400 14px/48px "Microsoft YaHei";
  line-height: 50px;
  margin: 0;
}
.table-top .table-top-title .selectAll-btn {
  font: 400 14px/48px "Microsoft YaHei";
}
.table-top .table-top-AssignmentBtn,
.table-top .table-top-RevokeBtn {
  background-color: transparent;
}
.table-top .table-top-AssignmentBtn {
  color: #2578c0;
  margin: 0 14px 0 15px;
}
.table-top .table-top-RevokeBtn {
  color: #dc4437;
}
/* 搜索框样式 begin*/
.search-wrap {
  position: relative;
  float: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.search-total {
  font-size: 12px;
  color: #b1bfcd;
  margin-right: 18px;
}
.search-wrap .form-control {
  border-radius: 0;
  border: 1px solid #bbbec3;
  box-shadow: none;
}
.search-btn {
  display: inline-block;
  width: 64px;
  height: 30px;
  line-height: 30px;
  background: #01bacf;
  border-radius: 0 4px 4px 0;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
.table-cell-item {
  width: 100%;
  padding-left: 40%;
  margin: 0 auto;
  text-align: left;
}
.table-cell-item.first {
  margin-top: 10px;
}
.table-cell-item.end {
  margin-bottom: 10px;
}
.table-cell-item span:first-child {
  margin-right: 4px;
  /* width: 100%; */
}
.table-cell-value {
  font-size: 12px;
  color: #f68411;
}
/* 分割线 */
.split-line {
  width: calc(100% - 40px);
  margin: 0 auto;
  height: 1px;
  background: #e3e6eb;
}
.rightMargin {
  margin-right: 2px;
}
/* 列表昵称格 */
.name-cell {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;
}
.name-cell-item {
  font-size: 12px;
}
.cell-img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
}
.cell-info.name-cell-item div {
  line-height: 20px;
}
.cell-info-name {
  color: #b1bfcd;
}
.cell-info-petName {
  text-align: left;
}
/* 分派弹窗 */
.AssignmentMc-box {
  font: 500 18px "微软雅黑 Regular";
}
.AssignmentMc-box .AssignmentMc-from .el-form-item__label {
  font-weight: 200;
  color: red;
}
.AssignmentMc-box .AssignmentMc-form-text {
  margin-left: 15px;
}
.AssignmentMc-box .AssignmentMc-form-text .AssignmentMc-select {
  height: auto;
  max-height: 290px;
  padding: 15px 25px;
  background-color: #fafbff;
  border: 1px solid #daebfe;
  margin: 15px 0 18px 0;
  overflow-y: auto;
  /* box-shadow:inset 5px -56px 78px -52px rgba(0,0,0,.3); */
}
.AssignmentMc-form-text .AssignmentMc-select .selectName {
  color: #63717b;
  margin-left: -10px;
}
.AssignmentMc-form-text .AssignmentMc-select .selectName:not(:last-child) {
  margin-bottom: 20px;
}
.AssignmentMc-box .AssignmentMc-form-text .totalMoney {
  font-size: 14px;
  color: #fa766b;
}
</style>


