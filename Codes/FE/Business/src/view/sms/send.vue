<template>
    <div class="sms-send-window">
        <el-collapse :accordion="true" @change="handleChange">
            <el-collapse-item name="sms-tpl-panel" class="sms-collapse-panel">
                <div slot="title" style="text-align:left;">
                    短信模板
                    <div  class="sms-search-panel">
                        <div class="form-sms-search" v-if="showSmsTplSearch">   总共 <span class="yellow-light">{{smsTpls.pagination.total}}</span> 个模板
                            <com-search  placeholder="按短信内容关键字搜索"
                                @searchHandler="smsTplSearchHandler"
                            ></com-search>
                        </div>
                        <span class="black-light">{{collapseText}}</span>
                    </div>

                </div>
                <custom-scroll :options="{scrollX: true, scrollY: false,scrollbars:true}" @scroll-end="loadMoreSMSTpl" :refresh="refreshEvt"  >
                    <div class="tpl-body">
                        <el-card v-if="showSmsTplSearch&& smsTpls.list.length>0" v-for="data in smsTpls.list" :key="data.smsId" shadow="hover" class="tpl-item" 
                        @click.native.stop="selectSMSTplHandler(data)"
                        :class="{'selected':data.smsId === selectedSMSTpl.smsId}"
                        >
                            <sms-content :data="data" />
                        </el-card> 
                        <div v-if="smsTpls.list.length<= 0" class="no-content"> 暂无数据 </div>
                    </div>
                </custom-scroll >
            </el-collapse-item>
        </el-collapse>
        <el-row class="sms-send-panel">
            <el-col class="sms-customer-panel" :span="13">
                <el-row class="sms-customer-search-panel" style="text-align:left" :gutter="20">
                    <el-col :span="13">
                        收信人：<com-search  placeholder="输入姓名、手机"
                                @searchHandler="smsCustomerSearchHandler"
                            ></com-search>
                    </el-col>
                    <el-col :span="11"><div>短信剩余<span class="yellow-light" v-text="surplusSms"></span>条</div>
                    </el-col>
                </el-row>
                <el-transfer
                    v-model="customers.selectedList"
                    :right-default-checked="customers.selectedList"
                    :titles="['选择当前条件下所有客户', '已选择客户数']"
                    :format="{
                      noChecked: '${total}',
                      hasChecked: '${checked}/${total}'
                    }"
                    :props="{key:'mobile',label:'nickname'}"
                    :data="customers.list">
                    <span slot-scope="{ option }">{{ option.nickname }}&nbsp;&nbsp;{{option.mobile}}</span>
                  </el-transfer>
            </el-col>
            <el-col class="sms-content-panel" :span="10">
                <el-row>
                    <el-form ref="form" :model="sendSMSForm" label-width="74px" size="mini">
                        <el-form-item label="短信签名 :">
                              <el-select v-if ="singNameList.length>0" v-model="sendSMSForm.signName" size="small" placeholder="请选择短信签名" style="width:100%;" >
                                    <el-option
                                    v-for="item in singNameList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                    </el-option>
                                </el-select>
                                <span v-else> 请设置短信签名 </span>
                        </el-form-item>
                        <div class="sms-send-body">
                            <el-form-item class="sms-content">
                                <el-input  type="textarea"
                                    :rows="4"
                                    placeholder="请输入内容" 
                                    v-model="templateContent"
                                    resize="none"
                                    ></el-input>
                            </el-form-item>
                            <el-form-item class="sms-toolbar" label="发送时间 :" style="padding-right: 6px;">
                                <el-radio-group v-model="sendSMSForm.isTime" style="display:block;text-align:left;">
                                    <el-radio :label="0">立即发送</el-radio>
                                    <el-radio :label="1">定时发送</el-radio>
                                    <el-date-picker
                                        v-if="sendSMSForm.isTime===1"
                                        v-model="sendSMSForm.sendTime"
                                        type="datetime"
                                        size="small"
                                        placeholder="选择日期时间"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        >
                                    </el-date-picker>
                                    <el-button style="float:right;" type="primary" size="small" @click.native.stop="sendSMSHandler" :disabled="!btnSendSMSenabled || sending" >正式发送</el-button>
                                </el-radio-group>
                                
                            </el-form-item>
                        </div>  
                        
                    </el-form>
                </el-row>
            </el-col>
            
        </el-row>
    </div>
</template>
<script>

    import eventBus from '../../utils/eventBus';
    import api from "api";

    export default {
        props:{
            smsId:String,
        },
        data(){
            return{
                showSmsTplSearch:false,
                selectedSMSTpl:{},
                smsTpls:{
                    list:[],
                    pagination:{
                        pageIndex:1,
                        pageSize:8,
                        total:0,
                    },
                    tplKeywords:'',
                },
                singNameList:[],
                refreshEvt:'sms-tpl-refresh',
                sendSMSForm:{
                    smsId:'',
                    signName:'',
                    templateContent:'',
                    sendTime:'',
                    isTime:0,
                },
                customers:{
                    list:[],
                    selectedList:[],
                    keywords:'',
                    pagination:{
                        pageIndex:1,
                        pageSize:1000,
                        total:0
                    }
                },
                sending:false,
                surplusSms:0 //短信剩余条数
            }
        },
        computed:{
            collapseText(){
                if(!!this.showSmsTplSearch){
                    return "收缩";
                }else{
                    return "展开";
                }
            },
            templateContent:{
                get(){
                    return `${this.sendSMSForm.templateContent}`;
                },
                set(val){
                    this.sendSMSForm.templateContent = val.replace(new RegExp(`【.*】`,'ig'),'');
                }
            },
            btnSendSMSenabled(){
                let {signName,templateContent,isTime,sendTime} = this.sendSMSForm;
                return !!signName && !!templateContent && (isTime ===0 || (isTime ===1 && !!sendTime)) &&this.customers.selectedList.length>0
            }
        },
        methods:{
            handleChange(an){
                this.showSmsTplSearch = an==='sms-tpl-panel';
                if(this.showSmsTplSearch){
                    setTimeout(()=>{
                        eventBus.$emit(this.refreshEvt);
                    },300);
                }
            },
            smsTplSearchHandler(keywords){
                this.smsTpls.tplKeywords = keywords;
                this.smsTpls.pagination.pageIndex = 1;
                this.getSMSTplList();
            },
            loadMoreSMSTpl(){
                let {total,pageIndex,pageSize} =this.smsTpls.pagination;
                if(Math.ceil( total / pageSize) > pageIndex ){
                    this.smsTpls.pagination.pageIndex++;
                    this.getSMSTplList();
                }
            },
            smsCustomerSearchHandler(keywords){
                this.customers.keywords = keywords;
                this.customers.pagination.pageIndex = 1;
                this.getCustomerList();
            },
            loadMoreCustomers(){
                let {total,pageIndex,pageSize} =this.customers.pagination;
                if(Math.ceil( total / pageSize) > pageIndex ){
                    this.customers.pagination.pageIndex++;
                    this.getCustomerList();
                }
            },
            selectSMSTplHandler(item){
                if(this.selectedSMSTpl.smsId === item.smsId){
                    this.selectedSMSTpl={
                    }
                }else{
                    this.selectedSMSTpl = item;
                    this.templateContent=this.selectedSMSTpl.templateContent
                }
            },
            getSMSTplList(){
                let self =this;
                if(!!self.tplLoading){
                    return ;
                }
                let options =Object.assign( {searchStr:self.smsTpls.tplKeywords},self.smsTpls.pagination);
                self.tplLoading =true
                api.request('getSMSTemplate', options, result => {
                    if (result.status == 0) {
                        if(options.pageIndex === 1){
                        self.smsTpls.list=[];
                        }
                        result.data.list.reduce((list,rec)=>{
                            let data = {
                                smsId:rec.id,
                                name:rec.name,
                                templateContent:rec.content,
                                type:rec.type,
                                status:0
                            }
                            list.push(formatStatus(data));
                            return list;
                        },self.smsTpls.list);
                        self.smsTpls.pagination.total = result.data.total;
                        self.$nextTick(()=>{
                            eventBus.$emit(self.refreshEvt);
                        })  
                    } else {
                        self.$message.error(result.message);
                    }
                    self.tplLoading = false;
                });
                function formatStatus(rec){
                    let data = {...rec};
                    switch (data.status) {
                        case 0:
                            data.iconClass = "icon-msg-editing";
                            break;
                        case 1:
                            data.iconClass = "icon-msg-auditing";
                            break;
                        case 2:
                        case 3:
                            data.iconClass = "icon-msg-fail";
                            break;
                        case 6:
                            data.iconClass = "icon-msg-success";
                        break;
                        case 4:
                        default:
                            data.iconClass = "icon-msg-success";
                            break;
                    }
                    return data;
                }
            },
            getCustomerList(selectedList){
                let self =this;
                if(!!self.customerLoading){
                    return ;
                }
                let options =Object.assign( {keyWords:self.customers.keywords},self.customers.pagination);
                self.customerLoading =true
                api.request('getCustomerList', options, result => {
                    if (result.status == 0) {
                        if(options.pageIndex === 1){
                        self.customers.list=[];
                        }
                        result.data.list.reduce((list,rec)=>{  
                            list.push(Object.assign({},rec));
                            return list;
                        },self.customers.list);
                        self.customers.pagination.total = result.data.total;
                        if(!!selectedList&&selectedList.length>0){
                            self.customers.selectedList=[...new Set([].concat(self.customers.selectedList,selectedList))];
                        }
                        self.$nextTick(()=>{
                            // eventBus.$emit(self.refreshEvt);
                        })  
                    } else {
                        self.$message.error(result.message);
                    }
                    self.customerLoading = false;
                });
            },
            getSingNameList(){
                let self =this;
                let options = {secretKey:localStorage.businessSecret};
                api.request('getSingNameList', options, result => {
                    if (result.status == 0) {
                        self.singNameList=[];
                        result.data.signs.reduce((list,rec)=>{  
                            list.push(rec);
                            return list;
                        },self.singNameList);
                        self.sendSMSForm.signName=self.singNameList[0];
                    } else {
                        self.$message.error(result.message);
                    }
                });
            },
            getSMSInfo(cb){
                let self =this;
                if(!!this.smsId){
                    let options = {secretKey:localStorage.businessSecret,smsId:this.smsId};
                    api.request('smsQuery', options, result => {
                        if (result.status == 0) {
                            self.singNameList=[];
                            if(!result.data.list || result.data.list.length<=0){
                               return self.$message.error('短信不存在');
                            }
                            let rec = result.data.list[0];
                            self.sendSMSForm={
                                smsId:rec.smsId,
                                signName:rec.signName,
                                templateContent:rec.templateContent,
                                sendTime:rec.sendTime,
                                isTime:!!rec.sendTime ? 1 : 0,
                            };
                            fetchCustomers(rec);
                        } else {
                            self.$message.error(result.message);
                        }
                    });
                }else{
                    let rec ={
                        phones:sessionStorage.getItem('phoneList')||'[]'
                    }
                    fetchCustomers(rec);
                }

                function fetchCustomers(rec){
                    let selectedList = [];
                    try {
                        selectedList = JSON.parse(rec.phones)
                    } catch (error) {
                        return self.$message.error('手机号无效');
                    }
                    cb&&cb(selectedList);
                }
            },
            sendSMSHandler(){
                    let self = this;
                    let model = this.sendSMSForm;
                    if(!model.templateContent){
                        return this.$message.error('请输入短信内容');
                    }
                    if(model.isTime === 0){
                        model.sendTime=void(0);
                    }else if(model.isTime===1 ){
                        if(!model.sendTime){
                            return this.$message.error('请选择定时发送时间');
                        }else if(model.sendTime <= new Date()){
                            return this.$message.error('定时发送时间必须大于当前时间');
                        }
                    }

                    if(!this.customers.selectedList || this.customers.selectedList.length<1){
                        return this.$message.error('请选择收信人');
                    }
                    this.sending = true;
                    let body ={
                        secretKey:localStorage.businessSecret,
                        templateContent:model.templateContent,
                        signName:model.signName,
                        phones:this.customers.selectedList,
                        identity:'business',
                        sendTime:model.sendTime || null,
                        smsId:this.smsId
                    };
                    let timer = setTimeout(()=>{
                        this.sending=false;
                    },60*1000);
                    api.request('sendSMS', body, result => {
                        if (result.status == 0) {
                            self.$message.success('提交成功！');
                        } else {
                            self.$message.error(result.message);
                        }
                        this.sending=false;
                        clearTimeout(timer);
                    });
                    
                    if(!!this.selectedSMSTpl&&!!this.selectedSMSTpl.smsId){
                        api.request('smsTplQuote', {smsId:this.selectedSMSTpl.smsId}, result => {
                            if (result.status == 0) {
                                console.info('短信模板使用计数成功');
                            } else {
                            console.error(result.message);
                            }
                        });
                }
            }
        },
        mounted(){
            var self=this;
            self.getSMSTplList();
            self.getSMSInfo(self.getCustomerList)
            // this.getCustomerList();
            self.getSingNameList();
            api.request('getSmsInfo', {secretKey:localStorage.businessSecret,type:1,pageIndex:1}, result => {
               if(result.status==0&&result.data!="用户没有资源"){
                   self.surplusSms=parseFloat(result.data.resGiveRemainder)+parseFloat(result.data.resBuyRemainder);
               }
            })
        }
    }
</script>

<style>
    .sms-send-window .sms-search-panel{
        float: right;
    }
    
    .sms-send-window .form-sms-search{
        display: inline-block;
    }
    .sms-send-window .sms-search-input{
        width: 200px;
        margin-left: 10px;
        margin-right: 10px;
    }
    .sms-send-window .el-collapse-item__content{
        background-color: #fafbff;
    }
    .sms-send-window .tpl-body{
        height: 200px;
        min-width: 100%;
        padding: 10px;
        box-sizing: border-box;
        writing-mode: vertical-lr;
    }
    .sms-send-window .tpl-item{
        width: 350px;
        height: 85px;
        writing-mode: horizontal-tb;
        display: inline-block;
        margin-bottom: 10px;
        margin-right: 10px;
    }
    .sms-send-window .tpl-item:nth-child(even){
        margin-bottom: 0;
    }
    .sms-send-window .selected{
        border:2px solid #00BAD0;
        /* outline: 1px solid #24d0c6;  */
    }
    .sms-send-window .no-content{
        writing-mode: horizontal-tb;
        width: 100%;
        text-align: center;
    }
   
    .sms-send-panel{
        padding-top:10px;
    }
    .sms-send-panel .sms-content-panel {
        width: 520px;
    }
     .sms-send-body {
        border: 1px solid #eee;
        box-sizing: border-box;
        padding: 10px;
        position: relative;
        height: 300px;
    }
    .sms-send-body .sms-content .el-form-item__content{
        margin-left: 0 !important;
    }
    .sms-send-body .el-textarea__inner{
        border: none;
        height: 200px;
        padding: 0;
    }
    .sms-send-window .sms-send-body .el-radio+.el-radio{
        margin-right: 5px;
        margin-left: 10px;
    }
    .sms-send-panel .el-form-item--mini.el-form-item,
    .sms-customer-search-panel{
        margin-bottom:10px; 
        line-height: 32px;
    }
    .sms-send-body .el-date-editor.el-input, 
    .sms-send-body .el-date-editor.el-input__inner{
        width: 173px;
        margin-right: 10px;
    }
    .sms-send-body .sms-toolbar{
        background-color: #f5f6fa;
        height: 50px;
        margin-bottom: 0 !important;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding:10px;
    }
    .sms-send-body .sms-toolbar label{
        margin-bottom: 0px;
        height: 32px;
        line-height: 32px;
        display: inline-block;
    }
    .sms-send-panel .el-form-item__label,
    .sms-send-panel .el-radio__label{
        padding-right: 10px;
        font-weight: normal;
        color: #63717b;
        line-height:27px;
    }
    .sms-send-panel .el-radio__label{
        padding-left: 5px;
        padding-right:0;
    }

    /* .sms-send-body .sms-content::after{
        content: "";
        height: 1px;
        background-color: #eee;
        margin: 0 -10px;
        width: 520px;
        margin-bottom: 45px;
    } */
    .sms-customer-panel{
        width: 630px;
        padding-right:10px;
    }
    .sms-customer-panel .el-transfer{
        text-align: left; display: inline-block;
        height:245px; width:100%;
        border:1px solid #eee;
        padding: 10px;
        height: 300px;
    }
    .sms-customer-panel .el-transfer-panel{
        width: 266px;
    }
    .sms-customer-panel .el-transfer .el-transfer-panel__list {
        height: 237px;
    }
    .sms-customer-panel .com-search-input{
        display: inline-block;
        margin-right: 0;
    }
    
</style>


