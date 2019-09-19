<template>
    <el-main style="width: 100%; padding: 30px 0px; box-sizing: border-box;">
      <el-row class="content-body">
        <div class="form" style="width: 100%; padding: 20px 30px; border: 1px solid #e4e4e4;">
            <div>
                <label class="form-lbl">商家名称</label>
                <label>{{data.businessName}}</label>
            </div>
            <div>
                <label class="form-lbl">公众号名称</label>
                <input id="appName" type="text" v-model="data.appName" maxlength="30" >
                <span class="form_error"></span>
            </div>
            <div >
                <label class="form-lbl">原始ID</label>
                <input id="appId" type="text" v-model="data.appId">
                <span class="form_error"></span>
            </div>
        </div>
        <div style="margin-top: 20px;">
            <el-button class="pull-left" type="primary" size="small" @click="btnSave">保存</el-button>
        </div>
      </el-row>
    </el-main>
</template>
<script>
import api from "api";
export default {
  data() {
    return {
      data: {
        businessName: "",
        appName: "",
        appId: ""
      }
    };
  },
  mounted() {
    var self = this;
    api
      .request("getWxSubscription", {})
      .then(function(result) {
        if (result.status == 0) {
          self.data.businessName = result.data.businessName;
          self.data.appName = result.data.appName;
          self.data.appId = result.data.appId;
        } else {
          Kdo.utils.messenger.error(result.message);
        }
      })
      .catch(function(error) {
        Kdo.utils.messenger.error(error.message);
      });
  },
  methods: {
    formValidate() {
      //表单验证
      let objArr = [$("#appName"), $("#appId")];
      let _appName = window.formValidation({
        obj: objArr[0],
        valueLength: 30,
        minLength: 4,
        empty: "请输入公众号名称",
        lengthError: "公众号名称仅允许输入4到30位中英文及数字",
        reg: /^[\u4e00-\u9fa5,\w]{4,30}$/,
        error: "公众号名称仅允许输入4到30位中英文及数字"
      });
      let _appId = window.formValidation({
        obj: objArr[1],
        empty: "请输入原始ID"
      });
      objArr.forEach(function(element) {
        element.blur();
      });
      return _appName.tag && _appId.tag;
    },
    btnSave() {
      var self = this;
      if (!self.formValidate()) return false;
      api
        .request("saveWxSubscription", {
          appName: self.data.appName,
          appId: self.data.appId
        })
        .then(function(result) {
          if (result.status == 0) {
            Kdo.utils.messenger.success("保存成功");
          } else {
            Kdo.utils.messenger.error(result.message);
          }
        })
        .catch(function(error) {
          Kdo.utils.messenger.error(error.message);
        });
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
.form > div > .form-lbl {
  text-align: right;
  width: 70px;
  font-weight: normal;
  margin-right: 10px;
  color: #555;
}
.form > div > input {
  width: 280px;
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
