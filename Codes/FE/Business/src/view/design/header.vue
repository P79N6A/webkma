<template>
  <div>
    <div class="pull-left head_middle">
    </div>
    <div>
      <div class="pull-right" style="margin-right:10px;">
        <div style="line-height:50px; height:50px;">
          <el-button class="head_btn" type="primary" size="medium" icon="iconfont icon-save" :loading="savingStatus" @click="saveManuscript"> 保存 </el-button>
          <el-button class="head_btn" type="primary" size="medium" icon="iconfont icon-preview" @click="btnPreview" ng-show="!isGroupEdit"> 预览 </el-button>
          <el-button class="head_btn" type="primary" size="medium" icon="iconfont icon-release" @click="releaseSetting" ng-show="!isGroupEdit"> 发布 </el-button>
        </div>
      </div>
    </div>
    <el-dialog title="发布设置" :visible.sync="dialogOptions.visible" width="600px" center :close-on-click-modal="false">
      <el-form :model="manuscript" :rules="manuscriptRules" ref="manuscript" label-width="100px" class="manuscriptForm">
        <div class="setting_box">
          <div class="box_border">
            <span class="box_title">基础设置</span>
            <div class="basic_info clearfix">
              <div class="cover_box pull-left">
                <form enctype="multipart/form-data" id="uploadImgToServer" style="height: 100%;">
                  <!-- <img id="templateImg" :src="manuscript.cover || '/static/cover-empty.jpg'" style="width:180px;height:180px;" /> -->
                  <div style="width: 100%; height: 100%; background-repeat: no-repeat; background-position: center; background-size: cover; " :style="{backgroundImage: manuscript.cover ? 'url(' + manuscript.cover + ')': 'url(\'/static/cover-empty.jpg\')' }"></div>
                  <input id="templateImgInput" type="file" name="fileName" accept="image/png,image/jpeg,image/gif" class="input_upload" @change="uploadCover($event)">
                  <div class="replace_btn_div">
                    <button type="button" class="replace_btn blue_black">更换封面</button>
                  </div>
                </form>
              </div>
              <div class="pull-right info_box">
                <span style="margin-left:2px; color:#63717b;">作品名称
                  <i style="color: #ed5564;">*</i>
                </span>
                <el-form-item prop="name" label-width="0px">
                  <el-input style="margin-top:2px; color:#63717b;" placeholder="请输入作品名称" v-model="manuscript.name" maxlength="20">
                    <i slot="suffix" style="font-size: 12px; font-style: normal; line-height: 60px;">{{nameLength}}/20</i>
                  </el-input>
                </el-form-item>
                <div class="pull-left">
                  <span class="pull-left" style="margin-left:2px;">作品描述&nbsp;&nbsp;</span>
                  <span class="pull-left sub-title">(将显示在分享出去的链接介绍中)</span>
                  <el-input style="margin-top:2px;" type="textarea" resize="none" rows="3" maxlength="150" placeholder="请输入作品描述" v-model="manuscript.description"></el-input>
                  <i class="textlength des_length">{{desLength}}/150</i>
                </div>
              </div>
            </div>
          </div>
          <!-- 员工分派(非设计师操作) -->
          <div class="box_border" v-if="role != '2'">
            <span class="box_title">员工分派</span>
            <div style="text-align: center;">
              <el-transfer style="text-align: left; display: inline-block; height: 240px;" v-model="employees.selectedList" :right-default-checked="employees.selectedList" :titles="['全选', '全选']" :format="{
                            noChecked: '${total}',
                            hasChecked: '${checked}/${total}'
                          }" :data="employees.list">
                <span slot-scope="{ option }">{{ option.label }}</span>
              </el-transfer>
            </div>
          </div>
        </div>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="releaseManuscript();" :loading="releaseStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import api from "api";
import {createPreviewWindow} from '../../utils';
export default {
  name: "designHeader",
  components: {},
  data: function() {
    return {
      role: localStorage.role,
      savingStatus: false,
      releaseStatus: false,
      manuscript: {
        id: "",
        name: "",
        description: "",
        cover: ""
      },
      manuscriptRules: {
        name: [{ required: true, message: "请输入作品名称" }]
      },
      dialogOptions: {
        visible: false
      },
      employees: {
        selectedList: [],
        list: []
      }
    };
  },
  mounted() {
    this.manuscript.id = !!this.$route.query ? this.$route.query.id : "";
  },
  computed: {
    nameLength: function() {
      return 20 - this.manuscript.name.length;
    },
    desLength: function() {
      return 150 - this.manuscript.description.length;
    }
  },
  methods: {
    saveManuscript() {
      var self = this;
      self.savingStatus = true;
      setTimeout(() => { self.savingStatus = false; }, 10000);
      Promise.all([
        new Promise(function(resolve, rej) {
          self.buildTemplateData(function(result) {
            resolve(result);
          });
        }),
        new Promise(function(resolve, rej) {
          self.autoGenerateImage(function(url) {
            resolve(url);
          });
        })
      ]).then(function(results, result) {
          let data = results[0];
          data.cover = results[1]
          return new Promise((resolve, reject) => {
            api.request(
              "updateManuscript",
              {
                id: self.manuscript.id,
                cover: data.cover,
                // content 中只保存站点相关的数据
                content: JSON.stringify({
                  config: data.config,
                  data: data.data,
                }),
                // pages 中保存各个页面的数据
                pages: JSON.stringify(data.pages),
                htmlData: data.htmlData,
                activityPluginControls: data.activityControls
              },
              retsult => resolve(retsult));
          });
        })
        .then(result => {
          if (result.status == 0) {
            Kdo.utils.messenger.success("稿件保存成功");
          } else {
            Kdo.utils.messenger.error(result.message);
          }
          self.savingStatus = false;
        });
    },
    getEmployeeList() {
      //获取人员列表
      let self = this;
      let _option = {
        pageIndex: 1,
        pageSize: 1000,
        state: 0
      };
      api.request("getEmployeeList", _option, result => {
        if (result.status == 0) {
          self.employees.list = result.data.list.map(function(item) {
            return {
              key: item.id,
              label: item.name + "\t" + item.phone,
              disabled: false
            };
          });
        }
      });
    },
    assignEmployee(manuscriptId, callback) {
      var self = this;
      //分派员工
      api.request(
        "assignEmployee",
        {
          manuscriptId: manuscriptId,
          distribution: 1,
          // range: self.employees.selectedList == self.employees.list ? 1 : 0,
          range: 1,
          employeeId: self.employees.selectedList
        },
        result => {
          callback(result);
        }
      );
    },
    releaseSetting() {
      var self = this;
      //发布设置弹框
      self.dialogOptions.visible = true;
      self.getEmployeeList();
      $("#templateImgInput").val("");
      // 自动生成封面图
      self.manuscript.cover = "";
      self.autoGenerateImage(function(url) {
        self.manuscript.cover = url;
      });
    },
    releaseManuscript() {
      var self = this,
        apiName,
        options = {},
        data = {},
        childWindow = null;
      Promise.all([
        new Promise(function(resolve, reject) {
          self.$refs["manuscript"].validate(valid => {
            if (valid) {
              self.releaseStatus = true;
              setTimeout(() => { self.releaseStatus = false; }, 10000);
              resolve();
            }
          });
        }),
        // new Promise(function(resolve, reject) {
        //   // 创建浏览器窗口
        //   Kdo.utils.asyncOpenWindow(_childWindow => {
        //     childWindow = _childWindow;
        //     resolve();
        //   });
        // }),
        new Promise(function(resolve, reject) {
          // 通过编辑器生成数据对象和目标接口
          self.buildTemplateData(function(result) {
            options = {
              name: self.manuscript.name,
              description: self.manuscript.description,
              cover: self.manuscript.cover,
              content: JSON.stringify({
                config: result.config,
                data: result.data
              }),
              pages: JSON.stringify(result.pages),
              htmlData: result.htmlData,
              activityPluginControls: result.activityControls
            };
            if (!!self.manuscript.id) {
              options = Object.assign({}, options, {
                id: self.manuscript.id
              });
            }
            if (localStorage.role == "2") {
              //设计师
              apiName = "createTemplate"; //生成模板
            } else {
              apiName = "releaseManuscript"; //发布稿件
            }
            resolve();
          });
        })])
        .then(function(results) {
          // 执行接口业务：生成模板或发布活动
          return new Promise((resolve, reject) => {
            api.request(apiName, options, result => {
              if (result.status == 0) {
                data = result.data;
                resolve(null)
              } else {
                reject(new Error(result.message));
              }
              // result.status != 0 ? reject(new Error(result.message == "模板名称重复" ? result.message : "发布失败，请重试！")) : resolve(null);
            });
          });
        })
        .then(function(cb) {
          return new Promise((resolve, reject) => {
            // 如果是非设计师角色，则进入员工分派流程
            if (localStorage.role != "2") {
              self.assignEmployee(data.id, result => {
                result.status != 0
                  ? reject(new Error("员工分派失败，请前往活动详情重新分派！"))
                  : resolve(null);
              });
            } else {
              resolve();
            }
          });
        })
        .then(function(err, cb) {
          Kdo.utils.messenger.success("活动发布成功！");

          createPreviewWindow(data.url,data.id);
          // 设置浏览器窗口的url
          // let _routeData = self.$router.resolve({
          //   name: "preview",
          //   query: { url: data.url }
          // });
          // childWindow.location = _routeData.href;
          self.dialogOptions.visible = false;
          self.releaseStatus = false;
        }).
        catch(err => {
          Kdo.utils.messenger.error(err.message);
          self.releaseStatus = false;
          // childWindow.close();
        });
    },
    autoGenerateImage(callback) {
      var self = this;
      self.$emit('takePhoto');
      //自动生成封面图片
      Kdo.domToImage.getImageUrl(Kdo.container.$body().parent(), function(url) {
        callback(url || "");
      });
    },
    // 上传封面
    uploadCover(event) {
      var self = this,
        target = event.currentTarget;
      var formData = new FormData($(target).parent()[0]);
      if (target.files[0].size > 3 * 1024 * 1024) {
        Kdo.utils.messenger.success("图片大小不超过3M哦");
        $(target).val("");
        return;
      }
      api.request("uploadFiles", formData, result => {
        if (result.status == 0) {
          self.manuscript.cover = result.data[0].file;
        } else {
          Kdo.utils.messenger.error("图片上传失败！");
        }
      });
    },
    btnPreview() {
      var self = this;
      //跳转操作
      // Kdo.utils.asyncOpenWindow(childWindow => {
        self.buildTemplateData(function(data) {
          api.request(
            "previewManuscript",
            {
              // 预览只发送id和htmlData 数据
              id: data.templateNumber,
              // content:JSON.stringify( {
              //   config: data.config,
              //   data: data.data,
              // }),
              // pages:JSON.stringify(data.pages),
              htmlData: data.htmlData
            },
            result => {
              // 打开窗口预览
              if (result.status == 0) {
                createPreviewWindow(result.data,data.templateNumber);
                // let _routeData = self.$router.resolve({
                //   name: "preview",
                //   query: { url: result.data }
                // });
                // childWindow.location.replace(_routeData.href);
              } else {
                Kdo.utils.messenger.error(result.message);
                // childWindow.close();
              }
            }
          );
        });
      // });
    },
    //生成稿件的数据对象
    buildTemplateData(callback) {
      var params = {
        templateNumber: Kdo.data.config.site.get().templateNumber,
        config: Kdo.data.config.site.get(),
        data: Kdo.data.site.controls,
        pages: Kdo.data.pages,
        activityControls: [],
        // goodsListByUUID: [],
        coverImg: "",
        isEditor: true
      };
      //var fileNumbers = [];
      _.each(params.pages, function(item) {
        if (item.number === Kdo.data.config.page.get().number) {
          item.config = Kdo.data.config.page.get();
          item.data = Kdo.data.page.controls;

          // filter activity control, cancat uuids
          Kdo.data.pages.forEach(function(page){
            page.data.forEach(function(controlConfig){
              if(controlConfig.pluginType) {
                var item = {
                  id: controlConfig.controlId,
                  type: null
                }
                switch(controlConfig.pluginType) {
                  case "form": item.type = 1; break;
                  case "draw": item.type = 2; break;
                  case "game": item.type = 3; break;
                }
                params.activityControls.push(item);
              }
            });
          });

          //filter goods control, concat uuids
          // _.each(Kdo.data.page.controls, function(controlConfig) {
          //   if (controlConfig.key == "plugin_shop") {
          //     params.goodsListByUUID = params.goodsListByUUID.concat(
          //       controlConfig.data.goodsUuid || []
          //     );
          //   }
          // });
        }
        //fileNumbers.push(item.number);
      });
      // callback(params);
      // 编译静态页面
      Kdo.page.release.page().then(function(content) {
        // _.each(fileResult, function(file, index) {
        //   params.pages[index] = !!params.pages[index]
        //     ? params.pages[index]
        //     : {};
        //   params.pages[index].htmlData = file.context;
        // });
        params.htmlData = content;
        callback(params);
      }).catch(function(err) {
        self.$message.error('编译静态页面出错');
      });
    },
    closeDialog() {
      this.dialogOptions.visible = false;
    }
  }
};
</script>
<style scoped>
.head_btn {
  height: 34px;
  width: 96px;
  font-size: 12px;
  border-radius: 0;
  background-color: #434476 !important;
  border-color: #434476 !important;
}

.setting_box {
  font-size: 14px;
}

.setting_box .textlength {
  position: absolute;
  right: 4px;
  font: normal 12px/28px "Microsoft YaHei";
  color: #c0c4cc;
  top: 23px;
}

.setting_box .sub-title {
  font-size: 12px;
  margin-top: 2px;
  color: #6e6e6e;
}

.setting_box .box_border {
  position: relative;
  width: 550px;
  height: auto;
  margin: 0 auto;
  border: 1px #c4ced8 solid;
  padding: 30px 15px;
}

.setting_box .box_border+.box_border {
  margin-top: 20px;
}

.setting_box .box_title {
  width: 86px;
  position: absolute;
  left: 16px;
  top: -13px;
  background: #fff;
  font-size: 16px;
  text-align: center;
}

.setting_box .basic_info .cover_box {
  width: 180px;
  height: 180px;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.setting_box .basic_info .replace_btn_div {
  width: 90px;
  height: 30px;
  left: 45px;
  bottom: 16px;
  position: absolute;
}

.setting_box .basic_info .replace_btn {
  width: 90px;
  height: 30px;
  border: 1px solid #77899c;
  background: #fff;
  border-radius: 2px;
  cursor: pointer;
}

.setting_box .basic_info .input_upload {
  width: 90px;
  height: 30px;
  position: absolute;
  top: 133px;
  left: 46px;
  opacity: 0;
  z-index: 1;
}

.setting_box .basic_info .info_box {
  width: 330px;
  height: 180px;
  position: relative;
}

.setting_box .basic_info .des_length {
  top: 155px;
  background-color: #fff;
  text-align: right;
  height: 20px;
}

.setting_box .manuscript_list .list {
  margin-top: 20px;
}

.icon-select {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url(../../assets/images/checkbox-icon.png);
  vertical-align: middle;
  margin-right: 5px;
}

.icon-select.active {
  background: url(../../assets/images/checkbox-icon.png) 0 16px;
}

.table-body {
  border: 1px solid #e3e3e3;
  height: 110px;
  overflow-y: scroll;
}

.table-row {
  width: 100%;
  height: 38px;
  line-height: 38px;
}

.table-cell {
  display: inline-block;
}

.border-bottom {
  border-bottom: 1px solid #e3e3e3;
}

.table-cell .icon-select {
  margin-left: 16px;
}

</style>
