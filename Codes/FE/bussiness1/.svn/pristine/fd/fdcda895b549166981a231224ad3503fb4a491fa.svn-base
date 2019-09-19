<template>
  <div>
    <div class="search">
      <search placeholder="请输入商品名称进行搜索" @searchHandler="searchHander" :style="{ width: '320px'}">
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
    <div class="table">
      <el-table :header-cell-style="getRowClass"  :data="goodsDataList" stripe :default-sort="{prop: 'sumNum', order: 'descending'}"
        style="width: 100%">
        <el-table-column type="index" label="序号" align="center" width="180">
        </el-table-column>
        <el-table-column prop="title" label="商品名称" align="center" >
          <template slot-scope="scope">
            <img v-if="scope.row.image" :src="scope.row.image" @click="scaleImg(scope.row.image)"
              style="width:40px;height:40px;vertical-align:-16px;border-radius:20px;margin:5px;" />
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="browseCount" align="center" sortable label="商品浏览数">
          <template slot-scope="scope">
            {{scope.row.browseCount || '-'}}
          </template>
        </el-table-column>
        <el-table-column prop="orderCount" align="center" sortable label="商品购买数">
        </el-table-column>
      </el-table>
      <el-dialog v-if="imgScale.visible" :visible.sync="imgScale.visible" :center="true" @close="imgScale.visible = false;">
        <el-row style="height:auto;text-align:center;">
          <img :src="imgScale.src" style="width:auto;max-width:600px;height:auto;">
        </el-row>
      </el-dialog>
      <pagination v-if="goodsDataList"  :paginationOpt="pagination"
        @switchPage="pagesFn" />
    </div>
  </div>
</template>
<script>
import api from "api";
import navigator from "components/navigator";
import search from "components/com-search";
import pagination from "components/ui-pagination";
import httpConfig from "config/http";
export default {
    components:{
       navigator,
        search,
        pagination
    },
    data(){
        return{
            goodsDataList:[],
            keyWords:"",
            exportUrl:"",
            goodsPlugin:{
              businessId:localStorage.getItem("businessId"),
              taskId:this.$route.query.id,
              goodsName:'',
              pageIndex:1,
              pageSize:10
            },
            pagination: { 
              pageIndex: 1,
              pageSize: 10,
              totalCount: 1,
              pageCount: 0
            },
            imgScale: {
              //图片放大镜
              visible: false,
              src: ""
            }
        }
    },
    mounted(){
      this.getList()
    },
    methods:{
        getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return "background:#fafbff;"
            } else {
                return ""
            }
        },
        getList(cb){
          // businessId
          let self = this
          api.request("pluginGoods", self.goodsPlugin, result => {
          if(result.status==0){
              self.goodsDataList = result.data.goods
              self.pagination.totalCount = result.data.totalCount
              self.pagination.pageCount = Math.ceil(result.data.totalCount/self.goodsPlugin.pageSize) 
            }
          })
          !!cb && cb()
        },
        searchHander(data){
          this.goodsPlugin.goodsName = data;
          this.getList();
        },
        //投票列表数据分页调取
        pagesFn(pageIndex, cb) {
            let self = this;
            self.pagination.pageIndex = pageIndex;
            self.goodsPlugin.pageIndex = pageIndex
            self.getList(cb);
        },
        //图片放大镜
        scaleImg: function (img) {
          this.imgScale.src = img;
          console.log("图片路径",)
          this.imgScale.visible = true;
        },
        // 导出表格数据
        importExcel(){
          // this.importExcelUrl = httpConfig.apiHost +
          // "activity/plugin/price/excel?relationId=" +
          // this.goodsPlugin.taskId +
          // "&&session_id=" +
          // localStorage.getItem("sessionId");
          // location.href = this.importExcelUrl
        }
    }
}
</script>
<style scoped>
.export{
    height:34px;
    padding-right:10px;
    display: flex;
    justify-content: flex-end;
    margin:15px 0px;
  }
  
.export a:hover, a:focus{
    text-decoration: none;
  }
.search{
    text-align: right;
    padding: 20px 0px;
  }
.table{
    padding: 0 20px;
  }
</style>