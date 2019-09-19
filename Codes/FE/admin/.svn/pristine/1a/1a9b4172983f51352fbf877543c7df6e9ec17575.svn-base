<template>
  <div class="detail-box">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="推广目标" name="1">
        <div>推广名称：{{detail.createTime+'-'+detail.targetName+'-'+detail.advertName+'-'+detail.buyWayName+'广告'}}</div>
        <div>当前状态：{{detail.state==0?'审核中':(detail.state==1?'审核失败':(detail.state==2?'审核通过':(detail.state==3?'已结束':'已暂停')))}}</div>
        <div>推广目标：{{detail.targetName}}</div>
        <div>广告位置：{{detail.advertName}}</div>
        <div>购买类型：{{detail.buyWayName}}</div>
      </el-collapse-item>
      <el-collapse-item title="用户人群" name="2">
        <div>投放时间：{{detail.timeOnline+'至'+detail.timeOffline+' '+'每天'+detail.timeDayBegin+'-'+detail.timeDayEnd}}</div>
        <div>每日预算：{{detail.budget}}</div>
        <div>出价：{{detail.bidPrice}}</div>
        <div>地域：{{detail.cityNames}}</div>
        <div>年龄：{{detail.ageBegin+'-'+detail.ageEnd}}岁</div>
        <div>性别：{{detail.sex==0?'全部':(detail.sex==1?'男':'女')}}</div>
        <div>兴趣：{{detail.interestNames}}</div>
      </el-collapse-item>
      <el-collapse-item title="创意类型" name="3">
          <div>外层样式：{{detail.styleName}}</div>
          <div>外层文案标题：{{detail.outerCopyTitle}}</div>
          <div>外层文案：{{detail.outerContent}}</div>

          <div>外层素材跳转：{{detail.chickJumpName}}</div>
          <div v-if="!!detail.activity">原生推广页：{{detail.activity.name}}</div>
          <div>外层素材样式：{{detail.outerMaterialName}}</div>
          
          <div>文字链类型：{{detail.textStyleName}}</div>
          <div>文字链跳转：{{detail.textJumpName}}</div>
          <div>绑定小程序：{{detail.appOriginalId}}</div>
          <div><span>外层图片：</span><img class="thumbnailImg" :src="detail.outerMaterialPath" @click="openImg(detail.outerMaterialPath)">
          </div>
          <div>分享标题：{{detail.shareTitle}}</div>
          <div>分享描述：{{detail.shareDesc}}</div>
      </el-collapse-item>
      <el-collapse-item title="其他信息" name="4">
        <div>所属商家：{{detail.business.businessName}}</div>
        <div v-if="!!detail.public">所属公众号：{{detail.public}}</div>
        <div v-if="!!detail.activity"><span>推广活动封面缩略图：</span><img class="thumbnailImg" :src="detail.activity.cover" @click="openImg(detail.activity.cover)">
        </div>
        <div v-if="!!detail.activity">推广活动名称：{{detail.activity.name}}</div>
        <div v-if="!!detail.activity">活动链接：{{detail.activity.url}}</div>
        <div v-if="detail.state==1">审核失败原因：{{detail.reason}}</div>
      </el-collapse-item>
    </el-collapse>
    <div class="panel-box text-center" style="margin-top: 25px;">
        <el-button type="primary" v-if="detail.state==0" @click="action('success')">通过</el-button>
        <el-button type="primary" v-if="detail.state==0" @click="action('fail')">驳回</el-button>
        <el-button type="primary" @click="action('back')">返回</el-button>
    </div>
    <comDialog :title="dialogTitle" :modal-show.sync="modalVisible">
      <div class="txt_content clearfix" v-if="model.status == 2 || model.status == 1 ">
        <div class="font-18" v-if="model.status == 2">确定推广计划审核成功？</div>
        <div v-if="model.status == 1">
          <input type="text" placeholder="请输入审核失败原因" v-model="model.reason" class="form-control">
        </div>
        <div style="margin-top:20px;" class="text-center">
          <el-button type="info" @click="action('done')">取消</el-button>
          <el-button type="primary" @click="action('model')">确定</el-button>
        </div>
      </div>
      <div v-if="model.status == 3">
        <img :src="imgSrc">
      </div>
    </comDialog>
  </div>
</template>
<script>
  import api from '../../axios/api-service'
  import comDialog from "../../components/com-dialog";
  export default {
    name: "weChat-detail",
    components:{ comDialog },
    data() {
      return{
        detail: {}, //详情信息
        mainId: "", //计划id
        model:{
          status: "", //审核状态
          reason: "", //失败原因
          err: ""
        },
        dialogTitle: "", //弹出框标题
        modalVisible: false, //弹出框
        activeNames: ['1','2','3','4'], //默认显示
        imgSrc: "" //图片路径
      }
    },
    mounted(){
      this.mainId = this.$route.query.mainId || '';
      this.getPromotionDetail();
    },
    methods:{
      //计划详情
      getPromotionDetail(){ 
        var self = this;
        api.request('getPromotionDetail',{
          id:self.mainId
        },result => {
          if (result.status == 0) {
            self.detail = result.data; 
          } else {
            self.messenger.error(result.message);
          }
        })
      },
      //事件集合
      action(type){
        var self = this;
        switch (type) {
          case 'success': //通过
            self.model.status = 2;
            self.model.reason = '';
            self.model.err = '';
            self.dialogTitle = '确认计划审核成功'
            self.modalVisible = true;
            break;
          case 'fail': //驳回
            self.model.status = 1;
            self.model.reason = '';
            self.model.err = '';
            self.dialogTitle = '确认计划审核失败'
            self.modalVisible = true;
            break;
          case 'back': //返回
            self.$router.push({
              path: `/wechat-adv`
            });
            break;
          case 'model': //确定
            var opt = { 'mainId': self.mainId , "state": self.model.status };
            if (self.model.status == 1) {
                if (self.model.reason == '') {
                    self.messenger.error("请输入审核失败原因");
                    return;
                }
                opt.reason = self.model.reason;
            }
            api.request("isPass",opt,result => {
              if (result.status == 0) {
                self.modalVisible = false;
                self.messenger.success(self.model.status == 1 ? '已驳回成功' : '已审核成功');
                self.getPromotionDetail();
              } else {
                self.messenger.error(result.message);
              }
            })
            break;
          case 'done': //取消
            self.modalVisible = false;
            break;
        }
      },
      //放大图片
      openImg(src){
        this.model.status = 3;
        this.dialogTitle = '';
        this.imgSrc = src + '@w_356,h_720';
        this.modalVisible = true;
      },
      // handleChange(val) {
        
      // }
    }
  }
</script>
<style scoped>
  .detail-box >>> .el-collapse{
    border: none;
  }
  .detail-box >>> .el-collapse .el-collapse-item{
    border: none;
  }
  .detail-box >>> .el-collapse .el-collapse-item .el-collapse-item__header{
    color: #000;
    font-size: 15px;
    font-weight: bold;
    background-color: transparent;
    border-bottom: 1px solid #999;
  }
  .detail-box >>> .el-collapse-item__wrap{
    border: none;
  }

  .detail-box{
    padding: 20px;
  }

  .detail-box .thumbnailImg{
    height: 38px;
    cursor: pointer;
    margin: 10px 6px;
    vertical-align: middle;
  }
</style>


