<template>
  <div class="app-header-wrap">
    <div class="app-header">
      <a class="logo" @click="switchPage"><img src="../assets/images/logo.png" alt=""></a>
      <div class="haslogin pull-right" v-if="isLoginStatus">
        <div class="head_info clearfix">
          <img class="head-img pull-left" :src="userInfo.userFace=='null'?'https://resource.ikmark.com/tuixiaobao/weapp/default-logo.jpg':userInfo.userFace">
          <el-popover placement="top-start" width="100" trigger="hover" popper-class="el-popover-clear-padding">
            <div class="my_child_menu">
              <p v-if="userInfo.role == 1" @click="goBussinessInfo">商家中心</p>
              <p class="logout" @click="logout">退出登录</p>
            </div>
            <div id="h_userInfomation" class="pull-left userInfomation" slot="reference">
              <p class="head_info_company nrp" style="width:110px;" title="">{{userInfo.userPhone}}</p>
              <span class="head_info_name pull-left grey_blue nrp" title="">{{userInfo.userName}}</span>
              <i class="small_arrow"></i>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "com-header",
  data() {
    return {
      userInfo: {
        userName: "",
        userPhone: "",
        userFace: "",
        role: localStorage.getItem("role")
      },
      isLogin: this.$store.state.login.isLogin
    };
  },
  mounted() {
    (this.userInfo.userName = localStorage.userName),
      (this.userInfo.userPhone = localStorage.userPhone),
      (this.userInfo.userFace = localStorage.userFace);
  },
  computed: {
    isLoginStatus: function() {
      return this.isLogin;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("setLogout");
       this.$router.push({ path: "/login" });
    },
    switchPage() {
      if (this.userInfo.role == 1) {
        this.$router.push({ path: "/dashbord" });
      }
    },
    //去商家中心
    goBussinessInfo() {
      this.$router.push({
          path: '/bussiness-info'
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pull-left {
  float: left;
}

.pull-right {
  float: right;
}

.app-header-wrap {
  width: 100%;
  min-width: 1400px;
  height: 50px;
  line-height: 50px;
  background-color: #25d0c7;
  background-image: linear-gradient(to right, #01c2cc, #5d5fac);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
}

.app-header {
  width: 1400px;
  height: 50px;
  line-height: 50px;
  margin: 0 auto;
}

.logo {
  display: block;
  width: 150px;
  height: auto;
  float: left;
  cursor: pointer;
}

.logo img {
  width: 100%;
  height: 100%;
}

.app-header .haslogin {
  width: 180px;
  height: 75px;
  float: right;
}

.head_info {
  display: inline-block;
  width: auto;
  width: 180px;
  height: 30px;
  margin-top: 10px;
}

.head_info .head-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.app-header .userInfomation {
  position: relative;
  width: 130px;
  float: left;
}

.head_info .head_info_company {
  line-height: 0px;
  font-size: 14px;
  color: #ffffff;
  font-weight: bold;
  margin: 8px 0;
}

.head_info .head_info_name {
  width: 104px;
  line-height: 15px;
  font-size: 12px;
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.app-header .userInfomation .small_arrow {
  position: absolute;
  right: 10px;
  top: 15px;
  width: 0;
  height: 0;
  overflow: hidden;
  font-size: 0;
  /*是因为, 虽然宽高度为0, 但在IE6下会具有默认的 */
  line-height: 0;
  /* 字体大小和行高, 导致盒子呈现被撑开的长矩形 */
  border-width: 5px;
  border-style: solid;
  /*ie6下会出现不透明的兼容问题*/
  border-color: #fff transparent transparent transparent;
}

.my_child_menu p {
  height: 34px;
  line-height: 34px;
  text-align: center;
  font-size: 14px;
  color: #63717b;
  cursor: pointer;
  margin: 0;
}

.my_child_menu p.logout {
  color: #ed5564;
}

.my_child_menu p:hover {
  background-color: #f1f3fc;
}

.gologin {
  width: auto;
  height: 80px;
  line-height: 80px;
}

.gologin .register {
  width: 106px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #2578c0;
  outline: none;
  color: #fff;
  border-radius: 30px;
  border: none;
  margin-left: 30px;
}
</style>
