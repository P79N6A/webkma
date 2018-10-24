<template>
    <el-container>
        <el-header class="clear-padding">
            <pageTitle :pageTitle="pageTitleOpt" @search-event="search" />
        </el-header>
        <el-main style="padding: 0 40px;">
            <el-row class="content-body">
                <el-row style="height:30px; line-height:30px; margin:10px 0; box-sizing: border-box; padding-left: 9px;">
                    <span>
                        <el-checkbox v-model="selectAll" @change="selectallFn">
                            <span class="btn-plain black-deep font-14" style="margin-right: 10px;">全选</span>
                        </el-checkbox>
                    </span>
                    <span class="btn-plain color-blue font-14" v-if="selectionData.length > 0" @click="batchOption('0')">启用</span>
                    <span class="btn-plain color-blue font-14 btn-disabeld" v-else>启用</span>
                    <span class="btn-plain color-blue font-14" v-if="selectionData.length > 0" @click="batchOption('1')">禁用</span>
                    <span class="btn-plain color-blue font-14 btn-disabeld" v-else>禁用</span>
                    <span class="btn-plain btn-delete color-red font-14" v-if="selectionData.length > 0" @click="batchRemove()">删除</span>
                    <span class="btn-plain color-blue font-14 btn-disabeld" v-else>删除</span>
                    <el-button class="pull-right" type="primary" size="small" @click="addEmployee">新增人员</el-button>
                </el-row>
                <el-table
                    ref="employeesTable"
                    :data="list"
                    tooltip-effect="dark"
                    style="width: 100%"
                    row-key="id"
                    class="table"
                    header-row-class-name="table-header"
                    header-cell-class-name="table-header"
                    @sort-change="sortChangeHandler">
                    <el-table-column
                    prop="active"
                    width="55">
                    <template slot-scope="scope" >
                        <el-checkbox v-model="scope.row.active" @change="handleSelectionChange"></el-checkbox>
                    </template>
                    </el-table-column>
                    <el-table-column
                    label="员工姓名"
                    show-overflow-tooltip
                    width="150">
                    <template slot-scope="scope" >
                        <img class="headImg" :src="scope.row.userFace" />
                        <span v-text="scope.row.name"></span> 
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="phone"
                    label="手机号码"
                    align="center"
                    class-name="number_color"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="createTime"
                    label="创建时间"
                    align="center"
                    class-name="number_color"
                    show-overflow-tooltip
                    width="150"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="totalShare"
                    label="累计推广分享数"
                    align="center"
                    sortable="custom"
                    class-name="number_color"
                    show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                    prop="totalVisitor"
                    label="累计推广访客数"
                    align="center"
                    sortable="custom"
                    class-name="number_color"
                    show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                    prop="totalAccess"
                    label="累计推广访问数"
                    align="center"
                    sortable="custom"
                    class-name="number_color"
                    show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="状态"
                    align="center"
                    width="80"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <slideBtn :slideBtnOpt="scope.row"   @slide-event="employeeState" />
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="操作"
                    align="center"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <i class="btn-plain" @click="edit(scope.row)">详情</i>
                        <i class="btn-plain btn-delete" @click="singleRemove(scope.row)">删除</i>
                    </template>
                    </el-table-column>
                </el-table>
                <pagination  v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import pageTitle from "../../components/page-title";
import slideBtn from "../../components/slide-btn";
import pagination from '../../components/ui-pagination';
import api from 'api';
import defaultHead from '../../assets/images/default-headImg.png';

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
                text: '员工管理',
                search: {
                    value: '',
                    placeholder: '请输入关键词搜索'
                },
                showSearch: true
            },
            paginationOpt: {
                pageIndex: 1,
                pageSize: 10,
                totalCount:0,
                pageCount: 0
            },
            selectionData: [],
            keyWords: '', //搜索关键字
            list: [], //员工列表数据
            selectAll: false //全选
        };
    },
    mounted() {
        this.getEmployeeList();
    },
    methods: {
        //获取员工列表
        getEmployeeList(cb) {
            let _this = this;
            let _option = {
                pageIndex: _this.paginationOpt.pageIndex,
                pageSize: _this.paginationOpt.pageSize,
                keyWords: _this.keyWords,
                orderBy:_this.orderBys 
            }
            api.request("getEmployeeList", _option, (result) => {
                if (result.status == 0) {
                    $.each(result.data.list, (index, item) => {
                        item.createTime = window.timeFormdate(item.createTime);
                        item.userFace=item.userFace||defaultHead;
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
            this.getEmployeeList();
        },
        //新增员工
        addEmployee() {
            this.$router.push({
                path: '/add-employee'
            });
        },
        //分页调用方法
        pagesFn(pageIndex, cb) { 
            let _this = this;
            _this.pagination = pageIndex;
            _this.getEmployeeList(cb);
        },
        //员工状态更改
        employeeState(data) {
            let _this = this;
            api.request('createEmployee', data)
                .then(function(result) {
                    if (result.status == 0) {
                        _this.getEmployeeList();
                    } else {
                        _this.myMessage.error(result.message);
                    }
                })
                .catch(function(error) {
                    _this.myMessage.error(error.message);
                });
        },
        //排序
        sortChangeHandler(orderBy){
            let {order,prop}=orderBy;
            if(!!prop){
                this.orderBys=[{
                    [prop]:order==='descending'?'desc':'asc'
                }];
                this.getEmployeeList();
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
        //获取当前选中的对象id数组
        getSelectIds() {
            let ids = [];
            if(!!this.selectionData && this.selectionData.length>0){
                ids = this.selectionData.map(item=>item.id);
            }
            return ids;
        },
        //批量删除
        batchRemove(item) {
            let ids = this.getSelectIds();
            if (ids.length == 0) {
                 this.$message({type:'warning',message: '请选择人员！'});
                return false;
            }
            this.removeEmployee(ids);
        },
        //删除单个员工
        singleRemove(item) {
            let ids = [item.id];
            this.removeEmployee(ids);
        },
        //删除员工
        removeEmployee(ids) {
            let _this = this;
            this.$confirm('确定删除对应员工？', '提示', {
                center: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                api.request('removeEmployee', {
                    ids: ids
                })
                .then(function(result) {
                    if (result.status == 0) {
                    _this.$message({
                        message: '操作成功!',
                        type: 'success'
                    });
                    _this.getEmployeeList();
                    } else {
                    _this.$message.error(result.message || '操作失败!')
                    }
                })
                .catch(function(error) {
                    _this.$message.error(error.message)
                });
            }).catch(() => {});
        },
        //批量启用、禁用
        batchOption(state) {
            let ids = this.getSelectIds();
            if (ids.length == 0) {
                this.$message({type:'warning',message: '请选择人员！'});
                return false;
            }

            let _this = this,
                _data = {
                    ids: ids,
                    field: 'state',
                    value: state
                };

            api.request('employeeModify', _data)
                .then(function(result) {
                    if (result.status == 0) {
                        _this.$message({
                            message: '操作成功!',
                            type: 'success'
                        });
                        _this.getEmployeeList();
                    } else {
                        _this.$message.error(result.message || '操作失败!')
                    }
                })
                .catch(function(error) {
                    _this.$message.error(error.message)
                });
        },
        //编辑
        edit(item) {
            this.$router.push({
                path: '/add-employee?id=' + item.id
            });
        }

    }
}
</script>



