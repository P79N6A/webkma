<template>
    <el-container>
        <el-header class="clear-padding">
            <pageTitle :pageTitle="pageTitleOpt" @search-event="search" />
        </el-header>
        <el-main style="padding: 0 40px;">
            <el-row style="height:30px; line-height:30px; margin:10px 0; box-sizing: border-box; padding-left: 9px;">
                <span>
                    <el-checkbox v-model="selectAll" @change="selectallFn">
                        <span class="btn-plain black-deep font-14" style="margin-right: 10px;">全选</span>
                    </el-checkbox>
                </span>
                <span class="btn-plain color-blue font-14" v-if="selectionData.length > 0" @click="batchOption('1')">加入黑名单</span>
                <span class="btn-plain color-blue font-14 btn-disabeld" v-else>加入黑名单</span>
                <span class="btn-plain color-blue font-14" v-if="selectionData.length > 0" @click="batchOption('0')">移出黑名单</span>
                <span class="btn-plain color-blue font-14 btn-disabeld" v-else>移出黑名单</span>
                <span class="btn-plain color-blue font-14" @click="smsSend()">发送短信</span>
                <span class="btn-plain btn-delete color-red font-14" v-if="selectionData.length > 0" @click="batchRemove()">删除</span>
                <span class="btn-plain btn-delete color-red font-14 btn-disabeld" v-else>删除</span>
            </el-row>
            <el-table
                ref="customerTable"
                :data="list"
                tooltip-effect="dark"
                style="width: 100%"
                row-key="id"
                class="table"
                header-row-class-name="table-header"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
                @sort-change="sortChangeHandler">
                <el-table-column
                prop="active"
                width="55">
                    <template slot-scope="scope" >
                        <el-checkbox v-model="scope.row.active" @change="handleSelectionChange"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column
                label="客户"
                show-overflow-tooltip
                width="150">
                <template slot-scope="scope" >
                    <img class="headImg" :src="scope.row.userFace" />
                    <span v-text="scope.row.nickname"></span> 
                </template>
                </el-table-column>
                <el-table-column
                prop="mobile"
                label="绑定手机号"
                align="center"
                width="150">
                </el-table-column>
                <el-table-column
                prop="joinNumber"
                label="参与活动数"
                align="center"
                sortable="custom"
                width="120"
                show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                prop="activityName"
                label="客户来源"
                align="center"
                width="160">
                </el-table-column>
                <el-table-column
                prop="staffName"
                label="首次推广人员"
                align="center"
                width="180">
                </el-table-column>
                <el-table-column
                prop="state"
                label="状态"
                align="center"
                width="80"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <slideBtn :slideBtnOpt="scope.row" :inactiveText="'拉黑'"  @slide-event="batchOption" />
                </template>
                </el-table-column>
                <el-table-column
                label="操作"
                align="center"
                show-overflow-tooltip>
                <template slot-scope="scope">
                    <i class="btn-plain" @click="detail(scope.row)">详情</i>
                    <i class="btn-plain" @click="openPhoneDialog(scope.row)">预留手机号</i>
                    <i class="btn-plain btn-delete" @click="singleRemove(scope.row)">删除</i>
                </template>
                </el-table-column>
            </el-table>
            <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
        </el-main>
    
        <el-dialog title="预留手机信息" v-if="dialogData.dialogTableVisible" :visible.sync="dialogData.dialogTableVisible" :center="true" :width="'500px'" @close="closeDialog">
            <el-row style="border:1px solid transparent;">
                <el-row>
                    <custom-scroll v-if="dialogData.gridData.length > 0" height="199px" :options="{scrollX: false, scrollY: true, scrollbars: true, preventDefault: false}" @scroll-end="loadMorePhone"  :refresh="'refreshScroll'" style="flex-grow: 1;">
                        <el-table
                        class="table" 
                        :data="dialogData.gridData"
                        header-row-class-name="table-header"
                        header-cell-class-name="table-header">
                            <el-table-column property="activityName" label="参与活动" align="center" width="240"></el-table-column>
                            <el-table-column property="phone" label="手机号" align="center"></el-table-column>
                        </el-table>
                    </custom-scroll > 
                    <div v-else :span="24" style="height: 40px; line-height: 40px; text-align: center;">
                        暂无数据
                    </div>
                </el-row>
            </el-row>
        </el-dialog>
        
    </el-container>
</template>

<script>
import pageTitle from "../../components/page-title";
import slideBtn from "../../components/slide-btn";
import pagination from '../../components/ui-pagination';
import api from 'api';
import defaultHead from '../../assets/images/default-headImg.png';
import eventBus from '../../utils/eventBus';

export default {
    components: {
        pageTitle,
        slideBtn,
        pagination
    },
    name: 'employee-management',
    data: function() {
        return {
            pageTitleOpt: {
                text: '客户列表',
                search: {
                    value: '',
                    size: '350px',
                    placeholder: '请输入微信昵称/绑定手机号/推广人员进行搜索'
                },
                showSearch: true
            },
            paginationOpt: {//列表分页参数
                pageIndex: 1,
                pageSize: 10,
                totalCount:0,
                pageCount: 0
            },
            keyWords: '',
            list: [],
            order: 'desc', //排序参数
            dialogData: {//预留手机号弹窗数据
                dialogTableVisible: false,
                gridData: [],
                pagination: {//预留手机号分页参数
                    total: '',
                    pageIndex: 1,
                    pageSize: 5,
                    dataMore: true
                },
                currentUserId: ''
            },
            selectionData: [],//选中的客户
            selectAll: false //全选
        };
    },
    mounted() {
        this.getCustomerList();
    },
    methods: {
        //获取员工列表
        getCustomerList(cb) {
            let _this = this;
            let _option = {
                pageIndex: _this.paginationOpt.pageIndex,
                pageSize: _this.paginationOpt.pageSize,
                keyWords: _this.keyWords,
                order: _this.order 
            }
            api.request("customerList", _option, (result) => {
                if (result.status == 0) {
                    $.each(result.data.list, (index, item) => {
                        item.userFace=item.face || defaultHead;
                        item.active = false;
                    })
                    _this.list = result.data.list;
                    _this.paginationOpt.totalCount = result.data.total;
                    _this.paginationOpt.pageCount = Math.ceil(_this.paginationOpt.totalCount / _this.paginationOpt.pageSize);
                } else {
                    _this.myMessage.error(result.message);
                }
                !!cb && cb();
            })
        },
        //搜索
        search(data) {
            this.keyWords = data;
            this.paginationOpt.pageIndex = 1;
            this.getCustomerList();
        },
        //分页调用方法
        pagesFn(pageIndex, cb) { 
            let _this = this;
            _this.paginationOpt.pageIndex = pageIndex;
            _this.getCustomerList(cb);
        },
        //排序
        sortChangeHandler(orderBy){
            let {order,prop}=orderBy;
            if(!!prop){
                this.order = order === 'descending'?'desc':'asc';
                this.getCustomerList();
            }
        },
        // //全选
        selectallFn(){
            this.list.forEach((item) => {
                item.active = this.selectAll;
            });
            this.handleSelectionChange();
        },
        //选择时，获取选中的数据对象
        handleSelectionChange() {
            this.selectionData = this.list.filter((item) => { return item.active == true; });
            if(this.selectionData.length == this.list.length) {
                this.selectAll = true;
            } else {
                this.selectAll = false;
            }
        },
        //获取当前选中的客户的手机号数组
        getSelectedPhoneList() {
            let phoneList = [];
            if(!!this.selectionData && this.selectionData.length>0){
                phoneList = this.selectionData.map(item=>item.mobile);
            }
            return phoneList;
        },
        //获取当前选中的对象id数组
        getSelectIds() {
            let ids = [];
            if(!!this.selectionData && this.selectionData.length>0){
                ids = this.selectionData.map(item=>item.id);
            }
            return ids;
        },
        //删除单个客户
        singleRemove(item) {
            let ids = [item.id];
            this.removeCustomer(ids);
        },
        //批量删除
        batchRemove(item) {
            let ids = this.getSelectIds();
            if (ids.length == 0) {
                this.$message({type:'warning',message: '请选择客户！'});
                return false;
            }
            this.removeCustomer(ids);
        },
        //删除客户
        removeCustomer(ids) {
            let _this = this;
            this.$confirm("确定删除对应客户?", "提示", {
                center: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            })
            .then(() => {
                api.request('customerDelete', {
                    ids: ids
                })
                .then(function(result) {
                        if (result.status == 0) {//
                        _this.$message({
                            message: '操作成功!',
                            type: 'success'
                        });
                        _this.getCustomerList();
                        } else {
                            _this.$message.error(result.message || '操作失败!')
                        }
                    })
                    .catch(function(error) {
                        _this.$message.error(error.message)
                    });
            })
        },
        //设置黑名单
        batchOption(data) {
            let _this = this,
            _data = {
                ids: [],
                field: 'state',
                value: ''
            };

            if(typeof data === 'string'){//批量设置
                let ids = this.getSelectIds();
                if (ids.length == 0) {
                    this.$message({type:'warning',message: '请选择客户！'});
                    return false;
                }
                _data.ids = ids;
                _data.value = data;
            } else {//修改单个客户
                _data.ids = [data.id];
                _data.value = data.state; 
            }

            api.request('customerModify', _data)
                .then(function(result) {
                    if (result.status == 0) {
                        _this.$message({
                            message: '操作成功!',
                            type: 'success'
                        });
                        _this.getCustomerList();
                    } else {
                        _this.$message.error(result.message || '操作失败!')
                    }
                })
                .catch(function(error) {
                    _this.$message.error(error.message)
                });
        },
        //跳转去详情
        detail(item) {
            this.$router.push({
                path: '/customer-detail?id=' + item.id
            });
        },
        //获取预留手机号列表
        getLeavePhoneList(cb, more){
            let _this = this
            , pagination = _this.dialogData.pagination;

            if(!!more){//此处为分页
                if(!pagination.dataMore){
                    return false;
                }
            }
            let option = {
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                userId: _this.dialogData.currentUserId
            }
            api.request('leavePhoneList', option)
                .then(function(result) {
                    if (result.status == 0) {
                        if( pagination.pageSize * pagination.pageIndex >= result.data.total ){
                            _this.dialogData.pagination.dataMore = false;
                        }
                        _this.dialogData.pagination.total = result.data.total;
                        if(!!more){//分页
                            _this.dialogData.gridData =  _this.dialogData.gridData.concat(result.data.list);
                        } else {//首次请求
                            _this.dialogData.gridData = result.data.list;
                        }
                    } else {
                        _this.$message.error(result.message || '操作失败!')
                    }
                    !!cb && cb();
                })
                .catch(function(error) {
                    _this.$message.error(error.message);
                });
        },
        //打开预留手机号弹窗
        openPhoneDialog(item) {
            this.dialogData.currentUserId = item.userId;
            this.getLeavePhoneList(() => {
                this.dialogData.dialogTableVisible = true;
            }); 
        },
        // 刷新分页滚动条
        refreshScroll(otps){
            setTimeout(() => {
                eventBus.$emit("refreshScroll", otps);
            });
        },
        //预留手机号分页加载逻辑
        loadMorePhone(){
            if( this.dialogData.pagination._lock || !this.dialogData.pagination.dataMore ) return false;
            this.dialogData.pagination.pageIndex++;
            //此处分页上锁
            this.dialogData.pagination._lock = true;
            this.getLeavePhoneList(()=> {
                this.dialogData.pagination._lock = false;
                this.refreshScroll();
            }, 'more');
        },
        //关闭预留手机号弹窗，弹窗参数重置
        closeDialog() {
            this.dialogData.dialogTableVisible = false;
            this.dialogData.pagination.pageIndex = 1;
            this.dialogData.pagination.dataMore = true;
            this.dialogData.gridData = [];
        },
        //去发送短信
        smsSend() {
            sessionStorage.setItem('phoneList', JSON.stringify(this.getSelectedPhoneList()) );
            this.$router.push({
                path: '/my-promotion?selectKey=sms'
            });
        }
    }
}
</script>




