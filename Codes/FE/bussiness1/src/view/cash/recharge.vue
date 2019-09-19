<template>
    <el-container class="clear-padding">
        <el-header class="clear-padding">
            <pageTitle :pageTitle="pageTitleOpt" />
        </el-header>
        <el-main style="width: 100%;padding:0 40px;box-sizing:border-box;">
          <el-row class="content-body">
           <el-row class="recharge-tip">
               尊敬的{{bussinessName}}，您当前正在进行商家资金充值，在充值过程中如有问题，请拨打咨询热线 400-0033-166
           </el-row>
           <el-row class="row mb20">
               <label class="label pull-left">选择充值金额</label>
               <div class="pull-left">
                   <span class="span font-14" v-for="(item,index) in cashArr" :key="index" :class="{'active': item.productId == currentItem.productId}" @click="currentItem = item;">
                       {{item.totalFee}}元 <i class="icon"></i>
                    </span>
               </div>
           </el-row>
            <el-row class="row mb20">
                <label class="label pull-left mr20 black-deep">付款方式</label>
                <span><i class="iconfont icon-weixinzhifu"></i><span class="font-14 black-deep">微信支付</span></span>
            </el-row>
            <el-row class="row mb20">
                <label class="label pull-left mr20 black-deep">付款金额</label>
                <span class="font-16"><span class="red-light">{{currentItem.totalFee}}</span><span class="black-deep" style="margin-left:5px;font-weight:bold;">元</span></span>
            </el-row>
            <el-row class="row">
                <label class="label pull-left mr20"></label>
                <el-button class="pull-left" type="primary" size="small" style="width:100px;height:34px;margin-right:10px;" @click="goPay">立即支付</el-button>
                <el-button class="pull-left" type="default" size="small" style="width:100px;height:34px;" @click="$router.go(-1);">返回</el-button>
            </el-row>
          </el-row>
        </el-main>
        <el-dialog title="" :append-to-body="true" :close-on-click-modal="false" :lock-scroll="false" :visible.sync="dialogOptions.visible" width="900px" center @open="opendialog" @close="closeDialog">
            <el-row class="pay-tpl" v-show="dialogOptions.tpl == 'awaitPay'">
                <div class="pull-left" style="margin-top:-14px;">
                    <div style="margin-left:30px;">
                        <label class="font-16 black-deep" style="margin-right:10px;">微信支付</label>
                    </div>
                    <div style="width:240px;height:240px;border:1px solid #9eabb8;padding:10px;background-color:#fff;margin:57px 0 0 110px;box-sizing:border-box;">
                        <div ref="qrcode" style="width:100%;height:100%;"></div>
                    </div>
                    <p style="margin-top:32px;padding-left:164px;"><i class="iconfont icon-weixin"></i><span class="font-14 black-light">使用微信扫码付款</span></p>
                </div>
                <img :src="dialogOptions.phoneBg" style="width:325px;height:415px;margin:-11px 0 0 75px;" />
            </el-row> 
            <el-row class="success-tpl" v-show="dialogOptions.tpl == 'success'">
                <p class="text-center" style="margin:85px auto 20px;"><i class="iconfont icon-right"></i><span class="font-20 black-deep">支付成功</span></p>
                <p class="font-12" style="width:646px;height30px;line-height:30px;background-color:#fff6e8;color:#b1bfcd;margin:0 auto 30px;text-align:center;">因支付数据返回延迟，如您已完成支付，并收到扣款提示信息，请15-30分钟刷新即可。</p>
                <p class="text-center mb15 black-light font-12">订单号: {{dialogOptions.result.orderId}}</p>
                <p class="text-center mb15 black-light font-12">付款金额: {{dialogOptions.result.totalFee}}元</p>
                <p class="text-center black-light font-12" style="margin-bottom:30px;">支付方式: {{dialogOptions.result.platform == '1' ? '微信支付': '支付宝支付'}}</p>
                <p class="text-center">
                    <span class="query-btn" @click="$router.go(-1);">查看余额</span>
                </p>
            </el-row>
            <el-row class="success-tpl" v-show="dialogOptions.tpl == 'fail'">
                <p class="text-center" style="margin:85px auto 20px;"><i class="iconfont icon-wrong"></i><span class="font-20 black-deep">支付失败</span></p>
                <p class="font-12" style="width:646px;height30px;line-height:30px;background-color:#fff6e8;color:#b1bfcd;margin:0 auto 30px;text-align:center;">支付失败，请重新支付。</p>
                <p class="text-center mb15 black-light font-12">订单号: {{dialogOptions.result.orderId}}</p>
                <p class="text-center mb15 black-light font-12">付款金额: {{dialogOptions.result.totalFee}}元</p>
                <p class="text-center black-light font-12" style="margin-bottom:30px;">支付方式: {{dialogOptions.result.platform == '1' ? '微信支付': '支付宝支付'}}</p>
                <p class="text-center">
                    <span class="query-btn" @click="repeatPay">重新支付</span>
                </p>
            </el-row>
        </el-dialog>
    </el-container>
</template>

<script>
import pageTitle from "../../components/page-title";
import api from 'api';
import phoneBg from "../../assets/images/pc-icon-phone-bg.png";

export default {
    components: {
        pageTitle
    },
    name: 'bussiness-info',
    data: function() {
        return {
            pageTitleOpt: {
                text: '资金充值'
            },
            cashArr: [],
            currentItem: {},
            bussinessName: JSON.parse(localStorage.getItem('userInfo')).businessInfo.businessName,
            dialogOptions: {
                visible: false,
                paylogId: '' , //记录id
                tpl: 'awaitPay',  //swaitPay -- 待支付   succsess -- 支付成功   fail -- 支付失败 
                result: {}, //记录结果 
                phoneBg: phoneBg
            }
        };
    },
    mounted(){
        this.getFixedamount();
    },
    methods: {
       // 获取定额支付列表
       getFixedamount(){
            let _this = this;
            api.request("getFixedamount", {})
            .then(function(result) {
                if (result.status == 0) {
                    _this.cashArr = result.data;
                    _this.currentItem = result.data[0];
                } else {
                    _this.$message.error(result.message || "操作失败!");
                }
            })
            .catch(function(error) {
                _this.$message.error(error.message);
            });
       },
       //立即支付
       goPay() {
           this.dialogOptions.visible = true;
       },
       //生成二维码
       creatQrcode(url){
           let qrcodeObj = this.$refs.qrcode;
           $(qrcodeObj).html('');
           var qrcode = new QRCode(qrcodeObj, {
                text: encodeURI(url),
                width: 220,
                height: 220
            });
       },
       //打开弹窗回调，生成支付二维码
       opendialog(){
           this.creatOrder();             
       },
       closeDialog() {
           let _this = this;
           window.clearInterval(_this.queryPayStatus);
       },
       //下单
       creatOrder(callback) {
           let _this = this;
            api.request("createOrderByWx", { plan: _this.currentItem.name })
            .then(function(result) {
                if (result.status == 0 && result.data.code == 200) {   
                    _this.creatQrcode(result.data.data.code_url);
                    _this.dialogOptions.paylogId = result.data.data.payLogId;
                    _this.queryPayStatus = window.setInterval(() => {
                        _this.getPayStatus();
                    },2000);
                    !!callback && callback();
                } else {
                    _this.$message.error(result.message || "操作失败!");
                }
            })
            .catch(function(error) {
                _this.$message.error(error.message);
            });             
       },
       //轮询查询支付结果
       getPayStatus() {
           let _this = this;
           api.request("getRechargeStatus", { payLogId: _this.dialogOptions.paylogId })
            .then(function(result) {
                if(result.status == 0){
                    _this.dialogOptions.result = result.data;
                    if(!result.data) return false;
                    switch(result.data.state){
                        case 1: //支付失败 
                        case 2: //支付超时 
                            _this.dialogOptions.tpl = 'fail';
                            window.clearInterval(_this.queryPayStatus);
                            break;
                        case 200: //支付成功
                            _this.dialogOptions.tpl = 'success';                    
                            window.clearInterval(_this.queryPayStatus);
                            break;                        
                        case 0: //下单失败 
                        case 100: //等待下单 
                        case 101: //下单成功 
                        case 102: //等待支付 
                        case 103: //支付中 
                        case 198: //退款中 
                        case 199: //已退款 
                        default: ;
                    }   
                } else {
                    _this.$message.error(error.message);
                }
            })
            .catch(function(error) {
                _this.$message.error(error.message);
            });        
       },
       repeatPay() {
           let _this = this;
           window.clearInterval(_this.queryPayStatus);
           this.creatOrder(() => {
                _this.dialogOptions.tpl = 'awaitPay';
           });
       }
    }
}
</script>
<style scoped>
.recharge-tip {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #fdf6ec;
    color: #63717b;
    font-size: 14px;
    margin: 20px auto 30px;
    padding-left: 20px;
}
.row{
    height: 30px;
    line-height: 30px;
}
.row .label{
    display: inline-block;
    width: 130px;
    height: 30px;
    line-height: 30px;
    text-align: right;
    font-size: 16px;
    font-weight: bold;
    color: #3c4a55;
    padding: 0;
}
.row .span{
    position: relative;
    display: inline-block;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #9eabb8;
    color: #3c4a55;
    float: left;
    margin-left: 20px;
    cursor: pointer;
}
.row .span .icon{
    display: none;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
    width: 24px;
    height: 24px;
    background: url(../../assets/images/cash-recharge-icon.png) right bottom
    no-repeat;
}
.row .span.active{
    border-color: #00bad0;
}
.row .span.span.active .icon{
    display: block;
}
.mb20 {
    margin-bottom: 20px;
}
.mb15 {
    margin-bottom: 15px;
}
.mr20 {
    margin-right: 20px;
}
.pay-tpl,
.success-tpl {
    height: 470px;
}
.icon-weixin {
    font-size: 25px;
    color: #28ac0c;
    margin: -7px 10px 0 0;
    float: left;
}
.icon-right {
    font-size: 25px;
    color: #00bad0;
    margin-right:10px;
}
.icon-weixinzhifu {
    font-size: 14px;
    margin-right:5px;
    color: #09bb07;
}
.query-btn {
    display: inline-block;
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #00bad0;
    border: 1px solid #00bad0;
    border-radius: 4px;
    cursor: pointer;
}
</style>



