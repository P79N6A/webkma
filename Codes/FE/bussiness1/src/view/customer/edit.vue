<template>
    <el-container>
        <el-header class="clear-padding">
            <pageTitle :pageTitle="pageTitleOpt" />
        </el-header>
        <el-main class="clear-padding" style="width: 1160px;margin: 30px auto;">
            <el-row style="height: 180px; border: 1px solid #c9d4df; padding: 20px; box-sizing: border-box; margin-bottom: 30px;">
                <el-col :span="8" style="height: 100%; background-color: #f8f8f8; padding: 30px 25px 28px; box-sizing: border-box;">
                    <img alt="头像" style="float: left; width: 80px; height: 80px; margin-right: 20px;" :src="data.userFace"/>
                    <el-row class="info-msg">
                        <p class="font-14">微信昵称 : {{data.nickname}}</p>
                        <p class="font-14" style="margin: 10px 0;">手机号码 : {{data.mobile}}</p>
                        <p style="font-size: 12px; color: #b2b2b2;" v-if="!!data.activityName">{{data.createTime}}</p>
                    </el-row>
                </el-col>
                <el-col :span="16" style="margin-top: 20px;">
                    <el-row class="font-14">
                        <el-col :span="6" class="text-right" style="margin-right: 5px;">客户来源 : </el-col>
                        <span>{{data.activityName || '线下导入'}}</span>
                    </el-row>
                    <el-row class="font-14" style="margin: 10px 0;">
                        <el-col :span="6" class="text-right" style="margin-right: 5px;">参与活动数 : </el-col>
                        <span>{{data.joinNumber}}</span>
                    </el-row>
                    <el-row class="font-14" style="margin: 10px 0;">
                        <el-col :span="6" class="text-right" style="margin-right: 5px;">首次推广人员 : </el-col>
                        <span>{{data.staffName}}</span>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-button class="pull-left" type="primary" size="small" @click="goback">返回</el-button>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import pageTitle from "../../components/page-title";
import api from 'api'
import defaultHead from '../../assets/images/default-headImg.png';

export default {
    components: {
        pageTitle
    },
    name: 'employee-management',
    data: function() {
        return {
            pageTitleOpt: {
                text: '客户基本信息'
            },
            data: {}
        };
    },
    mounted() {
        this.getCustomerdetail();
    },
    methods: {
        //获取客户详情数据
        getCustomerdetail() {
            let _this = this;
            let id = this.$route.query.id;
            let option = {
                id: id
            }
            api.request('getCustomerInfo', option)
                .then(function(result) {
                    if (result.status == 0) {
                        result.data[0].userFace = result.data[0].face || defaultHead;
                        result.data[0].createTime = !!result.data[0].createTime ? result.data[0].createTime.replace(/-/g,'/') : '';
                        _this.data = result.data[0];
                    } else {
                        _this.$message.error(result.message || '操作失败!')
                    }
                })
                .catch(function(error) {
                    _this.$message.error(error.message);
                });
        },
        //返回客户列表页
        goback() {
            this.$router.push({
                path: '/customer-management'
            });
        }
    }
}
</script>


