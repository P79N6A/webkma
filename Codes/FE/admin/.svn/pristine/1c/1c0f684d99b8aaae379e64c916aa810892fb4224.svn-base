<template>
    <div>
      <el-dialog :title="title" :visible.sync="modalShow" :before-close="handleClose" :width="size" top="34vh"
        :center="true" class="AssignmentMc-box">
        <div>
          <slot></slot>
        </div>
      </el-dialog>
    </div>
</template>
<script>
export default {
    name:'com-dialog',
    props:{
      modalShow: Boolean,
      size:{
        type: String,
        default:"500px"
      },
      title:{
        type: String,
        default:"标题"
      }
    },
    data(){
        return{
        }
    },
    mounted(){
        
    },
    methods:{
      handleClose(){
        this.modalShow = false;
      },
    },
    watch:{
      modalShow : function (val) {
        this.$emit('update:modalShow', val);
      }
    }   
}
</script>
<style scoped>

</style>



