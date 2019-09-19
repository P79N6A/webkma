<template>
    <el-container class="add-promotion-awards">
        <el-header class="clear-padding">
            <pageTitle :pageTitle="pageTitleOpt"/>
        </el-header>
        <el-main class="awards-wrap">
            <el-row class="awards-row font-14">
                <span class="pull-left black-deep font-14">选择推广活动：</span>
                <div class="pull-left" style="width:254px;margin-right:25px;position:relative;">
                    <selectDropmenu :selectArr="activityArr" @freshDataHandle="getPromotionActivity" @slectedHandle="selectActivityCb"/>
                </div>
                <span class="black-deep font-14">推广奖励截止时间：</span>
                <el-date-picker
                    v-model="params.endTime"
                    type="datetime"
                    :picker-options="pickerOptions0"
                    placeholder="选择截止时间">
                </el-date-picker>
                <span class="pull-right black-deep font-12" v-if="!!bussinessMoney">奖励总金额/账户余额 <span class="red-light" style="margin-left:10px;">{{awardsTotalMoney}}/{{bussinessMoney}}元</span></span>
            </el-row>
            <el-row class="awards-body">
                <el-row class="awards-row mb20">
                    <span class="pull-left font-16 bold black-deep">全员奖励目标</span>
                    <el-popover
                        placement="top-start"
                        width="401"
                        trigger="click"
                        content="1、全员奖励目标是设置的为当前活动被分派任务的员工；2、目标值设置后，员工必须要满足设置的数值才能获得奖励">
                        <i class="pull-left el-icon-info pointer" slot="reference"></i>
                    </el-popover>
                    <div class="pull-left desc black-deep">
                        <span class="mr15">推广员工数：<span class="red-light">{{curreEmployCount}}</span></span>
                        <span class="mr15" v-if="fullTotalMoney">全员推广奖励：<span class="red-light">￥{{fullTotalMoney}}</span></span>
                    </div>
                </el-row>
                <el-row class="full-target">
                    <el-row v-if="fullTargetEdit">
                        <ul class="full-target-list edit">
                            <li style="">
                                <p class="mb10 black-deep">奖励金额</p>
                                <p><el-input placeholder="请输入奖励金额" v-model="params.money" @blur="fulltargetValidate" @focus.stop="fullTargetEdit = true;" dataType="full"></el-input></p>
                            </li>
                            <li>
                                <p class="mb10 black-deep">奖励类型</p>
                                <p>
                                    <el-select v-model="params.typeCode" placeholder="请选择" style="width: 148px;" @change="fulltargetValidate" :popper-append-to-body="false">
                                        <el-option
                                        v-for="item in awardsConfig.type"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.name">
                                        </el-option>
                                    </el-select>
                                </p>
                            </li>
                            <li>
                                <p class="mb10 black-deep">奖励形式</p>
                                <p>
                                    <el-select v-model="params.styleCode" placeholder="请选择" style="width: 148px;" @change="fulltargetValidate" :popper-append-to-body="false">
                                        <el-option
                                        v-for="item in awardsConfig.style"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.name">
                                        </el-option>
                                    </el-select>
                                </p>
                            </li>
                            <li>
                                <p class="mb10 black-deep">目标访问数</p>
                                <p><el-input placeholder="请输入数量" v-model="params.targetAccess" @blur="fulltargetValidate" @focus.stop="fullTargetEdit = true;" dataType="full"></el-input></p>
                            </li>
                            <li>
                                <p class="mb10 black-deep">目标访客数</p>
                                <p><el-input placeholder="请输入数量" v-model="params.targetVisitor" @blur="fulltargetValidate" @focus.stop="fullTargetEdit = true;" dataType="full"></el-input></p>
                            </li>
                            <li>
                                <p class="mb10 black-deep">目标分享数</p>
                                <p><el-input placeholder="请输入数量" v-model="params.targetShare" @blur="fulltargetValidate" @focus.stop="fullTargetEdit = true;" dataType="full"></el-input></p>
                            </li>
                        </ul>
                    </el-row>
                    <el-row v-else>
                        <ul class="full-target-list pull-left">
                            <li>
                                <p class="black-deep font-12 text-center mb20">奖励金额</p>
                                <p class="red-light font-14 text-center bold">{{params.money}}</p>
                            </li>
                            <li>
                                <p class="black-deep font-12 text-center mb20">奖励类型</p>
                                <p class="black-deep font-14 text-center bold">{{params.typeCode}}</p>
                            </li>
                            <li>
                                <p class="black-deep font-12 text-center mb20">奖励形式</p>
                                <p class="black-deep font-14 text-center bold">{{params.styleCode}}</p>
                            </li>
                            <li>
                                <p class="black-deep font-12 text-center mb20">目标访问数</p>
                                <p class="black-deep font-14 text-center bold">{{params.targetAccess}}</p>
                            </li>
                            <li>
                                <p class="black-deep font-12 text-center mb20">目标访客数</p>
                                <p class="black-deep font-14 text-center bold">{{params.targetVisitor}}</p>
                            </li>
                            <li>
                                <p class="black-deep font-12 text-center mb20">目标分享数</p>
                                <p class="black-deep font-14 text-center bold">{{params.targetShare}}</p>
                            </li>
                        </ul>
                        <div class="modify-btn pull-right blue-light font-12" @click.stop="fullTargetEdit = true;">
                            修改
                        </div>
                    </el-row>
                </el-row>
                <el-row class="awards-row" style="margin:30px 0 20px;">
                    <span class="pull-left font-16 bold black-deep">团队奖励目标</span>
                    <el-popover
                        placement="top-start"
                        width="401"
                        trigger="click"
                        content="团队奖励，为团队负责人单独发放奖励，计算团队所有被分派任务的员工数据。">
                        <i class="pull-left el-icon-info pointer" slot="reference"></i>
                    </el-popover>
                    <div class="pull-left desc font-14 black-deep">
                        <span class="mr15">团队数：<span class="red-light">{{params.groups.length}}</span></span>
                        <span class="mr15" v-if="!!groupTotalMoney">团队奖励总金额：<span class="red-light">￥{{groupTotalMoney}}元</span></span>
                    </div>
                </el-row>
                <el-row class="team-awards">
                    <div class="awards-item awards-plus pointer" @click="openTreeApartmentDialog">
                        <p class="text-center text-center" style="margin:100px auto 25px;font-size:38px;color:#01bacf;"><i class="el-icon-circle-plus"></i></p>
                        <p class="text-center font-14" >添加团队奖励</p>
                    </div>
                    <div class="awards-item" v-for="(item,index) in params.groups" :key="index" :dataId="item.deptId">
                        <div class="item-title">
                            <span style="margin-right:15px;font-weight:bold;width: 200px;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" class="font-14 black-deep pull-left">{{item.name}}</span><span class="number-color">{{item.count}}人</span>
                            <span class="pull-right">
                                <span class="blue-light mr15 pointer" @click.stop="item.edit = true;" v-if="!item.edit">编辑</span>
                                <span class="red-light pointer" @click.stop="deleteApartment(index)">删除</span>
                            </span>
                        </div>
                        <div class="item-body black-deep font-12" v-if="item.edit">
                            <p class="awards-row mb10">
                                <label class="label black-deep font-12">奖励金额：</label>
                                <el-input class="font-12" placeholder="请输入金额" style="width:100px;" v-model="item.money" @blur="groupAwardsValidate(item)" @focus.stop="item.edit = true;" dataType="group"></el-input>
                            </p>
                            <p class="awards-row mb10">
                                <label class="label black-deep font-12">奖励类型：</label>
                                <el-select class="mr15 font-12" v-model="item.typeCode" placeholder="请选择" style="width: 100px;" @change="groupAwardsValidate(item)" :popper-append-to-body="false">
                                    <el-option
                                    v-for="item in awardsConfig.type"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.name">
                                    </el-option>
                                </el-select>
                                <el-select class="font-12" v-model="item.styleCode" placeholder="请选择" style="width: 100px;" @change="groupAwardsValidate(item)" :popper-append-to-body="false">
                                    <el-option
                                    v-for="item in awardsConfig.style"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.name">
                                    </el-option>
                                </el-select>
                            </p>
                            <p class="awards-row mb10">
                                <label class="label black-deep font-12">奖励目标：</label>
                                <el-input class="mr10 font-12" placeholder="请输入数量" style="width:150px;" v-model="item.targetAccess" @blur="groupAwardsValidate(item)" @focus.stop="item.edit = true;" dataType="group"></el-input>
                                访问数
                            </p>
                             <p class="awards-row mb10">
                                <label class="label"></label>
                                <el-input class="mr10 font-12" placeholder="请输入数量" style="width:150px;" v-model="item.targetVisitor" @blur="groupAwardsValidate(item)" @focus.stop="item.edit = true;" dataType="group"></el-input>
                                访客数
                            </p>
                             <p class="awards-row mb10">
                                <label class="label"></label>
                                <el-input class="mr10 font-12" placeholder="请输入数量" style="width:150px;" v-model="item.targetShare" @blur="groupAwardsValidate(item)" @focus.stop="item.edit = true;" dataType="group"></el-input>
                                分享数
                            </p>
                        </div>

                        <div class="item-body black-deep font-12" v-else>
                            <p class="awards-row mb10">
                                <label class="label black-deep font-12">奖励金额：</label>
                                <span class="red-light">{{item.money}}</span>
                            </p>
                            <p class="awards-row mb10">
                                <label class="label black-deep font-12">奖励类型：</label>
                                <span style="margin-right:20px;">{{item.typeCode}}</span>
                                <span>{{item.styleCode}}</span>
                            </p>
                            <p class="awards-row mb10">
                                <label class="label black-deep font-12">奖励目标：</label>
                                <span class="mr15 number-color">{{item.targetAccess}}</span>
                                访问数
                            </p>
                             <p class="awards-row mb10">
                                <label class="label"></label>
                                <span class="mr15 number-color">{{item.targetVisitor}}</span>
                                访客数
                            </p>
                             <p class="awards-row mb10">
                                <label class="label"></label>
                                <span class="mr15 number-color">{{item.targetShare}}</span>
                                分享数
                            </p>
                        </div>
                    </div>
                    
                </el-row>
            </el-row>
            <el-row class="text-center" style="margin:35px auto;">
                <el-button type="default" size="small" style="width:100px;" dataType="btn" @click.stop="jumpToList">取消</el-button>
                <el-button type="primary" size="small" style="width:100px;" @click.stop="addAwards" dataType="btn">确定</el-button>
            </el-row>

        </el-main>
        <el-dialog
            title="添加团队奖励部门"
            v-if="treeApartment.visible"
            :visible.sync="treeApartment.visible"
            :center="true"
            :width="'400px !important'"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="closeTreeApartmentDialog"
        >
        <el-tree ref="tree" 
            :data="treeApartment.data" 
            :props="treeApartment.defaultProps" 
            @check-change="checkChange"
            @node-click="nodeClick" 
            node-key="id"
            :check-strictly="true"
            :default-expanded-keys="[treeApartment.data[0].id]"
            show-checkbox>
        </el-tree>
        <div class="text-center" style="margin-top:20px;">
            <el-button type="default" size="small" @click="closeTreeApartmentDialog">取消</el-button>
            <el-button
            type="primary"
            size="small"
            :loading="treeApartment.savingStatus"
            @click="saveTreeApartmentDialog"
            >确定</el-button>
        </div>
        </el-dialog>
    </el-container>
</template>
<script>
import selectDropmenu from "../../components/select-dropmenu";
import pageTitle from "../../components/page-title";
import api from "api";
export default {
    components: {
        selectDropmenu,
        pageTitle
    },
    name: 'add-promotion-awards',
    data: function() {
        return {
            pageTitleOpt: {
                text: "添加推广奖励",
                showSearch: false
            },
            pickerOptions0: {
                disabledDate(time) {
                   return time.getTime() < Date.now();
                }
            },
            awardsConfig: {}, //奖励配置数据
            curreActivity: {}, //当前选中的活动对象
            curreEmployCount: '',//当前活动的员工数量
            activityArr: [], //活动列表数据
            awardsTotalMoney: 0, //奖励总金额
            bussinessMoney: '', //商家资金池总额
            fullTargetEdit: true,
            fullTotalMoney: 0, //全员奖励总金额
            groupTotalMoney: 0, //团队奖励总金额
            params: { //提交接口的参数
                endTime: "", //活动截止时间
                styleCode: "", //奖励形式(全员)
                typeCode: "", //奖励类型(全员)
                targetAccess: "", //目标访问数(全员)
                targetVisitor: "", //目标访客数(全员)
                targetShare: "", //目标分享数(全员)
                money: "", //奖励金额(全员)
                groups: []
            },
            singleGroup: { //单个部门数据
                "deptId": "", //部门id
                "styleCode": "",
                "typeCode": "",
                "targetAccess": '',
                "targetVisitor": '',
                "targetShare": '',
                "money": ''
            },
            treeApartment: {// 部门树对象
                savingStatus: false,
                visible: false,
                data: [], 
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                editCheckId: "", //选中的部门id
                name: "", //选中的部门名字
                count: "", //选中的部门人数
                managerState: "" //选中的部门主管状态  null--无主管   0--正常   1--禁用
            }
        }
    },
    mounted() {
        let self = this;
        this.getPromotionActivity('', () => {
            self.getActivityEmployeeCount();
        });
        this.getAccountDetail();
        this.getAwardsConfig();
        this.getDepartmentTreeAll();
        this.tempSaveData();
    },
    methods: {
        //获取商家账户详情
        getAccountDetail() {
            let self = this;
            api.request("getAccountDetail", {})
            .then(function(result) {
                if (result.status == 0) {
                    self.accountDetail = result.data;
                    self.bussinessMoney = parseFloat(self.accountDetail.balance).toFixed(2);
                } else {
                    self.$message.error(result.message);
                }
            })
            .catch(function(error) {
                self.$message.error(error.message);
            });
        },
        // 获取活动列表
        getPromotionActivity(data, callback) {
            let keyword = data || '';
            let self = this;
            api.request('getPromotionActivity', {search: keyword })
            .then(function(result) {
                if (result.status == 0) {
                    self.activityArr = result.data;
                    if(!self.curreActivity.id) self.curreActivity = result.data[0];
                    !!callback && callback();
                } else {
                    self.$message.error(result.message)
                }
            })
            .catch(function(error) {
                self.$message.error(error.message);
            });
        },
        selectActivityCb(data) {
            this.curreActivity = data;
            this.getActivityEmployeeCount();
            this.fullTotalMoney = 0;
            this.groupTotalMoney = 0;
            this.params = { //提交接口的参数
                endTime: "", //活动截止时间
                styleCode: "", //奖励形式(全员)
                typeCode: "", //奖励类型(全员)
                targetAccess: "", //目标访问数(全员)
                targetVisitor: "", //目标访客数(全员)
                targetShare: "", //目标分享数(全员)
                money: "", //奖励金额(全员)
                groups: []
            };
            this.fullTargetEdit = true;
        },
        //获取当前推广活动的员工数量
        getActivityEmployeeCount() {
            let self = this;
            api.request('getActivityEmployeeCount', {relationId: self.curreActivity.id })
            .then(function(result) {
                if (result.status == 0) {
                    self.curreEmployCount = result.data;
                } else {
                    self.$message.error(result.message)
                }
            })
            .catch(function(error) {
                self.$message.error(error.message);
            });
        },
        //获取奖励配置
        getAwardsConfig() {
            let self = this;
            api.request('getAwardsConfig', {})
            .then(function(result) {
                if (result.status == 0) {
                    self.awardsConfig = result.data;
                    self.typeCode = self.awardsConfig.type.code;
                    self.styleCode = self.awardsConfig.style.code;
                } else {
                    self.$message.error(result.message)
                }
            })
            .catch(function(error) {
                self.$message.error(error.message);
            });
        },
        //获取部门数据
        getDepartmentTreeAll(callback) {
            let self = this;
            let _option = { secret_key: localStorage.businessSecret };
            api.request("getDepartmentTreeAll", _option, result => {
                if (result.status == 0) {
                    self.treeApartment.data = result.data;
                } else {
                    self.$message.error(result.message);
                }
                !!callback && callback();
            });
        },
        //打开部门树弹窗
        openTreeApartmentDialog(){
            this.getDepartmentTreeAll(() => {
                this.treeApartment.visible = true;
            });            
        },
        // 部门树操作
        checkChange(item, node, self) {
            let _this = this, errMsg = '';
            if (node == true) {//点击未选中复选框
                if(item.managerState === null){
                    errMsg = '该部门尚未设置主管，不能为其添加团队奖励噢！';
                } else if( item.managerState === 1 ){
                    errMsg = '当前主管已经被禁用，请重新设置后再进行目标的设置！';
                }
                // 限制同一个部门只能添加一次团队奖励
                if(_.filter(_this.params.groups, (n) => { return n.deptId == item.id; }).length > 0){
                    errMsg = '同一个推广奖励活动，只能为一个部门设置奖励！';
                }
                if(!!errMsg) {
                    _this.$message.error(errMsg);
                    this.$refs.tree.setCheckedKeys([this.treeApartment.editCheckId]);
                    return false;
                }
                this.treeApartment.editCheckId = item.id;
                this.treeApartment.name = item.label;
                this.treeApartment.count = item.employeeCount;
                this.treeApartment.managerState = item.managerState;
                this.$refs.tree.setCheckedKeys([item.id]);
                this.treeApartment.isSelected = true;
            } else {
                if (this.treeApartment.editCheckId == item.id) {//点击已选中复选框，保证至少一个选中
                    this.$refs.tree.setCheckedKeys([item.id]);
                }
            }  
        },
        // 部门树操作
        nodeClick(item, node, self){
            this.$refs.tree.setCheckedKeys([item.id]);
        },
        // 关闭部门树弹窗
        closeTreeApartmentDialog() {
            this.treeApartment.editCheckId = '';
            this.treeApartment.visible = false;
        },
        // 为选取的部门添加奖励数据
        saveTreeApartmentDialog() {
            let self = this;
            if(!this.treeApartment.isSelected) {
                self.$message.error('请选择部门！');
                return false;
            }
            let tempGroup = JSON.parse(JSON.stringify(self.singleGroup));
            // 新增奖励部门
            tempGroup.deptId = this.treeApartment.editCheckId;
            tempGroup.name = this.treeApartment.name;
            tempGroup.count = this.treeApartment.count;
            tempGroup.edit = true;
            this.params.groups.push(tempGroup);
            this.treeApartment.visible = false;
            this.treeApartment.isSelected = false;
        },
        //验证总金额是否大于资金池金额
        moneyValidate(){
            let tag = true;
            this.awardsTotalMoney = (!!this.fullTotalMoney ? parseFloat(this.fullTotalMoney) : 0) + (!!this.groupTotalMoney ? parseFloat(this.groupTotalMoney) : 0);
            this.awardsTotalMoney = this.awardsTotalMoney == 0 ? this.awardsTotalMoney : parseFloat(this.awardsTotalMoney).toFixed(2);
            if(this.awardsTotalMoney > parseFloat(this.bussinessMoney)) tag = false;
            return tag;
        },
        //全员奖励验证
        fulltargetValidate(final) {
            let self = this
            , tag = true
            , reg = /^([1-9]\d*|[0]{1,1})$/;
            if(!self.params.money && final == 'final'){
                self.$message.error('请输入全员奖励金额！');
                tag = false;
            } else if(!!self.params.money && !/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,2}$/.test(self.params.money)){
                self.$message.error('全员奖励金额只能是大于0、最多2位小数的数字噢！');
                tag = false;
            } else {
                self.fullTotalMoney = !!self.params.money ? (parseFloat(self.params.money) * parseFloat(self.curreEmployCount)).toFixed(2) : 0;
                if(!self.moneyValidate()){
                    self.$message.error('当前推广奖励超出商家资金池的余额，请重新设置！');
                    tag = false;
                }
            }
            if(tag && !self.params.targetAccess && final == 'final'){
                self.$message.error('请输入全员目标访问数！');
                tag = false;
            } else if(!!self.params.targetAccess && !reg.test(self.params.targetAccess)){
                self.$message.error('全员目标访问数只能是正整数！');
                tag = false;
            }
            if(tag && !self.params.targetVisitor && final == 'final'){
                self.$message.error('请输入全员目标访客数！');
                tag = false;
            } else if(!!self.params.targetVisitor && !reg.test(self.params.targetVisitor)){
                self.$message.error('全员目标访客数只能是正整数！');
                tag = false;
            }
            if(tag && !self.params.targetShare && final == 'final'){
                self.$message.error('请输入全员目标分享数！');
                tag = false;
            } else if(!!self.params.targetShare && !reg.test(self.params.targetShare)){
                self.$message.error('全员目标分享数只能是正整数！');
                tag = false;
            }
            if(tag && !!self.params.typeCode && !!self.params.styleCode && !!self.params.money && !!self.params.targetAccess && !!self.params.targetVisitor && !!self.params.targetShare) {
                self.fullTargetEdit = false;
                return true;
            } else if(final == 'final'){
                if(tag && !self.params.styleCode){
                    self.$message.error('请选择全员奖励形式！');
                } 
                if(tag && !self.params.typeCode){
                    self.$message.error('请选择全员奖励类型！');
                }
                return false;
            }
            
        },
        //团队奖励验证
        groupAwardsValidate(item, final) {
            let self = this
            , tag = true
            , reg = /^([1-9]\d*|[0]{1,1})$/;

            if(!item.money && final == 'final'){
                self.$message.error('团队奖励金额不能为空！');
                tag = false;
            } else if(!!item.money && !/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,2}$/.test(item.money)){
                self.$message.error('团队奖励金额只能是大于0、最多2位小数的数字噢！');
                tag = false;
            } else {
                self.groupTotalMoney = 0;
                _.each(self.params.groups, function(single){
                    self.groupTotalMoney = parseFloat(self.groupTotalMoney) + (!!single.money ? parseFloat(single.money) : 0);
                });
                self.groupTotalMoney = self.groupTotalMoney == 0 ? 0 : parseFloat(self.groupTotalMoney).toFixed(2);
                if(!self.moneyValidate()){
                    self.$message.error('当前推广奖励超出商家资金池的余额，请重新设置！');
                    tag = false;
                }
            }
            if(tag && !item.targetAccess && final == 'final'){
                self.$message.error('团队目标访问数不能为空！');
                tag = false;
            } else if(!!item.targetAccess && !reg.test(item.targetAccess)){
                self.$message.error('团队目标访问数只能是正整数！');
                tag = false;
            }
            if(tag && !item.targetVisitor && final == 'final'){
                self.$message.error('团队目标访客数不能为空！');
                tag = false;
            } else if(!!item.targetVisitor && !reg.test(item.targetVisitor)){
                self.$message.error('团队目标访客数只能是正整数！');
                tag = false;
            }
            if(tag && !item.targetShare && final == 'final'){
                self.$message.error('团队目标分享数不能为空！');
                tag = false;
            } else if(!!item.targetShare && !reg.test(item.targetShare)){
                self.$message.error('团队目标分享数只能是正整数！');
                tag = false;
            }
            if(tag && !!item.typeCode && !!item.styleCode && !!item.money && !!item.targetAccess && !!item.targetVisitor && !!item.targetShare) {
                item.edit = false;
                return true;
            } else if(final == 'final'){
                if(tag && (!item.styleCode || !item.typeCode)){
                    self.$message.error('请选择团队奖励类型！');
                }
                return false;
            }
        },
        //点击其他区域改变数据块编辑状态
        tempSaveData() {
            let self = this;
            $('.add-promotion-awards')
                .unbind("click")
                .bind("click", function(e) {
                    let _this = $(e.target)
                    , fullTargetObj = _this.parents('.full-target')
                    , awardsItemObj = _this.parents('.awards-item')
                    , targetIsfull = _this.attr('class') == 'full-target'
                    , targetIsAwards = _this.attr('class') == 'awards-item'
                    , elSelectObj = _this.parents('.el-select')
                    , groupsEditArr = $.grep(self.params.groups, function(n){ return n.edit == true;});

                if ( self.fullTargetEdit && _this.text() != '修改' && _this.attr('dataType') != 'full' && _this.attr('dataType') != 'btn') {
                    self.fulltargetValidate();
                }

                if(groupsEditArr.length>0 && _this.attr('dataType') != 'group' && _this.attr('dataType') != 'btn' && ((!targetIsAwards && awardsItemObj.length == 0) || (!targetIsAwards && awardsItemObj.length>0 && awardsItemObj.attr('dataId') != self.treeApartment.editCheckId) || (!!targetIsAwards && targetIsAwards.attr('dataId') != self.treeApartment.editCheckId))) {
                    var awardsEdit = groupsEditArr[0];
                    self.groupAwardsValidate(awardsEdit);
                }

                if(_this.attr('data-type') != 'el-select' && elSelectObj.length == 0){
                    self.$eventBus.$emit('el-select-spread');
                }
            });
        },
        //选取的配置转换为code
        getAwardsConfigCode(type, name){
            let code = '', self = this;
            _.each(self.awardsConfig[type], (item) => {
                if(item.name == name){
                    code = item.code;
                }
            });
            return code;
        },
        //添加奖励
        addAwards() {
            let self = this, _tag = true;
            //验证数据
            if(!self.params.endTime){
                self.$message.error('请选择推广奖励截止时间！');
                return false;
            }
            if(!self.fulltargetValidate('final')){ _tag = false;}
            _.each(self.params.groups, (partment) => {
                if(_tag && !self.groupAwardsValidate(partment, 'final')){
                    _tag = false;
                }
            });
            if(!_tag) return false;
            // 数据组装与处理
            let _option = {
                "relationId": this.curreActivity.id,
                "endTime": !!self.params.endTime ? window.timeFormdate(self.params.endTime).replace(/\//g , '-') : '',
                "styleCode": self.getAwardsConfigCode('style', self.params.styleCode),
                "typeCode": self.getAwardsConfigCode('type', self.params.typeCode),
                "targetAccess": self.params.targetAccess,
                "targetVisitor": self.params.targetVisitor,
                "targetShare": self.params.targetShare,
                "money": self.params.money,
                "employeeCount":  self.curreEmployCount,
                "groups": []
            };
            _.each(self.params.groups, (item) => {
                _option.groups.push({
                    "deptId": item.deptId,
                    "styleCode": self.getAwardsConfigCode('style', item.styleCode),
                    "typeCode": self.getAwardsConfigCode('type', item.typeCode),
                    "targetAccess": item.targetAccess,
                    "targetVisitor": item.targetVisitor,
                    "targetShare": item.targetShare,
                    "money": item.money
                })
            })
            // 提交数据
            api.request("addAwards", _option, result => {
                if (result.status == 0) {
                    self.$message.success('添加成功！');
                    self.jumpToList();
                } else {
                    self.$message.error(result.message);
                }
            });
        },
        //跳回奖励列表
        jumpToList() {
            this.$router.push({
                path: "/employee-achievements"
            });
        },
        //删除部门
        deleteApartment(index) {
            let self = this;
            self.params.groups.splice(index, 1);
            self.groupTotalMoney = 0;
            _.each(self.params.groups, function(single){
                self.groupTotalMoney += (!!single.money ? parseFloat(single.money) : 0);
            });
            self.moneyValidate();
        }
    }
}
</script>
<style scoped>
    .add-promotion-awards .pointer {
        cursor: pointer;
    }
    .add-promotion-awards .mr15 {
        margin-right: 15px;
    }
    .add-promotion-awards .mb20 {
        margin-bottom: 20px;
    }
    .add-promotion-awards .mb10 {
        margin-bottom: 10px;
    }
    .add-promotion-awards .mr10 {
        margin-right: 10px;
    }
    .add-promotion-awards .bold {
        font-weight: bold;
    }
    .add-promotion-awards .awards-wrap{
        width: 100%;
        height: auto;
        padding: 20px 40px 0;
    }
    .add-promotion-awards .awards-row{
        height: 30px;
        line-height: 30px;
    }
    .add-promotion-awards >>> .el-input__inner {
        height: 30px;
        line-height: 30px;
        border-color: #e3e3e3 !important;
        border-radius: 4px;
        background-color: #fff;
        font-size: 12px;
    }
    .add-promotion-awards >>> .el-date-editor .el-input__inner {
        width: 180px;
        font-size: 14px;
        padding-right: 0;
        color: #63717b;
    }
    .add-promotion-awards >>> .el-date-editor .el-input__suffix {
        display: none;
    }
    .add-promotion-awards >>> .el-date-editor .el-input__inner[type='text']:focus,
    .add-promotion-awards >>> .el-date-editor .el-input__inner[type='text']:hover,
    .add-promotion-awards >>> .el-date-editor .el-input__inner[type='text']:active,
    .add-promotion-awards >>> .el-date-editor .el-input__inner[type='text']:visited,
    .add-promotion-awards >>> .el-input__inner, 
    .add-promotion-awards >>> .el-input__inner:active, 
    .add-promotion-awards >>> .el-input__inner:focus, 
    .add-promotion-awards >>> .el-input__inner:hover{
        background-color: #fff !important;
    }
    .add-promotion-awards >>> .el-input__icon {
        line-height: 30px;
    }
    .add-promotion-awards >>> .el-tree-node__content>.el-checkbox {
        margin-top: 5px;
    }
    .add-promotion-awards >>> .el-tree-node__label {
        width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
    }
    .add-promotion-awards .awards-body {
        width: 100%;
        padding: 20px 0 0px 20px;
        background-color: #f7fbfc;
        margin-top:20px;
    }
    .add-promotion-awards .el-icon-info {
        color: #2f98f3; 
        font-size: 15px;
        margin: 8px 5px 0;
    }
    .add-promotion-awards .desc {
        height: 30px;
        line-height: 30px;
        background-color: rgba(0,186,208,0.1);
        padding-left:15px;
        box-sizing: border-box;
        border-radius: 4px;
        font-size: 12px;
    }
    .add-promotion-awards .full-target {
        width: 1120px;
        height: 106px;
        padding: 23px 20px;
        box-sizing: border-box;
        background-color: #fff;
        box-shadow: 1px 1px 10px rgba(231,231,231,0.14);  
    }
    .add-promotion-awards .full-target-list {
        border-right: 1px solid #e2e2e2;
        height: auto;
    }
    .add-promotion-awards .full-target-list.edit {
        border-right: none;
    }
    .add-promotion-awards .full-target-list li {
        float: left;
        width: 165px;
    }
    .add-promotion-awards .full-target-list.edit li {
        width: 155px;
        margin-right: 30px;
    }
    .add-promotion-awards .full-target-list.edit li:last-child{
        margin-right: 0;
    }
    .add-promotion-awards .modify-btn {
        width: 70px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        cursor: pointer;
    }
    .add-promotion-awards .awards-item {
        width: 360px;
        height: 290px;
        background-color: #fff;
        float: left;
        margin: 0 20px 20px 0;
        box-shadow: 0px 1px 10px rgba(231,231,231,0.14);
    }
    .add-promotion-awards .awards-item .item-title {
        width: 340px;
        height: 50px;
        line-height: 50px;
        margin: 0 auto;
        padding: 0 20px;
        border-bottom:1px solid #eff7fa;
    }
    .add-promotion-awards .awards-item .item-body {
        padding: 25px 25px;

    }
    .add-promotion-awards .awards-row .label {
        display: inline-block;
        font-weight: normal;
        width: 60px;
        margin-right: 10px;
    }
    .add-promotion-awards >>> .el-select-dropdown__item {
        font-size: 12px;
        height: 30px;
        line-height: 30px;
    }
</style>

