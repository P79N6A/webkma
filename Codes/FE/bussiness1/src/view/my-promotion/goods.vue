<template>
  <div class="page-box">
    <!-- <div class="app-header-wrap">
      <div class="app-header">
        <img class="logo-img float-left" src="../../assets/images/logo.png">
      </div>
    </div> -->
    <comHeader />
    <div class="gds-main">
      <div class="gds-title">
        <div class="font-16 black-deep float-left" style="width:174px;font-weight:bold;">商品推广
          <span class="line"></span>
          模板选择
        </div>
        <!-- <div class="float-right font-12 reBtn">
          <a target="blank" href="https://www.baidu.com">返回商品列表</a>
        </div> -->
      </div>
      <!-- 商品名称 -->
      <div class="gds-name font-12 number-color ellipsis">
        当前推广的商品：
        <span v-for="(item,index) in goodsName" :key="item.id">{{item.goods_name}}{{index==goodsName.length-1?"。":"、"}}</span>
      </div>
      <!-- 商品模板列表 -->
      <div class="gds-list tpl-table">
        <!-- <div class="tep-item float-left">
          <div class="item-img">
            <img src="../../../static/images/icon-qrcode.png">
          </div>
          <div class="item-text ellipsis font-12 black-deep">商品名称超出打点展示已给我李搞好</div>
        </div> -->
        <manuscriptItem
          :options="{category:'detail',canUnlock:manuscriptItemOpt.canUnlock, actions:manuscriptItemOpt.actions,goodsIds:goodsIds,kid:kid}"
          :data="item"
          @manuscript-item-event="manuscriptCallback"
          v-for="item in goodsTempList"
          :key="item.id"
        />
      </div>
      <!-- v-if="goodsTempList.length>0" -->
      <pagination 
        class="float-right"
        :paginationOpt="goodsPagination"
        @switchPage="goodsPagesFn"
      />
    </div>
  </div>
</template>

<script>
import comHeader from "components/com-header";
import pagination from "components/ui-pagination";
import manuscriptItem from "components/manuscript-item";
import api from "api";
import eventBus from "../../utils/eventBus";
export default {
  components: {
    comHeader,
    pagination,
    manuscriptItem
  },
  name: "myPromotionGoods",
  data: function () {
    return {
      goodsTempList: [], //商品模板列表
      goodsPagination: { //商品模板分页
        pageIndex: 1,
        pageSize: 12,
        totalCount: 1,
        pageCount: 0
      },
      tplUsed: 0, //已使用模板
      goodsNumber: 0, //商品个数 
      goodsIds: "", //商品id
      kid: "", //商城id
      goodsName: [], //商品名称集合
      manuscriptItemOpt: {
        actions: ["preview", "use"],
        canUnlock: false
      },
    }
  },
  mounted() {
    // var ids = "8348,8349,8350""fsegrdgdhg" self.$route.query.goodsIds self.$route.query.kid;
    let self = this,
    ids = self.$route.query.goodsIds,
    kid = self.$route.query.kid,
    idsArray = ids.split(',');
    self.goodsNumber = idsArray.length;
    self.goodsIds = ids;
    self.kid = kid;
    self.getList();
    eventBus.$on("manuscript.list.addTplUse", () => {
      self.tplUsed++;
      self.refreshTplUsedCount();
    });
    self.getGoodsInfo();
  },
  methods:{
    //获取商品名称
    getGoodsInfo(){
      let self = this;
      api.request("getGoodsInfo", {
        businessId: localStorage.businessId,
        goodsIds: self.goodsIds,
        kid: self.kid
      }, result => {
        if (result.status == 0) {
          self.goodsName = result.data.goodsList;
          // console.log("商品名称",self.goodsName)
        } else {
          self.$message.error(result.message);
        }
      });
    },
    //商品模板列表分页调取方法
    goodsPagesFn(pageIndex, cb) {
      let self = this;
      self.goodsPagination.pageIndex = pageIndex;
      self.getList(cb);
    },
    //模板解锁标识
    refreshTplUsedCount() {
      let self = this;
      self.manuscriptItemOpt.canUnlock =
        self.tplUsed <
        self.$store.getters.getUserInfo.version.manuscriptQuantity;
    },
    //获取模板列表
    getList(cb) {
      let self = this;
      let _option = {
        pageIndex: self.goodsPagination.pageIndex,
        pageSize: self.goodsPagination.pageSize,
        goodsNumber: self.goodsNumber
      };
      api.request("getManuscriptListOfBusinessTemplate", _option, result => {
        if (result.status == 0) {
          self.goodsTempList = result.data.list;
          self.goodsPagination.totalCount = result.data.total;
          self.goodsPagination.pageCount = Math.ceil(
            self.goodsPagination.totalCount / self.goodsPagination.pageSize
          );
          self.tplUsed = result.data.info.used;
          self.refreshTplUsedCount();
        } else {
          self.$message.error(result.message);
        }
        !!cb && cb();
      });
    },
    manuscriptCallback(data){
      this.getList();
    }
  }
}
</script>

<style scoped>
  .float-left{
    float: left;
  }
  .float-right{
    float: right;
  }
  .ellipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .page-box {
    height: 100vh;
    max-height: 100vh;
    background: #ecf0fb;
    color: #63717b;
    font-size: 14px;
    margin: auto;
    overflow-y: auto;
    -webkit-text-size-adjust :none; 
    position: relative;
  }
  .page-box >>> .app-header-wrap .app-header .haslogin{
    display: none;
  }
  .page-box .logo-img{
    width: 150px;
  }
  .page-box .gds-main{
    width: 1400px;
    min-height: calc(100vh - 145px);
    padding: 0 30px;
    margin: 60px auto;
    background-color: #FFFFFF;
    overflow: hidden;
    box-sizing: border-box;
  }
  .page-box .gds-title{
    height: 58px;
    line-height: 58px;
    text-align: left;
    clear: both;
    border-bottom: 2px solid #edf2f5;
  }
  .gds-title .line{
    display: inline-block;
    width: 34px;
    height: 2px;
    background-color: #3c4a55;
    position: relative;
    top: -4px;
  }
  .gds-title .reBtn > a{
    display:inline-block;
    width: 100px;
    height: 30px;
    border: none;
    outline: none;
    line-height: 30px;
    text-align: center;
    text-decoration: none;
    color: #FFFFFF;
    border-radius: 20px;
    background-color: #00bad0;
  }
  .page-box .gds-name{
    height: 58px;
    line-height: 58px;
  }
  .gds-list .tep-item .item-img,
  .gds-list .tep-item .item-img > img{
    width: 158px;
    height: 197px;
  }
  .gds-list .tep-item .item-text{
    height: 40px;
    line-height: 40px;
  }
  .gds-list >>> .tpl-column{
    height: 250px!important;
    margin: 0 50px 20px 0!important;
    border-radius: 5px;
  }
  .gds-list >>> .tpl-column:hover {
    box-shadow: none!important;
  }
  .gds-list >>> .tpl-column:nth-of-type(6),
  .gds-list >>> .tpl-column:nth-of-type(12){
    margin: 0 0 20px 0!important;
  }
  .gds-list >>> .tpl-panel{
    height: 250px!important;
    padding: 10px 10px 0;
  }
  .gds-list >>> .tpl-panel .tpl-cover{
    border-radius: 5px;
  }
  .gds-list >>> .tpl-panel .tpl-cover div:first-child{
    margin-top: 40px!important;
    margin-bottom: 23px!important;
  }
  .gds-list >>> .tpl-panel .image-box{
    height: 197px!important;
  }
  .gds-list >>> .tpl-column .title-desc .attrs{
    display: none!important;
  }
  .gds-list >>> .tpl-column .title-desc{
    height: 43px!important;
  }
  .gds-list >>> .tpl-column .title-desc > p:nth-of-type(1){
    font-size: 12px;
  }
  .gds-list >>> .tpl-column .tpl-panel .tpl-cover .btn-action p{
    margin-top: 0px!important;
    font-size: 12px;
  }
  .gds-list >>> .tpl-column .tpl-panel .lock-status .status-bg{
    border-top-right-radius: 5px;
  }
</style>

