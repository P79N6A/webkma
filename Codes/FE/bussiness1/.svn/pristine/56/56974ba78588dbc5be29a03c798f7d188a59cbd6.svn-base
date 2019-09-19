<template>
  <div class="integral-box">
    <div class="header-seach">
      <p>营销力积分<span>{{tableData.taskPower}}</span>，排行<span>{{tableData.taskRank == -1?0:tableData.taskRank}}</span></p>
      <div class="query-box">
        <el-select placeholder="活动类型" size="mini" style="border-radius:none;margin-right:10px;width:100px" v-model="data_.type"
          @change="optionSelect()">
          <el-option label="只看客户" value="2"></el-option>
          <el-option label="只看员工" value="1"></el-option>
        </el-select>
        <el-input placeholder="输入关键字搜索" size="mini"
          style="border-radius:none;width:200px;padding-right:10px;border:none" v-model="data_.keywords">
          <el-button slot="append" style="background:#00BAD0;color:#ffffff;border-radius:none;" size="mini"
            @click="select">查询
          </el-button>
        </el-input>
        <!-- <el-button class="exportBtn" size="mini">
          <img
            src="https://resource.tuixb.cn/dev/00000000-0000-0000-0000-000000000000/KMA/default/4f3a8735-890f-479d-ac21-f14ab6b787e3.png"
            alt="">导出
        </el-button> -->
      </div>
    </div>
    <el-table :data="tableData.list" style="width: 98%;margin:0 auto"
      :default-sort="{prop: 'date', order: 'descending'}" :header-cell-style="{background:'#F7FBFC'}"
      @sort-change="sortChangeHandler">
      <el-table-column prop="date" label="昵称/身份">
        <template slot-scope="scope">
          <div style="display: flex; margin:10px 0;">
            <div>
              <img style="width:40px;height:40px;margin-right:12px;border-radius:40px;"
                :src="scope.row.headImage ||'../../assets/images/default-headImg.png' " />
            </div>
            <div class="font-12">
              <p class="black-deep">{{scope.row.userName}}</p>
              <p class="tipText-color" v-if="scope.row.empName">员工:{{scope.row.empName}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="power" label="营销力积分" align="center">
      </el-table-column>
      <el-table-column prop="browseCount" label="带来曝光量" sortable="custom" align="center">
      </el-table-column>
      <el-table-column prop="userCount" label="带来客户量" sortable="custom" align="center">
      </el-table-column>
      <el-table-column prop="serviceCount" label="带来咨询量" sortable="custom" align="center">
      </el-table-column>
      <el-table-column prop="orderCount" label="带来成交量" sortable="custom" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-popover:popover @click="details(scope.row)">
            人脉详情 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-if="tableData.list!=''" class="pull-right" :paginationOpt="paginationOpt" @switchPage="employeePagesFn" />
    <div v-if="dialogVisible">
      <el-dialog title="" :visible.sync="dialogVisible" width="70%" close="dialog">
        <div class="dialog-box">
          <div>
            <!-- //客户详情传1  员工详情传2 -->
            <userChart :userData="userData" :type="indexType==1 ? 'customer': 'employee'" :taskId="$route.query.id"/>
          </div>
          <div>
            <el-row class="navigator">
              <navigator :tabs="navigatorOpts.tabs" @navigator-event="transferTab"></navigator>
              <div class="header-goBack" @click="goBack" v-if="navigatorOpts.selectedKey === '6'">返回上一页</div>
            </el-row>
            <el-row v-if="navigatorOpts.selectedKey === '0'">
              <humanityPath :IDList="IDList"></humanityPath>
            </el-row>
            <el-row v-if="navigatorOpts.selectedKey === '1'">
              <visit  :IDList="IDList"></visit>
            </el-row>
            <el-row v-if="navigatorOpts.selectedKey === '2'">
              <forward  :IDList="IDList"></forward>
            </el-row>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import userChart from "components/user-dashbord";
import navigator from "components/navigator";
import humanityPath from '../components/popup/humanityPath'
import visit from '../components/popup/visit'
import forward from '../components/popup/forward'
import api from 'api';
import pagination from "../../../../components/ui-pagination";
export default {
  components: {
    userChart,
    navigator,
    humanityPath,
    visit,
    forward,
    pagination
  },
  data() {
    return {
      indexType: "",// //客户详情传1  员工详情传2
      userData: {
        id: "", // user_id
        keyID: ""  // 员工或者客户主键id
      },
      dialogVisible: false,
      tableData: [],
      navigatorOpts: {},
      paginationOpt: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        pageCount: 0
      },
        IDList:{
         merchantId: localStorage.getItem('businessId'),
          taskId: this.$route.query.id,
          rootUserId: 0,
          userId: 0,
      },
      data_: {
        "businessId": localStorage.getItem('businessId'),
        "taskId": this.$route.query.id,
        "keywords": "",
        "type":"1",
        "sorts": {},
        "pageIndex": 1,
        "pageSize": 10
      },
    }
  },
  mounted() {
    this.dataList()
  },
  methods: {
    //获取裂变数据
    dataList(cb) {
      let self = this;
      let option={
         "businessId": self.data_.businessId,
        "taskId":  self.data_.taskId,
        "keywords":  self.data_.keywords,
        "type":parseInt( self.data_.type),
        "sorts":  self.data_.sorts,
        "pageIndex": self.data_.pageIndex,
        "pageSize": self.data_.pageSize
      }
      api.request('taskPowerList',option, result => {
        if (result.status === 0) {
          self.tableData = result.data;
          self.paginationOpt.totalCount = result.data.totalCount;
          self.paginationOpt.pageCount = Math.ceil(
            self.paginationOpt.totalCount / self.paginationOpt.pageSize
          );
        }
        !!cb && cb();
      })
    },
    //下拉框搜索
    optionSelect() {
      var self = this;
      self.data_.keywords = "";
      self.paginationOpt.pageIndex = 1;
      self.dataList();
    },
    //搜索
    select() {
      var self = this;
      self.paginationOpt.pageIndex = 1;
      self.dataList();
    },
    //分页
    employeePagesFn(pageIndex, cb) {
      let self = this;
      self.paginationOpt.pageIndex = pageIndex;
      self.data_.pageIndex = pageIndex;
      self.dataList(cb);
    },
    details(data) {
      var self = this;
         if(self.dialogOpening) return false;
      // 点击加锁
      self.dialogOpening = true;
       self.IDList={
         merchantId: localStorage.getItem('businessId'),
          taskId: this.$route.query.id,
          rootUserId:data.rootUserId,
          userId:data.userId,
      }
      if (data.employeeId != '') {//员工
        self.indexType = 2;//客户详情传1  员工详情传2
        self.navigatorOpts = {
          tabs: [
            { key: '2', title: "转发统计" },
          ],
          selectedKey: '2'
        }
        self.userData = {
          id: !!data.userId ? data.userId : 0, // user_id
          keyID: data.employeeId ? data.employeeId : 0 //  // 员工或者客户主键id
        }
        console.log(self.userData, "员工")
        self.dialogVisible = !self.dialogVisible;
          self.dialogOpening = false;
      } else {//客户
        self.indexType = 1;//客户详情传1  员工详情传2
        self.navigatorOpts = {
          tabs: [
            { key: '0', title: "人脉路径" },
            { key: '1', title: "浏览统计" },
            { key: '2', title: "转发统计" },
          ],
          selectedKey: '0'
        }
        api.request('getInfoId', {
          "userId": data.userId,
          "businessId": localStorage.getItem('businessId')
        }, result => {
          self.userData = {
            id: !!data.userId ? data.userId : 0, // user_id
            keyID: result.data.id ? result.data.id : 0 //  // 员工或者客户主键id
          }
          console.log(self.userData, "客户")
          self.dialogVisible = !self.dialogVisible
           self.dialogOpening = false;
        }).catch(function (error) {
          self.dialogOpening = false;
        });
      }
    },
    //排序
    sortChangeHandler(orderBy) {
       this.data_.sorts={}
      let { order, prop } = orderBy;
      if (!!prop) {
        this.data_.sorts[prop] = order === "descending" ? 1 : 0;
        this.dataList();
      }
    },
    transferTab(tab) {
      var self = this;
      self.navigatorOpts.selectedKey = tab;
    },
  }
}
</script>

<style scoped>
.integral-box >>> .el-input-group>.el-input__inner{
  background: #ffffff;
  border-radius: 0
}
.integral-box >>> .el-input--mini .el-input__inner{
  background: #ffffff;
  border-radius: 0
}
.dialog-box {
  /* width: 70%; */
  height: 700px;
  display: flex;
  background: #ffffff;
}
.user-dashbord {
  background: #f7fbfc !important;
}
.dialog-box > div:nth-of-type(1) {
  width: 25%;
  background: #f7fbfc !important;
}
.dialog-box > div:nth-of-type(2) {
  width: 75%;
}
.integral-box >>> .el-dialog__header {
  width: 40px;
  height: 40px;
  background: #fa766b;
  display: inline-block;
  right: 0;
  top: 0;
  z-index: 1111;
  position: absolute;
}
.integral-box >>> .el-dialog__body {
  padding: 0 !important;
}
.integral-box >>> .el-dialog__headerbtn {
  width: 40px;
  height: 40px;
  background: #fa766b;
  display: inline-block;
  right: 0;
  top: 0;
  position: absolute;
}

.integral-box >>> .el-dialog__headerbtn > i {
  color: #ffffff;
}
.el-button--text {
  color: #3898ec;
}

.header-seach p {
  color: #b1bfcd;
}
.header-seach p span {
  color: #f68411;
}
.header-seach,
.query-box {
  display: flex;
}
.header-seach .exportBtn img {
  width: 10px;
  height: 10px;
  margin-right: 5px;
}
.header-seach .exportBtn {
  background: #00bad0;
  color: #ffffff;
  border: none;
}
.header-seach {
  display: flex;
  justify-content: space-between;
  padding: 15px 0 15px 0;
  width: 98%;
  margin: 0 auto;
}
.header-seach .reissueBtn {
  background: #fa766b;
  color: #ffffff;
  border: none;
}
.header-seach .exportBtn img {
  width: 10px;
  height: 10px;
  margin-right: 5px;
}
.header-seach .exportBtn {
  background: #00bad0;
  color: #ffffff;
  border: none;
}

.header-seach p {
  color: #b1bfcd;
}
.header-seach p span {
  color: #f68411;
}
.header-seach,
.query-box {
  display: flex;
}
.header-seach .exportBtn img {
  width: 10px;
  height: 10px;
  margin-right: 5px;
}
.header-seach .exportBtn {
  background: #00bad0;
  color: #ffffff;
  border: none;
}
</style>
