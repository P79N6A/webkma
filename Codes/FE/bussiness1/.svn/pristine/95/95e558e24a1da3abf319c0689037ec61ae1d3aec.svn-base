<template>
  <div>
    <el-table class="table-box" v-if="data" :data="formatData" :row-style="showRow" :fit="true" v-bind="$attrs">
      <el-table-column v-for="(column, index) in columns" :key="column.value" :label="column.text" :min-width="column.width">
        <template slot-scope="scope">
          <!-- 层级之间的距离 -->
          <span v-for="space in scope.row._level" v-if="index === 0" :key="space" class="ms-tree-space"/>
          <!-- 显示图标 -->
          <span v-if="iconShow(index,scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.row,scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-circle-plus-outline"/>
            <i v-else class="el-icon-remove-outline"/>
          </span>
          <!-- 头像 -->
          <div style="display:inline;width:20px;height:20px; padding-left:5px;">
             <img v-if="column.value=='name'" :src="scope.row.face" style="width:20px;height:20px;vertical-align:-6px;border-radius:20px;">
          </div>
          {{ scope.row[column.value] }}
          <!-- 名片 -->
          <img v-if="column.value=='name'" @click="showCard(scope.row)" src="../../static/images/icon-tipsCard.png" style="width:19px;height:18px;vertical-align:-5px;">
        </template>
      </el-table-column>
      <slot/>
    </el-table>
    <pagination
      v-if="data.length>0"
      class="pull-right"
      :paginationOpt="connectionsPagination"
      @switchPage="connectionsPagesFn"
    />
    <div class="card-info" v-if="!!cardFlag" :style="{left:cardX+'px',top:cardY+'px'}">
      <div class="title font-18">名片详情</div>
      <i class="close el-icon-close" @click="close"></i>
      <p>
        <span>微信昵称 : </span>
        <img :src="cardList.wxFace" style="width:25px;height:25px;margin-left:8px;border-radius:50%;">
        <span class="black-light" style="margin-left:0;">{{cardList.wxName}}</span>
      </p>
      <p>
        <span>姓&emsp;&emsp;名 : </span>
        <span>{{cardList.name}}</span>
      </p>
      <p>
        <span>企业名称 : </span>
        <span>{{cardList.company || "暂无"}}</span>
      </p>
      <p>
        <span>性&emsp;&emsp;别 : </span>
        <span>{{cardList.sex==1?"男":"女"}}</span>
      </p>
      <p>
        <span>地&emsp;&emsp;址 : </span>
        <span>{{cardList.wxProvince ||""}}{{cardList.wxCity||"暂无"}}</span>
      </p>
      <p>
        <span>职&emsp;&emsp;位 : </span>
        <span>{{cardList.job || "暂无"}}</span>
      </p>
      <p>
        <span>手&ensp;机&ensp;号 : </span>
        <span>{{cardList.phone || "暂无"}}</span>
      </p>
      <p>
        <span>微&ensp;信&ensp;号 : </span>
        <span>{{cardList.wxNo || "暂无"}}</span>
      </p>
      <p>
        <span>邮&emsp;&emsp;箱 : </span>
        <span>{{cardList.email || "暂无"}}</span>
      </p>
    </div>
  </div>
</template>
 
<script>
import api from "api";
import treeToArray from "../utils/format.js";
import pagination from "components/ui-pagination";
export default {
  name: "treeTable",
  components: {
    pagination
  },
  data() {
    return {
      cardFlag: false, //控制名片显示
      cardX: null, //名片x轴坐标
      cardY: null, //名片y轴坐标
      data: [], //列表数据
      columns: [ //表头
        {
          text: "微信昵称",
          value: "name",
          width: "100"
        },
        {
          text: "所在层级",
          value: "currentSub"
        },
        {
          text: "下级层级/下级人数",
          value: "newSub"
        },
        {
          text: "当前用户访问次数/下级人脉访问总数",
          value: "newView"     
        },
        {
          text: "当前用户分享数/下级人脉分享总数",
          value: "newShare"
        }
      ],
      type:"root", //默认请求类型
      connectionsPagination: { //分页参数
        pageIndex: 1,
        pageSize: 5,
        totalCount: 1,
        pageCount: 0
      },
      cardList:{}, //名片数据
    };
  },
  props: {
    expandAll: { //是否默认展开全部
      type: Boolean,
      default: false
    },
    manuscriptId:{ //活动id
        type:String,
        default:''
    },
    clientType:{ //终端类型
        type:String,
        default:''
    },
    businessId:{ //商家id
        type:String,
        default:''
    },
    pageIndex:{
        type:Number,
        default: 1
    },
    pageSize:{
        type:Number,
        default: 5
    },
    evalFunc: Function,
    evalArgs: Array,
  },
  computed: {
    // 格式化数据源将数据转换成树形数据
    formatData: function() {
      let tmp;
      if (!Array.isArray(this.data)) {
        tmp = [this.data];
      } else {
        tmp = this.data;
      }
      const func = this.evalFunc || treeToArray;
      const args = this.evalArgs
        ? Array.concat([tmp, this.expandAll], this.evalArgs)
        : [tmp, this.expandAll];
      return func.apply(null, args);
    },
  },
  mounted(){
    this.getTableData();
  },
  methods: {
    // 显示动画
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        : "display:none;";
        // console.log("样式",row)
    },
    stringLength:function(str) {
      return str.replace(/[\u0391-\uFFE5]/g,"aa").length;  //先把中文替换成两个字节的英文，在计算长度
    },
    //获取人脉活动列表
    formatArry(arr,topId) { 
      arr.map(item => { 
        item.name = (item.layer==0?item.nickname +(item.emplName==null?"":"(" + item.emplName + ")"):item.nickname)
        item.newShare = item.shareCount + '/' + item.subShareCount   //分享           
        item.newView = item.viewCount + '/' + item.subViewCount   //访问
        item.newSub = item.subLayer + '/' + item.subCount  //层级
        item.topId =topId || item.userId
        item.currentSub = ((item.layer==-1||item.layer==0)?"脉主":item.layer + '层人脉') 
        if (item.subCount > 0 && item.children){ 
          formatArry(item.children) 
        } 
      }) 
    }, 
    getTableData(json) {
        let self = this;
        // console.log(obj, "id", this.manuscriptId, this.businessId);
        let row = !!json && json.row || '',
        obj = !!json && json.obj || '',
        cb = !!json && json.cb || '';
        let option = {
            manuscriptId: self.manuscriptId,
            type: (!!obj ? obj.type : self.type),
            pageIndex: (!!obj ? obj.pageIndex : self.connectionsPagination.pageIndex),
            pageSize: (!!obj ? obj.pageSize : self.connectionsPagination.pageSize),
            clientType: self.clientType,
            businessId: self.businessId,
            nodeId: "",
            trunkId: "",
            layer: -1
        }
        , interfaceName = !!self.manuscriptId ? 'getManuscriptTable' : 'getCardTable'
        obj = $.extend(option, obj);
        // console.log(obj,"rowww",row)
        api.request(interfaceName, obj, result => {
            if (result.status == 0) {
                if(option.type=='root'){
                    self.data = result.data.list;
                    self.formatArry(self.data)
                    self.connectionsPagination.totalCount = result.data.total;
                    self.connectionsPagination.pageCount = Math.ceil(
                      self.connectionsPagination.totalCount /
                        self.connectionsPagination.pageSize
                    );
                    // console.log("人脉数据", self.data,)
                }else{
                    let list =result.data.list
                    self.formatArry(list,row.topId),
                    // row.children=list,
                    row._expanded = !row._expanded
                    self.$set(row,"children",list);
                    // console.log("人脉数据2", self.data,"rowww",row,"调整")
                }
              
            }
            !!cb && cb();
        });
    },
    // 获取名片信息
    getCardInfo(cuid,cbid){
      let self = this;
      api.request("getCardInfo", {
        cardUserId : cuid,
        cardBusinessId: cbid
      }, result => {
        if (result.status == 0) {
          self.cardList = result.data;
        //  console.log("名片",self.cardList)
        }
      });
    },
    // 切换下级是否展开
    toggleExpanded: function(row,trIndex) {
      let self = this;
      if(row.subCount > 0){
        let record = self.formatData[trIndex]
        if((!record.children ||record.children.length==0) && !record._expanded){
          self.getTableData({
            obj:{
              type:"sub",
              nodeId: row.userId,
              trunkId:row.topId || row.userId,
              layer: row.layer
            },
            row:record
          });
        }else{
          record._expanded = !record._expanded
        }
      }else{
        self.getTableData({
          row:row
        });
      }
      // console.log("row",row)
    },
    // 显示名片
    showCard:function(row,ev){
      this.cardFlag = true;
      var oEvent=ev||event;
      // this.cardX = oEvent.screenX - 100;
      // this.cardY = oEvent.screenY - 105;
      this.cardX = oEvent.offsetX + 400;
      this.cardY = oEvent.offsetY + 250;
      if(row.layer == 0){
        this.getCardInfo(row.userId,this.businessId)
      }else{
        this.getCardInfo(row.userId,"")
      }
    },
    // 关闭名片
    close:function(){
      this.cardFlag = false;
    },
    // 图标显示
    iconShow(index, record) {
      return index === 0 && record.subCount > 0;
      // return (index === 0 && record.children && record.children.length > 0)
    },
    //人脉列表分页调取方法
    connectionsPagesFn(pageIndex, cb) {
      let self = this;
      self.connectionsPagination.pageIndex = pageIndex;
      self.getTableData({cb: cb});
    }
  }
};
</script>
<style rel="stylesheet/css">
  .table-box{
    margin-top: 10px;
  }
  .table-box .el-table__body-wrapper{
    overflow: auto;
  }
  .el-table__body
  .table-box th{
    background-color: #FAFBFF!important;
    border-top: 1px solid #EDF2F5;
  }
  .table-box th>.cell,
  .table-box tr td>.cell{
    text-align: center!important;
  }
  .table-box tr td:nth-of-type(1) .cell{
    /* width:300px; */
    height: 24px;
    text-align: left!important;
    overflow: auto;
  }
  @keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @-webkit-keyframes treeTableShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
 
<style scoped>
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 14px;
  height: 14px;
}
.ms-tree-space::before {
  content: "";
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}
.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: #c8cfd4;
  margin-left: -15px;
}
.card-info{
  width: 400px;
  height: 440px;
  background-color: #FFF;
  border-radius: 5px;
  box-shadow:0px 2px 10px rgba(0,0,0,0.1);
  padding: 0 36px;
  position: absolute;
  /* left: 355px;
  top: 186px; */
  z-index: 20;
}
.card-info .title{
  text-align: center;
  padding: 32px 0 36px 0;
}
.card-info p{
  margin-bottom: 18px;
}
.card-info p > span:first-child{
  font-weight: bold;
  color: #3c4a55;
}
.card-info p > span:nth-of-type(2){
  margin-left: 8px;
  color: #63717b;
}
.card-info .close{
  position: relative;
  right: -17px;
  top: -79px;
}
</style>