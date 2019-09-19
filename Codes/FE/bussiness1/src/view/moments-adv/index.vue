<template>
  <div style="overflow: hidden;">
    <el-header class="clear-padding">
        <pageTitle :pageTitle="pageTitleOpt"/>
    </el-header>
    <el-row class="clear-padding">
      <navigator :tabs="navigatorOpts.tabs" @navigator-event="transferTab"></navigator>
    </el-row>
    <!-- 列表 -->
    <div class="container-fluid" style="padding: 0 30px; height:calc(100vh - 200px);overflow-y:auto;">
     <div :is="componentItem"></div> 
    </div>
  </div>
</template>

<script>
import pageTitle from "components/page-title";
import navigator from "components/navigator";
import advPromotionManagement from "view/moments-adv/list";
import advDashbord from "view/moments-adv/dashbord";
import advAccount from "view/moments-adv/account";
import advData from "view/moments-adv/data";
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
            state: '2,3',
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
<style>
  /* .scroll-box{
    overflow-y:scroll;
  } */
  /*滚动条样式*/
  .container-fluid::-webkit-scrollbar {
      width: 4px;    
      /*height: 4px;*/
  }
  .container-fluid::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(195,197,199,0.2);
      background: rgba(0,0,0,0.2);
  }
  .container-fluid::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      border-radius: 0;
      background: rgba(0,0,0,0.1);

  } 
  ::-webkit-scrollbar {
    width: 7px; /*对垂直流动条有效*/
    height: 7px; /*对水平流动条有效*/
  }
  /*定义滚动条的轨道颜色、内阴影及圆角*/
  ::-webkit-scrollbar-track {
    background-color: #ffffff;
    border-radius: 3px;
    border: 1px solid #f1f3fc;
  }
  /*定义滑块颜色、内阴影及圆角*/
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #9eabb8;
  }
</style>