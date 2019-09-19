<template>
  <div class="rewards-box">
    <div class="rewards-title">查看推广奖励</div>
    <div class="rewards-content">
      <div class="content-head">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple activity-info">
              <span class="fs14">{{rewardList.name}}</span>
              <el-date-picker
                v-model="value"
                type="datetime"
                prefix-icon="el-icon-time"
                clear-icon="clear"
                :picker-options="pickerOptions"
                class="timenInput"
                :disabled="rewardList.state == 2 ? true : false"
                @change="timeChange">
              </el-date-picker>
              <!-- <el-date-picker
                v-model="value1"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker> -->
              <el-dialog
                title="提示"
                :visible.sync="centerDialogVisible"
                width="30%"
                :center=true>
                <span>是否确定修改截止时间？</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="cancelSet">取 消</el-button>
                  <el-button type="primary" @click="confirmRevision">确 定</el-button>
                </span>
              </el-dialog>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light total-sum">
              <span>奖励总金额/账户余额</span>
              <div class="color-red inline-block"> <span>{{parseFloat(rewardList.employeeTotalMoney+rewardList.groupTotalMoney).toFixed(2)}}</span>/<span>{{balance}}元</span> </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="content">
        <!-- 全员奖励 -->
        <div class="target-head">
          <span class="font-head">全员奖励目标</span>
          <!-- <div class="inline-block target-title">
            推广员工数<span class="color-red">{{rewardList.employeeCount}}</span>
            全员推广奖励<span class="color-red">{{rewardList.employeeTotalMoney}}</span>
          </div> -->
          <div class="inline-block desc">
              <span class="mr15">推广员工数：<span class="color-red">{{rewardList.employeeCount}}</span></span>
              <span class="mr15">全员推广奖励：<span class="color-red">￥{{rewardList.employeeTotalMoney==null?0:rewardList.employeeTotalMoney}}</span></span>
          </div>
        </div>
        <div class="target-cont">
          <el-row>
            <el-col :span="8">
              <div class="grid-content bg-purple cont-one">
                <div>
                  <img src="../../../static/images/icon-reward.png" alt="">
                </div>
                <div class="one-text">
                  <span class="fs14 font-bold">全员奖励</span>
                  <p class="fs12 mt14">全员目标奖励是指被分派了当前活动任务的员工满足设置数值所获得及奖励。</p>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple-light fs. cont-two">
                <span class="fs12">奖励金额</span>
                <p><span class="fs30">￥{{rewardList.money}}</span> <span class="tips pstop">{{rewardList.styleName}}</span></p>
              </div>
            </el-col>
            <el-col :span="8"> 
              <div class="grid-content bg-purple cont-three">
                <div>
                  <span>目标访问数</span>
                  <p>{{rewardList.targetAccess}}</p>
                </div>
                <div>
                  <span>目标访客数</span>
                  <p>{{rewardList.targetVisitor}}</p>
                </div>
                <div>
                  <span>目标分享数</span>
                  <p>{{rewardList.targetShare}}</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 团队奖励 -->
        <div class="target-head">
          <span class="font-head mr5">团队奖励目标</span>
          <el-popover
            placement="right"
            width="220"
            font-size="12"
            popper-class="popover-text"
            trigger="hover"
            content="团队目标奖励是指被分派了当前活动任务的团队的员工满足设置数值所获得及奖励。">
            <i slot="reference" class="el-icon-info mr5" style="font-size: 15px;color:#2f99e7;"></i>
          </el-popover>
          <!-- <div class="inline-block target-title">
            团队数<span class="color-red">{{rewardList.groupCount}}</span>
            团队推广奖励<span class="color-red">{{rewardList.groupTotalMoney}}</span>
          </div> -->
          <div class="inline-block desc">
              <span class="mr15">团队数：<span class="color-red">{{rewardList.groupCount}}</span></span>
              <span class="mr15">团队奖励总金额：<span class="color-red">￥{{rewardList.groupTotalMoney==null?0:rewardList.groupTotalMoney}}</span></span>
          </div>
        </div>
        <div class="teams-cont">
          <el-row :gutter="20">
      
            <el-col :span="8" v-for="item in rewardList.groups" v-bind:key="item.id">
              <div class="grid-content bg-purple team" >
                <div class="team-head">
                  <span class="font-bold fs14">{{item.deptName}}</span>
                  <span class="color-grad">{{item.employeeCount}}人</span>
                  <span class="tips mt14">{{item.styleName}}</span>
                </div>
                <div class="team-info">
                  <div class="info-left">
                    <span>{{item.typeName}}</span>
                    <p class="fs20">￥{{item.money}}</p>
                  </div>
                  <div class="info-right">
                    <p>目标访问数<span>{{item.targetAccess}}</span></p>
                    <p>目标访客数<span>{{item.targetVisitor}}</span></p>
                    <p>目标分享数<span>{{item.targetShare}}</span></p>
                  </div>
                </div>
              </div>
            </el-col>
        
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "api";

export default {
  data: function() {
    return {
      value: '', //选定日期
      currentTime:'', //当前时间
      id:'', //活动id
      endTime:'', //活动结束时间
      rewardList:{}, //活动信息
      pickerOptions:{ //禁止选择大于当前的时间
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      centerDialogVisible: false, //弹窗
      balance:'' //商家余额
    };
  },
  mounted() {
    this.rewardsInfo();
    this.businessInfo();
  },
  methods: {
    //获取奖励详情
    rewardsInfo(){
      var self = this;
      self.id = this.$route.params.id;
      console.log("id",self.id)
      //获取当前活动详情 this.$route.params.id
      api.request(
        "detailExtensionReward",
        {
          id: self.id
        },
        result => {
          if (result.status == 0) {
          self.rewardList = result.data;
          self.value = result.data.endTime.replace('-','/');
          self.currentTime = result.data.endTime.replace('-','/');
          console.log("查看奖励数据",result.data,"2",self.rewardList);
          } else {
            self.$message.error(result.message);            
          }
        }
      );
    },
    //获取商户余额 
    businessInfo(){
      var self = this;
       api.request(
        "businessAccount", {},
        result => {
          if (result.status == 0) {
          self.balance = result.data.balance;
          console.log("查看余额", self.balance);
          } else {
            self.$message.error(result.message);            
          }
        }
      );
    },
    //修改活动截止时间
    timeChange(time){
      let self = this;
      if (!!time) {
        self.endTime = window.timeFormdate(time);
        self.centerDialogVisible = true;
        // self.endTime = time;
        console.log("endTime",self.endTime)

      }
     
      console.log("ssss setRewardTime",self.endTime)
    },
    //确定修改
    confirmRevision(){
      var self = this;
      api.request(
        "setRewardTime",
        {
          id: self.id,
          endTime: self.endTime
        },
        result => {
          if (result.status == 0) {
            self.value = result.data.endTime.replace('-','/');
            this.centerDialogVisible = false;
            this.rewardsInfo();
            console.log("查看修改时间",result.data);
          } else {
            self.$message.error(result.message);
          }
        }
      );
    },
    //取消修改
    cancelSet(){
      this.value = this.currentTime;
      this.rewardsInfo();
      this.centerDialogVisible = false;      
    }
  }
};
</script>

<style scoped>
  /* 公共样式 */
  .color-red{
    color: #FA766B;
  }
  .color-grad{
    color: #63717b;
  }
  .font-bold{
    font-weight: bold;
  }
  .font-head{
    font-size: 16px;
    font-weight: bold;
    color: #3c4a55;
    margin-right: 10px;
  }
  .fs12{
    font-size: 12px;
    color: #63717b;
    line-height: 12px;
  }
  .fs14{
    font-size: 14px;
    color: #3c4a55;
  }
  .fs20{
    font-size: 20px;
    color: #FA766B;
  }
  .fs30{
    display: inline-block;
    min-width: 35px;
    font-size: 30px;
    color: #FA766B;
    text-align: center;
  }
  .inline-block{
    display: inline-block;    
  }
  .mt14{
    margin-top: 14px;
  }
  .mr5{
    margin-right: 5px;
  }
  .mr15{
    margin-right: 15px;
  }
  .pstop{
    position: relative;
    top: -6px;
  }
  /* .target-title{
    width: 260px;
    height: 30px;
    font-size: 14px;
    background-color: #daf4f5;
    border-radius: 4px;
    padding: 5px 12px;
  }
  .target-title span{
    display: inline-block;
    line-height: 11px;
    margin-left:2px;
    overflow: hidden;
    text-overflow: clip;
    white-space: nowrap;
  }
  .target-title span:nth-of-type(1){
    width: 32px;
  }
  .target-title span:nth-of-type(2){
    width: 41px;
  } */
  .desc {
    height: 30px;
    line-height: 30px;
    background-color: rgba(0,186,208,0.1);
    padding-left:15px;
    box-sizing: border-box;
    border-radius: 4px;
  }
  .tips{
    display: inline-block;
    width: 55px;
    height: 20px;
    font-size: 10px;
    color: #FFFFFF;
    text-align: center;
    line-height: 19px;
    background-color: #FA766B;
    margin-left: 10px;
  }
  /* 标题 */
  .rewards-title{
    width: 100%;
    height: 62px;
    font-size: 16px;
    font-weight: bold;
    color: #3c4a55;
    border-bottom: 2px solid #EFF7FA;
    padding: 22px 0 0 44px;
  }
  /* 内容 */
  .rewards-content{
    width: 100%;
    padding: 20px 44px 0;
  }
  .content-head{
    width: 100%;
    height: 40px;
    margin-bottom: 8px;
  }
  .activity-info,.total-sum{
    font-size: 12px;
    color: #3c4a55;
  }
  .activity-info{
    font-weight: bold;
  }
  .activity-info>span{
    margin-right: 10px;
  }
  .total-sum{
    text-align: right;
    line-height: 30px;
  }
  .content{
    width: 100%;
    height: auto;
    background-color: #F7FBFC;
    padding: 20px 20px 10px;
  }
  /* 全员奖励目标 */
  .content .target-head{
    margin-bottom: 18px;
  }
  .content .target-cont{
    width: 100%;
    height: 112px;
    background-color: #FFFFFF;
    margin-bottom: 28px;
  }
  .content .target-cont .cont-one{
    display: flex;
    flex-direction: row;
    padding: 20px 0 20px 25px;
  }
  .content .target-cont .cont-one>img{
    width:70px;
    height:70px;
    margin-right:20px;
    /* vertical-align:-5px; */
  }
  .content .target-cont .cont-one .one-text{
    height: 71px;
    margin-left: 20px;
  }
  .content .target-cont .one-text>p{
    width: 240px;
    height: 31px;
    line-height: 16px;
    /* display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;  */
    overflow:hidden; 
    text-overflow:ellipsis;
  }
  .content .target-cont .cont-two{
    padding: 28px 64px 25px 120px;
  }
  .content .target-cont .cont-three{
    padding: 39px 0 34px;
  }
  .content .target-cont .cont-three div{
    display: inline-block;
    margin-right: 30px;
    width: 85px;
    text-align: center;
  }
  .content .target-cont .cont-three div>span{
    font-size: 12px;
    color: #63717b;
  }
  .content .target-cont .cont-three div>p{
    width: 85px;
    font-size: 16px;
    color: #3c4a55;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 6px;
  }
  /* 团队奖励目标 */
  .content .teams-cont .team{
    width: 350px;
    height: 192px;
    background-color: #FFFFFF;
    padding: 0 10px;
    margin-bottom: 10px;
  }
  .content .teams-cont .team .team-head{
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e9e9eb;
    padding-left: 20px;
    position: relative;
   }
  .content .teams-cont .team-head span{
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
   }
  .content .teams-cont .team-head span:nth-of-type(1){
    width: auto;
    max-width: 120px;
   }
  /* .content .teams-cont .team-head span:nth-of-type(2){
    margin: 0 146px 0 4px;
   } */
  .content .teams-cont .team-head span:nth-of-type(3){
    height: 20px;
    line-height: 20px;
    position: absolute;
    right: 20px;
   }
  .content .teams-cont .team .team-info{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 146px;
    padding: 30px 20px;
  }
  .content .teams-cont .team-info div{
    width: 136px;
    height: 100%;
  }
  .content .teams-cont .team-info div>p{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .content .teams-cont .team-info .info-right{
    line-height: 29px;
    border-left: 1px solid #e9e9eb;
  }
  .content .teams-cont .info-left{
    line-height: 26px;
    padding-top: 10px;
  }
  .content .teams-cont .info-right>p{
    width: 140px;
    margin-left:27px; 
    color: #3c4a55;;
  }
  .content .teams-cont .info-right>p span{
    color: #63717b;
    margin-left: 15px;
  }
  
</style>
<style>
   /* 组件样式 */
  .rewards-box .rewards-content .timenInput .el-input__inner {
    width: 175px;
    height: 30px;
    font-size: 13px;
    font-weight: 100;
    line-height: 30px;
    color: #63717b;
    border-color: #e3e3e3 !important;
    border-radius: 4px;
    background-color: #fff;
    padding-right: 0px;
  }
  .rewards-box .rewards-content .el-input__icon{
    line-height: 30px;
  }
  .popover-text {
    font-size: 12px;
    color: #888888;
    line-height: 18px;
  }
  .rewards-box .rewards-content .clear{
    display: none;
  }
  .rewards-box .rewards-content .el-dialog{
    width: 20%!important;
  }
  .rewards-box .rewards-content .el-dialog__body{
    font-weight: 100!important;
    text-align: center!important;
  }
</style>