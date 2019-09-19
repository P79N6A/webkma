
<template>
    <div>
        <div class="tip-panel" >
            <div class="tip-title">SMS 短信发送</div>
            <div class="tip-desc">用户，您好！您可以使用我们为你提供的内容或者新建内容，通过短信的方式向你的客户发送您要说的话。</div>
            <div class="use-help " @click="showUseHelp">操作指导</div>
            <el-dialog title="操作指导" :visible.sync="useHelpVisible" class="sms-guidance">
                <div>一、点击发送新短信。</div>
                <div><img src="../../assets/images/sms/sms-guidance-01.png" width="95%;"/></div>
                <div>二、在弹出的短信发送界面，设置短信内容（可以选择模板）以及发送的客户手机号。</div>
                <div><img src="../../assets/images/sms/sms-guidance-02.png" width="95%;"/></div>
                <div>三、发送成功短信后，打开我发送短信的列表界面，可以看到状态为审核中、已发送状态的短信模板。审核中表示短信服务商正在审核您的短信内容是否符合相关的法律法规，如果审核不成功则会返回审核失败。</div>
                <div><img src="../../assets/images/sms/sms-guidance-03.png" width="95%;"/></div>
                <div>注：1、模板审核时间为1-3个小时。</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、审核过的短信模板，下次发送短信时不在进行审核，可以直接发送。</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、使用过程中，禁止发送违法违规的短信内容，违者将会被追究刑事责任。</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4、短信签名+短信内容超过70个字符，短信服务商会默认当作2条短信；</div>
            </el-dialog>
        </div>
        <!-- <custom-scroll :options="{scrollX: false, scrollY: true,scrollbars:true}" @scroll-end="loadMoreSMS" :refresh="refreshEvt"> -->
            <div style="height: 570px; overflow: hidden;">
                <el-card v-if="pagination.pageIndex == 1" class="el-box-card" shadow="hover"  @click.native ="onSendSmsHandler" :body-style="{padding:'40px',cursor: 'pointer'}">
                    <div>
                    <div class="icon-sms-add"></div>
                    <div class="text-center">发送新短信</div>
                    </div>
                </el-card>
                <smsItem v-for="rec in smsList" :key="rec.smsId" :data="rec" 
                @removeHandler="onRemoveHandler" @editHandler="onEditHandler"
                @copyHandler="onCopyHandler"
                ></smsItem>
            </div>
            <!-- <el-row v-if="!hasMore" class="text-center sms-underline"> 这是我的底线了(☺-☺) </el-row> -->
            <el-row style="padding-right: 40px;">
                <pagination v-if="pagination.pageCount > 1" class="pull-right" :paginationOpt="pagination" @switchPage="loadMoreSMS" />
            </el-row>
        <!-- </custom-scroll> -->
        <el-dialog title="发送短信" :center="true" custom-class="sms-dialog" :visible.sync="openSendSMSWindow"
        :close-on-click-modal="false" :close-on-press-escape="false"
        @closed="refreshSMSList"
        width="1200px"
        >
            <smsSend :smsId="editSMSId" v-if="openSendSMSWindow"></smsSend>
        </el-dialog>
    </div>
</template>

<script>
import smsItem from "components/sms-item";
import api from "api";
import smsSend from "./send";
import eventBus from "../../utils/eventBus";
import pagination from "components/ui-pagination";
import sysConfig from "../../config/system.js";
export default {
  name: "sms-page",
  components: {
    smsItem,
    smsSend,
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
      useHelpVisible: false
    };
  },
  computed: {
    hasMore() {
      let { total, pageIndex, pageSize } = this.pagination;
      return Math.ceil(total / pageSize) > pageIndex;
    }
  },
  created() {
    if (this.$route.query.selectKey === "sms") {
      this.openSendSMSWindow = true;
    }
    this.refreshSMSList();
  },
  mounted() {
    this.scrollTop = document.documentElement.scrollTop;
    this.loadMoreSMS = this.loadMoreSMS.bind(this);
    this.$eventBus.$on('closeSendSMSWindow',($event) => {
      this.openSendSMSWindow = false;
    });
    // document.addEventListener('scroll',this.loadMoreSMS);
  },
  beforeDestroy() {
    // document.removeEventListener('scroll',this.loadMoreSMS);
  },
  methods: {
    onRemoveHandler(item) {
      this.$confirm("您确定要删除当前短信吗？", "提示", {
        center: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定"
      }).then(ok => {
        api.request(
          "deleteSMS",
          { secretKey: localStorage.businessSecret, smsId: item.smsId },
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
      this.editSMSId = data.smsId;
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
      let options = { ...self.pagination, secretKey: localStorage.businessSecret};
      api.request("smsQuery", options, result => {
        if (result.status == 0) {
          if (options.pageIndex === 1) {
            self.smsList = [];
          }
          // result.data.list.reduce((list,rec)=>{
          //     list.push(formatStatus(rec));
          //     return list;
          // },self.smsList);
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
            data.statusText = "编辑中";
            data.editable = true;
            break;
          case 1:
            data.msgClass = "tip-msg-auditing";
            data.iconClass = "icon-msg-auditing";
            data.statusText = "审核中";
            break;
          case 2:
          case 3:
            data.msgClass = "tip-msg-fail";
            data.iconClass = "icon-msg-fail";
            data.statusText = `${data.status === 2 ? "审核" : "发送"}失败`;
            break;

          case 6:
            data.msgClass = "tip-msg-success";
            data.iconClass = "icon-msg-timer";
            data.statusText = `定时发送`;
            break;
          case 4:
          default:
            data.msgClass = "tip-msg-success";
            data.iconClass = "icon-msg-success";
            data.statusText = `成功发送/总发送量 ${data.smsQuantitySuccess || 0}/${data.smsQuantitySuccess + data.smsQuantityFail}`;
            break;
        }
        return data;
      }
    }
  }
};
</script>


<style scoped>
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


