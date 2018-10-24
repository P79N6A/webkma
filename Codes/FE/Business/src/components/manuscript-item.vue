<template>
    <div class="pull-left tpl-column" :class="{'on': data && data.enable == 0}">
      <!-- Create -->
      <div v-if="options.category == 'create'">
          <div style="cursor:pointer;" @click="btnCreate()">
              <div class="tpl-panel">
                  <div style="padding-top:80px; padding-bottom:40px;">
                      <img style="width: 50px; height: 50px;" src="../assets/images/add.png">
                  </div>
                  <div class="font-14 black-deep">新建营销活动</div>
              </div>
              <div class="title-desc"></div>
          </div>
      </div>
      <!-- Detail -->
      <div v-if="options.category == 'detail'">
        <div class="tpl-panel">
            <div class="image-box" :style="{backgroundImage: data.cover ? `url('${data.cover}')` : false, backgroundPosition: data.cover ? 'top' : false }">
            </div>
            <div class="tpl-cover" v-if="data && data.enable != 0">
                <div style="margin-top:40px; margin-bottom: 35px;">
                    <img v-if="data.type===3" class="weapp-qrcode" :src="data.codeUrl || '/static/images/logo-white.png'">
                    <div v-else class="normal-qrcode" data-qrcode-panel="true"></div>
                </div>
                <div>
                    <table style="margin: 0 auto;">
                        <tr>
                            <td class="btn-action" :style="{'margin-right': (index+1 != options.actions.length) ? '20px': false}" 
                              @click="btnAction(actionEnums[key].type, data)" 
                              v-for="(key, index) in options.actions" :key="key">
                                <i :class="actionEnums[key].icon" style="width:30px;height:30px;background-size:100%;"></i>
                                <p>{{actionEnums[key].name}}</p>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="tpl-cover" v-else>
                <!-- <div style="padding-top:86px; padding-bottom:40px;">
                  <img style="width: 60px; height: 60px;" src="../assets/images/warn.png">
                </div> -->
                <div style="color: #fff; padding-top:120px; padding-bottom:40px;">当前活动已被禁用</div>
                <div>
                    <table style="margin: 0 auto;">
                        <tr>
                          <td class="btn-action" @click="btnAction('delete', data)">
                              <i class="icon-tpl-delete" style="width:30px;height:30px;background-size:100%;"></i>
                              <p>删除</p>
                          </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="title-desc" :title="data.name">
          <p style="width:180px; height:34px; line-height:34px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; " class="font-14 black-deep">{{data.name}}</p>
          <p class="attrs" v-if="data.useTotal != null">
            <i class="el-icon-view" style="font-size: 14px; margin-right: 4px;"></i>
            <span>{{data.useTotal}}</span>
          </p>
          <p class="attrs" v-else>
            <span>{{data.operatorDate | dataFormat}}</span>
          </p>
        </div>
      </div>
      <!--二维码设置选择已发布活动处使用-->
      <div v-if="options.category == 'qrcode'" class="qrcode-item" :class="[data.active ? 'active': '']" @click="selectH5(data)">
        <div class="tpl-panel">
            <div class="image-box" :style="{backgroundImage: data.cover ? `url('${data.cover}')` : false, backgroundPosition: data.cover ? 'top' : false }">
            </div>
        </div>
        <div class="title-desc" :title="data.name">
          <p style="width:180px; height:34px; line-height:34px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; " class="font-14 black-deep">{{data.name}}</p>
          <p class="attrs" v-if="data.useTotal != null">
            <i class="el-icon-view" style="font-size: 14px; margin-right: 4px;"></i>
            <span>{{data.useTotal}}</span>
          </p>
          <p class="attrs" v-else>
            <span>{{data.operatorDate | dataFormat}}</span>
          </p>
        </div>
      </div>
    </div>
</template>
<script>
import api from "api";
import moment from "moment";
import {createPreviewWindow} from '../utils';
export default {
  name: "manuscript-item",
  props: {
    data: {},
    options: {
      category: "detail", // create | detail
      actions: ["preview", "use"] // preview, edit, delete, use
    }
  },
  data() {
    return {
      actionEnums: {
        use: { name: "使用", type: "use", icon: "icon-tpl-use" },
        delete: { name: "删除", type: "delete", icon: "icon-tpl-delete" },
        edit: { name: "修改", type: "edit", icon: "icon-tpl-edit" },
        detail: { name: "详情", type: "detail", icon: "icon-tpl-detail" },
        preview: { name: "预览", type: "preview", icon: "icon-tpl-preview" }
      }
    };
  },
  filters: {
    dataFormat(date) {
      return moment(date).format("YYYY.MM.DD");
    }
  },
  mounted() {
    var self = this;
    this.createQrcode();
  },
  updated(){
    // this.createQrcode();
  },
  methods: {
    
    btnAction(action, item) {
      var self = this;
      switch (action) {
        case "preview":
          // Kdo.utils.asyncOpenWindow(childWindow => {
          //   let routeData = self.$router.resolve({
          //     name: "preview",
          //     query: { url: item.url }
          //   });
          //   childWindow.location.replace(routeData.href);
          // });
          createPreviewWindow(item.url,item.id);
          self.$emit("manuscript-item-event", { action: action, data: item });
          break;
        case "edit":
          Kdo.utils.asyncOpenWindow(childWindow => {
            var routeData = self.$router.resolve({
              name: "design",
              query: { id: item.id }
            });
            childWindow.location = routeData.href;
          });
          self.$emit("manuscript-item-event", { action: action, data: item });
          break;
        case "delete":
          this.$confirm("此操作将永久删除该项目，是否继续？", "提示", {
            center: true,
            confirmButtonText: "删除",
            cancelButtonText: "取消"
          })
            .then(() => {
              self.btnDelete(item.id, function() {
                self.$emit("manuscript-item-event", {
                  action: action,
                  data: item
                });
              });
            })
            .catch(() => {});
          break;
        case "use":
          self.btnCreate(item.id, function(newId) {
            self.$emit("manuscript-item-event", {
              action: action,
              data: item,
              newId: newId
            });
          });
          break;
        case "detail":
          Kdo.utils.asyncOpenWindow(childWindow => {
            let routeData = self.$router.resolve({
              name: "my-promotion-detail",
              query: { id: item.id }
            });
            childWindow.location.replace(routeData.href);
          });
          self.$emit("manuscript-item-event", { action: action, data: item });
          break;
      }
    },
    btnCreate(templateId, callback) {
      var self = this;
      Kdo.utils.asyncOpenWindow(childWindow => {
        api.request(
          "createManuscript",
          {
            refSourceId: templateId || null
          },
          function(result) {
            if (result.status !== 0) {
              Kdo.utils.messenger.error(result.message);
              childWindow.close();
            } else {
              let routeData = self.$router.resolve({
                name: "design",
                query: { id: result.data.id }
              });
              childWindow.location = routeData.href;
            }
            callback && callback(result.data.id);
          },
          function(err){
              Kdo.utils.messenger.error(err.message);
              childWindow.close();
          }
        );
      });
    },
    btnDelete(templateId, callback) {
      var self = this;
      api.request(
        "deleteManuscript",
        {
          id: templateId || null
        },
        function(result) {
          if (result.status !== 0) {
            Kdo.utils.messenger.error(result.message);
          } else {
            Kdo.utils.messenger.success("删除成功");
          }
          callback && callback();
        }
      );
    },
    createQrcode(){
      if(!!this.data&&this.data.type!==3){
        let url= this.data.url;
        url = /^(http|https):/i.test(url) ? url : location.protocol+'//'+url;
        let qrcode = new QRCode(this.$el.querySelector('.normal-qrcode'), {
          text: url,
          width: 100,
          height: 100,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });
      }
    },
    //此方法为二维码选择已发布活动处使用
    selectH5(item){
      this.$emit("manuscript-item-event", item);
    }
  }
};
</script>
<style scoped>
.tpl-table {
  margin-left: 50px;
  margin-right: 50px;
  margin-top: 30px;
}
.tpl-table .tpl-column {
  position: relative;
  margin: 30px 0px 0px 40px;
  width: 200px;
  height: 265px;
  border: 1px solid #ebf0fa;
  box-sizing: border-box;
}
.tpl-table .tpl-column:hover {
  box-shadow: 0 0 8px 2px #dedede;
}
.tpl-table .tpl-column .tpl-panel {
  height: 263px;
  text-align: center;
  position: relative;
}
.tpl-table .tpl-column .tpl-panel .tpl-cover {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  left: 0;
  top: 0;
  display: none;
  z-index: 2;
}
.tpl-table .tpl-column.on .tpl-panel .tpl-cover {
  display: block;
}
.tpl-table .tpl-column .tpl-panel .tpl-cover .btn-action {
  float: left;
  color: white;
  cursor: pointer;
}
.tpl-table .tpl-column .tpl-panel .tpl-cover .btn-action i {
  width: 50px;
  height: 50px;
  display: inline-block;
}
.tpl-table .tpl-column .tpl-panel .tpl-cover .btn-action i.icon-tpl-preview {
  background-image: url("../assets/images/preview.png");
}
.tpl-table
  .tpl-column
  .tpl-panel
  .tpl-cover
  .btn-action
  i.icon-tpl-preview:hover {
  background-image: url("../assets/images/preview-on.png");
}
.tpl-table .tpl-column .tpl-panel .tpl-cover .btn-action i.icon-tpl-use {
  background-image: url("../assets/images/use.png");
}
.tpl-table .tpl-column .tpl-panel .tpl-cover .btn-action i.icon-tpl-use:hover {
  background-image: url("../assets/images/use-on.png");
}
.tpl-table .tpl-column .tpl-panel .tpl-cover .btn-action i.icon-tpl-detail {
  background-image: url("../assets/images/edit.png");
}
.tpl-table
  .tpl-column
  .tpl-panel
  .tpl-cover
  .btn-action
  i.icon-tpl-detail:hover {
  background-image: url("../assets/images/edit-on.png");
}
.tpl-table .tpl-column .tpl-panel .tpl-cover .btn-action i.icon-tpl-edit {
  background-image: url("../assets/images/edit.png");
}
.tpl-table .tpl-column .tpl-panel .tpl-cover .btn-action i.icon-tpl-edit:hover {
  background-image: url("../assets/images/edit-on.png");
}
.tpl-table .tpl-column .tpl-panel .tpl-cover .btn-action i.icon-tpl-delete {
  background-image: url("../assets/images/delete.png");
}
.tpl-table
  .tpl-column
  .tpl-panel
  .tpl-cover
  .btn-action
  i.icon-tpl-delete:hover {
  background-image: url("../assets/images/delete-on.png");
}
.tpl-table .tpl-column .tpl-panel .tpl-cover .btn-action p {
  margin-top: 10px;
}
.tpl-table .tpl-column:hover .tpl-panel .tpl-cover {
  display: block;
}
.tpl-table .tpl-column .tpl-panel .image-box {
  width: 100%;
  height: 200px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url("../assets/images/cover-empty.jpg");
}
.tpl-table .tpl-column .title-desc {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 65px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 6px 10px;
  font-size: 14px;
}
.tpl-table .tpl-column .title-desc .attrs {
  font-size: 12px;
  color: #9eabb8;
}
.tpl-table .weapp-qrcode,
.tpl-table .normal-qrcode{
  width: 110px;
  height: 110px;
  margin: auto;
  background-color: #fff;
  padding: 5px;
}
.qrcode-item.active {
  border: 1px solid #00BAD0;
  background: url(../assets/images/design/h5_selected_icon.png) right bottom no-repeat;
}
</style>