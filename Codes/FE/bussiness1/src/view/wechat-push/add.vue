<template>
  <div style="height:auto;">
    <headerTitle :myTitle="myTitle" goBack='page'></headerTitle>
    <div class="step_content">
      <step-one :formData='formData'></step-one>
      <step-two :formData='formData'></step-two>
      <div class="addbtns">
        <div @click="add">发送</div>
        <div @click="goBack">取消</div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "api";
import headerTitle from "components/header-title";
import StepOne from "./add-step1";
import StepTwo from "./add-step2";
export default {
  components: {
    headerTitle,
    StepOne,
    StepTwo
  },
  data() {
    return {
      myTitle: "添加微信推送",
      active:1,
      formData:{
        name:'',
        labels:[],
        manuscript_id:''
      }
    }
  },
  methods: {
    goBack(){
      this.$router.go(-1);
    },
    add(){
      let cont = {
        user_ids:'',
        title:this.formData.name,
        manuscript_id:this.formData.manuscript_id,
        message:'1'
      }
      this.formData.labels.forEach((element,index) => {
          cont.user_ids += index==this.formData.labels.length-1?element.user_id:element.user_id+','
      });
      if(!cont.title){
        this.$message.error('推送标题不能为空')
        return
      }else if(!cont.manuscript_id){
        this.$message.error('请选择推送内容')
        return
      }else if(cont.user_ids.length<1){
        this.$message.error('请选择推送客户')
        return
      }
      let self = this
      api.request("addWxPush", cont, result => {
        if(result.status==0){
          self.$message.success("添加成功");
          self.goBack()
        }else{
         self.$message.error(result.message);
        }
      })
    }
  }
}
</script>
<style scoped>
.step_content{
  width:85%;
  margin: 0 auto;
  margin-bottom: 100px
}
.pull-right {
  padding-right: 30px;
}
.el-step__title{
    margin-left: -14px !important;
}
.addbtns{
  margin-left: 100px;
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
}
.addbtns div{
  width: 100px;
  height: 34px;
  text-align: center;
  line-height: 34px;
  margin-right: 20px;
  background: #00BAD0;
  border: 1px solid #00BAD0;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
}
.addbtns div:last-child{
  border: 1px solid #B1BFCD;
  color: #9EABB8;
  background: #ffffff
}
</style>