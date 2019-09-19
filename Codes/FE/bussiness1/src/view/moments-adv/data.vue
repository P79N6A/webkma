<template>
    <div class="adv-data" style="padding-top:20px;">
        <div style="overflow:hidden;margin-bottom:20px;">
            <span class="pull-left" style="height: 34px;line-height: 34px; margin-right: 15px;">按推广名称筛选</span>
            <select class="pull-left form-control" style="width:230px;" v-model="currentMainId" @change="search">
                <option v-for="item in promotionList" :key="item.mainId" :value="item.mainId">{{item.activityName}}</option>
            </select>
        </div>
        <div class="data-overview" style="border:1px solid #e6e6e8;">
            <div class="overview-title">数据概览 <span v-if="!!totalReport.endTime">（以下数据更新至{{totalReport.endTime}}。实时数据仅供参考，请以前一日数据为准。）</span></div>
            <div class="overview-body" style="height:160px;">
                <div style="height:80px;">
                    <div class="pull-left" style="width:30%;border-right:1px solid #e6e6e8;text-align:center;">
                        <p class="font-14 black-light" style="margin-bottom:10px;">总金额（元）</p>
                        <p v-if="!!totalReport.extensionCost"><span class="font-36 red-light">{{totalReport.extensionCost}}</span><span class="font-14 black-light"> 元</span></p>
                        <p v-else><span class="font-36 red-light">--</span></p>
                    </div>
                    <div class="pull-left" style="width:68%;">
                        <table style="margin-left:20px;    width: 100%;">
                            <tr>
                                <td class="text-center" style="width:18%;">
                                    <p class="font-14 black-light" style="margin-bottom:20px;">曝光次数</p>
                                    <p><span class="font-24 red-light">{{totalReport.exposureCount || '--'}}</span></p>
                                </td>
                                <td class="text-center" style="width:18%;">
                                    <p class="font-14 black-light" style="margin-bottom:20px;">点击次数</p>
                                    <p><span class="font-24 red-light">{{totalReport.clickCount || '--'}}</span></p>
                                </td>
                                <td class="text-center" style="width:18%;">
                                    <p class="font-14 black-light" style="margin-bottom:20px;">点击率</p>
                                    <p v-if="!!totalReport.clickRate"><span class="font-24 red-light">{{totalReport.clickRate}}</span>%</p>
                                    <p v-else><span class="font-24 red-light">--</span></p>
                                </td>
                                <td class="text-center" style="width:18%;">
                                    <p class="font-14 black-light" style="margin-bottom:20px;">转化指标</p>
                                    <p><span class="font-24 red-light">{{totalReport.conversionIndex || '--'}}</span></p>
                                </td>
                                <td class="text-center" style="width:22%;">
                                    <p class="font-14 black-light" style="margin-bottom:20px;">转化成本</p>
                                    <p v-if="!!totalReport.conversionCost"><span class="font-24 red-light">{{totalReport.conversionCost}}</span><span class="font-14 black-light"> 元</span></p>
                                    <p v-else><span class="font-24 red-light">--</span></p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="data-overview" style="margin:20px 0;">
            <div class="overview-title" style="">关键指标趋势图</div>
            <div class="overview-body" style="height:160px;">
                
                
            </div>
        </div> -->
        <div style="height:60px;line-height:60px;">关键指标明细表</div>
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
            prop="totalShare"
            label="日期"
            align="center"
            width="300"
            show-overflow-tooltip>
            <template slot-scope="scope" >
                {{scope.row.startTime}} -- {{scope.row.endTime}}
            </template>
            </el-table-column>
            <el-table-column
            prop="extensionCost"
            label="花费（元）"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="exposureCount"
            label="曝光次数"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="clickCount"
            label="点击次数"
            align="center"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="clickRate"
            label="点击率"
            align="center"
            show-overflow-tooltip>
                <template slot-scope="scope" >
                    {{scope.row.clickRate}}%
                </template>
            </el-table-column>
            <el-table-column
            prop="conversionIndex"
            label="转化指标"
            align="center"
            show-overflow-tooltip>
                <template slot-scope="scope" >
                    {{scope.row.conversionIndex || '--'}}
                </template>
            </el-table-column>
            <el-table-column
            prop="conversionCost"
            label="转化成本"
            align="center"
            show-overflow-tooltip>
                <template slot-scope="scope" >
                    {{scope.row.conversionCost || '--'}}
                </template>
            </el-table-column>
            <el-table-column
            prop="advertisementDiagnosis"
            label="广告诊断"
            align="center"
            show-overflow-tooltip>
                <template slot-scope="scope" >
                    {{scope.row.advertisementDiagnosis || '--'}}
                </template>
            </el-table-column>
        </el-table>
         <pagination  v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
    </div>
</template>
<script>
import api from 'api';
import pagination from '../../components/ui-pagination';
export default {
    name: "adv-data",
    components: {
        pagination
    },
    data() {
        return {
            promotionList: [], //推广列表
            currentMainId: '', //当前选中的推广计划id
            list: [], //推广数据报告列表
            totalReport: {}, //数据报告总和
            paginationOpt: { //推广数据报告分页
                pageIndex: 1,
                pageSize: 10,
                totalCount:0,
                pageCount: 0
            }
        }
    },
    created(){
        let self = this;
        self.getMomentsAdvList(() => {
            self.getMomentsAdvDatatotal();
            self.getMomentsAdvDataList();
        });
    },
    methods: {
        //获取推广列表
        getMomentsAdvList( callback ) {
            let self = this;
            let _option = {
                state: '2,3',
                pageIndex: 1,
                pageSize: 1000
            }
            api.request("getMomentsAdvList", _option, (result) => {
                if (result.status == 0) {
                    self.promotionList = result.data.list;
                    self.currentMainId = self.promotionList[0].mainId;
                } else {
                    self.$message.error(result.message);
                }
                !!callback && callback();
            })
        },
        //获取推广数据报告总和
        getMomentsAdvDatatotal() {
            let self = this;
            let _option = {
                mainId: self.currentMainId,
            }
            api.request("getMomentsAdvDataTotal", _option, (result) => {
                if (result.status == 0) {
                    result.data.endTime = window.timeFormdate(result.data.endTime).substring(0, window.timeFormdate(result.data.endTime).length-3);
                    self.totalReport = result.data;
                } else {
                    self.$message.error(result.message);
                }
            })
        },
        //获取推广数据报告列表
        getMomentsAdvDataList(cb) {
            let self = this;
            let _option = {
                mainId: self.currentMainId,
                pageIndex: self.paginationOpt.pageIndex,
                pageSize: self.paginationOpt.pageSize
            }
            api.request("getMomentsAdvDataList", _option, (result) => {
                if (result.status == 0) {
                    $.each(result.data.list, (index, item) => {
                        item.startTime = window.timeFormdate(item.startTime).substring(0, window.timeFormdate(item.startTime).length-3);
                        item.endTime = window.timeFormdate(item.endTime).substring(0, window.timeFormdate(item.endTime).length-3);
                    })
                    self.list = result.data.list;
                    self.paginationOpt.totalCount = result.data.total;
                    self.paginationOpt.pageCount = Math.ceil(self.paginationOpt.totalCount / self.paginationOpt.pageSize);
                } else {
                    self.$message.error(result.message);
                }
                !!cb && cb();
            })
        },
        //分页调用方法
        pagesFn(pageIndex, cb) { 
            let _this = this;
            _this.paginationOpt.pageIndex = pageIndex;
            _this.getMomentsAdvDataList(cb);
        },
        search(){
            this.getMomentsAdvDatatotal();
            this.getMomentsAdvDataList();
        }
    }
}
</script>
<style>
.adv-data .form-control {
    border-radius: 0;
    border: 1px solid #bbbec3;
    box-shadow: none;
}
.adv-data .data-overview {
    border:1px solid #e6e6e8;
}
.data-overview .overview-title {
    height: 40px;
    line-height: 40px;
    background: #fafbff;
    padding-left: 15px;
    border-bottom: 1px solid #e6e6e8;
}
.data-overview .overview-body {
    padding-top:40px;
}
</style>

