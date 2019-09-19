<template>
  <div style="height:auto;" class="stepone-box">
    <el-form ref="form" :model="formData" label-width="100px"  size="mini">
      <el-form-item label="推送标题：" class="activity-name">
        <el-input v-model="formData.name" size='small' maxlength="20" style="width: 400px;">
        </el-input>
        <span style="font-size:12px">{{formData.name.length}}/20</span>
      </el-form-item>
      <el-form-item label="选择内容：" style="margin-top:0px;margin-bottom:10px">
        <MyLibrary  @getmanuscript='getmanuscript'></MyLibrary>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import MyLibrary from "@/components/my-library.vue";
export default {
  components: {
    MyLibrary
  },
  props:['formData'],
  data() {
    return {

    }
  },
  methods:{
    getmanuscript(data){
      this.formData.manuscript_id = data.id
    }
  }
}
</script>
<style scoped>
.stepone-box {
  margin-top: 15px;
}
.stepone-box .activity-name {
  width: 500px;
  margin-bottom: 10px;
}
.stepone-box .activity-name span {
  position: absolute;
  right: 5px;
  top: 0;
  color: #b1bfcd;
}
.stepone-box >>> .el-input__inner {
  background-color: #fff;
  position: relative;
}
.stepone-box >>> label {
  font-weight: 400;
}
.el-step >>>.el-step__main{
  margin-left: -22px !important;
}
</style>
