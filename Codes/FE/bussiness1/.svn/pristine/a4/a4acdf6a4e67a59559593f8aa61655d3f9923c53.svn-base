<template>
  <div class="title-box">
    <span class="left-bag"></span>
    <div class="font-style">
      <span>{{myTitle}}</span>
      <span v-if="goBack" @click="goBackfn()" class="go-back">返回上一页</span>
    </div>
  </div>
</template>
<script>
/*
*goBack:  1、page 根据路由返回上一页  
*         2、components 触发goBackFunction 用于返回上一步
*/
export default {
  name: "navigator",
  props: [
    'myTitle',
    "goBack"
  ],
  methods:{
    goBackfn(){
      if(this.goBack=="page"){
        this.$router.go(-1);
      }else if(this.goBack == 'components'){
        this.$emit('goBackFunction')
      }
    }
  }
};
</script>
<style scoped>
.title-box {
  height: 60px;
  line-height: 60px;
  position: relative;
}
.title-box .left-bag {
  position: absolute;
  left: 0;
  height: 20px;
  top: 20px;
  width: 2px;
  background: #00bad0;
}
.title-box .font-style {
  font-size: 14px;
  color: rgba(60, 74, 85, 1);
  width: 95%;
  margin: 0 auto;
  height: 60px;
  border-bottom: 1px solid #e3e6eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.go-back{
  color: #008FFF;
  height: 60px;
  cursor: pointer;
  font-size: 12px;
}
</style>







