

<template>
  <div id="app-login" class="app-login">
    <!--<comHeader/>-->
    <div class="header">
      <div class="header-waper">
        <a class="logo"><img src="../assets/images/logo-login.png" alt=""></a>
      </div>
    </div>
    <div class="app-login-box">
      <div class="app-login-box-form pull-right">
        <div :class="role==2?'app-login-box-head-de':''" class="app-login-box-head"></div>
        <div class="app-login-box-role">
          <div class="pull-left role-item" @click="changeRole(1)">
            <div>我是商家</div>
            <div :class="role==1?'role-border':''"></div>
          </div>
          <div class="pull-right role-item" @click="changeRole(2)">
            <div>我是设计师</div>
            <div :class="role==2?'role-border':''"></div>
          </div>
        </div>
        <div class="app-login-box-container">
          <form>
            <div class="form-item">
              <!--<div class="input-item">-->
              <i class="iconfont icon-login"></i>
              <input type="text" class="txt-box" :class="{'txt-placeholder':this.username.length == 0}" v-model="username" id="username" name="login" placeholder="用户名">
              <!--</div>-->
              <span class="error"></span>
            </div>

            <div class="form-item">
              <!--<div class="input-item">-->
              <i class="iconfont icon-lock"></i>
              <input type="password" class="txt-box" :class="{'txt-placeholder':this.password.length == 0}" v-model="password" id="password" name="password" placeholder="密码">
              <!--</div>-->
              <span class="error"></span>
            </div>

            <div class="">
              <div class="row">
                <div class="col-md-6 col-xs-6">
                  <div class="app-checkbox">
                    <i class="icon-select" @click="remeber" :class="{'active': isRemeber}"></i>
                    <!--<input type="checkbox" name="app-checkbox-1" value="0">-->
                    <span>记住账号</span>
                  </div>
                </div>
                <div class="col-md-12 col-xs-12">

                </div>
                <div class="col-md-12 col-xs-12">
                  <button class="btn btn-success btn-block login-btn" type="button" @click="login">登&nbsp;&nbsp;&nbsp;&nbsp;录</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import comHeader from "components/com-header";
import api from "api";

export default {
  name: "login",
  components: { comHeader },
  data() {
    return {
      username: "", password: "", isRemeber: false,
      role: 1//1商家 2设计师
    };
  },
  mounted() {
    let _this = this;
    $(".app-login-box-container").keypress(function(e) {
      if (e.which == 13) {
        _this.login();
        return false;
      }
    });
    // debugger
    _this.isRemeber = localStorage.isRemeber == "true" ? true : false;
    if (_this.isRemeber) {
      _this.username = localStorage.userPhone;
    }
    $("#app-login").keydown(function(e) {
      var ev = window.event || e;
      var code = ev.keyCode || ev.which;
      if (code == 13) {
        _this.login();
        event.returnValue = false;
      }
    });
    // $(document).ready(function() {
    //   $(".login-btn").keydown(function(e) {
    //     debugger
    //     var curKey = e.which;
    //     if (curKey == 13) {
    //       this.login();
    //       return false;
    //     }
    //   });
    // });
  },
  methods: {
    formValidate() {
      let _this = this;
      let objArr = [$("#username"), $("#password")];
      let _username = window.formValidation({
        obj: objArr[0],
        empty: "请输入用户名",
        type: "phone",
        error: "手机号码格式不正确"
      });
      let _password = window.formValidation({
        obj: objArr[1],
        minLength: 6,
        empty: "请输入密码",
        lengthError: "请输入不小于6位密码"
      });
      objArr.forEach(function(element) {
        element.blur();
      });

      return new Promise((resolve, reject) => {
        _this.settimeout = setTimeout(() => {
          if(_username.tag && _password.tag){
            resolve(true);
          } else {
            resolve(false);
          }
        }, 100)
      })
    },
    login() {
      let _this = this;

      let _login = () => {
        let userInfo = {
          user_account: _this.username,
          user_password: _this.password,
          user_type: _this.role
        };
        api.request(
          "login",
          userInfo,
          function(result) {
            if (result.status == 0) {
              let sessionInfo = {
                user_uuid: result.data.user_uuid,
                sessionId: result.data.sessionId,
                userId: result.data.businessInfo.userId,
                userPhone: result.data.businessInfo.businessPhone,
                userName: result.data.businessInfo.businessName,
                role: result.data.businessInfo.businessType,
                userFace: result.data.businessInfo.businessLogo,
                isRemeber: _this.isRemeber,
                businessId: result.data.businessInfo.businessId,
                businessSecret: result.data.businessInfo.secret,
                businessCover: result.data.businessInfo.businessCover
              };
              _this.$store.dispatch("setLoginStatus", sessionInfo);
              _this.$store.dispatch("saveUserInfo", result.data);
              switch (sessionInfo.role) {
                case 1:
                  _this.$router.push({ path: "/dashbord" });
                  break;
                case 2:
                  _this.$router.push({ path: "/design-workbench" });
                  break;
              }
            } else {
              _this.myMessage.error(result.message);
            }
          },
          function(err) {
            console.log(err);
          }
        );
      }
      this.formValidate().then((tag) => {
        clearTimeout(this.settimeout);
        if(!tag) return;
        _login();
      });
    },
    remeber() {
      // debugger
      this.isRemeber = !this.isRemeber;
      let sessionInfo = {
        isRemeber: this.isRemeber
      };
      if (!!this.isRemeber) {
        this.$store.dispatch("setLoginStatus", sessionInfo);
      }
    },
    changeRole(role) {
      this.role = role;
      this.username = "",
        this.password = ""
    },
    enterClick(evt) {
      evt = (evt) ? evt : ((window.event) ? window.event : "");
      //兼容IE和Firefox获得keyBoardEvent对象 
      var key = evt.keyCode ? evt.keyCode : evt.which;
      //兼容IE和Firefox获得keyBoardEvent对象的键值 
      if (key == 13) {
        $(".login-btn").click();
        event.returnValue = false;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-login {
  min-height: 780px;
  /*background-color: #eff7fa;*/
  background: url('../assets/images/login-background.png') no-repeat;
  background-size: cover;
  background-position: center center;
}

.app-login .header {
  width: 100%;
  height: 75px;
  background-color: #fff;
  box-shadow: 0px 0px 25px #dde5e7;
}

.app-login .header .header-waper {
  width: 1200px;
  height: 75px;
  line-height: 75px;
  margin: 0 auto;
}

.app-login .logo {
  display: block;
  width: 180px;
  height: 60px;
  float: left;
  margin-left: 10px;
  cursor: pointer;
}

.app-login .logo img {
  width: 100%;
  height: 100%;
}

.app-login .app-login-box {
  font-size: 14px;
  color: #888888;
  width: 1050px;
  margin: 0 auto;
  padding-top: 70px;
}

.app-login .app-login-box-form {
  width: 300px;
  height: 450px;
  background-color: #fff;
  padding: 30px;
}

.app-login .app-login-box-form .form-group {
  height: 65px;
  margin-bottom: 10px;
}

.app-login .app-login-box-form .app-login-box-head {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  background: url('../assets/images/login-head01.png')
}

.app-login .app-login-box-form .app-login-box-head-de {
  background: url('../assets/images/login-head02.png')
}

.app-login .app-login-box-form .app-login-box-role {
  height: 40px;
  margin-top: 20px;
}

.app-login .app-login-box-form .app-login-box-role .role-item {
  width: 120px;
  text-align: center;
  cursor: pointer;
}

.app-login .app-login-box-form .app-login-box-role .role-border {
  width: 120px;
  margin-top: 15px;
  border-bottom: 2px #24d0c6 solid;
}

.app-login .app-login-box-form .app-login-box-container {
  margin-top: 20px;
}

.app-login .app-login-box-form .app-login-box-container .form-item {
  color: #c9d4df;
  height: 65px;
  position: relative;
}

.app-login .app-login-box-form .app-login-box-container .form-item i {
  position: absolute;
  top: 10px;
}

.app-login .app-login-box-form .app-login-box-container .txt-box {
  width: 240px;
  border: 0;
  /*left: 25px;
  top: 10px;
  position: absolute;*/
  height: 40px;
  color: #888888;
  padding-left: 25px;
  border-bottom: 1px #e5e5e5 solid;
}

.app-login .app-login-box-form .app-login-box-container .txt-box:focus {
  border: 0;
  border-bottom: 1px #9bcbf5 solid;
}

.app-login .app-login-box-form .app-login-box-container .txt-placeholder::-webkit-input-placeholder {
  color: #c9d4df;
}

.app-login .app-login-box-form .app-login-box-container .txt-placeholder::-moz-placeholder {
  color: #c9d4df;
}

.app-login .app-login-box-form .app-login-box-container .txt-placeholder:-moz-placeholder {
  color: #c9d4df;
}

.app-login .app-login-box-form .app-login-box-container .txt-placeholder:-ms-input-placeholder {
  color: #c9d4df;
}

.app-login .app-login-box-form .app-login-box-container .app-checkbox {
  margin-top: 7px;
}

.app-login .app-login-box-form .app-login-box-container .login-btn {
  height: 40px;
  border: 0;
  border-radius: 2px;
  font-size: 16px;
  margin-top: 25px;
  background-color: #24d0c6;
}

.app-login .app-login-box-form .app-login-box-container .icon-select {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url(../assets/images/checkbox-icon.png);
  vertical-align: middle;
  margin-right: 5px;
}

.app-login .app-login-box-form .app-login-box-container .icon-select.active {
  background: url(../assets/images/checkbox-icon.png) 0 16px;
}

.app-login .app-login-box-container .error {
  color: red;
}
</style>
