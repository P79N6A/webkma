<template>
  <el-container class="bussiness-wallet">
    <el-main class="clear-padding">
      <el-row class="overview">
        <el-col :span="12" class="overview-left" v-if="!!accountDetail.id">
          <div style="margin-right: 78px;">
            <p class="font-14 black-deep">钱包金额</p>
            <p class="font-32 red-deep p1">
              <span class="font-12 red-deep">￥</span>{{!!accountDetail.balance ? parseFloat(accountDetail.balance).toFixed(2) : 0}}
            </p>
          </div>
          <div :span="6">
            <p class="font-14 black-deep">锁定金额</p>
            <p class="font-32 red-deep p1"><span
                class="font-12 red-deep">￥</span>{{!!accountDetail.freeze ? parseFloat(accountDetail.freeze).toFixed(2) : 0}}</p>
          </div>
        </el-col>
        <el-col :span="12" v-if="!!accountDetail.awardMoney">
          <el-button class="pull-right" type="primary" size="small"
            style="width:100px;height:34px;margin: 14px 45px 0 0;" @click="goToRecharge">充值</el-button>
        </el-col>
      </el-row>
      <el-row class="cash-detail">
        <!-- <el-tabs v-model="activeName" @tab-click="switchTab">
          <el-tab-pane label="提现概览" name="withdrawal"></el-tab-pane>
          <el-tab-pane label="充值记录" name="recharge-log"></el-tab-pane>
        </el-tabs> -->
        <el-row class="withdrawal-tpl" v-if="activeName == 'withdrawal'">
          <el-row class="font-16" style="font-weight: bold;margin-bottom:20px;">提现记录</el-row>
          <!-- <el-row>
            <div class="card mr15">
              <span><i class="iconfont icon-right"></i><span class="font-14 black-deep">提现成功</span></span>
              <span class="pull-right red-light font-26">19992</span>
            </div>
            <div class="card">
              <span><i class="iconfont icon-warning"></i><span class="font-14 black-deep">提现失败</span></span>
              <span class="pull-right red-light font-26">11222</span>
            </div>
          </el-row> -->
          <el-row class="select-option mt20 mb30">
            <span class="pull-left font-14 black-deep" style="margin-right:2px;">提现时间：</span>
            <el-date-picker class="pull-left" v-model="withdrawal.dateArr" type="daterange" start-placeholder="开始日期"
              end-placeholder="结束日期" @change="chooseDate(withdrawal)" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <span class="pull-left font-14 black-deep" style="margin:0 2px 0 30px;">提现状态：</span>
            <el-select style="width: 148px;" v-model="withdrawal.params.state" @change="search"
              :popper-append-to-body="false">
              <el-option
                v-for="item in [{name: '全部', code: ''},{name: '提现成功', code: '200'},{name: '提现中', code: '1'},{name: '提现失败', code: '0'}]"
                :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
            <!-- <span class="pull-right">
              <el-input placeholder="请输入提现人名称" v-model="withdrawal.params.name">
                <el-button class="search-btn" slot="append" @click="search">搜索</el-button>
              </el-input>
            </span> -->
          </el-row>
          <el-table ref="withdrawalTable" :data="withdrawal.list" tooltip-effect="dark" style="width: 100%" row-key="id"
            class="table" header-row-class-name="table-header" header-cell-class-name="table-header">
            <el-table-column label="序号" prop="number" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="emplName" label="提现人" align="center">
            </el-table-column>
            <el-table-column prop="accountId" label="提现账户" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="提现时间" align="center">
            </el-table-column>
            <el-table-column prop="amount" label="提现金额" align="center">
            </el-table-column>
            <el-table-column label="提现状态" align="center" prop="stateText" show-overflow-tooltip>
            </el-table-column>

          </el-table>
          <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt"
            @switchPage="pagesFn" />
        </el-row>
        <el-row class="rechargelog-tpl" v-if="activeName == 'recharge-log'">
          <el-row class="select-option" style="margin:12px 0;">
            <span class="pull-left font-12 black-light">共{{ paginationOpt.totalCount }}条</span>
            <div class="pull-right" style="display:inline-block;">
              <el-select style="width: 130px;" v-model="rechargeLog.params.type" @change="search"
                :popper-append-to-body="false">
                <el-option
                  v-for="item in [{name: '流水类型', code: ''},{name: '单人红包', code: '1'},{name: '红包裂变', code: '2'},{name: '充值', code: '3'},{name: '任务奖励', code: '4'}]"
                  :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
              <el-select style="width: 130px;margin:0 4px;" v-model="rechargeLog.params.budget_type" @change="search"
                :popper-append-to-body="false">
                <el-option v-for="item in [{name: '收支类型', code: ''},{name: '收入', code: '1'},{name: '支出', code: '2'}]"
                  :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
              <el-date-picker v-model="rechargeLog.dateArr" type="daterange" start-placeholder="开始日期"
                end-placeholder="结束日期" @change="chooseDate(rechargeLog)" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
              <el-button type="primary" size="small" style="width:100px;height:30px;margin-left: 4px;"
                @click="downExcel"><i class="iconfont icon-excel-out" style="margin-right:5px;"></i>导出</el-button>
            </div>
          </el-row>
          <el-table ref="rechargeLogTable" :data="rechargeLog.list" tooltip-effect="dark" style="width: 100%"
            row-key="id" class="table" header-row-class-name="table-header" header-cell-class-name="table-header">
            <el-table-column label="流水类型" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ typeList[scope.row.type] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="金额" align="center">
              <template slot-scope="scope">
                <span
                  :style="{color: scope.row.budget_type==1 ? '#FA766B' : '#00BAD0'}">{{ `${ scope.row.budget_type ==1 ? '+' : '-' }${scope.row.money}` }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="详情" align="center" width="300">
            </el-table-column>
            <el-table-column prop="" align="center" width="100">
            </el-table-column>
            <el-table-column label="微信账户">
              <template slot-scope="scope">
                <div class="name-cell">
                  <div class="cell-img name-cell-item"
                    :style="{backgroundImage: `url(${!!scope.row.face ? scope.row.face : (require('../../assets/images/default-headImg.png'))})`}">
                  </div>
                  <div class="cell-info name-cell-item">
                    <div class="cell-info-name">
                      <span>{{ scope.row.nickname }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="收支类型" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.budget_type !== 2 ? '收入' : '支出' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" align="center" prop="create_time" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.create_time.split(' ')[0] }}</span>
                <br>
                <span style="color: #B1BFCD">{{ scope.row.create_time.split(' ')[1] }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt"
            @switchPage="pagesFn" />
        </el-row>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import api from "api";
import httpConfig from "config/http";
import pagination from "../../components/ui-pagination";

export default {
  components: {
    pagination
  },
  name: "bussiness-info",
  data: function () {
    return {
      // 导出地址
      downUrl: httpConfig.apiHost + "capital_flow_log/download?session_id=" + localStorage.getItem("sessionId"),
      activeName: 'recharge-log',  //当前选中tab   withdrawal--提现概览    recharge-log ---充值记录
      accountDetail: {},
      typeList: ['', '单人红包', '红包裂变', '充值', '任务奖励'],
      withdrawal: { //提现相关数据
        params: {
          state: '', //提现状态code
          payStartDate: '',
          payEndDate: '',
          name: '' //提现人名称
        },
        dateArr: '',
        list: [{
          number: 1, name: '张三', time: '2019-01-05 17:00', state: '提现成功', money: '12000', account: 'xxxxxx'
        }]
      },
      rechargeLog: {
        params: {
          type: '',
          // orderId: '',
          budget_type: '', //充值方式
          start_time: '',
          end_time: ''
        },
        dateArr: '',
        list: []
      },
      paginationOpt: {//列表分页参数
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        pageCount: 0
      }
    };
  },

  mounted() {
    let self = this;
    this.getAccountDetail();
    this.init();
  },
  methods: {
    init() {
      //初始化
      this.id = this.$route.query.id || "";

      if (!this.id) {
        this.getRechargeList();
      } else {
        this.activeName = 'withdrawal';
        this.getWithdrawalList();
      }

    },
    //切换tab
    switchTab(tab, event) {
      this.activeName = tab.paneName;
      this.paginationOpt.pageIndex = 1;
      if (tab.paneName == 'recharge-log') {
        this.getRechargeList();
      }
    },
    //导出
    downExcel() {
      window.open(this.downUrl)
    },
    //获取商家账户详情
    getAccountDetail() {
      let self = this;
      api.request("getAccountDetail", {})
        .then(function (result) {
          if (result.status == 0) {
            self.accountDetail = result.data;
            self.accountDetail.awardMoney = parseFloat(self.accountDetail.balance) + parseFloat(self.accountDetail.freeze);
            self.accountDetail.awardMoney = self.fmoney(self.accountDetail.awardMoney, 2);
          } else {
            self.$message.error(result.message);
          }
        })
        .catch(function (error) {
          self.$message.error(error.message);
        });
    },
    //获取提现记录列表
    getWithdrawalList(cb) {
      let self = this;
      let option = {
        emplId: this.id,
        name: this.withdrawal.params.name,
        state: this.withdrawal.params.state,
        start_time: self.withdrawal.params.payStartDate[0],
        start_time: self.withdrawal.params.payStartDate[1],
        payEndDate: self.withdrawal.params.payEndDate,
        pageIndex: self.paginationOpt.pageIndex,
        pageSize: self.paginationOpt.pageSize
      };
      api.request("getWithdrawalList", option)
        .then(function (result) {
          if (result.status == 0) {
            _.each(result.data.dataList, (item, index) => {
              item.number = (index + 1) + (self.paginationOpt.pageSize * (self.paginationOpt.pageIndex - 1));
              switch (item.state + '') {
                case '0':
                  item.stateText = '提现失败';
                  break;
                case '1':
                  item.stateText = '提现中';
                  break;
                case '200':
                  item.stateText = '提现成功';
                  break;
              }
              item.createTime = window.timeFormdate(item.createTime);
            })
            self.paginationOpt.totalCount = result.data.pageInfo.total;
            self.paginationOpt.pageCount = Math.ceil(
              self.paginationOpt.totalCount / self.paginationOpt.pageSize
            );
            self.withdrawal.list = result.data.dataList;
          } else {
            self.$message.error(result.message || "获取提现记录失败!");
          }
          !!cb && cb();
        })
        .catch(function (error) {
          self.$message.error(error.message);
        });
    },
    //获取充值记录列表
    getRechargeList(cb) {
      let self = this;
      let option = {
        type: self.rechargeLog.params.type,
        budget_type: self.rechargeLog.params.budget_type,
        start_time: self.rechargeLog.params.payStartDate,
        end_time: self.rechargeLog.params.payEndDate,
        // orderId: self.rechargeLog.params.orderId,
        pageIndex: self.paginationOpt.pageIndex,
        pageSize: self.paginationOpt.pageSize
      };
      api.request("getRechargeList", option)
        .then(function (result) {
          if (result.status == 0) {
            self.paginationOpt.totalCount = result.data.total;
            self.paginationOpt.pageCount = Math.ceil(
              self.paginationOpt.totalCount / self.paginationOpt.pageSize
            );
            self.rechargeLog.list = result.data.list;
          } else {
            self.$message.error(result.message || "获取充值记录列表失败!");
          }
          !!cb && cb();
        })
        .catch(function (error) {
          self.$message.error(error.message);
        });
    },
    //分页
    pagesFn(pageIndex, cb) {
      let _this = this;
      _this.paginationOpt.pageIndex = pageIndex;
      _this.activeName == 'recharge-log' ? _this.getRechargeList(cb) : _this.getWithdrawalList(cb);
    },
    //搜索
    search() {
      this.paginationOpt.pageIndex = 1;
      this.activeName == 'recharge-log' ? this.getRechargeList() : this.getWithdrawalList();
    },
    //选择时间
    chooseDate(item) {
      let self = this;
      item.params.payStartDate = !!item.dateArr
        ? window.timeFormdate(item.dateArr[0]).split(' ')[0].replace(/\//g, '-') + ' 00:00:00'
        : "";
      item.params.payEndDate = !!item.dateArr
        ? window.timeFormdate(item.dateArr[1]).split(' ')[0].replace(/\//g, '-') + ' 23:59:59'
        : "";
      this.search();
    },
    //金额格式化函数
    fmoney(s, n) { //s：要格式化的数字   n：保留几位小数
      // n = n > 0 && n <= 20 ? n : 2;
      s = parseFloat((s + "").replace(/[^\d\.-]/g, "")) + "";
      var l = s.split(".")[0].split("").reverse(),
        r = !!s.split(".")[1] ? '.' + s.split(".")[1].substring(0, 2) : '',
        t = "", i;
      for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
      }
      return t.split("").reverse().join("") + r;
    },
    //充值
    goToRecharge() {
      this.$router.push({
        path: "/cash-recharge"
      });
    }
  }
};
</script>
<style scoped>
.mr15 {
  margin-right: 15px;
}
.bold {
  font-weight: bold;
}
.green {
  color: #00bad0;
}
.font-26 {
  font-size: 26px;
}
.font-32 {
  font-size: 32px;
}
.bussiness-wallet {
  width: 100%;
  padding: 21px;
  min-height: 420px;
  box-sizing: border-box;
  background-color: #ffffff;
}
.overview {
  width: 100%;
  height: 120px;
  padding: 30px 0 30px 25px;
  box-sizing: border-box;
  background-color: rgba(247, 251, 252, 1);
}
.overview-left > div {
  display: inline-block;
  height: 90px;
  text-align: center;
}
.overview-left > div .p1 {
  margin-top: 10px;
}
.cash-detail >>> .el-tabs__item {
  padding: 0 22px;
  font-weight: bold;
}
.cash-detail >>> .el-tabs__active-bar {
  width: 68px !important;
}
.cash-detail >>> .el-tabs__item {
  font-size: 16px !important;
}
.cash-detail >>> .el-date-editor--daterange.el-input,
.cash-detail >>> .el-date-editor--daterange.el-input__inner,
.cash-detail >>> .el-date-editor--timerange.el-input,
.cash-detail >>> .el-date-editor--timerange.el-input__inner {
  width: 240px;
}
.cash-detail >>> .el-date-editor .el-range__close-icon {
  margin-top: -10px;
}
.cash-detail >>> .el-date-editor .el-range-input {
  width: 90px;
  font-size: 12px;
}
.cash-detail >>> .el-date-editor .el-range__icon {
  margin-left: 3px;
  margin-top: -9.5px;
}
.cash-detail >>> .el-date-editor .el-range-separator {
  width: 10px;
  height: 33px;
  padding: 0;
}
.cash-detail >>> .el-select .el-input .el-input__inner {
  border-color: #edf2f5 !important;
  background: #fff !important;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  border-radius:0;
}
.cash-detail >>> .el-select .el-input .el-select__caret {
  line-height: 30px;
}
.cash-detail >>> .el-tabs__header {
  margin-bottom: 0px;
}
.card {
  width: 386.66px;
  height: 90px;
  line-height: 90px;
  border: 1px solid #edf2f5;
  float: left;
  padding: 0 50px;
}
.card .iconfont {
  float: left;
  font-size: 16px;
  margin: 2px 20px 0 0;
}
.card .icon-right {
  color: #00bad0;
  margin-top: 1px;
}
.card .icon-jinhangzhong {
  color: #f1861a;
}
.card .icon-warning {
  color: #cad1db;
}
.select-option {
  height: 30px;
  line-height: 30px;
}
.cash-detail .form-control {
  box-shadow: none;
  height: 40px;
  border-color: #edf2f5;
}

.search-btn {
  width: 80px;
  height: 30px;
  line-height: 6px;
  background-color: #00bad0 !important;
  border-radius: 0 4px 4px 0;
  color: #fff !important;
}
.cash-detail >>> .el-input-group--append .el-input__inner,
.cash-detail >>> .el-input-group__prepend {
  width: 191px;
  background-color: #fff !important;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
.cash-detail >>> .el-range-editor.el-input__inner,
.cash-detail >>> .el-range-editor.el-input__inner:active,
.cash-detail >>> .el-range-editor.el-input__inner:focus,
.cash-detail >>> .el-range-editor.el-input__inner:hover {
  border-color: #edf2f5 !important;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  border-radius:0;
}
.bussiness-wallet >>> .el-button {
  font-size: 14px;
  padding: 0;
}
.overview >>> .el-button {
  background: rgba(56, 152, 236, 1) !important;
  border-color: rgba(56, 152, 236, 1) !important;
}
/* 表头样式 */
.name-cell {
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
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
  color: #3c4a55;
}
.cell-info-petName {
  text-align: left;
}
</style>
