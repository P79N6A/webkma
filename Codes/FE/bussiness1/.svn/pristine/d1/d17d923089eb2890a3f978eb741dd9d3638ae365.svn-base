<template>
<div style="padding:0 20px;">
    <div class="page-title">
        <h1 class="title black-deep" v-html="pageTitle.text"></h1>
        <div class="search-wrap"  v-if="pageTitle.showSearch">
            <com-search  :placeholder="pageTitle.search.placeholder"
                          @searchHandler="emitToParent"
                          :style="{ width: (pageTitle.search.size || '220px')}"
                            ></com-search>
        </div>
    </div>
  </div>
</template>
<script>
/**  父组件调用时需传以下参数
  pageTitleOpt: {
      text: '员工管理',                      -----标题名称
      search: {                             -----搜索框的配置参数,需要则配置
          value: '',                        -----搜索框绑定值
          placeholder: '请输入关键词搜索',   ------搜索框paleceholder值
          size: '200px'                     -----自定义搜索框width,默认值为'200px'
      },
      showSearch: true                      -----有搜索框则需配置，固定值true
  }
 */
export default {
  name: "page-title",
  props: {
    pageTitle: {
      default: () => {
        return {};
      }
    }
  },
  data: () => {
    return {};
  },
  methods: {
    emitToParent(keywords) {
      this.$emit("search-event", keywords);
    }
  }
};
</script>
<style scoped>
.page-title {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #ebf0fa;
}
.title {
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  font-weight: bold;
  float: left;
}
.search-wrap {
  position: relative;
  height: 34px;
  float: right;
  margin: 13px 0 0 0;
}
.page-title >>> .com-search-input {
  margin: 0;
}
</style>

