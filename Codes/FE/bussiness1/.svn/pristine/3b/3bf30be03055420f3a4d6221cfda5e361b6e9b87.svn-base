<template>
  <div class="page-main-box">
    <div class="title">
      <div>
        <el-header class="clear-padding">
          <pageTitle :pageTitle="pageTitleOpt" @search-event="search" class="clear-padding" />
        </el-header>
      </div>
    </div>
    <div class="list">
      <div v-if="activityList.length!==0">
        <div class="item" v-for="(item,index) in activityList" :key="index" @mouseenter="showBtn(index)" @mouseleave="hideBtn(index)">
          <div class="item-img">
            <div class="pic" style="top:0;">
              <img :src="item.cover" style="display: block;width:100%;height:auto;">
            </div>
            <div class="upscr upscrhover"></div>
            <div class="downscr downscrhover"></div>
          </div>
            <!-- v-if="item.showFlag" -->
          <div class="item-cont" style="margin-top:9px;" v-if="item.showFlag">
            <p class="font-12 black-deep ellipsis" style="width:146px;">{{item.name}}</p>
            <p class="font-11 black-tips">
              <span class="ellipsis">层级 : {{item.hierarchy}}</span>
              <span class="ellipsis">总数 : {{item.mapTotal}}</span>
            </p> 
          </div>
          <div class="more-btn"  >
             <div class="item-btn" @click="activityInfo(item)" >查看人脉图谱</div>
          </div>

        </div>
      </div>
      <div style="padding-top:24px;text-align:center;" v-else>
        <img src="../../../static/images/cover-data-empty.png" style="width:350px;height:166px;">
      </div>
    </div>
    <pagination 
      v-if="activityList.length>0"
      class="pull-right"
      :paginationOpt="activityPagination"
      @switchPage="activityPagesFn"
    />
  </div>
</template>

<script>
import pageTitle from "../../components/page-title";
import pagination from "components/ui-pagination";
import coverImg from "../../assets/images/none.png";
import api from "api";

export default {
  components: {
    pageTitle,
    pagination
  },
  name: "activityList",
  data() {
    return {
      businessId: "",//商家id
      pageTitleOpt: {
        text: "活动人脉图谱",
        search: {
          value: "",
          placeholder: "请输入活动名称"
        },
        showSearch: true
      },
      nameSearch: "", //搜索关键字
      activityList: [], //活动列表
      activityPagination: { //人员分派分页
        pageIndex: 1,
        pageSize: 12,
        totalCount: 1,
        pageCount: 0
      },
      currentIndex:"", //当前索引
    }
  },
  mounted() {
    var self = this;
    var scrollObj;
    var currentTop = 0;
    self.businessId = localStorage.businessId;
    self.getListRelation();
  },
  methods:{
    //搜索
    search(data) {
      let self = this;
      self.nameSearch = data;
      self.activityPagination.pageIndex = 1;
      self.getListRelation();
    },
    //获取活动人脉列表
    getListRelation(cb,obj){
      let self = this;
      obj = {
        businessId:self.businessId,
        pageIndex:self.activityPagination.pageIndex,
        pageSize:self.activityPagination.pageSize,
        nameSearch: self.nameSearch,
      } 
      api.request("getListRelation", obj, result => {
        if (result.status == 0) {
          result.data.list.map(el => {
            el.showFlag = true
            return el
          });
          self.activityList = result.data.list;
          self.activityPagination.totalCount = result.data.total;
          self.activityPagination.pageCount = Math.ceil(
            self.activityPagination.totalCount /
              self.activityPagination.pageSize
          );
          console.log("人脉列表",self.activityList)
        }
        !!cb && cb();
      });
    },
    //活动列表分页调取方法
    activityPagesFn(pageIndex, cb) {
      let self = this;
      self.activityPagination.pageIndex = pageIndex;
      self.getListRelation(cb);
    },
    //显示查看按钮
    showBtn(index){
      this.activityList[index].showFlag = false    
    },
    //隐藏查看按钮
    hideBtn(index){
      this.activityList[index].showFlag = true      
    },
    //跳转详情
    activityInfo(item){
      localStorage.setItem('manuscriptName', item.name);
      localStorage.setItem('brainMapRootFace', item.cover || coverImg);
      this.$router.push({
        path: "/connections-detail?id=" + item.id
      });
    }
  }
};
$(function(){
  // 长图显示效果
  var scrollObj;
  var currentTop = 0;
  // 上滑显示
  $(document).on("mouseenter", ".upscrhover", function() {
      var self = this;
      clearInterval(scrollObj);
      scrollObj = setInterval(function() {
          var imgHeight = $(self).parent().children("div:eq(0)").children().height();
          if (currentTop + imgHeight > $(self).parent().height()) {
              currentTop--;
              currentTop--;
              $(self).parent().children("div:eq(0)").css("top", currentTop)
          }
      }, 10)
  }).on("mouseleave", ".upscrhover", function() {
      clearInterval(scrollObj)
  }).css("margin-top", $(this).height() / 2);
  // 下滑显示
  $(document).on("mouseenter", ".downscrhover", function() {
      var self = this;
      clearInterval(scrollObj);
      scrollObj = setInterval(function() {
          var imgHeight = $(self).parent().children("div:eq(0)").children().height();
          if (currentTop < 0) {
              currentTop++;
              currentTop++;
              $(self).parent().children("div:eq(0)").css("top", currentTop)
          }
      }, 10)
  }).on("mouseleave", ".upscrhover", function() {
      clearInterval(scrollObj)
  });
  
})

</script>

<style scoped>
  .font-11{
    font-size: 11px;
  }
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .page-main-box{
    min-height: 660px;
    background-color: #FFF;
    padding: 0 25px;
  }
  .page-main-box .title{
    height: 58px;
    margin-bottom: 40px;
  }
  .page-main-box .list{
    max-height: 532px;
    padding-left: 30px;
  }
  .page-main-box .list .item{
    float: left;
    width: 160px;
    height: 250px;
    border: 1px solid #eeeeee;
    border-radius: 5px;
    padding: 6px;
    margin:0 33px 30px 0;    
    position: relative;
    overflow: hidden;
  }
  .page-main-box .list div.item:hover{
    transform: translateY(-10px);
    box-shadow:0px 1px 5px rgba(0,0,0,0.1);
  }

  .page-main-box .list .item .item-img{
    width:147px;
    height:180px;
    overflow: hidden;
    position: relative;
  }
  .page-main-box .list .item .item-img .pic{
    position: absolute;
  }
  .page-main-box .list .item .item-img .upscr{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    z-index: 99;
  }
  .page-main-box .list .item .item-img .downscr{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    z-index: 99;
  }
  .page-main-box .list .item-cont p{
    margin-top: 5px;
  }
  .page-main-box .list .item-cont .black-tips{
    color: #b1bfcd;
  }
  .page-main-box .list .item-cont .black-tips span{
    display:inline-block;
    width: 48%;
  }
  .page-main-box .list .item,
  .page-main-box .list .item .more-btn{
    transition: .5s;
  }
  .page-main-box .list .item .more-btn{
    width: 100%;
    height: 60px;
    background: #fff;
    outline: none;
    border: none;
    position: absolute;
    z-index: 9;
    bottom: 0;
    left: 0;
    transform: translateY(60px);
    opacity: 0;
    visibility: hidden;
  }
  .page-main-box .list div.item:hover .more-btn{
    visibility: visible;
    opacity: 1;
    transform: none;
  }
  .page-main-box .list .item-btn{
    width: 110px;
    height: 30px;
    background-color: #00bad0;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 30px;
    margin: auto;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
  

</style>
