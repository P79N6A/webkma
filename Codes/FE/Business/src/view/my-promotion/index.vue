<template>
  <div style="overflow: hidden;">
    <el-header class="clear-padding">
        <pageTitle :pageTitle="pageTitleOpt" @search-event="search" ref="searchWrap"/>
    </el-header>
    <el-row class="clear-padding">
      <navigator :tabs="navigatorOpts.tabs" @navigator-event="transferTab"></navigator>
    </el-row>
    <!-- 列表 -->
    <div class="container-fluid clear-padding">
      <div class="tpl-table" v-if="navigatorOpts.selectedKey!=='sms'" style="padding-bottom: 10px;">
        <manuscriptItem v-if="navigatorOpts.selectedKey!='release'" :options="{category:'create'}" @manuscript-item-event="manuscriptCallback" />
        <!-- List -->
        <manuscriptItem :options="{category:'detail', actions:manuscriptItemOpt.actions}" :data="item" @manuscript-item-event="manuscriptCallback" v-for="item in list" :key="item.id" />
        <div class="clearfix"></div>
        <div style="padding-right:40px;">
          <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
        </div>
      </div>
      <emptyTpl v-if="navigatorOpts.selectedKey == 'release' && paginationOpt.totalCount == 0 "/>
      <div v-if="navigatorOpts.selectedKey==='sms'" style="padding-left: 40px;">
        <smspage></smspage>
      </div>
      
    </div>
  </div>
</template>

<script>
import pageTitle from "components/page-title";
import pagination from "components/ui-pagination";
import navigator from "components/navigator";
import manuscriptItem from "components/manuscript-item";
import emptyTpl from "components/empty-tpl";
import api from "api";
import smspage from "../sms";

export default {
  components: {
    pageTitle,
    pagination,
    navigator,
    manuscriptItem,
    smspage,
    emptyTpl
  },
  name: "my-promotion",
  data: function() {
    return {
      pageTitleOpt: {
        text: "我的营销推广",
        search: {
          value: "",
          placeholder: "按活动名称进行搜索"
        },
        showSearch: true
      },
      paginationOpt: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 1,
        pageCount: 0
      },
      navigatorOpts: {
        tabs: [
          { key: "release", title: "我发布的活动" },
          { key: "draft", title: "我的活动素材" },
          { key: "sms", title: "我发送的短信" }
        ],
        selectedKey: ""
      },
      manuscriptItemOpt: {
        actions: ["preview", "detail", "delete"]
      },
      keyWords: "",
      list: []
    };
  },
  created(){
    this.navigatorOpts.selectedKey = this.$route.query.selectKey || 'release';
    let index = this.navigatorOpts.tabs.findIndex(t=>t.key===this.navigatorOpts.selectedKey);
    this.$set(this.navigatorOpts.tabs[index ===-1 ? 0 :index],"selected",true);
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList(cb) {
      //获取模板列表
      var _this = this,
        _option = {
          pageIndex: _this.paginationOpt.pageIndex,
          pageSize: _this.paginationOpt.pageSize,
          businessId: localStorage.businessId
        },
        apiKey = "";
      switch (_this.navigatorOpts.selectedKey) {
        case "release":
          _option.nameSearch = _this.keyWords,
          _this.manuscriptItemOpt.actions = ["preview", "detail", "delete"];
          apiKey = "getManuscriptListOfRelease";
          break;
        case "draft":
          _option.search = _this.keyWords;
          _option.pageSize = _this.paginationOpt.pageSize; 
          _this.manuscriptItemOpt.actions = ["preview", "edit", "delete"];
          apiKey = "getManuscriptListOfDraft";
          _option.pageSize=_option.pageSize-1;
          break;
        case "sms":
          _option.search = _this.keyWords;
          apiKey = "getSMSList";
          break;
      }
      if (_this.navigatorOpts.selectedKey === 'sms') {
        return;
      }
      api.request(apiKey, _option, result => {
        if (result.status == 0) {
          // 如果获取数据列表为空，并且页码大于1，则回到第一页重新获取数据。
          if (
            result.data.list.length == 0 &&
            _this.paginationOpt.pageIndex > 1
          ) {
            return _this.search();
          }
          // TODO：改为管道方式呈现，用moment写filters
          // $.each(result.data.list, (index, item) => {
          //   item.operatorDate = window.timeFormdate(item.operatorDate);
          // });
          
          _this.list = result.data.list;
          _this.paginationOpt.totalCount = result.data.total;
          _this.paginationOpt.pageCount = Math.ceil(
            _this.paginationOpt.totalCount / _this.paginationOpt.pageSize
          );
        } else {
          _this.myMessage.error(result.message);
        }
        !!cb && cb();
      });
    },
    search(data) {
      this.keyWords = data;
      this.paginationOpt.pageIndex = 1;
      this.list = [];
      this.getList();
    },
    pagesFn(pageIndex, cb) {
      //分页调用方法
      let _this = this;
      _this.pagination = pageIndex;
      _this.getList(cb);
    },
    transferTab(tab) {
      var self = this;
      self.paginationOpt.pageIndex = 1;
      self.navigatorOpts.selectedKey = tab;
      self.list = [];
      self.getList();
    },
    manuscriptCallback(data) {
      this.getList();
    }
  }
};
</script>
<style scoped>

</style>