<template>
  <div>
    <p style="font-size:36px;text-align: center;height: 100px;line-height: 100px;">{{msg}}</p>
    <vdialog :isShow="showDialog" :options="dialogOptions" v-on:modalResponse="modalResponse">
      <div style="overflow:hidden;">
        <p>sdfdsjfsfdgmsgksgklsmgmlksklg</p>
      </div>
    </vdialog>
    <button v-on:click="showPromp" type="button">弹窗</button>
    <button v-on:click="deleteService" type="button">删除</button>
    <router-link to="/">首页</router-link>
    <a @click="toDesign">编辑界面</a>
  </div>
</template>

<script>
import vdialog from "../components/com-dialog";
import deleteService from "../axios/api-service";
export default {
  name: 'home',
  data() {
    return {
      msg: 'Welcome to KPaas (*╹▽╹*)',
      dialogOptions: {//弹窗配置项
        width: '600',//弹窗宽度
        // title: '啥子东东',
        hasBtn: false //是否需要确定按钮，默认没有确认按钮
      },
      showDialog: false
    }
  },
  components: {
    vdialog
  },
  methods: {
    showPromp() {
      this.showDialog = true;
      this.myMessage.warning('修改成功！')
    },
    deleteService() {
      deleteService(1, function() {
        console.log(1111111111111111111111111111111111111111);
      })
    },
    modalResponse(json) {
      if (json.type === 'close') {
        this.showDialog = false;
      } else {//有表单等要操作的内容

      }
    },
    toDesign() {
      this.$router.push({ name: "design" })
      // this.$router.go(0)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
