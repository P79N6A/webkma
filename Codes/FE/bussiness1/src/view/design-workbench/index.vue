<template>
  <!-- style="overflow: hidden;" --> 
  <div class="scroll-box">
    <pageTitle :pageTitle="pageTitleOpt" @search-event="search" />
    <navigator :tabs="navigatorOpts.tabs" @navigator-event="transferTab"></navigator>
    <div class="template_type">
      模板类型：<span :class="manuscriptType==1?'on':''" @click="templateType(1)">H5活动</span><span :class="manuscriptType==2?'on':''"
        @click="templateType(2)">海报</span>
    </div>
    <!-- 模板分类 -->
    <category v-show="navigatorOpts.selectedKey=='template'" @trigger-event="categoryRefresh" />
    <!-- 列表 -->
    <div class="container-fluid" :style="{'width': listWideth}" style="padding: 0;">
      <div class="tpl-table" style="padding-bottom: 10px;">
        <!-- Create -->
        <manuscriptItem :options="{category:'create',manuscriptType}" v-if="navigatorOpts.selectedKey == 'draft'"
          @manuscript-item-event="manuscriptCallback" />
        <!-- List -->
        <manuscriptItem :options="{category:'detail', actions:manuscriptItemOpt.actions}" :data="item"
          @manuscript-item-event="manuscriptCallback" v-for="item in list" :key="item.id" />
        <div class="clearfix"></div>
      </div>
      <emptyTpl v-if="navigatorOpts.selectedKey != 'draft' && paginationOpt.totalCount == 0 " />
      <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" style="margin-bottom:100px;" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
    </div>
  </div>
</template>

<script>
import pageTitle from "components/page-title";
import pagination from "components/ui-pagination";
import navigator from "components/navigator";
import category from "components/com-category";
import manuscriptItem from "components/manuscript-item";
import emptyTpl from "components/empty-tpl";
import eventBus from "../../utils/eventBus";
import api from "api";

export default {
  components: {
    pageTitle,
    pagination,
    navigator,
    category,
    manuscriptItem,
    emptyTpl
  },
  name: "design-workbench",
  data: function () {
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
      caregoryFilter: null,
      list: [],
      manuscriptType: 1,
      listWideth: '100%'
    };
  },
  mounted() {
    this.getPageSize();
    eventBus.$on('getPageSize',() =>{
      this.getPageSize();
    })
  },
  methods: {
    //根据页面宽度计算出最合适的pagesize
    getPageSize() {
      let w = $('#app').width(), item_w = 194;
      this.paginationOpt.pageSize = Math.floor(w / item_w) * 2 - 1;
      // 动态给list设置宽度
      this.listWideth = Math.floor(w / item_w) * 194 + 'px';
      this.getList();
    },
    templateType(tab) {
      this.manuscriptType = tab;
      this.paginationOpt.pageIndex = 1;
      this.list = [];
      this.keyWords = "";
      this.getList();
    },
    categoryRefresh(data) {
      this.caregoryFilter = data || null;
      this.paginationOpt.pageIndex = 1;
      this.getList();
    },
    getList(cb) {
      //获取模板列表
      var self = this;
      var apiKey = "";
      switch (self.navigatorOpts.selectedKey) {
        case "template":
          apiKey = "getManuscriptListOfTemplate";
          self.manuscriptItemOpt.actions = ["preview"];
          self.paginationOpt.pageSize = self.paginationOpt.pageSize + 1;
          break;
        case "draft":
          apiKey = "getManuscriptListOfDraft";
          self.manuscriptItemOpt.actions = ["edit", "preview", "delete"];
          // self.paginationOpt.pageSize = 9;
          break;
      }
      var _option = {
        pageIndex: self.paginationOpt.pageIndex,
        pageSize: self.paginationOpt.pageSize,
        search: self.keyWords,
        range: 1,
        manuscriptType: self.manuscriptType
      };
      if (self.caregoryFilter) {
        _option.catIds = self.caregoryFilter;
        _option.catRelation = 1;
      }
      api.request(apiKey, _option, result => {
        if (result.status == 0) {
          // TODO：改为管道方式呈现，用moment写filters
          // $.each(result.data.list, (index, item) => {
          //   item.operatorDate = window.timeFormdate(item.operatorDate);
          // });
          self.list = result.data.list;
          self.paginationOpt.totalCount = result.data.total;
          self.paginationOpt.pageCount = Math.ceil(
            self.paginationOpt.totalCount / self.paginationOpt.pageSize
          );
        } else {
          self.$message.error(result.message);
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
      let self = this;
      self.pagination = pageIndex;
      self.getList(cb);
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
.template_type {
  color: #576369;
  margin: 20px 0 0 30px;
  height: 30px;
  line-height: 30px;
}
.template_type span {
  padding: 9px 11px;
}
.template_type span:hover {
  cursor: pointer;
}
.template_type span.on {
  color: #fff;
  background-color: #00bad0;
}
</style>