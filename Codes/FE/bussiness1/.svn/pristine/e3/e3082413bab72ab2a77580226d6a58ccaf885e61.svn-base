<template>
  <div class="connection-list">
    <el-table :data="tableData1" style="width: 100%" row-key="id" lazy :load="load">
      <el-table-column prop="date" label="昵称/身份" class-name="head-info" width="300">
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
      <el-table-column prop="level" label="所在层级" align='center'>
        <template slot-scope="scope">
          {{ scope.row.level == 0 ? '脉主' : scope.row.level }}
        </template>
      </el-table-column>
      <el-table-column prop="childCount" label="直接下级人数" align='center'>
      </el-table-column>
      <el-table-column prop="browseTime" label="浏览时间" align='center'>
      </el-table-column>
      <el-table-column prop="browseCount" label="浏览次数" align='center'>
      </el-table-column>
      <el-table-column prop="sex" label="性别" align='center'>
        <template slot-scope="scope">
          {{ scope.row.sex == 0 ? '未知' :  scope.row.sex == 1 ? '男' : '女'}}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地区" align='center'>
        <template slot-scope="scope">
          {{ scope.row.province }}{{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align='center'>
        <template slot-scope="scope">
          <el-button type="text" style="color:#3898EC" size="small" v-popover:popover @click="toDetails(scope.row)">
            人脉详情 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-if="paginationOpt.pageCount>1" class="pull-right" :paginationOpt="paginationOpt"
      @switchPage="pagesFn" />
    <div v-if="dialogVisible">
      <el-dialog title="" :visible.sync="dialogVisible" destroy-on-close="true" width="70%" close="dialog">
        <div class="dialog-box">
          <div>
            <!-- //客户详情传1  员工详情传2 -->
            <userChart :userData="userData" :type="indexType==1 ? 'customer': 'employee'" :taskId="$route.query.id" />
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
              <visit :IDList="IDList"></visit>
            </el-row>
            <el-row v-if="navigatorOpts.selectedKey === '2'">
              <forward :IDList="IDList"></forward>
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
import humanityPath from './popup/humanityPath';
import visit from './popup/visit';
import forward from './popup/forward';
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
  props: {
    taskId: { //活动id
      type: String,
      default: ''
    },
    businessId: { //商家id
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData1: [],
      paginationOpt: { //分页参数
        pageIndex: 1,
        pageSize: 5,
        totalCount: 1,
        pageCount: 0
      },
      keywords: '', //关键词
      IDList: {
        merchantId: localStorage.getItem('businessId'),
        taskId: this.$route.query.id,
        rootUserId: 0,
        userId: 0,
      },
      tableTotal: 0,
      dialogVisible: false,
      tableData: [],
      userData: {
        id: "", // user_id
        keyID: ""  // 员工或者客户主键id,
      },
      navigatorOpts: {}
    }
  },
  mounted() {
    this.taskBrowseList();
  },
  methods: {
    taskBrowseList(option) {
      let self = this;
      let _param = {
        "businessId": self.businessId,
        "taskId": self.taskId,
        "keywords": self.keywords,
        "maxLevel": self.maxLevel,
        "sorts": self.sorts,
        "pageIndex": self.paginationOpt.pageIndex,
        "pageSize": self.paginationOpt.pageSize
      };
      if (!!option && !!option.nodeId) _param = Object.assign({}, _param, { nodeId: option.nodeId, level: option.level });
      api.request('getRelationshipList', _param, result => {
        if (result.status === 0) {
          if (!!option && !!option.nodeId) {
            option.cb(result.data.list);
          } else {
            self.tableData1 = result.data.list;
            self.paginationOpt.totalCount = result.data.totalCount;
            self.paginationOpt.pageCount = Math.ceil(
              self.paginationOpt.totalCount / self.paginationOpt.pageSize
            );
          }
        } else {
          if (!!option && !!option.nodeId) {
            option.cb([]);
          }
        }
        !!option && !!option.cb && !option.nodeId && option.cb();
      })
    },
    //分页调用方法
    pagesFn(pageIndex, cb) {
      this.paginationOpt.pageIndex = pageIndex;
      this.taskBrowseList({ cb: cb });
    },
    load(tree, treeNode, resolve) {
      let self = this;
      if (this.loading) return false;
      //点击加锁
      this.loading = true;
      this.taskBrowseList({
        nodeId: tree.id,
        level: parseInt(tree.level) + 1,
        cb: (data) => {
          resolve(data);
          self.loading = false;
        }
      });
    },
    toDetails(data) {
      if (this.dialogOpening) return false;
      var self = this;
      // 点击加锁
      this.dialogOpening = true;
      self.IDList = {
        merchantId: localStorage.getItem('businessId'),
        taskId: self.$route.query.id,
        rootUserId: data.rootUserId,
        userId: data.userId,
      }
      if (data.empId != '') {//员工
        self.indexType = 2;//客户详情传1  员工详情传2
        self.navigatorOpts = {
          tabs: [
            { key: '2', title: "转发统计" },
          ],
          selectedKey: '2'
        }
        self.userData = {
          id: !!data.userId ? data.userId : 0, // user_id
          keyID: data.empId ? data.empId : 0 //  // 员工或者客户主键id
        }
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
        api.request(
          "getInfoId",
          {
            "userId": data.userId,
            "businessId": localStorage.getItem('businessId')
          }
        )
          .then(function (result) {
            self.userData = {
              id: !!data.userId ? data.userId : 0, // user_id
              keyID: result.data.id ? result.data.id : 0 //  // 员工或者客户主键id
            }
            self.dialogVisible = !self.dialogVisible;
            self.dialogOpening = false;
          })
          .catch(function (error) {
            self.dialogOpening = false;
          });

      }
    },
    transferTab(tab) {
      var self = this;
      self.navigatorOpts.selectedKey = tab;
    }
  }
}
</script>

<style scoped>
.connection-list >>> .head-info .cell {
  display: flex !important;
}
.connection-list
  >>> .el-table
  [class*="el-table__row--level"]
  .el-table__expand-icon {
  margin-top: 20px;
}
.connection-list >>> .el-button--text {
  width: 80px;
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
</style>
