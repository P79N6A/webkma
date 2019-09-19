<template>
  <div style="height:auto;">
    <headerTitle :myTitle="myTitle" goBack='page'></headerTitle>
    <div class="contenter">
      <div class="header_content">
        <p class="title">{{infoData.title}}</p>
        <p>
          <span class="cont_label">任务内容：</span>
          <span>【{{infoData.manuscript_type==3?"文章":"H5"}}】{{infoData.manuscript_name}}</span>
        </p>
        <p>
          <span class="cont_label">创建时间：</span>
          <span>{{infoData.create_time}}</span>
        </p>
      </div>
      <div class="table_content">
        <div class="title">推送人员列表</div>
        <el-table :data="dataList" style="width: 100%;margin-top:15px" header-align="center" :header-cell-style="getRowClass">
          <el-table-column label="昵称/身份" align="center">
            <template slot-scope="scope">
              <div class="flex_box">
                <img :src='scope.row.face?scope.row.face:defaultImg' />
                <div class="tableInfo">
                  <p>{{scope.row.nickname}}</p>
                  <p>{{scope.row.name==null?'暂无':(scope.row.name + '/' + scope.row.job)}}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="推送状态" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.push_status==0?'成功':'失败'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="推送成功时间" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.create_time_date}}</div>
              <div style="color:#B1BFCD">{{scope.row.create_time_timer}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="read_count" label="浏览次数" sortable align="center">
          </el-table-column>
          <el-table-column prop="" label="最近浏览时间" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.read_time_date}}</div>
              <div style="color:#B1BFCD">{{ scope.row.read_time_timer}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination v-if="dataList.length>0" class="pull-right" :paginationOpt="employeePagination"
        @switchPage="employeePagesFn" />
    </div>
  </div>
</template>
<script>
import api from 'api'
import headerTitle from "components/header-title";
import pagination from "components/ui-pagination";
export default {
  components: {
    headerTitle,
    pagination
  },
  data() {
    return {
      defaultImg:require('../../assets/images/default-headImg.png'),
      id:'',
      myTitle: "微信详情",
      mauscriptType: "",
      infoData:{},
      dataList: [],
      parmas:{
        pageIndex: 1,
        pageSize: 10, 
        manuscript_push_id:""
      },
      employeePagination: {
        //人员分派分页
        pageIndex: 1,
        pageSize: 10,
        totalCount: 1,
        pageCount: 0
      }
    }
  },
  mounted(){
    this.id = this.$route.query.id
    this.parmas.manuscript_push_id = this.id
    this.getInfo()
    this.getList()
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background:#F7FBFC;"
      } else {
        return ""
      }
    },
    getInfo() {
      let self = this
      api.request("wxPushInfo",{id:self.id}, result => {
        if(result.status ==0){
          self.infoData = result.data
        }
      })
    },
    getList(cb){
      let self = this
      api.request("wxPushInfoCustomerList", self.parmas, result => {
        if(result.status ==0){
          let arr = result.data.list
          arr.forEach(item => {
            if(item.create_time){
              let timer = item.create_time.split(' ')
              item.create_time_date = timer[0]
              item.create_time_timer = timer[1]
            }else{
              item.create_time_date = ''
              item.create_time_timer = ''
            }
            if(item.read_count){
              let timerread  = item.update_time.split(' ')
              item.read_time_date = timerread[0]
              item.read_time_timer = timerread[1]
            }else{
              item.read_time_date = ''
              item.read_time_timer = ''
            }
            console.log(item)
          });
          self.dataList = arr
          self.employeePagination.totalCount = result.data.total
          self.employeePagination.pageCount = Math.ceil(result.data.total/self.employeePagination.pageSize) 
        }
      })
      !!cb && cb();
    },
    // 员工分页
    employeePagesFn(pageIndex, cb) {
      let self = this;
      self.employeePagination.pageIndex = pageIndex;
      self.parmas.pageIndex = pageIndex
      self.getList(cb);
    },
  }
}
</script>
<style scoped>
.contenter {
  font-size: 12px;
}
.header_content {
  width: 95%;
  margin: 0 auto;
  padding-left: 26px;
  margin-top: 34px;
  margin-bottom: 27px;
}
.header_content p {
  line-height: 14px;
  margin-bottom: 10px;
  color: #b1bfcd;
}
.table_content{
  width: 95%;
  margin: 0 auto;
}
.title{
  font-size: 14px;
  color: #3c4a55 !important;
}
.flex_box {
  display: flex;
  justify-content:flex-start;
  padding: 12px 0px;
  overflow: hidden;
  padding-left: 26px;
}
.flex_box img {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 50%
}
.tableInfo{
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}
.tableInfo p {
  text-align: left;
  color: #3c4a55;
}
.tableInfo p:last-child {
  color: #b1bfcd;
}
.pull-right {
  padding-right: 30px;
}
</style>