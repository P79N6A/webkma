<template>
  <div class="material-list-box">
    <div class="navigator">
      <navigator :tabs="navigatorOpts.tabs" @navigator-event="transferTab"></navigator>
    </div>
    <div class="material-content">
      <div class="select-data flex space-between">
        <div class="flex" style="min-width: 500px;">
          <span class="font-14 mr-15">时序</span>
          <div class="formSortin mr-30" style="position:relative;width:118px;">
            <el-select v-model="searchOptions.order" placeholder="最近" @change="materialSort">
              <el-option label="最近" value="desc"></el-option>
              <el-option label="最早" value="asc"></el-option>
            </el-select>
            <i class="el-icon-caret-bottom" style="position:absolute;top:6px;right:14px;font-size:18px;cursor:pointer;"></i>
          </div>
          <div>
            <el-date-picker
              v-model="selectTime"
              type="daterange"
              range-separator="到"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div>
          <div class="searchLabel flex" style="margin-right: 100px;">
            <el-input v-model="searchOptions.keys" class="width-250 mr-10" placeholder="请输入素材编号"></el-input>
            <el-button type="primary" @click="materialSearch">搜索</el-button>
            <el-button type="info" class="clear-btn" style="display:none;" @click="materialClearSearch">撤销</el-button>
          </div>
        </div>
      </div>
      <div class="set-btn flex space-between">
        <div class="flex" style="width:70%;margin-left:35px;">
          <el-button class="btnSerch" type="primary" @click="action('batchRemove')">批量删除</el-button>
          <el-button type="primary" @click="action('addTag')">添加标签</el-button>
        </div>
        <div style="margin-right:150px;">
          <div class="pull-left" style="position: relative;overflow: hidden;" v-if="materialType == 'img'">
            <form enctype="multipart/form-data" style="position:relative;">
                <input id="addMaterialInput" type="file" name="fileName" multiple="multiple" style="width: 70px;height: 30px;position: absolute;left:7px;top:5px;opacity:0"
                        accept="image/png,image/jpeg,image/gif" class="input-upload detailUpImg add-m-btn" @click="action('addinput')"/>
                <button type="button" class="el-button--primary el-button"
                        style="line-height: 16px;padding: 6px;margin-right: 10px;">
                    添加素材
                </button>
            </form>
          </div>
          <el-button type="primary" class="mrl10 keywords" @click="svg_show" v-if="materialType == 'svg'">添加素材</el-button>
          <!-- <el-button type="primary" @click="addMaterial">添加素材</el-button> -->
        </div>
      </div>
      <div class="table-data">
        <el-table
          ref="multipleSelection"
          :data="pageControl.data"
          tooltip-effect="dark"
          row-key="id"
          class="table"
          @selection-change="handleSelectionChange"
          header-row-class-name="table-header"
          header-cell-class-name="table-header"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mtrId"
            label="素材编号"
            align="center"
            width="200"
            class-name="number_color"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mtrSource"
            label="缩略图"
            align="center"
            width="100"
            class-name="number_color"
          >
            <template slot-scope="scope">
               <img style="width: 30px;height: 30px;cursor: pointer; vertical-align: middle;"
                    :src="scope.row.mtrSource" alt=""
                    img-preview-dire="scope.row.mtrSource" @click="imgBigger(scope.row.mtrSource)" />
            </template>
          </el-table-column>
          <el-table-column
            prop="tagName"
            label="标签"
            align="center"
            class-name="tagBox"
          >
            <template slot-scope="scope">
              <span class="singleTag mr-10" v-for="item in scope.row.tags" :key="item">{{item.tagName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="mtrType"
            label="素材格式"
            align="center"
            class-name="number_color"
            width="70"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="createtime"
            label="添加日期"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.createtime}}
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
            class-name="number_color"
            width="70"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <img v-if="scope.row.mtrRemark==null" src="../../assets/images/icon/u492.png" width="15px" height="15px" @click="remarkText(scope.row)">
              <img v-if="scope.row.mtrRemark!==null" src="../../assets/images/icon/u494.png" width="15px" height="15px" @click="remarkText(scope.row)">
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="flex" style="justify-content: center;">
                <span class="keywords btn-plain" @click="compile(scope.row)">编辑标签</span>
                <div class="pull-left" style="position: relative;overflow: hidden; margin: 0 15px;" v-if="scope.row.mtrType == 'img'">
                    <form enctype="multipart/form-data">
                        <input type="file" title="" name="fileName" multiple="multiple" style="width: 39px;height: 30px;position: absolute;left:7px;top:5px;opacity:0"
                                accept="image/png,image/jpeg,image/gif" class="input-upload detailUpImg" @click="action('replace',scope.row)" />
                        <button type="button"
                                class="btn-plain"
                                style="background-color:transparent;">
                            替换
                        </button>
                    </form>
                </div>
                <span class="keywords btn-plain" @click="action('replace',scope.row,'editText')" v-if="scope.row.mtrType == 'svg'">替换</span>
                <span class="mrl10 keywords btn-plain" @click="removeSingle(scope.row)">删除</span>
              </div>
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
        <div class="dialog">
          <el-dialog :title="pageControl.promptTitle" :visible.sync="modalVisible" :before-close="handleClose" width="500px" top="34vh"
            :center="true" class="AssignmentMc-box">
            <div v-if="state=='remove'">
              <span slot="footer" class="space-around flex">
                <el-button type="primary" class="width-135" @click="action('removeDete')">确定</el-button>
                <el-button class="width-135" @click="cancelMc">取 消</el-button>
              </span>
            </div>
            <div v-if="state=='addTags'">
              <el-row :gutter="20" style="margin-bottom:20px;">
                <el-col class="tagbox" :span="6" v-for="(item,index) in (pageControl.operatingType == 'addTag'?pageControl.tags:pageControl.editTag)" :key="index" style="padding:0;">
                  <div style="width:99px;" :class="item.active?'active':''"  @click="addTagEvent(item,index)">{{item.name}}</div>
                </el-col>
              </el-row>
              <span slot="footer" class="space-around flex">
                <el-button type="primary" class="width-135" @click="action('editTag')">确定</el-button>
                <el-button class="width-135" @click="cancelMc">取 消</el-button>
              </span>
            </div>
            <div v-if="state=='img'" style="text-align:center;">
              <img :src="imgSrc" id="imgcont">
            </div>
            <div v-if="state=='remark'"> 
              <textarea class="textbox"
                        style="resize:none;width:100%;height:100px;" 
                        v-model="pageControl.mtrRemark"
                        placeholder="请输入备注信息"></textarea>
              <span slot="footer" class="space-around flex">
                <el-button type="primary" class="width-135" @click="remark">确定</el-button>
                <el-button class="width-135" @click="cancelMc">取 消</el-button>
              </span>
            </div>
            <div v-if="state=='svg'" class="svgBox">
              <div class="uploadImg">
                <div class="mb-15" style="color:#000;">上传源文件 <span class="ml-35 ellipsis disable-color">{{svgObjList.source.id}}</span> </div>
                <div class="flex space-around mb-15">
                  <div class="green-deep">
                    <form enctype="multipart/form-data" style="position:relative;">
                      <input type="file" id="uploadSvgMultipart" name="fileName" multiple="multiple" data-type="0" style="width: 39px;height: 30px;position: absolute;left:7px;top:5px;opacity:0"
                              class="input-upload detailUpImg" @click="action('uploadInput')"/>
                      <a class="btn pull-right">上传</a>
                    </form>
                  </div>
                  <a class="green-deep" target="_blank" :href="svgObjList.source.downUrl">下载</a>
                </div>
              </div>
              <div class="uploadFile mb-15">
                <div class="mb-15" style="color:#000;">上传模板 <span class="ml-50 ellipsis disable-color">{{svgObjList.template.id}}</span> </div>
                <div class="flex space-around mb-15">
                  <div class="green-deep">
                    <form enctype="multipart/form-data" style="position:relative;">
                      <input type="file" id="uploadSvgTemp" name="fileName" multiple="multiple" data-type="0" style="width: 39px;height: 30px;position: absolute;left:7px;top:5px;opacity:0"
                              class="input-upload detailUpImg" @click="action('uploadTemp')"/>
                      <a class="btn pull-right">上传</a>
                    </form>
                  </div>
                  <a class="green-deep" target="_blank" :href="svgObjList.template.downUrl">下载</a>
                </div>
              </div>
              <div class="refuse-box" v-if="replacrFlag == 'editText'" >
                <textarea class="textbox"
                          style="resize:none;width:100%;height:100px;"
                          v-model="pageControl.mtrRemark"
                          placeholder="请输入备注信息"></textarea>
              </div>
              <span slot="footer" class="space-around flex" style="margin-top:38px;">
                <el-button type="primary" class="width-135" @click="action('svgEditSure')">确定</el-button>
                <el-button class="width-135" @click="cancelMc">取 消</el-button>
              </span>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../axios/api-service";
import sysConfig from '../../config/system'
import navigator from "../../components/navigator";
import pagination from "../../components/ui-pagination";
// import dialog from "../../components/com-dialog ";
import { constants } from 'crypto';
export default {
  name: "material-list",
  components:{navigator,pagination},
  data() {
    return {
      navigatorOpts: { //tab切换
        tabs: [
          { key: "controls_shape", title: "形状素材", selected: true},
          { key: "controls_image", title: "图片素材" },
          { key: "controls_background", title: "背景素材" },
          { key: "controls_text", title: "文本素材" }
        ],
        selectedKey: ""
      },
      searchOptions: { //搜索排序选项
        order: "desc",
        terminalType: 2,
        materialCategoryId: '',
        materialId: '',
        keys: '',
        startTime: {	//可空，不为空时则筛选结果的创建时间将会大于等于该值
            value: "",
            opened: false,
            options: {}
        },
        endTime: {       //可空，不为空时则筛选结果的创建时间将会小于该值
            value: "",
            opened: false,
            options: {}
        }
      },
      paginationOpt: { //分页
        pageIndex: 1,
        pageCount: '',
        pageSize: 10
      },
      selectTime: '', //时间选择
      pageControl: {
        operatingType: 'addTag', //操作
        checkAll: false,//全选
        currentItem: {},//当前操作项
        electedMaterialIds: [],//选中的素材id
        data: [],//素材数据
        tags: [{active:false}],//所有标签
        editTag: [],//编辑时的标签
        selectedTag: [],//选中的标签
        promptTitle: '选择标签类型',
        removeTipText: '确定删除这条数据',
        mtrRemark: ''//备注
      },
      multipleSelection: [],
      materialState: "controls_shape", //tab当前状态
      sortState: "", //下拉选择状态
      modalVisible: false, //蒙层状态
      state: "", //点击状态
      imgSrc: "", //预览图片地址
      currentId: "", //当前行id
      materialType: "svg", //图片类型svg img
      uploadtype: true,
      svgObjList: { //上传img或模板
        source:{
          id:"",
          downUrl:"",
          file:""
        },
        template:{
          id:"",
          downUrl:"",
          file:""
        }
      },
      editData: {
        type: ""
      }, //保存上传对象
      replacrFlag: "" //替换svg(备注标识)
    };
  },
  mounted(){
    this.getMaterialList();
    this.getMaterialTagList();
    this.bindFn('add', $('#addMaterialInput'));
  },
  methods:{
    cancelMc(){
      this.modalVisible = false;
    },
    handleClose(){
      this.modalVisible = false;
    },
    //tab菜单切换
    transferTab(evt){ 
      this.materialState= evt;
      let json = {
        mtrClass: evt
      }
      switch (this.materialState) {
        case "controls_shape":
        case "controls_text":
            this.materialType = "svg"
            break;
        case "controls_image":
        case "background":
            this.materialType = "img"
            break;
      }
      this.searchOptions.order =  "desc";
      this.getMaterialList(json);
    },
    //下拉排序 
    materialSort(evt){ 
      this.sortState = evt;
      let json = {
        mtrClass: this.materialState,
        sort: evt
      }
      this.getMaterialList(json);
    },
    //搜索
    materialSearch(){ 
      $(".clear-btn").show();
      this.searchOptions.startTime.value = window.timeFormdate(this.selectTime[0]);
      this.searchOptions.endTime.value = window.timeFormdate(this.selectTime[1]);
      this.paginationOpt.pageCount = 0;
      this.paginationOpt.pageIndex = 1;
      let json = {
        mtrClass: this.materialState,
        sort: this.sortState
      }
      this.getMaterialList(json);
    },
    //撤销搜索,清空条件
    materialClearSearch(){
       $(".clear-btn").hide();
      this.paginationOpt.pageIndex = 1;
      this.paginationOpt.pageCount = 0;
      this.searchOptions.startTime.options = '';
      this.searchOptions.startTime.value = '';
      this.searchOptions.endTime.value = '';
      this.searchOptions.endTime.options = '';
      this.searchOptions.keys = '';
      let json = {
        mtrClass: this.materialState,
        sort: this.sortState
      }
      this.getMaterialList(json);
    },
    //表格选择
    handleSelectionChange(val){ 
      this.pageControl.selectedTag = val;
      var checkedCount = val.length;
      this.pageControl.checkAll = checkedCount;
    },
    //获取素材列表
    getMaterialList(json,cb){ 
      let self = this;
      let options = {
          mtrClass: !!json ? (json.mtrClass==""?self.navigatorOpts.tabs[0].key:json.mtrClass) : self.navigatorOpts.tabs[0].key,
          sort: !!json ? (json.sort==""?self.searchOptions.order:json.sort) : self.searchOptions.order,
          mtrId: self.searchOptions.keys,
          pageIndex: self.paginationOpt.pageIndex,
          pageSize:  self.paginationOpt.pageSize,
          startTime: self.searchOptions.startTime.value || '',
          endTime: self.searchOptions.endTime.value || ''
      };
      api.request("getMaterialList",options,result => {
        if (result.status == 0) {
            self.pageControl.data = result.data.list;
            self.pageControl.checkAll = false;
            self.paginationOpt.totalCount = result.data.total;
            self.paginationOpt.pageCount = Math.ceil(
              self.paginationOpt.totalCount / self.paginationOpt.pageSize
            );
        } else {
            self.messenger.error("操作失败");
        }
        !!cb && cb();
      })
    },
    //分页
    pagesFn(pageIndex, cb) {
      let json = {
        mtrClass: this.materialState,
        sort: this.sortState
      }
      this.paginationOpt.pageIndex = pageIndex;
      this.getMaterialList(json,cb);
    },
    //获取当前所有的员工id数组
    getSelectIds() {
      let mtrIds = [];
      if (!!this.pageControl.data && this.pageControl.data.length > 0) {
        mtrIds = this.pageControl.data.map(item => item.mtrId);
      }
      return mtrIds;
    },
    //获取当前勾选单个员工的id
    getSelectId() {
      let mtrId = "";
      if (!!this.pageControl.selectedTag && this.pageControl.selectedTag.length > 0) {
        mtrId = this.pageControl.selectedTag.map(item => item.mtrId);
      }
      return mtrId;
    },
    //单个删除
    removeSingle(item){
      alert("确定删除素材?")
      this.pageControl.currentItem = item
      var _data = {
          mtrIds: [this.pageControl.currentItem.mtrId]
      }
      this.removeApi(_data);
    },
    //事件集合
    action(operatingType, item, type){
      var self = this;
      switch (operatingType) {
        case 'addTag'://添加标签
          var _array = self.getSelectId();
          if (_array.length == 0) {
            self.messenger.error('请选择要添加标签的素材！');
            return false;
          };
          self.state = 'addTags';
          self.pageControl.promptTitle = '选择标签类型';
          self.pageControl.operatingType = 'addTag';
          $.each(self.pageControl.tags, function (index1, item1) { item1.active = false; });
          if (_array.length == 0) {
              self.messenger.error('请选择要添加标签的素材！');
              return false;
          };
          self.modalVisible = true;
          break;
        case 'batchRemove'://批量删除按钮
          if (self.getSelectId().length == 0) {
              self.messenger.error('请选择要删除的素材！');
              return false;
          }
          self.state = 'remove';
          self.modalVisible = true;
          self.pageControl.promptTitle = '确定删除选中素材?';
          self.pageControl.operatingType = 'batchRemove';
          break;
        case 'removeDete': //确定批量删除
          var _data = {
              mtrIds: self.getSelectId()
          }
          this.removeApi(_data);
          self.modalVisible = false;
          break;
        case 'editTag': //执行添加标签(编辑标签)
          var self = this;
          if (self.pageControl.operatingType == 'addTag') {//添加
            var _data = {
                relationId: self.getSelectId().toString(),
                tagId: self.getSelectedTags().toString()
            };
            api.request("relateTag",_data,result => {
              if (result.status == 0) {
                self.modalVisible = false;
                self.messenger.success('添加标签成功！');
              } else {
                self.messenger.error('添加标签失败');
              }
              self.pageControl.checkAll = false;
              let json = {
                mtrClass: this.materialState,
                sort: this.sortState
              }
              self.getMaterialList(json);
            }) 
          }else {//编辑标签
            var _data = {
                relationId: [self.pageControl.currentItem.mtrId].toString(),
                tagId: self.getSelectedTags('edit').toString()
            };
            api.request("resetTag",_data,result => {
              if (result.status == 0) {
                self.modalVisible = false;
                self.messenger.success('编辑标签成功！');
              } else {
                self.messenger.error('编辑标签失败');
              }
              self.pageControl.checkAll = false;
              let json = {
                mtrClass: this.materialState,
                sort: this.sortState
              }
              self.getMaterialList(json);
            }) 
          }
          break;
        case 'replace': //替换
          var self = this;
          if(type == 'editText'){
            self.replacrFlag = 'editText'
          }
          self.pageControl.currentItem = item;
          if (self.materialType == "svg") {
              //debugger
              self.svg_show(item);
          } else {
              self.bindFn('edit');
          }
          break;
        case 'addinput': //添加img触发事件
            self.bindFn('add');
          break;
        case 'uploadInput': //上传svg
            self.uplodSvg('img',$('#uploadSvgMultipart'))
          break;
        case 'uploadTemp': //上传svg模板 
            self.uplodSvg('temp',$('#uploadSvgTemp'))
          break;
        case 'svgEditSure':
            var self =this;
            if (self.svgObjList.source.id == undefined && self.editSvgData.materialId == undefined) {
							self.messenger.error('svg保存失败：未上传SVG源文件或数据读取失败');
							return;
						}
						var opt = '';
						if (self.editSvgData.type == 'edit') {
							opt = 'materialId=' + self.editSvgData.materialId;
						} else {
							opt = 'materialId=' + (self.svgObjList.source.id == '未选择文件' ? '' : self.svgObjList.source.id);
						}
						if (self.editSvgData.type == 'edit') {
							var opt = {
								mtrId: self.pageControl.currentItem.mtrId,
								mtrRemark: self.pageControl.mtrRemark,
								mtrSource: self.svgObjList.source.file,
								mtrTemplate: self.svgObjList.template.file,
								mtrSourceName: self.svgObjList.source.id,
								mtrTemplateName: self.svgObjList.template.id
							};
							self.updateMaterial(opt)
						} else {
							var _data = {
								mtrSource: self.svgObjList.source.file,
								mtrTemplate: self.svgObjList.template.file,
								mtrSourceName: self.svgObjList.source.id,
								mtrTemplateName: self.svgObjList.template.id,
								mtrClass: self.materialState,
								mtrType: self.materialType
							}
							self.addMaterial(_data);
						}
            self.modalVisible = false;						
          break;
      }
    },
    //获取素材标签
    getMaterialTagList() {
      var self = this;
      api.request("getList", {}, result => {
        self.pageControl.tags = result.data;      
      })
    },
    //删除接口
    removeApi(obj){
      var self = this;
      api.request("deleteMaterial",obj,result => {
        if (result.status == 0) {
            self.messenger.success("操作成功");
        } else {
            self.messenger.error("操作失败");
        }
        self.pageControl.checkAll = false;
        let json = {
          mtrClass: self.materialState,
          sort: self.sortState
        }
        self.getMaterialList(json);
      })
    },
    //选中标签
    addTagEvent(item, index){
      let newItem = Object.assign({},item);
      newItem.active = !item.active;
      this.$set(this.pageControl.tags,index,newItem);
      if(this.pageControl.operatingType == 'editTag'){
        this.$set(this.pageControl.editTag,index,newItem);
      }
    },
    //获取选中的标签集合
    getSelectedTags(edit) {
      var _array = [];
      if (!!edit) {
          $.each(this.pageControl.editTag, function (index, item) {
              if (item.active) {
                  _array.push(item.id);
              }
          });
      } else {
          $.each(this.pageControl.tags, function (index, item) {
              if (item.active) {
                  _array.push(item.id);
              }
          });
      }
      return _array;
    },
    //编辑标签
    compile(item){
      var self = this;
      self.state = 'addTags';
      self.pageControl.promptTitle = '选择标签类型';
      self.pageControl.operatingType = 'editTag';
      self.pageControl.currentItem = item;
      //合并标签并去重
      var _array = [];
      $.each(item.tags, function (index3, item3) {
          var _array1 = $.grep(self.pageControl.tags, function (n) { return n.tagName == item3.name });
          if (_array1.length == 0) {
              _array.push({ name: item3.name });
          }
      })
      self.pageControl.editTag = self.pageControl.tags.concat(_array);
      $.each(self.pageControl.editTag, function (index1, item1) {
          item1.active = false;
          $.each(item.tags, function (index2, item2) {
              if (item1.name == item2.tagName) {
                  item1.active = true;
              }
          });
      });
      self.modalVisible = true;      
    },
    //放大图片
    imgBigger(src){
      this.state = 'img';
      var reg = RegExp(/\.(svg|gif|webp)$/);
      if(src.match(reg)){
        $('#imgcont').css('width','450px')
        this.imgSrc = src;
      }else{
        $('#imgcont').css('width','')
        this.imgSrc = src + '@w_356,h_720';
      }
      
      this.pageControl.promptTitle = '';
      this.modalVisible = true;
    },
    //备注信息
    remarkText(item){
      this.state = 'remark';
      this.pageControl.promptTitle = '编辑备注';
      this.pageControl.mtrRemark = item.mtrRemark;
      this.currentId = item.mtrId
      this.modalVisible = true;
    },
    //保存备注信息
    remark(){
      var self = this;
      var opt = {
          mtrId: self.currentId,
          mtrRemark: self.pageControl.mtrRemark
      };

      if (opt.mtrRemark == null || !opt.mtrRemark) {
          self.messenger.error('请输入备注内容');
          return
      }
      api.request('updateMaterial',opt,result=>{
        if (result.status == 0) {
            let json = {
              mtrClass: this.materialState,
              sort: this.sortState
            }
            self.getMaterialList(json);
            self.pageControl.checkAll = false;
            self.modalVisible = false;
        } else {
            self.messenger.error('编辑失败:' + result.message);
        }
      })
    },
    //上传图片
    bindFn(add, obj) {
      // debugger
      var _obj = !!obj ? $(obj) : $('.material-list-box').find("input[name=fileName]");
      var _this = this;
      _obj.off('change').on('change', function () {
          var $this = $(this);
          var self = this;
          var formData = new FormData($this.parent()[0]);
          var len = self.files.length;
          if (!!obj && len > 10) {
              self.messenger.error('单次上传不能超过10张图片');
              return;
          }
          if (!obj && len > 1) {
              self.messenger.error('单次上传不能超过1张图片');
              return;
          }
          for (var i = 0; i < len; i++) {
              if (self.files.item(i).size > 3 * 1024 * 1024) {
                  self.messenger.error('图片大小不超过3M哦');
                  $this.val("");
                  return;
              }
          }

          var xhr = new XMLHttpRequest();
          //请求error
          xhr.addEventListener("error", function () {
              self.messenger.error('图片上传失败');
          }, false);
          //请求中断
          xhr.addEventListener("abort", function () {
              self.messenger.error('上传已由用户或浏览器取消删除连接');
          }, false);
          //发送请求 lanh.kpaasApiHost
          xhr.open("POST", sysConfig.kpaasApiHost + 'api/assets_service/v1/assets/upload?secret_key=' + sysConfig.secret_key, true);
          xhr.setRequestHeader('SessionId', localStorage.getItem("sessionId"));
          xhr.send(formData);
          xhr.onreadystatechange = function (callback) {
              if (xhr.readyState == 4) {
                  if (xhr.status == 200) {
                      var responseText = xhr.responseText;
                      var json = $.parseJSON(responseText);
                      if (json.status === 0) {
                          $this.val('');
                          if (add == "add") {
                              var _list = [];
                              $.each(json.data, function (index, item) {
                                  var _data = {
                                      mtrSource: item.file,
                                      mtrSourceName: item.title,
                                      mtrTemplate: "",
                                      mtrClass: _this.materialState,
                                      mtrRemark: "",
                                      mtrType: _this.materialType
                                  }
                                  _list.push(_data)
                              })
                              _this.addMaterial(_list);
                          }
                          else {
                              var _data = {
                                  mtrId: _this.pageControl.currentItem.mtrId,
                                  mtrSource: json.data[0].file,
                                  mtrSourceName: json.data[0].title
                              }
                              _this.updateMaterial(_data);
                          }
                      } else {
                          self.messenger.error('图片上传失败：' + json.message);
                      }
                  } else {
                      self.messenger.error('图片上传失败：后台无响应');
                  }
              }
          }
      });
    },
    //添加素材（保存数据）
    addMaterial(_data) {
      var self = this;
      self.pageControl.data= [];
      api.request('saveMaterail',_data,result=>{
        if (result.status == 0) {
          self.messenger.success('添加素材成功！',result);
        } else {
          self.messenger.error('添加素材失败！' + result.message);              
        }
        let json = {
            mtrClass: self.materialState,
            sort: self.sortState
          }
        self.getMaterialList(json);
      })
    },
    //更新素材
    updateMaterial(data){
      var self = this;
      api.request('updateMaterial',data,result=>{
        if (result.status == 0) {
          self.messenger.success('更新素材成功！');
        } else {
          self.messenger.error('更新素材失败！');              
        }
        let json = {
            mtrClass: self.materialState,
            sort: self.sortState
          }
        self.getMaterialList(json);
      })
    },
    //添加svg素材
    svg_show(item){
      var self = this;
      self.state = 'svg';
      self.modalVisible = true;
      self.pageControl.promptTitle = '添加svg素材';
      if (!!item) {
        self.editSvgData = item;
        self.materialRemark = Object.assign({},item);;
        self.svgObjList.source.id = item.mtrSourceName;
        self.svgObjList.source.downUrl = 'http://api.kpaas.dev.cn/' + "api/assets_service/v1/assets/download?asset=" + item.mtrSource.replace(/^http[s]?:\/\/[^\/]+\//i, "") + "&name=" + item.mtrSourceName;
        self.svgObjList.template.id = item.mtrTemplateName;
        self.svgObjList.template.downUrl = 'http://api.kpaas.dev.cn/' + "api/assets_service/v1/assets/download?asset=" + item.mtrTemplate.replace(/^http[s]?:\/\/[^\/]+\//i, "") + "&name=" + item.mtrTemplateName;
        self.editData.type = 'edit';
        self.addFireTitle = '替换';
      } else {
        self.editData = {
          type: 'add'
        };
        self.addFireTitle = '添加';
      }
    },
    //上传svg
    uplodSvg(type,obj){
      var _obj = !!obj ? $(obj) : $('.material-list-box').find("input[name=fileName]");
      var _this = this;
      _obj.off('change').on('change', function () {
        var $this = $(this);
        var This = this;
        var formData = new FormData($this.parent()[0]);
        console.log(formData);
        var len = 0;
        try {
          len = This.files.length;
        } catch (e) {
          len = 0;
        }
        if (len <= 0) {
          return;
        }
        if (len > 1) {
          self.messenger.error('单次上传不能超过1张svg');
          return;
        }
        for (var i = 0; i < len; i++) {
          if (This.files.item(i).size > 3 * 1024 * 1024) {
            self.messenger.error('svg大小不超过3M哦');
            $this.val("");
            return;
          }
        }
        _this.uploadtype = true;
        _this.schedule_btxt = '上传中...';
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("abort", function () {
          console.log('上传已由用户或浏览器取消删除连接');
        }, false);
        //发送请求
        xhr.open("POST", sysConfig.kpaasApiHost + 'api/assets_service/v1/assets/upload?secret_key=' + sysConfig.secret_key, true);

        xhr.setRequestHeader('SessionId', localStorage.getItem("sessionId"));
        xhr.send(formData);
        xhr.onreadystatechange = function (callback) {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              var responseText = xhr.responseText;
              var json = $.parseJSON(responseText);
              if (json.status === 0) {
                console.log('svg上传成功');
                _this.schedule_btxt = '上传完成';
                $this.val('');
                if (type == 'img') {//源文件
                  _this.svgObjList.source.id = json.data[0].title;
                  _this.svgObjList.source.downUrl = sysConfig.kpaasApiHost + "api/assets_service/v1/assets/download?asset=" + json.data[0].file + "&name=" + json.data[0].title;
                  _this.svgObjList.source.file = json.data[0].file
                }
                else if (type == 'temp') {//模板文件
                  _this.svgObjList.template.id = json.data[0].title;
                  _this.svgObjList.template.downUrl = sysConfig.kpaasApiHost + "api/assets_service/v1/assets/download?asset=" + json.data[0].file + "&name=" + json.data[0].title;
                  _this.svgObjList.template.file = json.data[0].file
                }
              } else {
                self.messenger.error('svg上传失败：' + json.desc);
              }
            } else {
              self.messenger.error('svg上传失败：后台无响应');
            }
          }
        }
      });
    }
  }
};
</script>
<style scoped>
  .material-list-box >>> .comp-navigator{
    margin: 0;
    overflow-y: hidden;
  }

  .material-list-box >>> .el-button{
    padding: 8px 12px!important;
    border-radius: 0; 
  }

  .material-list-box >>> .el-table .tagBox{
    padding-top: 5px;
  }

  .mr-10{
    margin-right: 10px;
  }

  .mr-15{
    margin-right: 15px;
  }

  .mr-30{
    margin-right: 30px;
  }

  .ml-35{
    margin-left: 35px;
  }

  .ml-50{
    margin-left: 50px;
  }

  .mb-15{
    margin-bottom: 15px; 
  }

  .width-250{
    width: 250px;
  }

  .width-135{
    width: 135px;
  }

  .active{
    position: relative;
    border-color:#e93536!important;
  }

  .material-list-box{
    margin: 15px 20px 0;
  }
  
  .material-list-box .material-content .select-data{
    line-height: 32px;
    padding: 15px;
    margin-bottom: 15px;
  }

  .material-list-box .material-content .set-btn{
    height: 34px;
    margin-bottom: 20px;
  }

  .material-list-box .material-content .singleTag{
    display: inline-block;
    width: 64px;
    padding: 2px 4px;
    border: 1px solid #ccc;
    margin-bottom: 5px;
    /* overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis; */
  }



  .material-list-box .dialog .tagbox{
    width:100px;
    height:40px;
    text-align:center;
    line-height:40px;
    margin:0 23px 15px 0;

  }
  .material-list-box .dialog .tagbox div{
    border:1px solid #999;
  }
  .material-list-box .dialog .tagbox div.active:after{
    position: absolute;
    display: inline-block;
    content: '';
    width: 16px;
    height: 16px;
    bottom: 0px;
    right: 0px;
    background: url('../../assets/images/icon/tag_selected-icon.png')no-repeat;
  }
  .material-list-box .dialog .tagbox:nth-child(4n){
    margin-right:0;
  }
</style>
