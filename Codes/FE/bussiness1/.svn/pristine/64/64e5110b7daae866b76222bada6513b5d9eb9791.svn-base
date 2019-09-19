<template>
  <div class="mail-send-window clearfix">
    <el-col :span="8">
      <div class="tpl-total">
        邮件模板
        <span>{{unLockTplCount}}</span>
        /{{emailCount}}
      </div>
      <div class="search-div">
        <com-search placeholder="请输入邮件模板名称" @searchHandler="searchMailTpl" :style="{ width: '268px'}"></com-search>
      </div>
      <div class="tpl-list">
        <div class="col" @click="useTpl(null)" :class="selectedSMSTpl=={}?'active':''" style="padding-left: 30px;">
          <i class="iconfont icon-add add" style="color: #dcdfe9;margin-right: 5px;"></i>新建邮件
        </div>
        <custom-scroll :options="{scrollX: false, scrollY: true,scrollbars:true, preventDefault: false}" @scroll-end="loadMoreSMSTpl"
          :refresh="'refreshScroll'" style="flex-grow: 1;" height="700px">
          <div class="tpl-body">
            <div class="col" v-for="item in mailTpls.list" :key="item.id" @click="useTpl(item)" :class="selectedSMSTpl.id==item.id?'active':''"
              :title="item.name">
              {{item.name}}
              <div class="lock-icon" v-show="item.isUnlock==0" @click="unLockTpl(item)">
                <i class="iconfont icon-lock"></i>
              </div>
            </div>
            <div v-if="mailTpls.list.length<= 0" class="no-content">暂无数据</div>
          </div>
        </custom-scroll>
      </div>
    </el-col>
    <el-col :span="16" style="padding-left: 34px;">
      <el-row class="sms-send-panel">
        <el-row>
          <el-form ref="form" :model="sendSMSForm" label-width="95px" size="mini">
            <el-form-item label="发件人：">
              <el-input v-model="sendSMSForm.fromName"></el-input>
            </el-form-item>
            <el-form-item label="发件人地址：">
              <el-input v-model="sendSMSForm.from" placeholder="请输入发件人邮箱地址"></el-input>
            </el-form-item>
            <el-form-item label="邮件名称：">
              <el-input v-model="sendSMSForm.name"></el-input>
            </el-form-item>
            <el-form-item label="邮件正文：">
              <!-- <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="sendSMSForm.content"
                resize="none"
              ></el-input>-->
              <script id="container" name="content" type="text/plain"></script>
              <div class="readonly-div" v-if="selectedSMSTpl.isUnlock==0"></div>
            </el-form-item>
            <el-form-item label="收件人：">
              <div class="sms-send-body mail-to">
                <el-row class="sms-customer-search-panel" :gutter="20">
                  <el-col :span="13">
                    <com-search placeholder="输入姓名、邮箱" @searchHandler="smsCustomerSearchHandler"></com-search>
                  </el-col>
                  <el-col :span="11">
                    <div>
                      邮件剩余
                      <span class="yellow-light" v-text="surplusMail"></span>条
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-transfer v-model="customers.selectedList" :right-default-checked="customers.selectedList" :titles="['选择当前条件下所有客户', '已选择客户数']"
                    :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}'
                }"
                    :props="{key:'email',label:'email'}" :data="customers.list">
                    <span slot-scope="{ option }">{{ option.nickname }}&nbsp;&nbsp;{{option.email}}</span>
                  </el-transfer>
                </el-row>
                <el-form-item class="sms-toolbar" label="发送时间 :" style="padding-right: 6px;">
                  <el-radio-group v-model="sendSMSForm.isTime" style="display:block;text-align:left;">
                    <el-radio :label="0">立即发送</el-radio>
                    <el-radio :label="1">定时发送</el-radio>
                    <el-date-picker v-if="sendSMSForm.isTime===1" v-model="sendSMSForm.sendTime" type="datetime" size="small"
                      placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>

                  </el-radio-group>
                </el-form-item>
              </div>
            </el-form-item>
            <div style="height: 35px;margin: 35px 0 20px 0;">
              <el-button style="float:right;" type="primary" size="small" @click.native.stop="sendSMSHandler" :disabled="!btnSendMailenabled(0) || sending">正式发送</el-button>
              <el-button style="float:right;margin-right: 13px;" type="primary" size="small" :disabled="!btnSendMailenabled(1) || saving"
                @click.native.stop="saveMailHandler">保存</el-button>
            </div>
          </el-form>
        </el-row>
      </el-row>
    </el-col>
  </div>
</template>
<script>
import eventBus from "../../utils/eventBus";
import api from "api";

import "bower_components/summernote/dist/summernote.js";
// import "bower_components/umeditor/umeditor.config.js";
import "bower_components/summernote/lang/summernote-zh-CN.js";
import "bower_components/summernote/dist/summernote.css";
import "codemirror/lib/codemirror.css";

export default {
  props: {
    emailId: String
  },
  data() {
    return {
      selectedSMSTpl: {},
      mailTpls: {
        list: [],
        pagination: {
          pageIndex: 1,
          pageSize: 15,
          total: 0
        },
        tplKeywords: ""
      },
      singNameList: [],
      refreshEvt: "sms-tpl-refresh",
      sendSMSForm: {
        emailId: "",
        from: "",
        fromName: "",
        content: "",
        name: "",
        sendTime: "",
        identity: "business",
        isTime: 0
      },
      customers: {
        list: [],
        selectedList: [],
        keywords: "",
        pagination: {
          pageIndex: 1,
          pageSize: 3000,
          total: 0
        }
      },
      sending: false,
      saving: false,
      surplusMail: 0, //邮件剩余条数
      unLockTplCount: 0,
      umEditor: null,
      emailCount: this.$store.getters.getUserInfo.version.emailQuantity
    };
  },
  computed: {
    templateContent: {
      get() {
        return `${this.sendSMSForm.templateContent}`;
      },
      set(val) {
        this.sendSMSForm.templateContent = val.replace(
          new RegExp(`【.*】`, "ig"),
          ""
        );
      }
    },
    btnSendMailenabled(type) {
      return function (type) {
        // debugger
        let { from, fromName, content, name, isTime } = this.sendSMSForm;

        return (
          !!from &&
          !!fromName &&
          !!name &&
          (type == 0 ? this.customers.selectedList.length > 0 : true)
        );
      };
    }
  },
  created() {
    if (!!this.emailId) {
      this.getMailDetail(this.emailId);
    }
  },
  mounted() {
    // if (!this.umEditor) {
    // this.umEditor = UM.createEditor("container", {
    //   initialFrameWidth: 635,
    //   initialFrameHeight: 250,
    //   autoHeightEnabled: false
    // });
    $("#container").summernote(window.lanh.summernoteOptions);
    $("#container").summernote("code", "");
    // }
    // this.umEditor.setContent("");

    this.getMailResource();
    this.getMailTplList();
    this.getSMSInfo(this.getCustomerList);
  },
  beforeDestroy() {
    // this.umEditor.destroy();
  },
  methods: {
    // 刷新分页滚动条
    refreshScroll(otps) {
      setTimeout(() => {
        eventBus.$emit("refreshScroll", otps);
      });
    },
    loadMoreSMSTpl() {
      let self = this;
      // let { total, pageIndex, pageSize } = this.mailTpls.pagination;
      // if (Math.ceil(total / pageSize) > pageIndex) {
      this.mailTpls.pagination.pageIndex++;
      this.getMailTplList(() => {
        self.refreshScroll();
      });
      // }
    },
    smsCustomerSearchHandler(keywords) {
      this.customers.keywords = keywords;
      this.customers.pagination.pageIndex = 1;
      this.getCustomerList();
    },
    loadMoreCustomers() {
      let { total, pageIndex, pageSize } = this.customers.pagination;
      if (Math.ceil(total / pageSize) > pageIndex) {
        this.customers.pagination.pageIndex++;
        this.getCustomerList();
      }
    },
    selectSMSTplHandler(item) {
      if (this.selectedSMSTpl.smsId === item.smsId) {
        this.selectedSMSTpl = {};
      } else {
        this.selectedSMSTpl = item;
        item.active = true;
        this.templateContent = this.selectedSMSTpl.templateContent;
      }
    },
    getMailResource() {
      let self = this;
      api.request(
        "getSmsInfo",
        { secretKey: localStorage.businessSecret, type: 2 },
        result => {
          if (result.status == 0 && result.data != "用户没有资源") {
            self.surplusMail =
              parseFloat(result.data.resGiveRemainder) +
              parseFloat(result.data.resBuyRemainder);
          } else if (result.data == "用户没有资源") {
            self.surplusMail = 0;
          }
        }
      );
    },
    searchMailTpl(keyWords) {
      this.mailTpls.tplKeywords = keyWords;
      this.mailTpls.pagination.pageIndex = 1;
      this.getMailTplList();
    },
    getMailTplList(cb) {
      let self = this;
      if (!!self.tplLoading) {
        return;
      }

      let options = Object.assign(
        { searchStr: self.mailTpls.tplKeywords },
        self.mailTpls.pagination
      );
      self.tplLoading = true;
      api.request("getMailTemplate", options, result => {
        if (result.status == 0) {
          if (options.pageIndex === 1) {
            self.mailTpls.list = result.data.list;
          }
          if (cb) {
            self.mailTpls.list = self.mailTpls.list.concat(result.data.list);
          }

          self.mailTpls.pagination.total = result.data.total;
          self.unLockTplCount = result.data.used;
          !!cb && cb();
        } else {
          self.$message.error(result.message);
        }
        self.tplLoading = false;
      });
      function formatStatus(rec) {
        let data = { ...rec };
        switch (data.status) {
          case 0:
            data.iconClass = "icon-msg-editing";
            break;
          case 1:
            data.iconClass = "icon-msg-auditing";
            break;
          case 2:
          case 3:
            data.iconClass = "icon-msg-fail";
            break;
          case 6:
            data.iconClass = "icon-msg-success";
            break;
          case 4:
          default:
            data.iconClass = "icon-msg-success";
            break;
        }
        return data;
      }
    },
    unLockTpl(item) {
      let _this = this;
      if (
        !!this.unLockTplCount &&
        !!this.emailCount &&
        this.emailCount - this.unLockTplCount <= 0
      ) {
        Kdo.utils.messenger.info("邮件模板可解锁条数已使用完");
        return;
      }
      Kdo.utils.messenger.asyncConfirm(
        `是否要解锁 ${item.name} 模板？`,
        (isOk, cb) => {
          if (isOk) {
            api.request("unlockMailTemplate", { emailId: item.id }, function (
              result
            ) {
              if (result.status !== 0) {
                Kdo.utils.messenger.error(result.message);
                cb(false);
              } else {
                cb(true);
                item.isUnlock = 1;
                if (!!_this.selectedSMSTpl) {
                  _this.selectedSMSTpl.isUnlock = 1;
                }
                _this.unLockTplCount++;
                // _this.getMailTplList();
                setTimeout(() => {
                  Kdo.utils.messenger.success("解锁成功");
                }, 500);
              }
            });
          }
        }
      );
    },
    useTpl(item) {
      if (!item) {
        this.sendSMSForm.content = "";
        $("#container").summernote("code", "");
        this.sendSMSForm.name = "";
        this.selectedSMSTpl = {};
      } else {
        this.selectedSMSTpl = { isUnlock: item.isUnlock };
        this.getMailTplDetail(item.id);
      }
    },
    getCustomerList(selectedList) {
      let self = this;
      if (!!self.customerLoading) {
        return;
      }
      let options = Object.assign(
        { keyWords: self.customers.keywords, type: 2 },
        self.customers.pagination
      );
      self.customerLoading = true;
      api.request("getCustomerList", options, result => {
        if (result.status == 0) {
          if (options.pageIndex === 1) {
            self.customers.list = [];
          }
          result.data.list.reduce((list, rec) => {
            list.push(Object.assign({}, rec));
            return list;
          }, self.customers.list);
          self.customers.pagination.total = result.data.total;
          if (!!selectedList && selectedList.length > 0) {
            self.customers.selectedList = [
              ...new Set([].concat(self.customers.selectedList, selectedList))
            ];
          }
          self.$nextTick(() => {
            // eventBus.$emit(self.refreshEvt);
          });
        } else {
          self.$message.error(result.message);
        }
        self.customerLoading = false;
      });
    },
    getMailTplDetail(id) {
      let _this = this;
      api.request("getMailTplDetail", { emailId: id }, result => {
        if (result.status === 0) {
          _this.selectedSMSTpl = Object.assign(
            _this.selectedSMSTpl,
            result.data
          );
          _this.sendSMSForm.content = result.data.content;
          this.sendSMSForm.name = result.data.name;
          $("#container").summernote("code", result.data.content);
          // _this.umEditor.setContent(result.data.content);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getMailDetail(id) {
      let _this = this;
      api.request(
        "getMailDetail",
        { secretKey: localStorage.businessSecret, emailId: id },
        result => {
          if (result.status === 0) {
            _this.sendSMSForm = Object.assign(_this.sendSMSForm, result.data);
            _this.customers.selectedList = !!result.data.to
              ? result.data.to.split(";")
              : [];
            if (!!result.data.sendTime) {
              _this.sendSMSForm.isTime = 1;
            }
            $("#container").summernote("code", result.data.content)
            // _this.umEditor.setContent(result.data.content);
          } else {
            this.$message.error(result.message);
          }
        }
      );
    },
    getSMSInfo(cb) {
      let self = this;
      if (!!this.smsId) {
        let options = {
          secretKey: localStorage.businessSecret,
          smsId: this.smsId
        };
        api.request("smsQuery", options, result => {
          if (result.status == 0) {
            self.singNameList = [];
            if (!result.data.list || result.data.list.length <= 0) {
              return self.$message.error("短信不存在");
            }
            let rec = result.data.list[0];
            self.sendSMSForm = {
              smsId: rec.smsId,
              signName: rec.signName,
              templateContent: rec.templateContent,
              sendTime: rec.sendTime,
              isTime: !!rec.sendTime ? 1 : 0
            };
            fetchCustomers(rec);
          } else {
            self.$message.error(result.message);
          }
        });
      } else {
        let rec = {
          mail: sessionStorage.getItem("mailList") || "[]"
        };
        fetchCustomers(rec);
      }

      function fetchCustomers(rec) {
        let selectedList = [];
        try {
          selectedList = JSON.parse(rec.mail);
        } catch (error) {
          return self.$message.error("邮箱地址无效");
        }
        cb && cb(selectedList);
      }
    },
    sendSMSHandler() {
      let self = this;
      this.sendSMSForm.content = $("#container").summernote("code")
      // this.sendSMSForm.content = this.umEditor.getContent();
      let model = this.sendSMSForm;

      if (self.selectedSMSTpl.isUnlock == 0) {
        return this.$message.error("使用模板未解锁");
      }
      if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(model.from)) {
        return this.$message.error("请输入正确的邮箱地址");
      }
      if (!model.content) {
        return this.$message.error("请输入邮件内容");
      }
      if (model.isTime === 0) {
        model.sendTime = void 0;
      } else if (model.isTime === 1) {
        if (!model.sendTime) {
          return this.$message.error("请选择定时发送时间");
        } else if (model.sendTime <= new Date()) {
          return this.$message.error("定时发送时间必须大于当前时间");
        }
      }

      if (
        !this.customers.selectedList ||
        this.customers.selectedList.length < 1
      ) {
        return this.$message.error("请选择收信人");
      }
      this.sending = true;
      let body = {
        secretKey: localStorage.businessSecret,
        content: model.content,
        fromName: model.fromName,
        name: model.name,
        from: model.from,
        address: this.customers.selectedList,
        sendTime: model.sendTime || null,
        mailId: this.mailId,
        identity: "business"
      };
      let timer = setTimeout(() => {
        this.sending = false;
      }, 60 * 1000);
      api.request("sendMail", body, result => {
        if (result.status == 0) {
          self.$message.success("发送成功！");
          this.$eventBus.$emit('closeSendMailWindow');
          self.getMailResource();
        } else {
          self.$message.error(result.message);
        }
        this.sending = false;
        clearTimeout(timer);
      });

      if (!!this.selectedSMSTpl && !!this.selectedSMSTpl.id) {
        api.request(
          "mailTplQuote",
          { emailId: this.selectedSMSTpl.id },
          result => {
            if (result.status == 0) {
              console.info("邮件模板使用计数成功");
            } else {
              console.error(result.message);
            }
          }
        );
      }
    },
    saveMailHandler() {
      let self = this;
      this.sendSMSForm.content = $("#container").summernote("code")
      // this.sendSMSForm.content = this.umEditor.getContent();
      let model = this.sendSMSForm;
      if (self.selectedSMSTpl.isUnlock == 0) {
        return this.$message.error("使用模板未解锁");
      }
      if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(model.from)) {
        return this.$message.error("请输入正确的邮箱地址");
      }
      if (!model.content) {
        return this.$message.error("请输入邮件内容");
      }
      if (model.isTime === 0) {
        model.sendTime = void 0;
      } else if (model.isTime === 1) {
        if (!model.sendTime) {
          return this.$message.error("请选择定时发送时间");
        } else if (model.sendTime <= new Date()) {
          return this.$message.error("定时发送时间必须大于当前时间");
        }
      }

      this.saving = true;
      let body = {
        secretKey: localStorage.businessSecret,
        content: model.content,
        from: model.from,
        fromName: model.fromName,
        name: model.name,
        address: this.customers.selectedList,
        emailId: this.emailId,
        sendTime: model.sendTime || null
      };
      let timer = setTimeout(() => {
        this.saving = false;
      }, 60 * 1000);
      api.request("saveMail", body, result => {
        if (result.status == 0) {
          self.$message.success("保存成功！");
        } else {
          self.$message.error(result.message);
        }
        this.saving = false;
        clearTimeout(timer);
      });
    }
  }
};
</script>

<style>
.mail-send-window .tpl-total {
  font-size: 16px;
  padding: 20px 30px;
  font-weight: bold;
}
.mail-send-window .tpl-total span {
  color: #00bad0;
}

.mail-send-window .search-div {
  padding: 0 0 20px 20px;
}

.mail-send-window .tpl-list {
  border-top: 1px #ebeef5 solid;
}
.mail-send-window .tpl-list .col {
  height: 56px;
  line-height: 56px;
  padding: 0 20px;
  position: relative;
  border-bottom: 1px #ebeef5 solid;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mail-send-window .tpl-list .col:hover {
  cursor: pointer;
  background-color: #f5f6fa;
}
.mail-send-window .tpl-list .col.active {
  cursor: pointer;
  background-color: #f5f6fa;
}

.mail-send-window .tpl-list .lock-icon {
  position: absolute;
  top: -6px;
  right: 0;
  width: 65px;
  height: 100%;
  background: url(../../assets/images/angle-top-right-bg.png) no-repeat 30px 6px;
}

.mail-send-window .tpl-list .lock-icon i {
  color: #fff;
  position: absolute;
  top: -10px;
  right: 2px;
  font-size: 14px;
}

.mail-send-window .tpl-list .tpl-body {
  /* height: 200px;
        min-width: 100%; */
  min-height: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.sms-send-panel .readonly-div {
  width: 635px;
  height: 271px;
  position: absolute;
  z-index: 1000;
  top: 0;
}

.el-dialog__header {
  border-bottom: 1px #ebeef5 solid;
  margin: 0 20px;
  padding-bottom: 30px;
}
.iScrollIndicator {
  background-color: #ebeef5 !important;
}

.sms-send-panel .el-transfer {
  padding: 0 8px;
}

.sms-send-panel .el-transfer-panel__list {
  height: 246px !important;
}

.sms-send-panel .el-transfer-panel {
  width: 266px;
}

.sms-send-panel .edui-container {
  border-color: #eee;
  box-shadow: 0px 0px 0px;
}

/* .sms-send-body .sms-send-panel .edui-container .edui-toolbar{
  box-shadow: 0px 0px 0px;
} */

/* .mail-send-window .sms-search-panel {
  float: right;
} */

.mail-send-window .form-sms-search {
  display: inline-block;
}
.mail-send-window .sms-search-input {
  width: 200px;
  margin-left: 10px;
  margin-right: 10px;
}
.mail-send-window .el-collapse-item__content {
  background-color: #fafbff;
}
/* .mail-send-window .tpl-body {
  height: 200px;
  min-width: 100%;
  padding: 10px;
  box-sizing: border-box;
  writing-mode: vertical-lr;
} */
.mail-send-window .tpl-item {
  width: 350px;
  height: 85px;
  writing-mode: horizontal-tb;
  display: inline-block;
  margin-bottom: 10px;
  margin-right: 10px;
}
.mail-send-window .tpl-item:nth-child(even) {
  margin-bottom: 0;
}
.mail-send-window .selected {
  border: 2px solid #00bad0;
  /* outline: 1px solid #24d0c6;  */
}
.mail-send-window .no-content {
  writing-mode: horizontal-tb;
  width: 100%;
  text-align: center;
}

.sms-send-panel {
  padding-top: 10px;
}
.sms-send-panel .sms-content-panel {
  width: 520px;
}
.sms-send-body {
  border: 1px solid #eee;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  height: 400px;
}

.sms-send-body.mail-to {
  height: 400px;
}
.sms-send-body .sms-content .el-form-item__content {
  margin-left: 0 !important;
}
.sms-send-body .el-textarea__inner {
  border: none;
  height: 200px;
  padding: 0;
}
.mail-send-window .sms-send-body .el-radio + .el-radio {
  margin-right: 5px;
  margin-left: 10px;
}
.sms-send-panel .el-form-item--mini.el-form-item,
.sms-customer-search-panel {
  margin-bottom: 10px;
  line-height: 32px;
}
.sms-send-body .el-date-editor.el-input,
.sms-send-body .el-date-editor.el-input__inner {
  width: 200px;
  margin-right: 10px;
}
.sms-send-body .sms-toolbar {
  background-color: #f5f6fa;
  height: 50px;
  margin-bottom: 0 !important;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
}
.sms-send-body .sms-toolbar label {
  margin-bottom: 0px;
  height: 32px;
  line-height: 32px;
  display: inline-block;
}
.sms-send-panel .el-form-item__label,
.sms-send-panel .el-radio__label {
  padding-right: 10px;
  font-weight: normal;
  color: #63717b;
  line-height: 27px;
}
.sms-send-panel .el-radio__label {
  padding-left: 5px;
  padding-right: 0;
}

/* .sms-send-body .sms-content::after{
        content: "";
        height: 1px;
        background-color: #eee;
        margin: 0 -10px;
        width: 520px;
        margin-bottom: 45px;
    } */
.sms-customer-panel {
  width: 630px;
  padding-right: 10px;
}
.sms-customer-panel .el-transfer {
  text-align: left;
  display: inline-block;
  height: 245px;
  width: 100%;
  border: 1px solid #eee;
  padding: 10px;
  height: 300px;
}
.sms-customer-panel .el-transfer-panel {
  width: 266px;
}
.sms-customer-panel .el-transfer .el-transfer-panel__list {
  height: 237px;
}
.sms-customer-panel .com-search-input {
  display: inline-block;
  margin-right: 0;
}
</style>


