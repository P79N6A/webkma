<template>
    <div>
       <pageTitle :pageTitle="pageTitleOpt" @search-event="search" />
       <div class="content-body">
         <el-table :data="marketingCampaign" @sort-change="sortChangeHandler" tooltip-effect="dark" style="width: 100%" row-key="id" class="table" header-row-class-name="table-header" header-cell-class-name="table-header">
                  <el-table-column label="活动名称"  width="300" prop="name" show-overflow-tooltip ></el-table-column>
                  <el-table-column label="发布时间"   width="200" prop="createTime" show-overflow-tooltip sortable="custom" align="center" class-name="number_color"></el-table-column>
                  <el-table-column label="累计推广分享数"  width="150" prop="totalShare" show-overflow-tooltip sortable="custom" align="center" class-name="number_color"></el-table-column>
                  <el-table-column label="累计推广访客数"  width="150" prop="totalVisitor" show-overflow-tooltip sortable="custom" align='center' class-name="number_color"></el-table-column>
                  <el-table-column label="累计推广浏览数"  width="150" prop="totalAccess" show-overflow-tooltip sortable="custom" align='center' class-name="number_color"></el-table-column>
                  <el-table-column label="操作"  prop="totalAccess" show-overflow-tooltip align='center'>
                    <template slot-scope="scope">
                      <i class="btn-plain"  @click="btnAction('detail',scope.row)">详情</i>
                      <i class="btn-plain"  @click="btnAction('preview',scope.row)">预览</i>
                      <i class="btn-plain btn-delete" @click="btnAction('delete',scope.row)">删除</i>
                    </template>
                  </el-table-column>
          </el-table>
          <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
       </div>
    </div>
</template>

<script>
import pageTitle from "components/page-title";
import pagination from 'components/ui-pagination';
import api from "api";
import {createPreviewWindow} from '../utils';

export default {
  components: {
        pageTitle,
        pagination
    },
  name:'marketing-campaign',
  data: function() {
    return {
      businessId:'',
      orderBys:[],
      marketingCampaign:[],
      pageTitleOpt: {
        text: "营销活动数据",
        search: {
          value: "",
          placeholder: "请输入关键词搜索"
        },
        showSearch: true
      },
      keyWords:'',
      paginationOpt: {
        pageIndex: 1,
        pageSize: 10,
        totalCount:0,
        pageCount: 0
        },
        deleteOptions: { //下载弹窗配置项
          width: '500', //弹窗宽度
          title: '确认删除',
          hasBtn: true, //是否需要确定按钮，默认没有确认按钮
          hasBtnTxt: '删除', //确认按钮自定义文本
          closeBtnTxt: '取消', //关闭弹窗按钮自定义文本
          closeBtn: true, //是否需要关闭按钮，默认没有确认按钮
        },
    };
  },
  mounted() {
    var self=this;
    self.businessId=localStorage.businessId;
    self.getManuscriptListOfRelease();
  },
  methods: {
    sortChangeHandler(orderBy){
        let {order,prop}=orderBy;
        if(!!prop){
            this.orderBys=[{
                [prop]:order==='descending'?'desc':'asc'
            }];
            this.getManuscriptListOfRelease();
        }
    },
    search(data){//搜索事件
    var self=this;
    self.keyWords=data;
    self.paginationOpt.pageIndex = 1;
    self.getManuscriptListOfRelease();
    },
    pagesFn(pageIndex, cb) { //分页调用方法
      let self = this;
      self.paginationOpt.pageIndex = pageIndex;
      self.getManuscriptListOfRelease(cb);
    },
    getManuscriptListOfRelease(cb){//获取已发布稿件列表
      var self=this;
      var obj={
        businessId:self.businessId,
        nameSearch:self.keyWords,
        orderBy:self.orderBys,
        pageIndex:self.paginationOpt.pageIndex,
        pageSize:self.paginationOpt.pageSize
      }
       api.request("getManuscriptListOfRelease", obj, result => {
          if(result.status==0){
            self.marketingCampaign=result.data.list;
            self.paginationOpt.totalCount=result.data.total;
            self.paginationOpt.pageCount= Math.ceil(
                self.paginationOpt.totalCount/self.paginationOpt.pageSize
            )
          }
          !!cb && cb();
       })
    },
   btnAction(action, item) {
     var self = this;
      switch (action) {
        case 'preview':
        // Kdo.utils.asyncOpenWindow(childWindow => {
        //     let routeData = self.$router.resolve({
        //       name: "preview",
        //       query: { url: item.url }
        //     });
        //     childWindow.location = routeData.href;
        //   });
          createPreviewWindow(item.url,item.id);
        break;
        case 'detail':
        Kdo.utils.asyncOpenWindow(childWindow => {
            let routeData = self.$router.resolve({
              name: "my-promotion-detail",
              query: { id: item.id }
            });
            childWindow.location = routeData.href;
          });
        break;
        case 'delete':
        self.$confirm('确定删除当前活动吗?', '提示', {
          center: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          //type: 'warning'
        }).then(() => {
            api.request('deleteManuscript', {
                id: item.id
            })
            .then(function(result) {
                    if (result.status == 0) {//
                    self.$message({
                        message: '操作成功!',
                        type: 'success'
                    });
                    self.getManuscriptListOfRelease();
                    } else {
                    self.$message.error(result.message || '操作失败!')
                    }
                })
                .catch(function(error) {
                    self.$message.error(error.message)
                });
        })
        break;
        }
      }
   }
  
};
</script>
<style scoped>
.content-body{
  padding: 0 40px;
  margin-top: 30px;
  color:#63717b;
}
</style>


