<template>
<div style="position:relative;">
    <div class="loading" v-if="!!isloading">
      <img src="../assets/images/loading-300.gif" alt="">
    </div>
    <div id="tree-map" class="tree-map">
    </div>
    <div class="overview" v-if="!isloading">
      <p>层级：{{data.subLayer || '0'}} 层</p>
      <p>总数：{{data.subCount || '0'}} 人</p>
    </div>
</div>
</template>
<script>
import api from "api";
import treeMap from "../utils/treeMap.js";
export default {
  name: "treeMap",
  props: {
    'manuscriptId':{
        type:String,
        default:''
    },
    'clientType':{
        type:String,
        default:''
    },
    'businessId':{
        type:String,
        default:''
    }
  },
  data() {
    return {
      isloading: true,
      data: {}
    };
  },
  mounted() {
    this.getTreeMapData();
  },
  methods: {
    getTreeMapData(json) {
        let manuscriptId = (!!json ? json.manuscriptId : this.manuscriptId) || '',
        clientType = (!!json ? json.clientType : this.clientType) || '',
        businessId = (!!json ? json.businessId : this.businessId) || '';

        let self = this
        , _option = {
            manuscriptId: manuscriptId,
            clientType: clientType,
            businessId: businessId
        }
        , interfaceName = !!manuscriptId ? 'getManuscriptGraph' : 'getCardGraph'
        api
        .request(
          interfaceName,
          _option
        )
        .then(function(result) {
          if (result.status == 0) {
            self.data = result.data;
            self.initMap(result.data);
          } else {
            self.$message.error(result.message);
          }
        })
        .catch(function(error) {
          self.$message.error(error.message);
        });
    },
    initMap(data) {
      let self = this;
        data.rootName = localStorage.getItem('brainMapRootName');
        data.face = localStorage.getItem('brainMapRootFace');
        let tree = new treeMap({
            width: 1200, // 总画布svg的宽
            height: 700,
            dataset: data,
            wrapId: 'tree-map',
            onloadFn: function(){
              self.isloading = false;
            }

        });

        tree.render();
    }
  }
};
</script>
<style scoped>
.loading{
  position: absolute;
  width: 400px;
  height: 400px;
  line-height: 400px;
  top: 150px;
  left: 345px;
  text-align: center;
}
.loading > img{
  width: 100px;
  height: 100px;
}
.tree-map {
  float: left;
  width: 1088px;
  height: 550px;
}
.overview {
  position: absolute;
  width: 110px;
  height: 50px;
  margin-top: 26px;
  padding-top: 5px;
  box-sizing: border-box;
  border: 1px solid #f1f3fd;
  font-size: 12px;
  right: 0px;
  top: 0px;
  background-color: #fff;
}
.overview > p {
  padding-left: 10px;
  margin-bottom: 5px;
  color: #3c4a55;
}
</style>