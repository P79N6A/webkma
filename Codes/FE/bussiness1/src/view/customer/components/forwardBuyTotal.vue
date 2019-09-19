<template>
    <div class="forward-box">
        <p class="title">累计商品浏览数：<span style="margin-right: 10px;">{{forwardData.totalGoodsBrowse}}</span>   累计商品销量：<span style="margin-right: 10px;">{{forwardData.totalGoodsAmount}}</span></p>
        <el-table :data="forwardData.list" border style="width: 100%"  :header-cell-style="{background:'#F7FBFC'}">
            <el-table-column prop="taskName" label="任务名称">
            </el-table-column>
            <el-table-column prop="goodsName" label="商品名称">
            </el-table-column>
            <el-table-column prop="amount" label="商品销量">
            </el-table-column>
        </el-table>
        <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt"
              @switchPage="pagesFn" />
    </div>
</template>

<script>
import api from 'api';
import pagination from "../../../components/ui-pagination";
export default {
   name: "forward-buy-goods",
    components: {
        pagination
    },
    props: {
        businessId: '',
        id: '',
        type: ''
    },
    data(){
        return{
            forwardData: {},
            paginationOpt: {
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0,
                pageCount: 0
            }
        }
    },
    mounted() {
        this.taskForwardList();
    },
    methods: {
        taskForwardList(cb) {
            let self = this;
            api.request('getForwardGoodsList', {
                "businessId": self.businessId,  
                "targetUserId": self.id,  
                "pageIndex": self.paginationOpt.pageIndex, 
                "pageSize": self.paginationOpt.pageSize, 
            }, result => {
                if (result.status === 0) {
                    self.forwardData = result.data;

                    self.paginationOpt.totalCount = result.data.totalCount;
                    self.paginationOpt.pageCount = Math.ceil(
                        self.paginationOpt.totalCount / self.paginationOpt.pageSize
                    );
                }
                !!cb && cb();
            })
        },
         //分页调用方法
        pagesFn(pageIndex, cb) {
            this.paginationOpt.pageIndex = pageIndex;
            this.taskForwardList(cb);
        }
    }
}
</script>

<style scoped>
.forward-box{
    width: 95%;
    margin: 0 auto;
    margin-top: 30px;

}
.title{
    color: #3C4A55;
    font-size: 12px;
    padding-bottom: 10px;
}
.title span{
    color: #F68411;
}
</style>
