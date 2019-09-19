<template>
  <el-container class="bussiness-box" style="display:none;">
    <el-header class="top-cont">
      <el-row>
        <el-col
          :span="2"
          class="text-left font-14"
          style="min-width:115px;padding-right: 10px; margin-right: 20px;"
        >商家信息设置:</el-col>
        <el-col :span="3" style="min-width:178px;">
          <form class="form_upload">
            <comupload
              type="businessLogo"
              upfileId="upfileId1"
              uploadTip="jpg/jpeg/gif/png <3M"
              :imageUrl="businessData.businessLogo"
              fileType="/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/"
              :cb="uploadImg"
            ></comupload>
          </form>
        </el-col>
        <el-col :span="4" style="padding:14px 0 11px 0;">
          <p class="font-14 black-deep mb-12">{{businessData.businessName}} <span class="font-12" style="color:#3898EC;cursor: pointer;" @click="modifyPwd">修改密码</span> </p>
          <p class="font-12 black-deep mb-5">账号：{{businessData.businessPhone}}</p>
          <p class="font-12 black-deep mb-10">版本：<span style="color:#FE8C05;">{{businessData.version_name}}</span></p>
          <p class="font-12 tipText-color">版本有效期 {{businessData._endTime}}</p>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="bottom-cont">
      <el-col
          :span="2"
          class="text-left font-14"
          style="min-width:115px; padding-right: 10px; margin-right: 20px;"
        >营销力规则设置:</el-col>
      <el-col :span="6">
          <ul class="table-data">
            <li>
              <div>记分项</div>
              <div style="position:relative;">分值 <i class="iconfont icon-bianji1 font-14 score-set" style="color:#3898EC;cursor: pointer;" @click="scoreSet"></i></div>
            </li>
            <li>
              <div>带来曝光量</div>
              <div>
                <span>{{marketingPower.exposure.number}}</span>次曝光=<span>{{marketingPower.exposure.scoring}}</span>分 (不满1分不计入)
              </div>
            </li>
            <li>
              <div>带来访客量</div>
              <div>
                <span>{{marketingPower.userSessions.number}}</span>人=<span>{{marketingPower.userSessions.scoring}}</span>分
              </div>
            </li>
            <li>
              <div>带来咨询量</div>
              <div>
                <span>{{marketingPower.consultationVolume.number}}</span>个咨询=<span>{{marketingPower.consultationVolume.scoring}}</span>分
              </div>
            </li>
            <li>
              <div>带来成交量</div>
              <div>
                <span>{{marketingPower.volume.number}}</span>个成交=<span>{{marketingPower.volume.scoring}}</span>分
              </div>
            </li>
          </ul>
      </el-col>
    </el-main>
    <el-footer>
      <div class="footer-box">
        <ul style="margin-bottom:30px;">
          <li class="mb-5">1.营销力积分怎么算？</li>
          <li>
            <span>员工营销力积分</span>
            <span>= 带来曝光量分值+带来访客数分值+带来咨询量分值+带来成交量分值；</span>
          </li>
          <li>
            <span>客户营销力积分</span>
            <span>= 带来曝光量分值+带来访客数分值+带来咨询量分值+带来成交量分值；</span>
          </li>
          <li>
            <span>任务营销力积分</span>
            <span>= 所有员工营销力积分+所有客户营销力积分；</span>
          </li>
        </ul>
        <ul>
          <li class="mb-5">2.营销力积分记分项：</li>
          <li>
            <span>曝光量：</span>
            <span>所有点击浏览该活动的PV数据（包含扫码进入和点击链接进入）；</span>
          </li>
          <li>
            <span>访客量：</span>
            <span>包含所有通过的独立访客，重复进入不进行计算；</span>
          </li>
          <li>
            <span>咨询量：</span>
            <span>通过表单提交成功的数据数量、通过点击电话插件的数据、通过在线客服私信的数据量之和；</span>
          </li>
          <li>
            <span>成交量：</span>
            <span>通过活动进入商品详情并且下单成功的数据；</span>
          </li>
        </ul>
      </div>
    </el-footer>
    <el-dialog
      title="营销力积分设置"
      :visible.sync="showDialog"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="30%"
      center>
      <div>
        <div class="flex font-14 input-set">
          <span class="mr-5">每</span>
          <el-input type="number" oninput ="value=value.replace(/[^\d]/g,'')" placeholder="请输入数量" v-model="marketingPower.exposure.number" clearable></el-input>
          <span class="mr-5 ml-5">曝光量，记</span> 
          <el-input type="number" oninput ="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'')" placeholder="请输入数量" v-model="marketingPower.exposure.scoring" clearable></el-input>
          <span class="ml-5">分</span>
        </div>
        <div class="flex font-14 input-set">
          <span class="mr-5">每</span>
          <el-input type="number" oninput ="value=value.replace(/[^\d]/g,'')" placeholder="请输入数量" v-model="marketingPower.userSessions.number" clearable></el-input>
          <span class="mr-5 ml-5">个访客，记</span> 
          <el-input type="number" oninput ="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'')" placeholder="请输入数量" v-model="marketingPower.userSessions.scoring" clearable></el-input>
          <span class="ml-5">分</span>
        </div>
        <div class="flex font-14 input-set">
          <span class="mr-5">每</span>
          <el-input type="number" oninput ="value=value.replace(/[^\d]/g,'')" placeholder="请输入数量" v-model="marketingPower.consultationVolume.number" clearable></el-input>
          <span class="mr-5 ml-5">咨询量，记</span> 
          <el-input type="number" oninput ="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'')" placeholder="请输入数量" v-model="marketingPower.consultationVolume.scoring" clearable></el-input>
          <span class="ml-5">分</span>
        </div>
        <div class="flex font-14 input-set">
          <span class="mr-5">每</span>
          <el-input type="number" oninput ="value=value.replace(/[^\d]/g,'')" placeholder="请输入数量" v-model="marketingPower.volume.number" clearable></el-input>
          <span class="mr-5 ml-5">成交量，记</span> 
          <el-input type="number" oninput ="value=value.replace(/^(\-)*(\d+)\.(\d).*$/,'')" placeholder="请输入数量" v-model="marketingPower.volume.scoring" clearable></el-input>
          <span class="ml-5">分</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideDialog" style="background-color:#F7FBFC;">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import api from "api";
import defaultHead from "../../assets/images/default-headImg.png";
import comupload from "../../components/com-upload";
import moment from "moment";

export default {
  components: {
    comupload
  },
  name: "bussiness-info",
  data: function() {
    return {
      businessId: "", //商家id
      businessData: {}, //商家信息
      marketingPower: { //营销力设置数据
        exposure:{ //曝光量
          number: 100,
		      scoring: 1   
        },
        userSessions: { //访客量
          number: 1, 
          scoring: 1 
        },
        consultationVolume: { //咨询量
          number: 1, 
          scoring: 2 
        },
        volume: { //成交量
          number: 1, 
          scoring: 5 
        }
      }, 
      showDialog: false //弹框状态
    };
  },
  mounted() {
    this.businessId = localStorage.businessId || "";
    this.getBussinessInfo();
  },
  methods: {
    //获取商家详情数据
    getBussinessInfo() {
      let _this = this;
      api
        .request("getBussinessInfo", { businessId: _this.businessId })
        .then(function(result) {
          if (result.status == 0) {
            $('.bussiness-box').show();
            _this.businessData = result.data[0];
            _this.businessData._endTime = moment(_this.businessData.endTime).format("YYYY/MM/DD"); 
            _this.marketingPower = result.data[0].marketingPower; 
          } else {
            _this.$message.error(result.message || "操作失败!");
          }
        })
        .catch(function(error) {
          _this.$message.error(error.message);
        });
    },
    //去修改密码
    modifyPwd() {
      this.$router.push({
        path: "/modifyPwd"
      });
    },
    //保存上传数据
    saveBussiness(data) {
      let _this = this;
      this.businessData = Object.assign(this.businessData, data);
      api
        .request("saveBussinessInfo", _this.businessData)
        .then(function(result) {
          if (result.status == 0) {
            _this.getBussinessInfo();
            _this.$message({
                message: '设置成功!',
                type: 'success'
            });
          } else {
            _this.$message.error(result.message || "操作失败!");
          }
        })
        .catch(function(error) {
          _this.$message.error(error.message);
        });
    },
    //上传logo
    uploadImg(data){
      this.saveBussiness(data);
    },
    //营销力弹窗
    scoreSet(){
      this.showDialog = true;
      // this.marketingPower = Object.assign(this.marketingPower,this.businessData._marketingPower)
    },
    //提交设置
    submitData(){
      if(this.marketingPower.exposure.number=='' || this.marketingPower.exposure.scoring==''){
        this.$message.error("曝光量选项设置不能为空");
        return false
      }
      if(this.marketingPower.exposure.number < 1 || this.marketingPower.exposure.scoring < 1){
        this.$message.error('设置曝光量请输入"0"以上的整数');
        return false
      }
      if(this.marketingPower.userSessions.number=='' || this.marketingPower.userSessions.scoring==''){
        this.$message.error("访客量选项设置不能为空");
        return false
      }
      if(this.marketingPower.userSessions.number < 1 || this.marketingPower.userSessions.scoring < 1 ){
        this.$message.error('设置访客量请输入"0"以上的整数');
        return false
      }
      if(this.marketingPower.consultationVolume.number=='' || this.marketingPower.consultationVolume.scoring==''){
        this.$message.error("咨询量选项设置不能为空");
        return false
      }
      if(this.marketingPower.consultationVolume.number < 1 || this.marketingPower.consultationVolume.scoring < 1 ){
        this.$message.error('设置咨询量请输入"0"以上的整数');
        return false
      }
      if(this.marketingPower.volume.number=='' || this.marketingPower.volume.scoring==''){
        this.$message.error("成交量选项设置不能为空");
        return false
      }
       if(this.marketingPower.volume.number < 1 || this.marketingPower.volume.scoring < 1 ){
        this.$message.error('设置成交量请输入"0"以上的整数');
        return false
      }
      let marketingPower = this.marketingPower;
      for (let key in marketingPower) {
        let cont = {
          number: parseInt(marketingPower[key].number),
          scoring: parseInt(marketingPower[key].scoring)
        }
        marketingPower[key] = cont;
      }
      this.saveBussiness(marketingPower);
      this.showDialog = false;
    },
    //取消设置
    hideDialog(){
      this.getBussinessInfo();
      this.showDialog = false;
    },
    //关闭弹窗
    handleClose(){
      this.getBussinessInfo();
      this.showDialog = false;
    } 
  }
};
</script>
<style scoped>
  .mb-5{
    margin-bottom: 5px;
  }
  .mr-5{
    margin-right: 5px; 
  }
  .ml-5{
    margin-left: 5px; 
  }
  .mb-10{
    margin-bottom: 10px;
  }
  .mb-12{
    margin-bottom: 12px;
  }
  .bussiness-box >>> .el-dialog{
    min-width: 465px;
    background-color: #F7FBFC;
  }
  .bussiness-box >>> .el-button{
    width: 100px;
    height: 34px;
    line-height: 8px;
  }
  .bussiness-box >>> .el-input{
    width: 130px;
  }
  .bussiness-box >>> .el-input__inner{
    width: 130px;
    height: 30px;
    border-radius: 0;
    border-color: #B1BFCD;
  }
  .bussiness-box .input-set{
    text-align: center;
    line-height: 29px;
    margin-bottom: 15px;
  }
  .bussiness-box .top-cont{
    height: 200px!important;
    padding: 40px 35px;
  }
  .bussiness-box .bottom-cont{
    height: 243px!important;
  }
  .bussiness-box .table-data{
    width: 543px;
  }
  .bussiness-box .table-data .score-set{
    position: absolute;
    right: 9px;
  }
  .bussiness-box .table-data > li{
    display: flex;
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #DEE4E9;
  }
  .bussiness-box .table-data > li:first-child{
    background-color: #F7FBFC;
  }
  .bussiness-box .table-data > li:last-child{
    border-bottom: 1px solid #DEE4E9;
  }
  .bussiness-box .table-data > li > div{
    width: 50%;
    text-align: center;
  }
  .bussiness-box .table-data span{
    color: #F68411;
  }
  .bussiness-box .footer-box{
    height:278px; 
    margin:10px 0 0 116px;
    padding: 20px 0 0 33px;
    background-color:#F7FBFC;
  }
  .bussiness-box .footer-box ul li{
    line-height: 22px;
  }
  .bussiness-box .footer-box ul li span:nth-of-type(2){
    color: #b1bfcd;
  }
</style>
