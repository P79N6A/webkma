<template>
  <div style="height:auto; padding-bottom:50px">
    <headerTitle :myTitle="myTitle"></headerTitle>
    <div class="content-box">
      <div class="btn-box">
        <div class="add-btn" @click="addBtn"> +新建微信推送</div>
        <div class="search_item">
          <el-input placeholder="请输入推送活动名称搜索" style="width: 240px;" v-model="parmas.keyword"></el-input>
          <el-button class="btn" @click="search">查询</el-button>
        </div>
      </div>
      <div class="listBox">
        <div class="list" v-for="(item,index) in dataList" :key="index">
          <div class="des-box">
            <div class="des">
              <p class="name">{{item.title}}</p>
              <p class="task-content">任务内容：【{{item.manuscript_type==3?"文章":"H5"}}】{{item.manuscript_name}}</p>
              <p class="set-time">创建时间：{{item.create_time}}</p>
            </div>
          </div>
          <div class="number">
            <p>推送人数 <span> {{item.total}}</span></p>
            <p>触达人数<span> {{item.read_number}}</span></p>
          </div>
          <div class="operation">
            <p @click="details(item)">详情</p>
          </div>
        </div>
      </div>
    </div>
     <div class="nullData" v-if="dataList==''">暂无数据</div>
    <pagination v-if="dataList.length>0" class="pull-right" :paginationOpt="employeePagination"
      @switchPage="employeePagesFn" />
  </div>
</template>
<script>
import api from "api";
import headerTitle from "components/header-title";
import pagination from "components/ui-pagination";
export default {
  components: {
    headerTitle,
    pagination
  },
  data() {
    return {
      myTitle: "微信推送列表",
      mauscriptType: "",
      dataList:[],
      parmas:{
        pageIndex:1,
        pageSize:8,
        keyword:"",
      },
      employeePagination: {
        //人员分派分页
        pageIndex: 1,
        pageSize: 8,
        totalCount: 1,
        pageCount: 0
      }
    }
  },
  mounted(){
    this.getList()
  },
  methods: {
    search(){
      this.parmas.pageIndex = 1
      this.getList()
    },
    getList(cb){
      let self = this
      api.request("wxPushlList", self.parmas, result => {
        if(result.status ==0){
          self.parmas.keyword = ''
          self.dataList = result.data.list
          self.employeePagination.totalCount = result.data.total
          self.employeePagination.pageCount = Math.ceil(result.data.total/self.employeePagination.pageSize) 
        }
      })
      !!cb && cb();
    },
    addBtn() {
      this.$router.push({ path: "/wechat-push/add" });
    },
    details(item) {
      this.$router.push({ path: "/wechat-push/details", query: { id:item.id} });
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
.list .des-box {
  display: flex;
  overflow: hidden;
}
.content-box >>> .el-input__inner{
  background: #ffffff
}
.list .des-box .des {
  margin-left: 30px;
}
.list .des-box .des .name {
  font-size: 14px;
  color: rgba(60, 74, 85, 1);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.nullData {
  text-align: center;
  font-size: 16px;
  color: #3c4a55;
  padding: 30px 0 30px 0;
}

.list .number p {
  font-size: 12px;
  line-height: 12px;
}
.list .number p:last-child {
  margin-top: 13px;
}
.list .number p span:nth-of-type(1) {
  color: #f68411;
}
.list .number p span:nth-of-type(2) {
  color: #fa766b;
}
.list .des-box .des .set-time,
.task-content {
  font-size: 12px;
  color: rgba(177, 191, 205, 1);
}
.list .des-box .des .set-time {
  margin-top: 10px;
}
.list .des-box .des .task-content {
  margin-top: 7px;
}
.content-box {
  width: 95%;
  margin: 0 auto;
}
.btn-box {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
}
.btn-box .add-btn {
  width: 110px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background: rgba(0, 186, 208, 1);
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
}

.search_item {
  display: flex;
  justify-content: space-between;
  /* width: 260px; */
  float: right;
  /* margin-right: 14px; */
}
.search_item .search_input {
  width: 200px;
  height: 30px;
  border: 1px solid #e3e6eb;
  padding-left: 8px;
}
.search_item .btn {
  background: #00bad0;
  height: 30px;
  width: 60px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  margin-left: -3px;
  z-index: 1;
  color: #ffffff;
  display:flex;
  align-self: center;
  padding: 0 !important;
  justify-content: center;
  line-height: 26px !important;
}

.search_item >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
}

.listBox .list .des-box {
  width: 50%;
}
.listBox .list .number {
  width: 25%;
  text-align: center;
  font-size: 14px;
  color: #3c4a55;
}
.listBox .list .operation {
  width: 25%;
  padding: 16px;
  text-align: center;
  color: #008fff;
  font-size: 14px;
  border-left: 1px solid #e3e6eb;
}
.listBox .list {
  padding: 20px 0 20px 0;
  border-bottom: 1px solid #e3e6eb;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center
}
.listBox .list:last-child{
  border: none
}
.listBox .list:nth-of-type(1) {
  margin-top: 20px;
}
.list .operation p {
  cursor: pointer;
}
.pull-right{
  padding-right: 30px;
}
</style>