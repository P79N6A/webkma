<template>
    <div style="overflow: hidden;">
        <pageTitle :pageTitle="pageTitleOpt" @search-event="search" />
        <navigator :tabs="navigatorOpts.tabs" @navigator-event="transferTab"></navigator>
        <!-- 列表 -->
        <div class="container-fluid">
            <div class="tpl-table" style="padding-bottom: 10px;">
                <!-- Create -->
                <manuscriptItem :options="{category:'create'}" v-if="navigatorOpts.selectedKey == 'draft'" @manuscript-item-event="manuscriptCallback"/>
                <!-- List -->
                <manuscriptItem :options="{category:'detail', actions:manuscriptItemOpt.actions}" :data="item" @manuscript-item-event="manuscriptCallback" 
                  v-for="item in list" :key="item.id" />
                <div class="clearfix"></div>
            </div>
            <emptyTpl v-if="navigatorOpts.selectedKey != 'draft' && paginationOpt.totalCount == 0 "/>
            <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
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

export default {
  components: {
    pageTitle,
    pagination,
    navigator,
    manuscriptItem,
    emptyTpl
  },
  name: "design-workbench",
  data: function() {
    return {
      pageTitleOpt: {
        text: "我的工作台",
        search: {
          value: "",
          placeholder: "请输入稿件名称搜索"
        },
        showSearch: true
      },
      paginationOpt: {
        pageIndex: 1,
        pageSize: 9,
        totalCount: 1,
        pageCount: 0
      },
      navigatorOpts: {
        tabs: [
          { key: "draft", title: "活动素材", selected: true },
          { key: "template", title: "已发布模板" }
        ],
        selectedKey: "draft"
      },
      manuscriptItemOpt: {
        actions: ["edit", "preview", "delete"]
      },
      keyWords: "",
      list: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList(cb) {
      //获取模板列表
      var _this = this;
      var apiKey = "";
      switch (_this.navigatorOpts.selectedKey) {
        case "template":
          apiKey = "getManuscriptListOfTemplate";
          _this.manuscriptItemOpt.actions = ["preview"];
          _this.paginationOpt.pageSize = 10;
          break;
        case "draft":
          apiKey = "getManuscriptListOfDraft";
          _this.manuscriptItemOpt.actions = ["edit", "preview", "delete"];
          _this.paginationOpt.pageSize = 9;
          break;
      }
      var _option = {
        pageIndex: _this.paginationOpt.pageIndex,
        pageSize: _this.paginationOpt.pageSize,
        search: _this.keyWords,
        range: 1
      };
      api.request(apiKey, _option, result => {
        if (result.status == 0) {
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