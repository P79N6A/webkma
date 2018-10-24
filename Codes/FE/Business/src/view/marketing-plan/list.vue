<template>
    <div>
        <pageTitle :pageTitle="pageTitleOpt" @search-event="search" />
        <!-- 列表 -->
        <div class="container-fluid" style="padding-left: 0;">
            <div class="tpl-table">
                <!-- Create -->
                <manuscriptItem :options="{category:'create'}" @manuscript-item-event="manuscriptCallback"/>
                <!-- List -->
                <manuscriptItem :options="{category:'detail', actions:['preview', 'use']}" :data="item" @manuscript-item-event="manuscriptCallback" 
                  v-for="item in list" :key="item.id" />
                <div class="clearfix"></div>
            </div>
            <div style="padding-right: 25px;">
              <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
            </div>
        </div>
    </div>
</template>

<script>
import pageTitle from "components/page-title";
import pagination from "components/ui-pagination";
import manuscriptItem from "components/manuscript-item";
import api from "api";

export default {
  components: {
    pageTitle,
    pagination,
    manuscriptItem
  },
  name: "marketing-plan",
  data: function() {
    return {
      pageTitleOpt: {
        text: "选择活动模板",
        search: {
          value: "",
          placeholder: "请输入关键词搜索"
        },
        showSearch: true
      },
      paginationOpt: {
        pageIndex: 1,
        pageSize: 9,
        totalCount: 1,
        pageCount: 0
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
      let _this = this;
      let _option = {
        pageIndex: _this.paginationOpt.pageIndex,
        pageSize: _this.paginationOpt.pageSize,
        search: _this.keyWords,
        range: 1
      };
      api.request("getManuscriptListOfBusinessTemplate", _option, result => {
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
      this.getList();
    },
    pagesFn(pageIndex, cb) {
      //分页调用方法
      let _this = this;
      _this.pagination = pageIndex;
      _this.getList(cb);
    },
    manuscriptCallback(data) {
      this.getList();
    }
  }
};
</script>
<style scoped>

</style>