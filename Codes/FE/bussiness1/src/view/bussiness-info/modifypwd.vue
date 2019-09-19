<template>
    <el-container class="clear-padding">
        <el-header class="clear-padding">
            <pageTitle :pageTitle="pageTitleOpt" />
        </el-header>
        <el-main style="width: 100%; padding: 30px 40px; box-sizing: border-box;">
          <el-row class="content-body">
            <div class="form" style="width: 100%; padding: 20px 30px; border: 1px solid #e4e4e4;">
                <div>
                    <label>原密码</label>
                    <input id="prePwd" type="password" v-model="modify.prevPwd" maxlength="20" placeholder="请输入旧密码">
                    <span class="form_error"></span>
                </div>
                <div >
                    <label>新密码</label>
                    <input id="newPwd" type="password" v-model="modify.newPwd" maxlength="20" placeholder="请输入新密码">
                    <span class="form_error"></span>
                </div>
                <div >
                    <label>确认新密码</label>
                    <input id="reNewPwd" type="password" v-model="modify.reNewPwd" maxlength="20" placeholder="请再次输入新密码">
                    <span class="form_error"></span>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <el-button class="pull-left" type="primary" size="small" @click="submit">确定</el-button>
                <el-button class="pull-left" type="default" size="small" @click="cancel">取消</el-button>
            </div>
          </el-row>
        </el-main>
    </el-container>
</template>

<script>
import pageTitle from "../../components/page-title";
import api from 'api'

export default {
    components: {
        pageTitle
    },
    name: 'bussiness-info',
    data: function() {
        return {
            pageTitleOpt: {
                text: '修改密码'
            },
            bussinessData: {},
            modify: {
                prevPwd: '',
                newPwd: '',
                reNewPwd: ''
            }
        };
    },
    methods: {
        //表单验证
        formValidate() {
            let objArr = [$("#prePwd"), $("#newPwd"), $("#reNewPwd")];
            let _prePwd = window.formValidation({
                obj: objArr[0],
                empty: "请输入原密码",
                reg: /^[a-zA-Z0-9\w\`\~\!\@\#\$\%\^\&\*\(\)_\-\+\=\{\}\[\]\:\;\"\'\\\|\<\,\.\>\/\?.]{6,20}$/,
                error: "请输入6-20位密码，区分大小写！"
            });
            let _newPwd = window.formValidation({
                obj: objArr[1],
                noRepeatObj: objArr[0],
                empty: "请输入新密码",
                reg: /^[a-zA-Z0-9\w\`\~\!\@\#\$\%\^\&\*\(\)_\-\+\=\{\}\[\]\:\;\"\'\\\|\<\,\.\>\/\?.]{6,20}$/,
                error: "请输入6-20位密码，区分大小写！",
                repeatError: "修改密码不能与原密码相同！"
            });
            let _reNewPwd = window.formValidation({
                obj: objArr[2],
                repeatObj: objArr[1],
                empty: "请输入确认密码",
                reg: /^[a-zA-Z0-9\w\`\~\!\@\#\$\%\^\&\*\(\)_\-\+\=\{\}\[\]\:\;\"\'\\\|\<\,\.\>\/\?.]{6,20}$/,
                error: "请输入6-20位密码，区分大小写！",
                repeatError: "两次密码输入不一致，请重新输入！"
            });
            objArr.forEach(function(element) {
                element.blur();
            });
            return _prePwd.tag && _newPwd.tag && _reNewPwd.tag;
        },
        prePwdErr(){
            $("#prePwd").addClass('error').next().html('*原密码错误，请重新输入！').addClass('help-block form_error');
        },
        submit() {
            if(!this.formValidate()) return false;

            let _this = this;
            let option = {
                client_type: 'pc',
                session_id: localStorage.sessionId,
                user_uuid: localStorage.user_uuid,
                user_password: _this.modify.newPwd,
                original_password: _this.modify.prevPwd
            };

            api.request('modifyPwd', option)
                .then(function(result) {
                    if (result.status == 0) {
                        _this.$message.success('修改成功，请重新登陆!');
                        _this.$store.dispatch("setLogout");
                        window.location.href = "/";
                    } else if(result.message.indexOf('原密码错误') != -1){
                        _this.prePwdErr();
                    }else{
                        _this.$message.error(result.message || '操作失败!');
                    }
                })
                .catch(function(error) {
                    _this.$message.error(error.message);
                });
        },
        cancel() {
            this.$router.push({
                path: '/bussiness-info'
            });
        }
    }
}
</script>
<style scoped>
.form > div {
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
}
.form > div:last-child {
  margin: 0;
}
.form > div > label {
  display: inline-block;
  width: 80px;
  text-align: right;
  font-weight: normal;
  margin-right: 10px;
  color: #555;
}
.form > div > input {
  width: 160px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #e4e4e4;
  padding-left: 10px;
}
.form_error {
  color: #f04e51;
}
.help-block {
  display: inline;
}
.form > div > input.error {
  border-color: #f04e51;
}

.ml20 {
  margin-left: 20px;
}
</style>



