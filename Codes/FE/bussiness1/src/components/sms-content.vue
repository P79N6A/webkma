
<template>
    <el-popover
        placement="top-start"
        title="短信内容"
        width="300"
        trigger="hover"
        :open-delay="openDelay"
        >
        <slot>
          <div style="word-wrap:break-word;">{{data.templateContent}}</div>
        </slot>
        <div class="box-content" slot="reference" >
            <i class="icon-msg" :class="data.iconClass"> </i> 
            <span v-multiline-text-clip="{width:22,height:22.5,line:2}" class="content-body" style="">{{data.templateContent}}</span>
        </div>
    </el-popover>
</template>

<script>

export default {
    name:'SmsContent',
    componentName:'SmsContent',
    props:{
        data:Object
    },
    data(){
        return {
          openDelay: 500
        };
    }
}
</script>

<style scoped>
    /*sms item 相关样式*/
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
  text-align: center;
}
</style>

