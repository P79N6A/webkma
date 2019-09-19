
<template>
    <el-card class="el-box-card" shadow="hover" :body-style="{ padding: '0px' }">
        <div class="tip-msg " :class="data.msgClass" v-text="data.statusText" > </div>
        <div class="box-body">
            <!-- <sms-content :data="data"></sms-content> -->
            <div class="box-content" slot="reference" >
            <i class="icon-msg" :class="data.iconClass"> </i> 
            <span v-multiline-text-clip="{width:22,height:22.5,line:2}" class="content-body" style="">{{data.name}}</span>
        </div>
            <!-- <div>{{data.name}}</div> -->
        </div>
        <el-row class="footer">
            <el-col :span="12" class="spilt-line"> 
                <el-button type="text" v-if="!!data.editable " @click="onEditHandler"> 编辑</el-button>
                <el-button type="text" v-else @click="onGetDetailHandler"> 查看详情</el-button>
            </el-col>
            <el-col :span="12"  > <el-button type="text" class="el-button_danger" @click="onRemoveHandler">删除</el-button></el-col>
        </el-row>
    </el-card>
</template>

<script>
export default {
    name:'mail-item',
    props:{
        data:Object
    },
    data(){
        return {
        };
    },
    methods:{
        onRemoveHandler(){
            this.$emit('removeHandler',this.data)
        },
        onEditHandler(){
            this.$emit('editHandler',this.data)
        },
        onGetDetailHandler(){
            this.$emit('getDetailHandler',this.data)
        },
       
    }
}
</script>

<style scoped>
    .box-body{
        height: 120px;
        padding: 40px 25px 0;
    }
    
    /* .clip-text::after{
        content: '...';
        position: absolute;
        bottom: 0;
        right: 0;
        height: 22px;
        width: 22px;
        text-align: right;
        background:linear-gradient(to right,transparent 0% ,#fff 40%,#fff);
    } */
    
    .tip-msg{
        height: 20px;
        line-height: 12px;
        border: 1px solid #eee;
        position: absolute;
        top: 0;
        right: 0;
        width: auto;
        font-size: 12px;
        padding: 2px;
    }
    .tip-msg-success{
        color: #24d0c6;
        background-color: #e9faf9;
        border-color: #24d0c6;
    }
    .tip-msg-editing{
        background-color: #eef6ff;
        color:#3898ec;
        border-color:#3898ec;  
    }
    .tip-msg-auditing{
        background-color: #fff3e6;
        color:#f58410;
        border-color:#f58410;  
    }
    .tip-msg-fail{
        background-color: #fef1f0;
        color:#fa766b;
        border-color:#fa766b;  
    }
    
    .spilt-line{
        position: relative;
    }
    .spilt-line::after{
        content: '';
        width: 1px;
        display: inline-block;
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        border-right: 1px solid #eee;
    }
    .footer{
        height: 38px;
        border-top:1px solid #eee; 
        box-sizing: border-box;
        background: #fafbff;
        font-size: 12px;
        color: #9eabb8;
        line-height: 38px;
        text-align: center;
        /* overflow: hidden; */
    }
    .footer .el-button--text{
        padding: 10px 20px;
    }

    .box-content{
  height: 45px;
  line-height:22px;
  padding-left: 45px;
  overflow: hidden;
  position: relative;
}
.icon-msg{
  background-size: contain;
  width: 45px;
  height: 45px;
  margin-left: -45px;
  margin-right: 20px;
  float: left;
}
.icon-msg-editing{
  background: url(../assets/images/icon-msg-editing.png) no-repeat left center;
}
.icon-msg-auditing{
  background: url(../assets/images/icon-msg-auditing.png) no-repeat left center;
}
.icon-msg-success{
  background: url(../assets/images/icon-send-success.png) no-repeat left center;
}
.icon-msg-fail{
  background: url(../assets/images/icon-send-fail.png) no-repeat left center;
}
.icon-msg-timer{
  background: url(../assets/images/icon-msg-timer.png) no-repeat left center;
}
.content-body{
  word-wrap:break-word;
  word-break :break-all;
  display: block;
  /* text-align: center; */
}
</style>

