<template>
  <div class="page-main-box">
    <div class="title font-17 black-deep">
        名片人脉图谱
    </div>
    <div class="data-detail">
        <div class="tab-content">
            <div>
                <div class="switch-data">
                    <button
                        class="pull-right btn-source"
                        :class="sourceSwitch=='list'?'activeSwitch':''"
                        @click="clickSwitch('list')"
                    >列表展示</button>
                    <button
                        class="pull-right btn-source"
                        :class="sourceSwitch=='brain'?'activeSwitch':''"
                        @click="clickSwitch('brain')"
                    >脑图展示</button>
                </div>
                <div v-if = "sourceSwitch=='list'">
                  <div>
                    <treeTable ref="tabs" v-if="businessId" :business-id="businessId"></treeTable>
                  </div>
                </div>
                <div v-if = "sourceSwitch=='brain'">
                  <div>
                    <treeMap ref="profile" :business-id="businessId"></treeMap>
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
import pagination from "components/ui-pagination";
import api from "api";

export default {
  components: {
    navigator,
    treeTable,
    pagination,
    treeMap
  },
  name: "connectionsDetail",
  data() {
    return {
        manuscriptId: "", //
        sourceSwitch: 'brain', // brain --- 脑图  list -- 列表
        connectionsList: [], //人脉列表
        businessId: localStorage.getItem('businessId') || ''
    };
  },
  mounted(){
    localStorage.setItem('brainMapRootFace', JSON.parse(localStorage.getItem('userInfo')).userFace || 'https://resource.ikmark.com/tuixiaobao/weapp/default-logo.jpg');
  },
  methods:{
    //点击切换数据来源
    clickSwitch(source){
      var self = this;
      self.sourceSwitch = source;
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
        padding: 20px 20px 0;
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
