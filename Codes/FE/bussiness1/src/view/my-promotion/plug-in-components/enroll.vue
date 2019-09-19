<template>
  <div>
    <div class="search">
      <el-select v-model="enrollCont.controlId" @change='getListChange' size="small" placeholder="请选择">
        <el-option v-for="item in labelData" :key="item.value" :label="item.name" :value="item.controlId">
        </el-option>
      </el-select>
      <search placeholder="请输入用户信息进行搜索" @searchHandler="searchHander" :style="{ width: '320px'}">
      </search>
    </div>
    <!-- <div class="export">
      <el-button
        @click="importExcel" 
        type="primary" 
        size="small" 
        style="width:130px;height:30px;margin-left: 4px; line-height:10px;"
        >
        <a target="_blank" style="color:#ffffff">
          <i class="iconfont icon-excel-out" style="color:#ffffff"></i>excel导出数据
        </a>   
      </el-button>
    </div> -->
    <el-table :data="formData" style="overflow-x:auto;" class="table" header-row-class-name="table-header"
      header-cell-class-name="table-header">
      <el-table-column :label="title" v-for="(title,index) in formDataTitle" :key="index" min-width="150"
        style="width:100%;">
        <template slot-scope="scope">
          <div v-if="index==0" class="flex_box">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content" v-if="scope.row[index].nickname" class="tooltip_box">{{scope.row[index].nickname}}
              </div>
              <img :src="scope.row[index].face" class="userFace">
              <span class="userInfo">{{scope.row[index].nickname}}</span>
            </el-tooltip>
          </div>
          <div v-else class="flex_box" v-for="(value,idx) in scope.row[index].text" :key="idx">
            <el-tooltip effect="dark" placement="top-start" v-if="value.text">
              <div slot="content" v-if="value.text" class="tooltip_box">{{value.text}}</div>
              <span class="userInfo" v-text="value.text"></span>
            </el-tooltip>
            <img :src="value.img" v-if="value.img" class="thumbnailImg" @click="scaleImg(value.img)">
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-if="imgScale.visible" :visible.sync="imgScale.visible" :center="true"
      @close="imgScale.visible = false;">
      <el-row style="height:auto;text-align:center;">
        <img :src="imgScale.src" style="width:auto;max-width:600px;height:auto;">
      </el-row>
    </el-dialog>
    <pagination v-if="pagination.pageCount > 1" class="pull-right pageination" :paginationOpt="pagination"
      @switchPage="pagesFn" />
  </div>
</template>
<script>
import api from "api";
import navigator from "components/navigator";
import search from "components/com-search";
import pagination from "components/ui-pagination";
import httpConfig from "config/http";
export default {
  components: {
    navigator,
    search,
    pagination
  },
  data() {
    return {
      formData: [], //表单数据
      formDataTitle: [], //表单数据标题
      keyWords: "",
      exportUrl: "",
      labelData: [],
      enrollCont: {
        relationId: this.$route.query.id,
        keywords: '',
        pageIndex: 1,
        pageSize: 6,
        controlId: ''
      },
      pagination: {
        pageIndex: 1,
        pageSize: 6,
        totalCount: 1,
        pageCount: 0
      },
      imgScale: {
        //图片放大镜
        visible: false,
        src: ""
      },
    }
  },
  mounted() {
    console.log(this.$route.query.id)
    this.getTempList();
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background:#fafbff;"
      } else {
        return ""
      }
    },
    //获取模板表单名称列表(1)
    getTempList() {
      let self = this
      new Promise((resolve, reject) => {
        api.request("getformList", { type: 1, relationId: self.enrollCont.relationId }, result => {
          if (result.status == 0) {
            self.labelData = result.data
            if (result.data[0]) {
              self.enrollCont.controlId = result.data[0].controlId
              resolve(result)
            }
          }
        })
      }).then(res => {
        self.getList();
      })
    },
    // 表单切换
    getListChange() {
      this.getList()
    },
    // 获取报名列表(2)
    getList: function (cb) {
      console.log("1", cb)
      let self = this
      api.request("getformData", self.enrollCont, result => {
        // if(result.status==0){
        //   self.formDataTitle = result.data.title
        //   self.formData = list
        //   self.pagination.totalCount = result.data.total
        //   self.pagination.pageCount = Math.ceil(result.data.total/self.enrollCont.pageSize) 
        // }
        if (result.status == 0 && !!result.data) {
          var list = [];
          result.data.list.forEach(function (element, index) {
            var item = [
              {
                face: element.face ? element.face : defaultHead,
                nickname: element.nickname
              }
            ];
            element.content.forEach(function (formItem, i) {
              if (
                formItem.type == "text_radio-option" ||
                formItem.type == "text_checkbox-option" ||
                formItem.type == "text_image-radio-option" ||
                formItem.type == "text_image-checkbox-option" ||
                formItem.type == "text_upload"
              ) {
                formItem.text = JSON.parse(formItem.text);
              } else {
                formItem.text = [
                  {
                    text: formItem.text
                  }
                ];
              }
              item.push(formItem);
            });
            list.push(item);
          });
          self.formData = list;
          console.log(self.formData)
          self.formDataTitle = result.data.title;
          self.pagination.totalCount = result.data.total;
          self.pagination.pageCount = Math.ceil(
            self.pagination.totalCount /
            self.enrollCont.pageSize
          );
        }
        !!cb && cb()
      })
    },
    searchHander(data) {
      this.enrollCont.keywords = data;
      this.getList()
    },
    //报名列表数据分页调取
    pagesFn(pageIndex, cb) {
      let self = this;
      self.pagination.pageIndex = pageIndex;
      self.enrollCont.pageIndex = pageIndex;
      console.log(cb);
      self.getList(cb);
    },
    //图片放大镜
    scaleImg: function (img) {
      this.imgScale.src = img;
      console.log("图片路径")
      this.imgScale.visible = true;
    },
    // 导出表格数据
    importExcel() {
      this.importExcelUrl = httpConfig.apiHost +
        "/activity/plugin/form/excel?relationId=" +
        this.enrollCont.relationId +
        "&&session_id=" +
        localStorage.getItem("sessionId");
      location.href = this.importExcelUrl
    }
  }
}
</script>
<style scoped>
.export {
  height: 34px;
  padding-right: 10px;
  display: flex;
  justify-content: flex-end;
  margin: 15px 0px;
}

.export a:hover,
a:focus {
  text-decoration: none;
}
.search {
  text-align: right;
  padding: 20px 0px;
}
.search .el-select {
  width: 150px;
  border-radius: 20px !important;
}
.table {
  padding: 0 20px;
}
.userFace {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: 8px;
}

.thumbnailImg {
  height: 25px;
  margin-right: 8px;
  margin-top: 2px;
}
.pageination {
  padding-right: 20px;
}
.userInfo {
  min-width: 150px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.flex_box {
  min-width: 150px;
  display: flex;
  align-self: center;
}
.tooltip_box {
  max-width: 400px !important;
}
</style>