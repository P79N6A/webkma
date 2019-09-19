<template>
  <div style="height:auto;">
    <headerTitle :myTitle="myTitle"></headerTitle>
    <div class="content-box">
      <div class="btn-box">
        <div class="add-btn" @click="addBtn">+新建红包活动</div>
        <div class="search-wrap">
          <el-select
            v-model="data_.state"
            placeholder="活动类型"
            size="mini"
            @change="optionSelect()"
            style="border-radius:none;margin-right:10px"
          >
            <el-option label="全部状态" value></el-option>
            <el-option label="已结束" value="3"></el-option>
            <el-option label="进行中" value="2"></el-option>
            <el-option label="未开始" value="1"></el-option>
          </el-select>
           <el-select
            v-model="data_.type"
            placeholder="活动类型"
            size="mini"
            @change="optionSelect()"
            style="border-radius:none;margin-right:10px"
          >
            <el-option label="全部类型" value></el-option>
            <el-option label="红包裂变" value="1"></el-option>
            <el-option label="阶梯红包" value="2"></el-option>
          </el-select>
          <div class="search_item">
          <el-input placeholder="请输入红包活动名称搜索" style="width: 240px;" v-model="data_.keyWords"></el-input>
          <el-button class="btn" @click="select">查询</el-button>
        </div>
        </div>
      </div>
      <div class="listBox" v-if="list!=''">
        <div class="list" v-for="(item,index) in list" :key="index">
          <div class="des-box">
            <div class="img-box">
              <img
                :src="item.red_packet_type==1 || item.red_packet_type==2?'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/8e72d081-e2ad-45aa-855c-bd928bd80e2b.png':'https://resource.tuixb.cn/beta/00000000-0000-0000-0000-000000000000/KMA/default/b7277310-e1b7-461a-955c-4c265ed57644.png'"
                alt
              />
              <div class="flag" :class="item.state==2?'proceed':item.state==1?'nostart':'timeout'">
                <div class="sanjiao1"></div>
                <div class="sanjiao2"></div>
                <div class="text">{{item.state==1?'未开始':item.state==2?'进行中':'已结束'}}</div>
              </div>
            </div>
            <div class="des">
              <p class="name">{{item.title}}</p>
              <p class="set-time">{{item.create_time}}</p>
              <p class="task-content">任务内容：【{{item.m_type==3?"文章":"H5"}}】{{item.m_name}}</p>
              <p class="cycle">任务周期：{{item.active_start_date}}-{{item.active_end_date}}</p>
              <p class="pv">
                <span>浏览 {{item.browse_number}}</span>
                <span style="margin-left:18px;display: inline-block">转发 {{item.forwarding_number}}</span>
              </p>
            </div>
          </div>
          <div class="number">
            <p>
              已发
              <span>{{item.receive_num}}</span>个红包
              <span>￥{{item.receive_money}}</span>
            </p>
            <p>
              剩余
              <span>{{item.remain_num}}</span>个红包
              <span>￥{{item.remain_money}}</span>
            </p>
            <p>
              补发
              <span>{{item.a_total_num}}</span>个红包
              <span>￥{{item.a_total_money}}</span>
            </p>
          </div>
          <div class="operation">
            <p @click="details(item)" :style="item.state==3?'margin-top:30px':''">详情</p>
            <p v-if="item.state==2" @click="activityEnd(item)">结束</p>
            <p @click="edit(item)" v-if="item.state==1">编辑</p>
          </div>
        </div>
      </div>
      <div class="nullData" v-if="list==''">暂无数据</div>
      <pagination
        v-if="list.length>0"
        class="pull-right"
        :paginationOpt="employeePagination"
        @switchPage="employeePagesFn"
      />
    </div>
  </div>
</template>

<script>
import api from "api";
import headerTitle from "components/header-title";
import pagination from "../../components/ui-pagination";
export default {
  components: {
    headerTitle,
    pagination
  },
  data() {
    return {
      employeePagination: {
        //人员分派分页
        pageIndex: 1,
        pageSize: 5,
        totalCount: 1,
        pageCount: 0
      },
      myTitle: "红包活动列表",
      mauscriptType: "",
      data_: {
        state: "", //活动状态 1，进行中 2，未开始 3，已结束
        keyWords: "",
        pageIndex: 1,
        pageSize: 5,
        type:"",// 1红包裂变 2阶梯红包
      },
      list: []
    };
  },
  mounted() {
    var self = this;
    this.dataList();
  },
  methods: {
    //列表
    dataList(cb) {
      var self = this;
      api.request("redpacketList", Object.assign(self.data_), result => {
        if (result.status == 0) {
          self.list = result.data.list;
          self.employeePagination.totalCount = result.data.total;
          self.employeePagination.pageCount = Math.ceil(
            result.data.total / self.employeePagination.pageSize
          );
        } else {
          self.$message.error(result.message);
        }
      });
      !!cb && cb();
    },
    //结束
    activityEnd(data) {
      var self = this;
       this.$confirm("结束红包会影响任务的推广效果，确认结束吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
         api.request(
        "redpacketclose",
        Object.assign({ main_id: data.main_id }),
        result => {
          if (result.status == 0) {
            self.$message.success("修改成功");
            self.dataList();
          } else {
            self.$message.error(result.message);
          }
        }
      );
             
        })
        .catch(() => {
          self.$message({
            type: "info",
            message: "已取消修改"
          });
        });
      
    },
    //添加
    addBtn() {
      this.$router.push({
        path: "/red-add",
        query: { indexType: "redPacket" }
      });
    },
    //下拉框搜索
    optionSelect() {
      var self = this;
      self.data_.keyWords = "";
      self.data_.pageIndex = 1;
      self.employeePagination.pageIndex = 1;
      self.dataList();
    },
    //搜索
    select() {
      var self = this;
      self.employeePagination.pageIndex = 1;
      self.data_.pageIndex = 1;
      self.dataList();
    },
    //详情
    details(data) {
      this.$router.push({
        path: "/red-details",
        query: { myTitle: data.title, main_id: data.main_id,type:data.red_packet_type}
      });
    },
    //编辑
    edit(data) {
      this.$router.push({
        path: "/red-add",
        query: { main_id: data.main_id, m_type: data.m_type, indexType: "redPacket",m_id: data.m_id, }
      });
    },
    //分页
    employeePagesFn(pageIndex, cb) {
      let self = this;
      self.employeePagination.pageIndex = pageIndex;
      self.data_.pageIndex = pageIndex;
      self.dataList(cb);
    }
  }
};
</script>
<style scoped>
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
.content-box >>> .el-input__inner{
  background: #ffffff
}
.nullData {
  text-align: center;
  font-size: 16px;
  color: #3c4a55;
  padding: 30px 0 30px 0;
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

.content-box >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  /* width: 132px; */
}
.list .des-box .img-box {
  width: 80px;
  height: 120px;
  position: relative;
  overflow: hidden;
}
.list .des-box {
  display: flex;
  height: 120px;
  overflow: hidden;
}
.list .des-box .des {
  margin-left: 30px;
  width: 65%;
}
.list .des-box .des .name {
  font-size: 14px;
  color: rgba(60, 74, 85, 1);
}

.list .number p:nth-of-type(2) {
  margin-top: 14px;
}
.list .number p:nth-of-type(3) {
  margin-top: 14px;
}
.list .number p span:nth-of-type(1) {
  color: #f68411;
}
.list .number p span:nth-of-type(2) {
  color: #fa766b;
}
.list .des-box .des .set-time,
.task-content,
.cycle,
.pv {
  font-size: 12px;
  color: rgba(177, 191, 205, 1);
}
.list .des-box .des .set-time {
  margin-top: 10px;
}
.list .des-box .des .task-content {
  margin-top: 7px;
  overflow: hidden;
  width: 95%;
text-overflow:ellipsis;
white-space: nowrap;
}
.list .des-box .des .cycle {
  margin-top: 5px;
}
.list .des-box .des .pv {
  margin-top: 8px;
}
.list .des-box .img-box img {
  width: 100%;
  height: 100%;
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
.listBox {
  overflow: hidden;
}
.listBox .list .des-box {
  width: 55%;
  height: 120px;
  overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
}
.listBox .list .number {
  width: 20%;
  text-align: left;
  font-size: 14px;
  color: #3c4a55;
  height: 90px;
  margin-top: 20px;
}
.listBox .list .operation {
  width: 25%;
  cursor: pointer;
  text-align: center;
  color: #008fff;
  font-size: 14px;
  height: 90px;
  margin-top: 20px;
  border-left: 1px solid #e3e6eb;
}
.listBox .list {
  padding: 20px 0 20px 0;
  border-bottom: 1px solid #e3e6eb;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.listBox .list:nth-of-type(1) {
  margin-top: 20px;
}
.list .operation p:nth-of-type(1) {
  margin-top: 14px;
}
.list .operation p:nth-of-type(2) {
  margin-top: 14px;
}
.list .img-box .flag {
  position: absolute;
  top: 0;
  right: 40px;
  z-index: 2;
}
.flag .sanjiao1,
.flag .sanjiao2 {
  position: absolute;
  width: 0;
  height: 0;
}

.flag.timeout .sanjiao1,
.flag.timeout .sanjiao2 {
  border: 20px solid #fa766b;
}
.flag.proceed .sanjiao1,
.flag.proceed .sanjiao2 {
  border: 20px solid #f68411;
}
.flag.nostart .sanjiao1,
.flag.nostart .sanjiao2 {
  border: 20px solid #00d473;
}
.flag .sanjiao1 {
  top: 0;
  left: 0;
  border-right: 20px solid transparent !important;
  border-bottom: 5px solid transparent !important;
}
.flag .sanjiao2 {
  top: 0;
  left: 0px;
  border-left: 20px solid transparent !important;
  border-bottom: 5px solid transparent !important;
}

.flag .text {
  width: 40px;
  position: absolute;
  top: 2px;
  left: 0px;
  color: #ffffff;
  font-size: 12px;
  text-align: center;
}
</style>