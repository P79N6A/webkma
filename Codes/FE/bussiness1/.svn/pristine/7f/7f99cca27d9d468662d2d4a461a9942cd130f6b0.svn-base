<template>
  <el-container>
    <el-header class="clear-padding">
      <pageTitle :pageTitle="pageTitleOpt" />
    </el-header>
    <el-main style="width: 100%; padding: 30px; box-sizing: border-box;">
      <el-row class="content-body">
        <div class="form" style="width: 100%; padding: 20px 30px; border: 1px solid #e4e4e4;">
          <div>
            <span style="color:#F56C6C;">*</span><label>人员名称</label>
            <input id="name" type="text" v-model="employee.name" maxlength="10">
            <span class="form_error"></span>
          </div>
          <div>
            <span style="color:#F56C6C;">*</span><label>手机号码</label>
            <input id="phone" type="text" v-model="employee.phone" maxlength="11">
            <span class="form_error"></span>
          </div>
          <div class="padding24">
            <span style="color:#F56C6C;">*</span><label>部门</label>
            <input id="apartment" type="text" v-model="depTitle" disabled>
            <span class="form_error"></span>
          </div>
          <div class="padding24">
            <span style="color:#F56C6C;">*</span><label>职位</label>
            <input id="job" type="text" v-model="employee.job" maxlength="10">
            <span class="form_error"></span>
          </div>
          <div class="padding18">
            <label>微信号</label>
            <input id="wxNo" type="text" v-model="employee.wxNo" maxlength="30">
            <span class="form_error"></span>
          </div>
          <div class="padding30">
            <label>邮箱</label>
            <input id="email" type="text" v-model="employee.email" maxlength="50">
            <span class="form_error"></span>
          </div>
          <div class="padding30">
            <label>性别</label>
            <el-radio v-model="employee.sex" label="1">男</el-radio>
            <el-radio v-model="employee.sex" label="2">女</el-radio>
            <span class="form_error"></span>
          </div>
          <div>
            <label>人员状态</label>
            <div style="display: inline-block; vertical-align: top;">
              <slideBtn :slideBtnOpt="employee" active-text="启用" inactive-text="禁用" :prop-value-map="{0:0,1:1}"
                prop-key="state" @slide-event="employeeState" />
            </div>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <el-button class="pull-left" type="primary" size="small" @click="submit">确定</el-button>
          <el-button class="pull-left" type="default" size="small" @click="$router.go(-1)">取消</el-button>
        </div>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import pageTitle from "../../components/page-title";
import slideBtn from "../../components/slide-btn";
import api from "api";

export default {
  components: {
    pageTitle,
    slideBtn
  },
  name: "employee-management",
  data: function () {
    return {
      pageTitleOpt: {
        text: "人员信息",
        showSearch: false
      },
      employee: {
        id: "",
        name: "",
        phone: "",
        state: 0,
        deptId: "",
        job: "",
        sex: "1",
        wxNo: "",
        email: ""
      },
      depTitle: "",
      rules: {

      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      //初始化
      let id = this.$route.query.id || "";
      this.depTitle = decodeURIComponent(this.$route.query.selDepText);
      this.employee.deptId = this.$route.query.selDepId;

      //重置数据
      this.resetData();

      if (!id) return false;

      // 调取接口获取服务信息
      this.getEmployeeInfo(id, result => {
        result.sex = result.sex.toString();
        this.depTitle = result.deptName;
        this.employee = result;
      });
    },
    //修改时获取数据
    getEmployeeInfo(opt, cb) {
      let _this = this;

      api.request('getEmployeeInfo', { id: opt, secret_key: localStorage.businessSecret })
        .then(function (result) {
          if (result.status == 0) {
            cb(result.data);
          } else {
            _this.$message.error(result.message)
          }
        })
        .catch(function (error) {
          _this.$message.error(error.message);
        });
    },
    formValidate() {
      //表单验证
      let objArr = [$("#name"), $("#phone"), $("#job"), $("#wxNo"), $("#email")];
      let _name = window.formValidation({
        obj: objArr[0],
        valueLength: 10,
        minLength: 1,
        empty: "请输入人员姓名",
        lengthError: "人员姓名为1~10个中英文数字字符",
        reg: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
        error: "人员姓名为1~10个中文字符"
      });
      let _phone = window.formValidation({
        obj: objArr[1],
        empty: "请输入手机号码",
        type: "phone",
        error: "手机号码格式不正确"
      });
      let _job = window.formValidation({
        obj: objArr[2],
        empty: "请输入职位",
        valueLength: 10,
        empty: "职位不能为空"
      });
      let _wxNo = window.formValidation({
        obj: objArr[3],
        error: "微信号格式不正确",
        reg: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})$/,
        notNeedFill: true
      });
      let _email = window.formValidation({
        obj: objArr[4],
        type: "email",
        error: "邮箱格式不正确",
        notNeedFill: true
      });
      objArr.forEach(function (element) {
        element.blur();
      });

      return _name.tag && _job.tag && _phone.tag && _email.tag && _wxNo.tag;
    },
    //提交
    submit() {
      let _this = this;
      if (!this.formValidate()) {
        return
      }
      api.request("createEmployee", Object.assign(_this.employee, { secret_key: localStorage.businessSecret }), result => {
        if (result.status == 0) {
          _this.$message.success("操作成功!");
          _this.resetData();
          _this.$router.push({ name: "employee-management" });
        } else if (result.status == -1001) {
          $("#phone")
            .addClass("error")
            .next()
            .html(result.message);
        } else {
          _this.$message.error(result.message);
        }
      });
    },
    //修改人员状态
    employeeState(data) {
      this.employee.state = data.state;
    },
    // 数据重置
    resetData() {
      this.employee.id = "";
      this.employee.name = "";
      this.employee.phone = "";
      this.employee.state = 0;
    }
  }
};
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
.padding30 {
  padding-left: 30px;
}
.padding24 {
  padding-left: 24px;
}
.padding18 {
  padding-left: 18px;
}
</style>
