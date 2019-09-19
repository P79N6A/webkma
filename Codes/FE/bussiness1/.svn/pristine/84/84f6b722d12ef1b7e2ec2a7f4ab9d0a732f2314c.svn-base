<template>
  <div class="page-main-box">
    <div class="title font-17 black-deep">
        {{manuscriptName}}-人脉图谱
    </div>
    <div class="data-detail">
        <div>
          <navigator :tabs="navigatorOpts.tabs" @navigator-event="transferTab" style="margin:0 0 20px 0;"></navigator>
        </div>
        <div class="tab-content">
            <div>
                <div class="switch-data">
                    <button
                        class="pull-right btn-source"
                        :class="sourceSwitch=='列表展示'?'activeSwitch':''"
                        @click="clickSwitch('列表展示')"
                    >列表展示</button>
                    <button
                        class="pull-right btn-source"
                        :class="sourceSwitch=='脑图展示'?'activeSwitch':''"
                        @click="clickSwitch('脑图展示')"
                    >脑图展示</button>
                </div>
                <div v-if = "sourceSwitch=='列表展示'">
                  <div>
                    <treeTable ref="tabs" v-if="manuscriptId" :manuscript-id="manuscriptId" :business-id="businessId" :client-type="brainMapType"></treeTable>
                  </div>

                </div>
                <div v-if = "sourceSwitch=='脑图展示' && !!manuscriptId">
                  <div>
                    <treeMap ref="profile" :manuscript-id="manuscriptId" :client-type="brainMapType"></treeMap>
                  </div>
                </div>
            </div>
            <!-- <div v-show="navigatorOpts.selectedKey == 'publicData'">公众号数据</div>
            <div v-show="navigatorOpts.selectedKey == 'programData'">小程序数据</div> -->
        </div>
    </div>
  </div>
</template>

<script>
import navigator from "components/navigator";
import treeTable from "components/tree-table";
import treeMap from "components/tree-map";

import api from "api";

export default {
  components: {
    navigator,
    treeTable,
    treeMap
  },
  name: "connectionsDetail",
  data() {
    return {
      manuscriptId: "", //活动id
      manuscriptName: "", //活动名称
      businessId: "", //商家id
      sourceSwitch: '脑图展示', //来源数据切换默认全部
      navigatorOpts: {
      //tab标签数据
          tabs: [
          { key: "allData", title: "全部数据", selected: true },
          { key: "publicData", title: "公众号数据" },
          { key: "programData", title: "小程序数据" }
          ],
          selectedKey: "allData"
      },
      brainMapType: '' //活动脑图类型
    };
  },
  mounted(){
    this.manuscriptId = this.$route.query.id;
    this.manuscriptName = localStorage.manuscriptName;
    this.businessId = localStorage.businessId;
  },
  methods:{
    //点击切换tab标签
    transferTab(tab) {
      var self = this;
      self.navigatorOpts.selectedKey = tab.split(".")[0];
      this.brainMapType = tab.split(".")[0] == 'allData' ? '' : (tab.split(".")[0] == 'publicData' ? 'wx' : 'weapp');
      // this.brainMapType = tab.split(".")[0] == 'allData' ? '' : tab.split(".")[0] == 'publicData' ? 'wx' : 'weapp';
      if(!!this.$refs.profile){
        this.$refs.profile.getTreeMapData({
          manuscriptId: self.manuscriptId,
          clientType: self.brainMapType
        });
      }
      if(!!this.$refs.tabs){
        this.$refs.tabs.getTableData({obj:{
          type:"root",
          manuscriptId: self.manuscriptId,
          businessId: self.businessId,
          clientType: self.brainMapType,
          pageIndex: 1,
          pageSize: 5
        }});
      }
    },
    //点击切换数据来源
    clickSwitch(source){
      var self = this;
      self.sourceSwitch = source;
    },
    singleClick(row, event, column){
      console.log("点击",row, event, column)
    },
    
  }
};
</script>
<style scoped>
    .font-17{
        font-size: 17px;
    }
    .page-main-box{
        /* min-height: 660px; */
        min-height: 1000px;
        background-color: #FFF;
        /* position:relative; */
    }
    .page-main-box .title{
        height: 61px;
        line-height: 61px;
        font-weight: bold;
        border-bottom: 2px solid #eff7fa;
        /* background-color: #FFF; */
        padding: 0 20px;
    }
    .page-main-box .data-detail{
        padding: 0 20px;
        /* background-color: #FFF; */
    }
    .page-main-box .tab-content .switch-data{
        height: 40px;
        text-align: right;
        background-color: #edf2f5;
        border: 1px solid #edf2f5;
        /* margin-bottom: 10px; */
    }
    .page-main-box .tab-content .switch-data .btn-source{
        width: 100px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        background: none;
    }
    .page-main-box .tab-content .switch-data .btn-source:hover{
        background: #FFFFFF;
    } 
    .page-main-box .tab-content .switch-data .btn-source.activeSwitch{
        color: #00bad0;
        background: #FFFFFF;  
    }
</style>
