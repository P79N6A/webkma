<template>
    <div class="adv-promotion-management" style="padding-top:20px;">
        <div style="overflow:hidden;margin-bottom:20px;">
            <span class="pull-left" style="height: 34px;line-height: 34px; margin-right: 15px;">搜索范围</span>
            <select class="pull-left form-control" style="width:130px;" v-model="state" @change="searchFn">
                <option value="2">推广中</option>
                <option value="0">审核中</option>
                <option value="1">审核失败</option>
                <option value="3">已结束</option>
            </select>
            <div class="pull-left">
                <el-date-picker
                    format="yyyy/MM/dd"
                    size="small"
                    v-model="actTime"
                    type="daterange"
                    @change="chooseDate"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <input type="text" class="pull-left form-control" style="width:220px;" placeholder="请输入推广计划名称进行搜索" v-model="search">
            <span style="display:inline-block;width:100px;height:34px;line-height:34px;background:#01bacf;border-radius:0 4px 4px 0;text-align:center;color:#fff;cursor:pointer;" @click="searchFn">搜索</span>
            <el-button class="pull-right" type="primary" size="small" @click="jumpToCreat()">创建推广计划</el-button>
        </div>
        <el-table
            ref="promotionTable"
            :data="list"
            tooltip-effect="dark"
            style="width: 100%"
            row-key="id"
            class="table"
            header-row-class-name="table-header"
            header-cell-class-name="table-header">
            <el-table-column
            label="推广计划"
            width="200">
            <template slot-scope="scope" >
                <div>
                    <img class="img pull-left" :src="scope.row.cover" />
                    <span v-text="scope.row.activityName" style="display:table-cell;height:80px;line-height:1.2158;vertical-align:middle;"></span> 
                </div>
            </template>
            </el-table-column>
            <el-table-column
            prop="targetName"
            label="推广目标"
            align="center"
            class-name="number_color"
            width="110">
            </el-table-column>
            <el-table-column
            prop="buyWayName"
            label="购买类型"
            align="center"
            class-name="number_color"
            show-overflow-tooltip
            width="100"
            >
            </el-table-column>
            <el-table-column
            prop="totalShare"
            label="投放时间"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope" >
                <div>
                    <p style="line-height:1.2158;">{{scope.row.timeOnline}}</p>
                    <p style="line-height:1.2158;">-</p>
                    <p style="line-height:1.2158;">{{scope.row.timeOffline}}</p>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            prop="budget"
            label="广告预算"
            align="center">
            </el-table-column>
            <el-table-column
            prop="extensionCost"
            label="花费"
            align="center">
            </el-table-column>
            <el-table-column
            prop="clickCount"
            label="点击次数"
            width="70"
            align="center">
            </el-table-column>
            <el-table-column
            prop="exposureCount"
            label="曝光次数"
            width="70"
            align="center">
            </el-table-column>
            <el-table-column
            prop="clickRate"
            label="点击率"
            align="center"
            width="70">
                <template slot-scope="scope" >
                    {{scope.row.clickRate}}{{!!scope.row.clickRate ? '%': ''}}
                </template>
            </el-table-column>
            <el-table-column
            prop="conversionIndex"
            label="转化指标"
            align="center"
            width="70">
            </el-table-column>
            <el-table-column
            prop="conversionCost"
            label="转化成本"
            align="center">
            </el-table-column>
            <el-table-column
            label="操作"
            align="center"
            width="80">
            <template slot-scope="scope">
                <i class="btn-plain" v-if="state == '1'" @click="jumpToCreat(scope.row.mainId)">重新编辑</i>
            </template>
            </el-table-column>
        </el-table>
         <pagination  v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
    </div>
</template>
<script>
import pagination from '../../components/ui-pagination';
import api from 'api';
export default {
    name: "adv-promotion-management",
    components: {
        pagination
    },
    data() {
        return {
            state: "0", //审核状态 0正常, 1失败, 2审核通过, 3已结束
            search: "", //搜索词
            actTime: [], //时间选择器数组
            timeOnline: '', //投放日期起始
            timeOffline: '', //投放日期结束
            list: [],//列表数据
            paginationOpt: {
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0,
                pageCount: 0
            }
        }
    },
    mounted() {
        this.getPromotionList();
    },
    methods: {
        //获取推广列表数据
        getPromotionList(cb) {
            let self = this;
            let _option = {
                state: self.state,
                search: self.search,
                timeOnline: self.timeOnline,
                timeOffline: self.timeOffline,
                pageIndex: self.paginationOpt.pageIndex,
                pageSize: self.paginationOpt.pageSize
            }
            api.request("getMomentsAdvList", _option, (result) => {
                if (result.status == 0) {
                    self.list = result.data.list;
                    self.paginationOpt.totalCount = result.data.total;
                    self.paginationOpt.pageCount = Math.ceil(self.paginationOpt.totalCount / self.paginationOpt.pageSize);
                } else {
                    self.$message.error(result.message);
                }
                !!cb && cb();
            })
        },
        //选择时间
        chooseDate(){
            let self = this;
            this.timeOnline = !!self.actTime ? window.timeFormdate(self.actTime[0]) : '';
            this.timeOffline = !!self.actTime ? window.timeFormdate(self.actTime[1]) : '';
        },
        //搜索
        searchFn() {
            this.paginationOpt.pageIndex = 1;
            this.getPromotionList();
        },
        //分页调用方法
        pagesFn(pageIndex, cb) { 
            let _this = this;
            _this.pagination = pageIndex;
            _this.getPromotionList(cb);
        },
        //跳转至创建推广
        jumpToCreat(id){
            let param = !!id ? '?id=' + id : '';
            this.$router.push({
                path: '/add-moments-adv' + param
            });
        }
    }
}
</script>
<style>
.adv-promotion-management .form-control {
    border-radius: 0;
    border: 1px solid #bbbec3;
    box-shadow: none;
}
.adv-promotion-management .el-date-editor--daterange.el-input, 
.adv-promotion-management .el-date-editor--daterange.el-input__inner, 
.adv-promotion-management .el-date-editor--timerange.el-input, 
.adv-promotion-management .el-date-editor--timerange.el-input__inner{
    width: 260px;
    height: 34px;
    border-radius: 0;
    border-color: #bbbec3;
    border-left-color: transparent;
    border-right-color: transparent;
}
.adv-promotion-management .el-range-editor--small .el-range-input {
    width: 90px !important;
}
.adv-promotion-management .el-date-editor .el-range__close-icon{
    font-size: 16px;
    color: #dfe6ec;
}
.adv-promotion-management .el-button--primary{
    padding: 10px 15px;
}
.adv-promotion-management .el-table td{
    height: 80px;
}
.adv-promotion-management .el-table td .img{
    width: 60px;
    height: 60px;
    margin: 10px 5px 0 0;
}
</style>

