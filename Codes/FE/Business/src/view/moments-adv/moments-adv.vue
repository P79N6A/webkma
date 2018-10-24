<template>
  <div style="overflow: hidden;">
    <el-header class="clear-padding">
        <pageTitle :pageTitle="pageTitleOpt"/>
    </el-header>
    <el-row class="clear-padding">
      <navigator :tabs="navigatorOpts.tabs" @navigator-event="transferTab"></navigator>
    </el-row>
    <!-- 列表 -->
    <div class="container-fluid" style="padding: 0 30px;">
     <div :is="componentItem"></div> 
    </div>
  </div>
</template>

<script>
import pageTitle from "components/page-title";
import navigator from "components/navigator";
import advPromotionManagement from "view/moments-adv/adv-promotion-management";
import advDashbord from "view/moments-adv/adv-dashbord";
import advAccount from "view/moments-adv/adv-account";
import advData from "view/moments-adv/adv-data";
import api from 'api';

export default {
  components: {
    pageTitle,
    navigator,
    advPromotionManagement,
    advDashbord,
    advAccount,
    advData
  },
  name: "my-promotion",
  data: function() {
    return {
      pageTitleOpt: {
        text: "朋友圈广告投放",
        showSearch: false
      },
      navigatorOpts: {
        tabs: [
          { key: "advDashbord", title: "概览" },
          { key: "advPromotionManagement", title: "推广管理" },
          { key: "advAccount", title: "账户管理" }
        ],
        selectedKey: ""
      },
      componentItem: "advDashbord"
    };
  },
  created(){
    this.navigatorOpts.selectedKey = this.$route.query.selectKey || 'advDashbord';
    let index = this.navigatorOpts.tabs.findIndex(t=>t.key===this.navigatorOpts.selectedKey);
    this.$set(this.navigatorOpts.tabs[index ===-1 ? 0 :index],"selected",true);
    this.componentItem = this.navigatorOpts.selectedKey;
  },
  mounted(){
    this.getMomentsAdvList();
  },
  methods: {
    //获取推广列表
    getMomentsAdvList( callback ) {
        let self = this;
        let _option = {
            state: 2,
            pageIndex: 1,
            pageSize: 1000
        }
        api.request("getMomentsAdvList", _option, (result) => {
            if (result.status == 0 && result.data.list.length > 0 ) {
                this.navigatorOpts.tabs.push({ key: "advData", title: "数据报告" });
            }
        })
    },
    transferTab(tab) {
      this.navigatorOpts.selectedKey = tab;
      this.componentItem = tab;
    }
  }
};
</script>
<style scoped>

</style>