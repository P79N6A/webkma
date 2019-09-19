<template>
  <div class="classify-box">
    <fold title="模板分类管理">
      <el-row class="flex space-between operation mrb-15">
        <div> 
          <el-button type="primary" @click="action('add')">添加分类</el-button>
        </div>
        <div class="fr">
          <search :placeholder="searchOpt.placeholder"
                  @searchHandler="searchHander"
                  :style="{ width: '220px'}"
                  ></search>
        </div>
      </el-row>
      <!-- :default-expand-all="false" -->
      <div class="classify-table">
        <el-table
          :data="dataList"
          style="margin-bottom: 20px;"
          row-key="catId"
          borde
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <!-- <el-table-column
            prop=""
            align="center"
            width="100">
          </el-table-column> -->
          <el-table-column
            prop="name"
            label="分类名称"
            align="left">
          </el-table-column>
          <el-table-column
            prop="level"
            label="分类层级"
            align="center">
          </el-table-column>
          <el-table-column
            prop="parentName"
            label="上级分类"
            align="center">
            <template slot-scope="scope">
              {{scope.row.parentName || "-"}}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            align="center">
            <template slot-scope="scope">
              <span v-if="!scope.row._sortEdit" @click="scope.row._sortEdit = true">{{scope.row.sort}}</span>
              <input style="width:56px;border:1px solid #ccc;" v-if="scope.row._sortEdit" type="text" v-model="scope.row.sort"  @blur="changeSortNum(null, scope.row)" @keyup="changeSortNum($event, scope.row)" />
            </template>
          </el-table-column>
          <el-table-column
            prop="templateCount"
            label="模板数量"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            width="250"
            align="center">
            <template slot-scope="scope">
              <span class="btn-plain" v-if="scope.row.level=='1'" @click="action('addSubClass',scope.row)">添加子分类</span>
              <span class="btn-plain" @click="action('editor',scope.row)">编辑</span>
              <span class="btn-plain" @click="action('delete',scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin:10px 10px 0 0;">
          <pagination
            v-if="paginationOpt.pageCount > 1"
            class="pull-right"
            :paginationOpt="paginationOpt"
            @switchPage="pagesFn"
          />
        </div>
      </div>
    </fold>
    <comDialog :title="dialogTitle" :modal-show.sync="modalVisible" class="modal-box">
      <div class="flex mrb-25" style="line-height:32px;">
        <span class="mr-25">分类层级</span>
        <div style="position:relative;width:345px;">
          <el-select v-model="detailData.level" :disabled="classFlag" placeholder="一级分类" @change="changeCategoryLevel">
            <el-option label="一级分类" value="1"></el-option>
            <el-option label="二级分类" value="2"></el-option>
          </el-select>
          <i class="el-icon-caret-bottom" style="position:absolute;top:6px;right:14px;font-size:18px;cursor:pointer;"></i>
        </div>
      </div>
      <div class="flex mrb-25" style="line-height:32px;">
        <span class="mr-25">上级分类</span>
        <div style="position:relative;width:345px;">
          <el-select v-model="detailData.parentId" popper-class="itoption" :disabled="superClassFlag || prompt.tpl != 'add'" placeholder="">
            <el-option v-for="item in categoryLevelList" :key="item.catId" :label="item.name" :value="item.catId"></el-option>
          </el-select>
          <i class="el-icon-caret-bottom" style="position:absolute;top:6px;right:14px;font-size:18px;cursor:pointer;"></i>
        </div>
      </div>
      <div class="flex mrb-25" style="line-height:32px;">
        <span class="mr-25">分类名称</span>
        <div style="position:relative;width:345px;">
          <el-input v-model="detailData.name" maxlength="5" placeholder="请输入分类名称"></el-input>
          <span class="font-13 tips-color">请输入1-5个字的分类名称</span>
        </div>
      </div>
      <div class="flex space-around">
        <el-button type="primary" class="width-135" @click="modalSubmit">提交</el-button>
        <el-button class="width-135" @click="cancelMc">取 消</el-button>
      </div>
    </comDialog>
  </div>
</template>

<script>
import api from "../../axios/api-service";
import fold from "../../components/com-fold";
import search from "../../components/com-search";
import comDialog from "../../components/com-dialog";
import pagination from "../../components/ui-pagination";
import { setTimeout } from 'timers';

export default {
  name: "classify",
  components:{ fold, search, comDialog, pagination },
  data() {
    return {
      searchOpt: {
        placeholder: '请输入分类名称内容'
      },
      searchKeyword: "", //搜索词
      paginationOpt: { //分页
        pageIndex: 1,
        pageCount: '',
        pageSize: 10
      },
      detailData:{
        level: '', //分类层级
        parentId: null,//上级分类
        name: '', //分类名称
        catId: null
      },
      dataList: [], //模板数据
      classFlag: false, //层级选择状态
      categoryLevelList: [], //上级分类数据
      prompt:{ tpl:"" }, //弹窗数据
      parentName: "", //上级名称
      childTable:{ //子级数据
        parentId:"",
        dataList: []
      },
      dialogTitle: "添加模板分类",
      modalVisible: false, //自定义蒙层状态
      superClassFlag: true, //上级分类禁用状态
      sortEditFlag: false, //排序状态
      expandFlag: false //展开状态
    };
  },
  updated(){
    if(this.searchKeyword != ""){
     this.expandAll();
    }
  },
  mounted(){
    this.getList(); //所有模板数据
  },
  methods: {
    //搜索
    searchHander(data) {
      this.searchKeyword = data;
      if(data==""){
        this.dataList = [];
      }
      this.paginationOpt.pageIndex = 1;
      this.getList();
    },

    //下拉选择分类
    changeCategoryLevel(){ 
      var self =this;
      if(self.detailData.level=="1"){
        self.superClassFlag = true;
      }else{
        self.superClassFlag = false;
      }
      self.detailData.parentId = null;
      self.getClassifyList(parseFloat(self.detailData.level) - 1);
    },

    //事件集合
    action(operatingType, item){
      var self = this;
      switch (operatingType) {
        case 'add': //添加分类
          // self.detailData.level = "1";
          self.dialogTitle = "添加模板分类";
          self.detailData = { level: "1", parentId: null, name: "" }
          if(self.detailData.level=='1'){
            self.superClassFlag = true;
          }else{
            self.superClassFlag = false;
          }
          self.classFlag = false;
          self.expandFlag = true;
          self.prompt.tpl = "add";
          self.modalVisible = true;
          break;
        case 'addSubClass': //添加子分类
          self.dialogTitle = "添加模板分类";
          self.detailData = { catId: null, level: (parseFloat(item.level) + 1).toString(), parentId: item.catId, name: "" }
          self.prompt.tpl = "addChild";
          self.classFlag = true;
          self.modalVisible = true;
          self.getClassifyList(parseFloat(item.level) - 1)
          // console.log("层级",self.detailData.level)
          break;
        case 'editor': //编辑
          self.dialogTitle = "编辑模板分类";
          self.detailData = { catId: item.catId, level: item.level.toString(), parentId: item.parentId == '0'?"":item.parentId, name: item.name }
          self.prompt.tpl = "edit";
          self.classFlag = true;
          self.modalVisible = true;
          self.getClassifyList(parseFloat(item.level) - 1);
          break;
        case 'delete': //删除
          var self = this;
           self.messenger.confirm('删除分类的同时，对应的子分类也将会删除！',function(tag){
             if(tag){
              api.request("deleteClassify",{catId: item.catId},result=>{
                if (result.status === 0) {
                    self.messenger.success("删除成功");
                     
                    if(self.dataList.length < self.paginationOpt.pageIndex){
                      self.paginationOpt.pageIndex = self.paginationOpt.pageIndex - 1
                    }
                    // 默认第一级必须刷新
                    if (item.level != "1") {
                        self.getDataListSwitch();
                    }
                    self.getDataListSwitch(item.level);
                } else {
                    self.messenger.error(result.message);
                }
              })
             }
           })
          break;
      }
    },

    //取消蒙层
    cancelMc(){
      this.modalVisible = false;
    },

    //提交分类
    modalSubmit(){
      var self = this;
      api.request("editClassify",self.detailData,result => {
        if( result.status == 0 ){
          self.detailData = { catId: null, level: "", parentId: "", name: "" }
          self.modalVisible = false;
          // 默认第一级必须刷新
          if (self.detailData.level != "1" || self.prompt.tpl == "add" || self.prompt.tpl == "edit") {
            self.getList();
          }
          // self.getDataListSwitch(self.detailData.level);
        }else{
          self.messenger.error(result.message)
        }
      })
    },

    //获取模板列表
    getList(cb){
      var self = this;
      var obj = {
          search: self.searchKeyword,
          pageIndex: self.paginationOpt.pageIndex,
          pageSize: self.paginationOpt.pageSize
      }
      api.request("getListSearch",obj,result => {
        if (result.status == 0) {
            self.detailData = {level:'1',parentId:null,name:""}
            for (var i = 0; i < result.data.list.length; i++) {
              if(result.data.list[i].childrenId !== null){
                self.setData(result.data.list[i],i)
              }
            }
            $.each(result.data.list, function (index1, item1) { item1._sortEdit = false; });
            self.dataList = result.data.list;
            self.paginationOpt.totalCount = result.data.total;
            self.paginationOpt.pageCount = Math.ceil(
              self.paginationOpt.totalCount / self.paginationOpt.pageSize
            );
        } else {
            self.messenger.error("获取失败");
        }
        !!cb && cb();
      })
    },

    //分页
    pagesFn(pageIndex, cb){
      this.paginationOpt.pageIndex = pageIndex;
      this.getList(cb);
    },

    //获取当前级别下的分类项
    getClassifyList(level,cb){
      var self = this;
      api.request("getClassifyList",{
        level: level || "1"
      },result => {
        if (result.status == 0) {
            self.categoryLevelList = result.data;
        } else {
            self.messenger.error(result.message);
        }
      })
    },

    //获取子级项
    getChildDataList(){
      var self = this;
      api.request("getClassifyList",{
        parentId: self.childTable.parentId
      },result => {
        if (result.status == 0) {
              self.childTable.dataList= result.data;
          } else {
              self.messenger.error(result.message);
          }
      })
    },

    //拼装子级数据
    setData(item,index){
      var self = this;
      if (self.childTable.parentId != item.catId) {
        self.childTable.parentId = item.catId;
        api.request("getClassifyList",{
          parentId: self.childTable.parentId
        },result => {
          if (result.status == 0) {
              let newItem = Object.assign({},item);
              newItem.children = [];
              for (var i = 0; i < result.data.length; i++) {
                newItem.children.push(result.data[i])
              }
              self.$set(self.dataList,index,newItem);
            } else {
              self.messenger.error(result.message);
            }
        })
      }else{
        api.request("getClassifyList",{
          parentId: self.childTable.parentId
        },result => {
          if (result.status == 0) {
              let newItem = Object.assign({},item);
              newItem.children = [];
              for (var i = 0; i < result.data.length; i++) {
                newItem.children.push(result.data[i])
              }
              self.$set(self.dataList,index,newItem);
            } else {
              self.messenger.error(result.message);
            }
        })
      }
      
    },

    //自定义排序
    changeSortNum(event, data) {
      var self = this;
      if (!!event && event.keyCode != 13) {
          data.sort = data.sort.replace(/\D/g, '');
          return false;
      }
      if (!/^\d{1,}$/.test(data.sort) || data.sort > 1000 || data.sort < 0) {
          return self.messenger.error('请输入0~1000之间的数字！');
      }
      api.request("customSort",{ catId: data.catId, value: data.sort },result=>{
        if (result.status === 0) {
          self.messenger.success('操作成功！');
          self.getDataListSwitch(data.level);
        } else {
          self.messenger.error(result.message);
        }
      })
    },

    //判断层级 刷新
    getDataListSwitch(level){
      switch (parseFloat(level)) {
        default:
        case 1:
          this.getList();
          break;
        case 2:
          this.getChildDataList();
          break;
      }
    },
    //获取展开子级按钮
    expandAll () {
      var els = document.getElementsByClassName('el-table__expand-icon')  //获取点击的箭头元素
      $(els).hide()
      $.each(this.dataList,function (index1, item1) { item1.children = [] })
      // for (let i = 0; i < els.length; i++) {
      //   console.log("当个点击元素",els[i]) 
      // }
    }
  }
};
</script>
<style scoped>
  .classify-box >>> .el-collapse-item__content{
    padding-top: 15px!important;
  }
  .classify-box >>> .modal-box .el-input__inner{
    width: 345px;
  }
  /* .classify-box >>> .el-table [class*=el-table__row--level] .el-table__expand-icon{
    display: none;
  } */

  .fr{
    float: right
  }

  .mr-25{
    margin-right: 25px;
  }

  .mrb-15{
    margin-bottom: 15px;
  }

  .mrb-25{
    margin-bottom: 25px
  }

  .width-135{
    width: 135px;
  }

  .classify-box .operation div{
    width: 50%;
  }

</style>
