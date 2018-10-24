<template>
  <div class="left-menu">
    <ul class="category-wrap">
      <li v-for="item in categoryList" :key="item.index" :class="{'active':selected.category == item.key}" @click="changeCategory(item.key)">
        <div class="pull-left tab-hd"></div>
        <div class="pull-left tab-bd">
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </div>
        <div class="clear-fix"></div>
      </li>
    </ul>

    <div class="menu-body">
      <div class="mt10"></div>
      <!--背景颜色-->
      <div class="background-color-div" v-show="selected.category=='background'" style="flex-basis: 60px;flex-shrink: 0;">
        <div class="pull-left background-title">
          <input class="backgroundColor" />
        </div>
        <div class="pull-left color-list">
          <div class="pull-left color-item" v-for="item in backgroundColor" :key="item.index" :style="{backgroundColor:item}" @click="setBackgroundColor(item)"></div>
        </div>
      </div>

      <!--图片类型-类别-->
      <div class="operate-tab" v-if="selected.category=='controls_image'||selected.category=='background'" style="flex-basis: 60px; flex-shrink: 0;">
        <div class="tab-item one" :class="{'active':selected.role == 'sys'}" @click="setRole('sys')">图片库</div>
        <div class="tab-item two" :class="{'active':selected.role == 'own'}" @click="setRole('own')">我的图片</div>
        <div class="clear-fix"></div>
      </div>

      <!--标签-->
      <!--<ul class="image-catageray" v-if="selected.role == 'sys'&&selected.category!='plugins'&&selected.category!='qrcode'" style="flex-shrink:0;">
                      <li @click="setTag()" :class="{'active':selected.tag == ''}">全部</li>
                      <li v-for="item in tagList" :key="item.index" :class="{'active':selected.tag == item.id}" @click="setTag(item)">{{item.name}}</li>
                    </ul>-->

      <!--图片类型-管理-->
      <div class="btn-group" v-if="selected.role == 'own'" style="flex-shrink:0;">
        <button class="pull-left cancel-span" v-show="selected.category=='background'&&!selected.editorMaterial" @click="cancelBackground">撤销背景</button>
        <button class="pull-left batch-delete" v-show="selected.editorMaterial" @click="deleteSelectedMaterial()" :disabled="!selectedMaterial">删除</button>
        <button class="pull-left batch-manage" @click="manageMaterial">{{selected.editorMaterial ? '取消管理' : '批量管理' }}</button>
        <form enctype="multipart/form-data" v-show="!selected.editorMaterial" style="float:left;position:relative;width: 100px;overflow: hidden;">
          <input id="myImage-upload" type="file" name="fileName" multiple="multiple" accept="image/png,image/jpeg,image/gif" class="input-upload" @change="uploadImg($event)"/>
          <button class="pull-left upload">上传图片</button>
        </form>
        <div class="clearfix"></div>
        <!--<p class="upload-explain">支持png、jpg、jpeg、gif格式，不超过3M</p>-->
      </div>

      <custom-scroll :options="{scrollX: false, scrollY: true, scrollbars: true, preventDefault: false}" @scroll-end="loadNextData()" :refresh="'refreshScroll'" style="flex-grow: 1;">
        <div style="position: relative; float: left; width: 100%;">
          <!--文字文本-->
          <div v-show="selected.category=='controls_text'">
            <div class="Text" v-for="item in defaultTextList" :key="item.index" data-type="control" :data-key="item.key" data-create-type="drag">
              <p>{{item.name}}</p>
            </div>
          </div>
          <!--背景设置-->
          <!--<div v-show="selected.category=='background'&&selected.role == 'sys'">
                          <div class="background-title">
                            <span>纯色背景</span>
                            <input class="backgroundColor" />
                          </div>
                          <div class="catageray-title">
                            <span class="pull-left">图片背景</span>
                            <div class="pull-left cancel-span" style="margin-left: 16px;" @click="cancelBackground">撤销背景</div>
                          </div>
                        </div>-->
          <!--常规（形状）列表-->
          <div v-if="selected.category=='controls_shape'">
            <div class="material" v-for="item in defaultShapeList" :key="item.index">
              <div data-type="control" :data-key="item.key" data-create-type="drag" :style="item.shapStyle"></div>
            </div>
          </div>
          <!--拖拽模块（非背景）列表-->
          <div v-if="selected.category!='background'">
            <div class="material" v-for="item in dataList" :key="item.index" :data-type="item.pluginType ||'control'" :data-key="item.key" data-create-type="drag" @click="selectMaterial(item)">
              <i class="icon-selected" :class="item.editor ? 'el-icon-circle-check' : 'el-icon-circle-check-outline'" v-show="selected.editorMaterial"></i>
              <img :src="item.coverPicture" :title="item.name">
              <div v-if="selected.category=='plugins'||selected.category=='qrcode'||selected.category=='games'" class="text-center" style="height:30px;line-height:30px;font-size:14px;color:#fff;">{{item.name}}</div>
            </div>
          </div>
          <!--点击模块（背景）列表-->
          <div v-if="selected.category=='background'">
            <div class="material" v-for="item in dataList" @click="selected.editorMaterial ? selectMaterial(item) : setBackground(item)" :key="item.index" data-type="background" :data-key="item.key">
              <i class="icon-selected" :class="item.editor ? 'el-icon-circle-check' : 'el-icon-circle-check-outline'" v-show="selected.editorMaterial"></i>
              <img :src="item.coverPicture" :title="item.name">
            </div>
          </div>
        </div>
        <div class="clear-fix"></div>
      </custom-scroll>
    </div>
  </div>
</template>
<script>
import materialCategory from "config/design/material-category";
import backgroundColor from "config/design/background-color";
import api from "api";
import sysConfig from "config/system.js";
import eventBus from '../../utils/eventBus';


export default {
  name: "left-menu",
  data: function() {
    return {
      categoryList: materialCategory,
      backgroundColor,
      dataList: [],
      tagList: [],
      defaultShapeList: [],//json中默认配置常规（形状）
      defaultTextList: [],//json中默认配置文本（文字）
      pagination: {
        pageIndex: 1,
        pageSize: 20,
        startCount: 0,
        totalCount: 0,
        pageCount: 0,
        dataMore: true, //是否还有下一页标志
        _lock: false   //分页上锁,避免连续不断请求
      },
      selected: {
        category: "controls_text",//默认选中分类
        tag: "",  //选中标签
        role: "sys",  //图片、背景列表所属（sys系统；own用户）
        pageBackground: Kdo.data.config.page.get("style")["background-color"],  //页面设置背景色值
        editorMaterial: false  //编辑素材状态
      }
    };
  },
  mounted() {
    this.getInitData();
    this.getTagList();
    this.initColorInput(this.selected.pageBackground);
  },
  computed: {
    selectedMaterial() {
      return this.dataList.filter(item => { return item.editor }).length > 0
    }
  },
  updated() {
  },
  methods: {
    //初始化数据显示
    getInitData: function() {
      var self = this;
      var callback = function() {
        self.droppable();
        self.refreshScroll(Object.assign({ preventDefault: self.selected.category == "background" }));
      }
      self.pagination.pageIndex = 1;
      self.dataList = [];
      // 根据category获取静态数据（非接口）
      switch (self.selected.category) {
        // 文字
        case "controls_text":
          var _text_json = Kdo.menus.getLeftMenuJson("controls").find((n) => n.key == "controls_text").childs
          self.defaultTextList = _.filter(_text_json, (n) => n.struct == "text");
          break;
        // 形状
        case "controls_shape":
          let _contols_rectangle = Kdo.menus.getLeftMenuJson("controls").find((n) => n.key == "controls_rectangle").childs;
          // 格式化常规样式在菜单中显示
          $.each(_contols_rectangle, function(index, item) {
            switch (item.key) {
              case 'controls_rectangle_horizontal':
                item['shapStyle'] = {
                  "background-color": item.data._chooseColors[0],
                  "width": "80px",
                  "height": "10px",
                  "float": "left",
                  "margin": "40px 5px 20px"
                }
                break;
              case 'controls_rectangle_vertical':
                item['shapStyle'] = {
                  "background-color": item.data._chooseColors[0],
                  "width": "10px",
                  "height": "80px",
                  "float": "left",
                  "margin": "0 39px 20px"
                }
                break;
              case 'controls_rectangle_circle':
                item['shapStyle'] = {
                  "background-color": item.data._chooseColors[0],
                  "width": item.style.width,
                  "height": item.style.height,
                  "float": "left",
                  "margin": "0 5px 20px",
                  "border-radius": "50%"
                }
                break;
              default:
                item['shapStyle'] = {
                  "background-color": item.data._chooseColors[0],
                  "width": item.style.width,
                  "height": item.style.height,
                  "float": "left",
                  "margin": "0 5px 20px"
                }
                break;
            }
          });
          self.defaultShapeList = _contols_rectangle;
          break;
        // 图片
        case "controls_image":
          break;
        // 背景
        case "background":
          break;
        // 二维码
        case "qrcode":
          let _pluginqrcode_app = Kdo.menus.getLeftMenuJson("plugin").find((n) => n.key == "plugin_app")
          if (_pluginqrcode_app) {
            $.each(_pluginqrcode_app.childs, (i, item) => {
              if (item.key == "plugin_app_qrcode") {
                item.coverPicture = require('../../' + item.coverPicture)
                self.dataList.push(item)
              }
            });
          }
          break;
        // 活动插件
        case "plugins":
          let _plugin = _.filter(Kdo.menus.getLeftMenuJson("plugin"), (n) => n.key != "plugin_dynamic")
          let _pluginChilds = []
          $.each(_plugin, (i, item) => {
            _pluginChilds = _pluginChilds.concat(item.childs)
          })
          $.each(_pluginChilds, (i, item) => {
            if (item.key != "plugin_app_qrcode") {
              item.coverPicture = require('../../' + item.coverPicture);
              self.dataList.push(item)
            }
          });
          break;
           // 小游戏
        case "games":
        // debugger
          let _game = Kdo.menus.getLeftMenuJson("game")
          let _gameChilds = []
          $.each(_game, (i, item) => {
            _gameChilds = _gameChilds.concat(item.childs)
          })
          $.each(_gameChilds, (i, item) => {
            // if (item.key != "plugin_app_qrcode") {
              item.coverPicture = require('../../' + item.coverPicture);
              self.dataList.push(item)
            // }
          });
          break;
      }
      // 用户角色开放上传图片功能（图片、背景）
      // if (self.selected.role == "own") {
      //   self.uploadImg();
      // }
      // 获取动态数据（接口）
      self.getMaterialList(self.selected.category, (data) => {
        self.dataList = self.dataList.concat(data);
        callback();
      });
    },
    //获取素材数据
    getMaterialList(category, cb) {
      var self = this;
      api.request("getMaterialList", {
        pageIndex: self.pagination.pageIndex,
        pageSize: self.pagination.pageSize,
        mtrClass: self.selected.category,
        tagId: self.selected.tag,
        identity: self.selected.role
      }, result => {
        if (result.status != 0) return Kdo.utils.messenger.error("获取素材异常");
        //判断是否还有下一页
        if (self.pagination.pageIndex * self.pagination.pageSize >= result.data.total) {
          self.pagination.dataMore = false;
        } else {
          self.pagination.dataMore = true;
        }
        var list = [];
        // 将数据全部存入缓存
        if (result.data.list.length > 0) list = Kdo.menus.pushMenuJson(self.selected.category, result.data.list);
        !!cb && cb(list.map(item => { return Object.assign({ editor: false }, item) }));
      });
    },
    //设置（选择）素材分类
    changeCategory(category) {
      this.selected.category = category;
      this.selected.role = "sys"
      this.selected.tag = ""
      this.selected.editorMaterial = false;
      this.getInitData();
      this.getTagList();
    },
    //设置（选择）标签
    setTag(tag) {
      this.selected.tag = !!tag ? tag.id : "";
      this.getInitData();
    },
    //设置（切换）角色
    setRole(role) {
      this.selected.role = role;
      this.selected.tag = ""
      this.selected.editorMaterial = false;
      this.getInitData();
    },
    //获取标签列表
    getTagList() {
      var self = this;
      api.request("getMaterialTagList", {
        pageIndex: 1,
        pageSize: 1000,
        mtrClass: self.selected.category
      }, result => {
        if (result.status == 0) {
          self.tagList = result.data.list;
        }
      });
    },
    //初始加载颜色选择器
    initColorInput(originalColor) {
      let _this = this;
      var _setColor = function(color) {
        _this.selected.pageBackground = color ? color.toHexString() : "#ffffff";
        Kdo.data.config.page.set({ "style": { "background-color": !!color ? color.toHexString() : "" } });
      }

      $(".backgroundColor").spectrum({
        allowEmpty: true,
        color: originalColor,
        showInput: true,
        showPalette: true,
        showSelectionPalette: false,
        showAlpha: false,
        showButtons: false,
        maxPaletteSize: 10,
        preferredFormat: "hex",
        localStorageKey: "spectrum.demo",
        move: function(color) {
          _setColor(color);
        },
        change: function(color) {
          if (!color) {
            _this.selected.pageBackground = '';
            return false;
          }
          _setColor(color);
        },
        beforeShow: function() {
        },
        palette: $.spectrum.customOptions.palette
      });
    },
    //撤销背景
    cancelBackground() {
      // this.selected.pageBackground = ""
      Kdo.data.config.page.set({
        "style": {
          "background-image": "",
          // "background-color": "" 
        }
      });
      // $(".left-menu").find(".backgroundColor").spectrum("set", "");

      // this.$confirm('确定撤销已设置的背景颜色及背景图片吗?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      // }).catch(() => {
      // });
    },
    //设置（选择）背景图片
    setBackground(item) {
      if (item.key == "clear") {
        return this.cancelBackground();
      }
      Kdo.data.config.page.set({
        "style": {
          "background-image": item.data.src.replace('_100X100', ''),
          "background-size": "100%"
        }
      });
    },
    //直接选择颜色设置背景色
    setBackgroundColor(item) {
      Kdo.data.config.page.set({ "style": { "background-color": !!item ? item : "" } });
    },
    //上传图片
    uploadImg(event) {
      let self = this;
      // setTimeout(() => {
        // $("#myImage-upload")
        //   .off("change")
        //   .on("change", function() {
            var $this = $(event.currentTarget),
                This = event.currentTarget,
                warnContext;

                //  var file = event.currentTarget.files[0];

            // debugger
            var formData = new FormData($this.parent()[0]);
            if (This.files.length > 10) {
              warnContext = "单次上传图片不超过10张哦";
              $this.val("");
              return;
            }

            Array.from(This.files).forEach(function(element) {
              if (element.size > 3 * 1024 * 1024) {
                warnContext = "图片大小不超过3M哦";
                $this.val("");
                return;
              }
            });

            if (warnContext){
              return Kdo.utils.messenger.warn(warnContext);
            }

            api.request("uploadFiles", formData, result => {
              if (result.status == 0) {
                self.saveUserImg(result.data);
              } else {
                Kdo.utils.messenger.error("图片上传失败！");
              }
              $this.val("");
            });
        // });
      // });
    },
    // 管理素材(批量)
    manageMaterial() {
      var self = this;
      self.selected.editorMaterial = !self.selected.editorMaterial;
      self.dataList.forEach(item => { item.editor = false; });
    },
    // 选中素材
    selectMaterial(item) {
      var self = this;
      // 仅编辑状态下生效
      if (self.selected.editorMaterial) {
        item.editor = !item.editor;
        console.log(item.editor);
      }
    },
    // 删除选中素材
    deleteSelectedMaterial() {
      var self = this,
        selectedList = self.dataList.filter(item => { return item.editor });
      if (selectedList.length > 0) {
        self.$confirm('确定要删除已选中的素材吗？删除后不可恢复哟', '提示', {
          center: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          // 执行删除
          api.request("deleteMaterial", {
            mtrIds: selectedList.map(item => { return item.key })
          }, result => {
            if (result.status != 0) {
              return Kdo.utils.messenger.error("图片删除失败");
            }
            Kdo.utils.messenger.success("图片删除成功");
            self.getInitData();
          })
        }).catch(() => {
          // 撤销不做处理
        });
      }
    },
    //保存用户上传图片
    saveUserImg(imgArray) {
      var self = this,
        _option = [];

      $.each(imgArray, (i, item) => {
        let _optionItem = {
          mtrSource: item.file,
          mtrSourceName: item.title,
          mtrClass: self.selected.category,
          mtrType: "img"
        };
        _option.push(_optionItem);
      });

      api.request("saveMaterial", _option, result => {
        if (result.status == 0) {
          self.getInitData();
        } else {
          Kdo.utils.messenger.error("图片上传失败！");
        }
      });
    },
    //模块拖拽
    droppable: function() {
      var self = this;
      var $element = $(".left-menu");
      setTimeout(function() {
        var dataItem = null,
          moveDomClassName = "dragging-target-mouse";
        $element.find("[data-create-type='drag']").draggable({
          helper: "clone",
          iframeFix: true,
          cursor: "move",
          start: function(event, ui) {
            if (self.selected.editorMaterial) return false;
            dataItem = Kdo.menus.getMenuInfo($(ui.helper.context).data("key"), "mobile" /* $scope.tpl_status.webType*/);
            $(event.currentTarget).addClass("draggable-item");
            $(event.currentTarget).css({ visibility: "hidden" });
            
          },
          stop: function(event, ui) {
            // switch ($(ui.helper).data("type")) {
            //   case "draw":
            //   case "game":
            //     break;
            //   case "background":
            //   case "control":
            //   case "group":
            //   default:
            //     break;
            // }
            $("." + moveDomClassName).remove();
            $(".draggable-item").css({ visibility: "visible" });
            dataItem = null;
          },
          drag: function(event, ui) {
            let $dom = $(ui.helper);
            if ($("." + moveDomClassName).length > 0) {
              $("." + moveDomClassName).css({ top: ui.offset.top, left: ui.offset.left });
            } else {
              var newDom = $(ui.helper).clone();
              var controlText = newDom.find("span");
              var controlImg = newDom.find("img");
              var $controlP = newDom.find("p");
              var $div = newDom.find("div");
              var $moveDom = $("<div></div>").addClass(moveDomClassName);
              $dom.css({ visibility: "hidden" });
              newDom.css({
                width: $(ui.helper).width(),
                height: $(ui.helper).height(),
                margin: 0,
                "text-align": "center",
                top: 0,
                left: 0
              });
              if ($div.length < 1) {
                controlImg.css({ width: "100%", height: "100%" });
              } else {
                controlImg.css({ width: "92px", height: "92px;" });
              }

              $moveDom.html(newDom);
              var _styleJson = {
                top: ui.offset.top,
                left: ui.offset.left,
                width: $(ui.helper).width() + 2,
                height: $(ui.helper).height()
              };
              if ($controlP.length > 0) {
                _styleJson["width"] = "213px";
                _styleJson["line-height"] = "47px";
                _styleJson["font-size"] = "18px";
              }
              $moveDom.css(_styleJson).appendTo("body");
            }

            $element.find(".ui-draggable.ui-draggable-handle.ui-draggable-dragging").html("");
          }
        });
      });
      //优化：拖拽模块时模块元素未离开菜单，则不创建模块。（依赖kdo_base_page_create中的drop判断）
      $element.droppable({
        accept: "div.ui-draggable.ui-draggable-handle[data-key]",
        tolerance: "pointer",
        over: function(event, ui) {
          ui.helper.removeClass("drop");
        },
        out: function(event, ui) {
          ui.helper.addClass("drop");
        }
      });
    },
    refreshScroll(otps) {
      setTimeout(() => {
        eventBus.$emit("refreshScroll", otps);
      });
    },
    //绑定滚动加载事件
    loadNextData() {
      let self = this;
      if (self.pagination._lock || !self.pagination.dataMore) return false;
      self.pagination.pageIndex++;
      //此处分页上锁
      self.pagination._lock = true;
      self.getMaterialList(self.selected.category, (data) => {
        self.dataList = self.dataList.concat(data);
        self.pagination._lock = false;
        self.droppable();
        self.refreshScroll();
      });
    }
  }
};
</script>
<style scoped>

</style>


