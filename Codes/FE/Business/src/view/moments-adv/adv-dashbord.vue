<template>
    <div class="page-box">
        <div class="panel-box panel-box1">
            <div class="title">基础财务信息</div>
            <div class="content">
                <div>总金额（元）</div>
                <div><span class="cl-red pull-left fn-34" v-text="overview.money"></span><button class="my-btn-green pull-right"  @click="recharge()">充值</button></div>
            </div>
        </div>
        <div class="panel-box">
            <div class="title">朋友圈广告</div>
            <div class="content">
                <div class="content-item">
                    <div>推广中</div>
                    <div  class="cl-red fn-20" v-text="overview.pass"></div>
                </div>
                <div class="content-item">
                    <div>审核失败</div>
                    <div  class="cl-red fn-20" v-text="overview.fail"></div>
                </div>
                <div class="content-item">
                    <div>审核中</div>
                    <div  class="cl-red fn-20" v-text="overview.ing"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from "api";


export default {
    data() {
        return {
            overview:{}
        }
    },
     mounted() {
         var self=this;
         api.request('getPromotionOverview',{},result =>{
             if(result.status==0){
                 self.overview=result.data;
             }
         })
     },
     methods:{
         recharge(){
             this.$alert("尊敬的客户：充值请联系电话028-XXXXXXX", "提示", {
                center: true,
                confirmButtonText: "确定"
            })
         }
     }
}
</script>
<style scoped>
.page-box{
    padding-top:30px;
   font-size:14px ;
}
.page-box .panel-box{
    float: left;
}
.page-box .panel-box1{
    width: 380px;
    margin-right:20px;
}
.page-box .panel-box .title{
    margin-bottom: 20px;
}
.page-box .panel-box .content{
    border:1px solid #e6e6e6;
    height:140px;
    padding:30px 0;
    box-sizing: border-box;
}
.page-box  .panel-box1 .content>div{
    margin:auto;
    width: 300px;
    line-height: 34px;
    overflow: hidden;
}
.page-box  .panel-box1 .content .my-btn-green{
    width: 100px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    outline: none;
    border: none;
    border-radius: 5px;
    color: #fff;
    font-size: 14px;
}
.page-box .fn-34{
    font-size: 34px;
}
.page-box .fn-20{
    font-size:20px;
}
.page-box .panel-box .cl-red{
    color: #fa766b;
}
.page-box .panel-box .content-item{
    float: left;
    width: 240px;
    text-align: center;
    margin-top:18px;
}

</style>
