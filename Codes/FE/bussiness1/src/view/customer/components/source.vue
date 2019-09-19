<template>
    <div class="forward-box">
        <el-table :data="tableData" border style="width: 100%" :header-cell-style="{background:'#F7FBFC'}" @sort-change="sortChangeHandler">
            <el-table-column prop="taskName" label="任务名称">
            </el-table-column>
            <el-table-column label="营销力积分">
                <template slot-scope="scope">
                    {{scope.row.power}}{{scope.row.rank == -1 ? '[暂无排名]': '[排名'+scope.row.rank+']'}}
                </template>
            </el-table-column>
            <el-table-column prop="browseCount" sortable label="带来曝光量">
            </el-table-column>
            <el-table-column prop="userCount" sortable label="带来客户数">
            </el-table-column>
            <el-table-column prop="serviceCount" sortable label="带来咨询量">
            </el-table-column>
            <el-table-column prop="orderCount" sortable label="带来成交量">
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
    name: "customer-detail-source",
    components: {
        pagination
    },
    props: {
        businessId: '',
        id: ''
    },
    data(){
        return{
            tableData: [],
            paginationOpt: {
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0,
                pageCount: 0
            },
            sorts: {} //带来曝光量(browseCount)/带来客户量(userCount)/带来咨询量(serviceCount)/带来成交量(orderCount),0:升序，1降序
        }
    },
    mounted() {
        this.getSourceData();
    },
    methods: {
        getSourceData(cb) {
            let self = this;
            api.request('taskPowerList', {
                "businessId": self.businessId,  
                "targetUserId": self.id,  
                "sorts": self.sort, 
                "pageIndex": self.paginationOpt.pageIndex, 
                "pageSize": self.paginationOpt.pageSize, 
            }, result => {
                if (result.status === 0) {
                    self.tableData = result.data.list;
                    self.paginationOpt.totalCount = result.data.totalCount;
                    self.paginationOpt.pageCount = Math.ceil(
                        self.paginationOpt.totalCount / self.paginationOpt.pageSize
                    );
                }
                !!cb && cb();
            })
        },
        //排序
        sortChangeHandler(orderBy) {
            let { order, prop } = orderBy;
            if (!!prop) {
                this.sorts[prop] = order === "descending" ? 1 : 0;
                this.getSourceData();
            }
        },
         //分页调用方法
        pagesFn(pageIndex, cb) {
            this.paginationOpt.pageIndex = pageIndex;
            this.getSourceData(cb);
        },
    }
}
</script>

<style scoped>
.forward-box{
    width: 95%;
    margin: 0 auto;
    margin-top: 30px;

}
.empty-list {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
}
</style>
