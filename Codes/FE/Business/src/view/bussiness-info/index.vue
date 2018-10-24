<template>
    <el-container>
        <el-header class="clear-padding">
            <pageTitle :pageTitle="pageTitleOpt" />
        </el-header>
        <el-main style="margin: 30px auto;padding: 0;">
            <el-row style="width: 1160px; height: auto; border: 1px solid #e3e3e3; padding: 20px 40px 40px; box-sizing: border-box;">
                <el-row style="height: 60px; line-height: 60px; border-bottom: 1px solid #c9d4df;margin-bottom: 40px;">
                    <span class="font-18 black-deep" >{{ bussinessData.businessName }}</span>
                    <span class="font-14 black-light" style="margin: 0 20px 0 40px;">账号 : {{ bussinessData.businessPhone }}</span>
                    <span class="font-14 blue-light" style="cursor: pointer;" @click="modifyPwd">修改密码</span>
                </el-row>
                <el-row>
                    <el-row>
                        <el-col :span="2" class="text-right font-14 black-light" style="padding-right: 10px; margin-right: 10px;">公司Logo</el-col>
                        <el-col :span="10">
                            <form>
                                <comupload type="businessLogo" upfileId="upfileId1" uploadTip="jpg/jpeg/gif/png <3M" :imageUrl="bussinessData.businessLogo" fileType="/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/" :cb="saveBussiness"></comupload>
                            </form>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 40px;">
                        <el-col :span="2" class="text-right font-14 black-light" style="padding-right: 10px; margin-right: 10px;">公司封面</el-col>
                        <el-col :span="10">
                            <form>
                                <comupload type="businessCover" upfileId="upfileId2" uploadTip="jpg/jpeg/gif/png <5M，建议比例4:3" :imageUrl="bussinessData.businessCover" size="5M" fileType="/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/" :cb="saveBussiness"></comupload>
                            </form>
                        </el-col>
                    </el-row>
                </el-row>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import pageTitle from "../../components/page-title";
import api from 'api'
import defaultHead from '../../assets/images/default-headImg.png';
import comupload from '../../components/com-upload';

export default {
    components: {
        pageTitle,
        comupload
    },
    name: 'bussiness-info',
    data: function() {
        return {
            businessId: '',
            pageTitleOpt: {
                text: '商家信息'
            },
            bussinessData: {}
        };
    },
    mounted() {
        this.businessId = localStorage.businessId || '';
        this.getBussinessInfo();
    },
    methods: {
        //获取商家详情数据
        getBussinessInfo() {
            let _this = this;

            api.request('getBussinessInfo', { businessId: _this.businessId })
                .then(function(result) {
                    if (result.status == 0) {
                        _this.bussinessData = result.data[0];
                    } else {
                        _this.$message.error(result.message || '操作失败!')
                    }
                })
                .catch(function(error) {
                    _this.$message.error(error.message);
                });
        },
        //去修改密码
        modifyPwd() {
            this.$router.push({
                path: '/modifyPwd'
            });
        },
        //保存上传数据
        saveBussiness(data) {
            let _this = this;
            this.bussinessData = Object.assign(this.bussinessData, data);

            api.request('saveBussinessInfo', _this.bussinessData)
                .then(function(result) {
                    if (result.status == 0) {
                        _this.getBussinessInfo();
                    } else {
                        _this.$message.error(result.message || '操作失败!')
                    }
                })
                .catch(function(error) {
                    _this.$message.error(error.message);
                });
        }
    }
}
</script>


