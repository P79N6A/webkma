<template>
  <div class="material-label-box">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1">
        <template slot="title">
          <i class="header-icon el-icon-info" style="margin: 0 6px;"></i>{{title}}
        </template>
        <div class="label-info">
          <slot></slot>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "com-fold",
  props: {
    title:{
      type: String,
      default: "菜单标题"
    }
  },
  data() {
    return {
       activeNames: "1" //折叠菜单
    };
  },
  mounted() {},
  computed: {},
  methods: {
    handleChange(val) { 

    }
  }
};
</script>
<style scoped>
  .material-label-box {
    margin: 15px 20px 0;
  }
</style>
