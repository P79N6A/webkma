
<template>
  <div>
    <div class="tip-panel">
      <div class="tip-title">EDM邮件发送</div>
      <div class="tip-desc">用户，您好！您可以使用我们为你提供的内容或者新建内容，通过邮件的方式向你的客户发送您要传递的信息。</div>
      <div class="use-help" @click="showUseHelp">操作指导</div>
      <el-dialog title="操作指导" :visible.sync="useHelpVisible" class="sms-guidance">
        <div>一、点击我的营销推广-我发送的邮件，点击发送新邮件</div>
        <div>
          <img src="../../assets/images/mail/mail-guidance-03.png" width="95%;">
        </div>
        <div>二、在邮件编辑界面，点击新建邮件，在右边的编辑框填写邮件相关内容</div>
        <div>
          <img src="../../assets/images/mail/mail-guidance-04.png" width="95%;">
        </div>
        <div>三、选择邮件模板，填写发件人和发件人地址（收件人可以通过客户管理进行导入客户或者活动表单收集到的带有邮件信息的客户数据）</div>
        <div>
          <img src="../../assets/images/mail/mail-guidance-05.png" width="95%;">
        </div>
        <div>四、邮件内容编辑完成，勾选所有收件人，点击向右的箭头，添加发送对象。选择立即发送或定时发送，可以点击保存或正式发送。</div>
        <div>
          <img src="../../assets/images/mail/mail-guidance-06.png" width="95%;">
        </div>
      </el-dialog>
    </div>
    <div style="height: 570px; overflow: hidden;">
      <el-card
        v-if="pagination.pageIndex == 1"
        class="el-box-card"
        shadow="hover"
        @click.native="onSendSmsHandler"
        :body-style="{padding:'40px',cursor: 'pointer'}"
      >
        <div>
          <div class="icon-sms-add"></div>
          <div class="text-center">发送新邮件</div>
        </div>
      </el-card>
      <mailItem
        v-for="rec in smsList"
        :key="rec.smsId"
        :data="rec"
        @removeHandler="onRemoveHandler"
        @editHandler="onEditHandler"
        @getDetailHandler="onGetDetailHandler"
      ></mailItem>
    </div>
    <el-row style="padding-right: 40px;">
      <pagination
        v-if="pagination.pageCount > 1"
        class="pull-right"
        :paginationOpt="pagination"
        @switchPage="loadMoreSMS"
      />
    </el-row>
    <el-dialog
      title="发送邮件"
      :center="true"
      custom-class="sms-dialog"
      :visible.sync="openSendSMSWindow"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="closeSend"
      width="1200px"
    >
      <mailSend :emailId="editSMSId" v-if="openSendSMSWindow"></mailSend>
    </el-dialog>
    <el-dialog title="邮件详情" :visible.sync="mailDetailVisible" class="sms-guidance" width="960px">
      <div>
        <el-row>
          <el-col :span="3" class="col-title text-right">
            <div>邮件名称：</div>
          </el-col>
          <el-col :span="21">
            <div>{{mailDetailData.name}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-title text-right">
            <div>发送时间：</div>
          </el-col>
          <el-col :span="21">
            <div>{{mailDetailData.sendTime}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-title text-right">
            <div>发件人：</div>
          </el-col>
          <el-col :span="21">
            <div>{{mailDetailData.from}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-title text-right">
            <div>收件人：</div>
          </el-col>
          <el-col :span="21" class="to-list">
            <div>{{mailDetailData.to}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="col-title text-right">
            <div>邮件内容：</div>
          </el-col>
          <el-col :span="21" class="content-div">
            <!-- <div v-html="mailDetailData.content"></div> -->
            <script id="container" name="content" type="text/plain"></script>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mailItem from "components/mail-item";
import api from "api";
import mailSend from "./send";
import eventBus from "../../utils/eventBus";
import pagination from "components/ui-pagination";
import sysConfig from "../../config/system.js";

import "bower_components/summernote/dist/summernote.js";
// import "bower_components/umeditor/umeditor.config.js";
import "bower_components/summernote/lang/summernote-zh-CN.js";
import "bower_components/summernote/dist/summernote.css";

export default {
  name: "mail-page",
  components: {
    mailItem,
    mailSend,
    pagination
  },
  data() {
    return {
      smsList: [],
      pagination: {
        pageIndex: 1,
        pageSize: 0, //实际分页大小
        ariginSize: 9, //原始分页大小
        totalCount: 1,
        pageCount: 0
      },
      refreshEvt: "sms-info-refresh",
      openSendSMSWindow: false,
      editSMSId: "",
      useHelpVisible: false,
      mailDetailVisible: false,
      mailDetailData: {},
      umEditor: null
    };
  },
  computed: {
    hasMore() {
      let { total, pageIndex, pageSize } = this.pagination;
      return Math.ceil(total / pageSize) > pageIndex;
    }
  },
  created() {
    if (this.$route.query.selectKey === "mail") {
      this.openSendSMSWindow = true;
    }
    this.refreshSMSList();
  },
  mounted() {
    this.scrollTop = document.documentElement.scrollTop;
    this.loadMoreSMS = this.loadMoreSMS.bind(this);
    this.$eventBus.$on('closeSendMailWindow',($event) => {
      this.openSendSMSWindow = false;
    });
    //  this.umEditor = UM.createEditor("container", {
    //           initialFrameWidth: 635,
    //           initialFrameHeight: 200
    //         });
  },
  methods: {
    closeSend() {
      sessionStorage.setItem("mailList", "");
      this.refreshSMSList();
    },
    onRemoveHandler(item) {
      this.$confirm("您确定要删除当前邮件吗？", "提示", {
        center: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定"
      }).then(ok => {
        api.request(
          "deleteMail",
          { secretKey: localStorage.businessSecret, emailId: item.emailId },
          result => {
            if (result.status === 0) {
              this.$message.success("删除成功！");
              this.$nextTick(this.refreshSMSList);
            } else {
              this.$message.error(result.message);
            }
          }
        );
      });
    },
    onEditHandler(data) {
      this.openSendSMSWindow = true;
      this.editSMSId = data.emailId;
    },
    onCopyHandler(item) {
      let self = this;
      if (!!self.smsCopying) {
        return;
      }
      self.smsCopying = true;
      let options = {
        secretKey: localStorage.businessSecret,
        smsId: item.smsId
      };
      api.request("copySMS", options, result => {
        if (result.status == 0) {
          self.refreshSMSList();
        } else {
          self.$message.error(result.message);
        }
        self.smsCopying = false;
      });
    },
    onSendSmsHandler() {
      this.editSMSId = "";
      this.openSendSMSWindow = true;
    },
    onGetDetailHandler(item) {
      let _this = this;
      api.request(
        "getMailDetail",
        { secretKey: localStorage.businessSecret, emailId: item.emailId },
        result => {
          if (result.status === 0) {
            _this.mailDetailData = result.data;
            console.log(_this.mailDetailData.content);
            _this.mailDetailVisible = true;
            setTimeout(() => {
              $("#container").summernote(window.lanh.summernoteOptions);
              $("#container").summernote("code", _this.mailDetailData.content);
              $("#container").summernote("disable");
              // if (!_this.umEditor) {
              //   _this.umEditor = UM.createEditor("container", {
              //     autoHeightEnabled: false,
              //     initialFrameWidth: 700,
              //     initialFrameHeight: 400,
              //   });
              // }
              // $(".edui-container").css("width","95%")
              // _this.umEditor.setContent(_this.mailDetailData.content);
            }, 500);
          } else {
            this.$message.error(result.message);
          }
        }
      );
    },
    showUseHelp() {
      this.useHelpVisible = true;
    },
    //分页切换
    loadMoreSMS(pageIndex, cb) {
      // let { scrollHeight,scrollTop , clientHeight } = document.documentElement;
      // console.log(`${scrollHeight}:${scrollTop}:${clientHeight}`);
      // console.log(this.scrollTop > scrollTop ? 'up':'down');
      // if(scrollTop > this.scrollTop && scrollHeight-scrollTop-clientHeight < 100 && !this.smsLoading ){
      this.pagination.pageIndex = pageIndex;
      this.querySMSList(cb);
      // }
      // this.scrollTop =scrollTop;
    },
    refreshSMSList() {
      // sessionStorage.setItem("mailList","");
      this.$route.query["selectKey"] = void 0;
      delete this.$route.query["selectKey"];
      this.pagination.pageIndex = 1;
      this.querySMSList();
    },
    querySMSList(cb) {
      let self = this;
      if (!!self.smsLoading) {
        return;
      }
      self.smsLoading = true;
      self.pagination.pageSize =
        self.pagination.pageIndex == 1
          ? self.pagination.ariginSize - 1
          : self.pagination.ariginSize;
      let options = {
        ...self.pagination,
        secretKey: localStorage.businessSecret
      };
      api.request("sentMailList", options, result => {
        if (result.status == 0) {
          if (options.pageIndex === 1) {
            self.smsList = [];
          }
          self.smsList = result.data.list.map(list => {
            list = formatStatus(list);
            return list;
          });
          self.pagination.totalCount = result.data.total;
          self.pagination.pageCount = Math.ceil(
            self.pagination.totalCount / self.pagination.ariginSize
          );
        } else {
          self.$message.error(result.message);
        }
        self.$nextTick(() => {
          eventBus.$emit(self.refreshEvt);
        });
        self.smsLoading = false;
        !!cb && cb();
      });
      function formatStatus(rec) {
        let data = { ...rec };
        switch (data.status) {
          case 0:
            data.msgClass = "tip-msg-editing";
            data.iconClass = "icon-msg-editing";
            data.statusText = "草稿";
            data.editable = true;
            break;
          case 1:
            data.msgClass = "tip-msg-success";
            data.iconClass = "icon-msg-success";
            data.statusText = "发送成功";
            break;
          case 2:
            data.msgClass = "tip-msg-fail";
            data.iconClass = "icon-msg-fail";
            data.statusText = "发送失败";
            break;

          case 3:
            data.msgClass = "tip-msg-success";
            data.iconClass = "icon-msg-timer";
            data.statusText = `定时发送`;
            data.editable = true;
            break;
          //   case 4:
          //   default:
          //     data.msgClass = "tip-msg-success";
          //     data.iconClass = "icon-msg-success";
          //     data.statusText = `已发送 ${data.smsQuantitySuccess || 0} 封`;
          //     break;
        }
        return data;
      }
    }
  }
};
</script>


<style scoped>
.sms-guidance div {
  padding: 3px 0 !important;
}
.to-list {
  /* width: 805px; */
  max-height: 66px;
  overflow-y: auto;
  word-break: break-all;
}

.content-div {
  word-break: break-all;
}

.tip-panel {
  width: 1160px;
  height: 150px;
  border: 1px solid #c9d4df;
  margin: 30px 0;
  padding: 30px;
  color: #63717b;
  font-size: 14px;
  background: url(../../assets/images/bg-sms.png) no-repeat 96% 25px;
}
.tip-panel > div {
  margin-bottom: 15px;
}
.sms-underline,
.use-help,
.tip-desc {
  font-size: 12px;
  color: #9eabb8;
}
.sms-underline {
  padding-bottom: 20px;
}
.use-help {
  background: url(../../assets/images/icon-use-help.png) no-repeat left center;
  width: 100px;
  height: 20px;
  padding-left: 25px;
  line-height: 20px;
  color: #3898ea;
  cursor: pointer;
}
.icon-sms-add {
  width: 50px;
  height: 50px;
  background: url(../../assets/images/add.png) no-repeat center center;
  background-size: contain;
  margin: 0 auto 10px;
}
.sms-dialog {
  border-top: 1px solid red;
}

.sms-guidance div {
  padding: 8px 0;
}
</style>


