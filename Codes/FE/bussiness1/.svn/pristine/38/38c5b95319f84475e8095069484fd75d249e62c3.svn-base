<template>
    <div class="qrcode-setting">
        <div class="">
            <p @click="swithType('fromurl')">
                <i class="icon" :class="{'choose':pageControl.chooseType == 'fromurl'}"></i>
                <label>输入网址生成二维码</label></p>
            <p v-if="pageControl.chooseType == 'fromurl'"><input type="text" name="choose-url" placeholder="以http://或https://开头" v-model="pageControl.inputUrl"/></p>
        </div>
        <div class="">
            <p @click="swithType('fromh5')">
                <i class="icon" :class="{'choose':pageControl.chooseType == 'fromh5'}"></i>
                <label>选择已发布活动作品生成二维码</label></p>
            <p class="relative" v-if="pageControl.chooseType == 'fromh5'" @click="dialogOptions.visible = true;">
                <input type="text" placeholder="请选择营销活动作品" readonly v-model="pageControl.H5Name"/>
                <span class="choose-tail"></span>
            </p>
        </div>
        <div class="btn_wrap" v-show="pageControl.chooseType != ''">
            <button @click="creatQrcode">生成二维码</button>
        </div>
        <el-dialog title="选择已发布的活动二维码" :append-to-body="true" :lock-scroll="false" :top="'5vh'" :visible.sync="dialogOptions.visible" width="1050px" center>
            <!-- List -->
            <div class="container-fluid clear-padding" v-if="paginationOpt.totalCount > 0">
                <div class="tpl-table">
                    <manuscriptItem :options="{category:'qrcode', actions:manuscriptItemOpt.actions}" :data="item" @manuscript-item-event="manuscriptCallback" v-for="item in list" :key="item.id" />
                </div>
            </div>
            <div style="padding-right:40px;">
                <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
            </div>
            <emptyTpl v-if=" paginationOpt.totalCount == 0 "/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogOptions.visible = false;">取 消</el-button>
                <el-button type="primary" @click="checkSelect">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import manuscriptItem from "components/manuscript-item";
import pagination from "components/ui-pagination";
import emptyTpl from "components/empty-tpl";
import eventBus from '../../../utils/eventBus.js';
import api from "api";
export default {
    components: {
        pagination,
        manuscriptItem,
        emptyTpl
    },
    name: 'qrcode-setting',
    data (){
        return {
            pageControl: {
                inputUrl: '',
                chooseType: '',//选择类型   --fromurl   --fromh5
                qrcodeUrl: '',
                H5Name: '',
                H5Url: ''
            },
            controlConfig: null,
            dialogOptions: {
                visible: false
            },
            paginationOpt: {
                pageIndex: 1,
                pageSize: 10,
                totalCount: 1,
                pageCount: 0
            },
            manuscriptItemOpt: {
                actions: []
            },
            list: [],
            currentItem: { id: ''}
        }
    },
    created(){
        eventBus.$on("settingRefresh", this.init);
    },
    beforeDestroy(){
        eventBus.$off('settingRefresh');
    },
    mounted(){
        this.init(); 
    },
    methods: {
        init(){
            var _currentBox = Kdo.box.utils.getCurrentBox(),
                _$box = _currentBox.$focusSingleBox;

            if (_currentBox.focusLevel == "single") {
                var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
                if (_controlConfigs.length > 0) this.controlConfig = _controlConfigs[0];
            }

            this.pageControl = {
                inputUrl: this.controlConfig.data.inputUrl,
                chooseType: this.controlConfig.data.chooseType,//选择类型   --fromurl   --fromh5
                qrcodeUrl: this.controlConfig.data.qrcodeUrl,
                H5Name: this.controlConfig.data.H5Name,
                H5Url: this.controlConfig.data.H5Url
            }

           this.getList();

        },
        //却换二维码类型
        swithType (type){
            this.pageControl.chooseType = type;
        },
        //获取模板列表
        getList(cb) {
            var _this = this,
                _option = {
                    pageIndex: _this.paginationOpt.pageIndex,
                    pageSize: _this.paginationOpt.pageSize,
                    businessId: localStorage.businessId
                },
                apiKey = "getManuscriptListOfRelease";
            
            api.request(apiKey, _option, result => {
                if (result.status == 0) {
                _.each(result.data.list,function(item){
                    item.active = false;
                })
                _this.list = result.data.list;
                _this.paginationOpt.totalCount = result.data.total;
                _this.paginationOpt.pageCount = Math.ceil(
                    _this.paginationOpt.totalCount / _this.paginationOpt.pageSize
                );
                } else {
                    _this.myMessage.error(result.message);
                }
                !!cb && cb();
            });
        },
        //分页调用方法
        pagesFn (pageIndex, cb) {
            let _this = this;
            _this.pagination = pageIndex;
            _this.getList(cb);
        },
        manuscriptCallback (data) {//获取选中的h5
            var self = this;
            _.each(self.list, function(item){
                if(data.id == item.id){
                    item.active = true;
                }else {
                    item.active = false;
                }
            });
            self.currentItem = data;
        },
        //确定选择h5
        checkSelect(){
            this.pageControl.H5Url = this.currentItem.url;
            this.pageControl.H5Name = this.currentItem.name;
            this.dialogOptions.visible = false;
        },
        //生成二维码
        creatQrcode () {
            var self = this;
            if(self.pageControl.chooseType == 'fromurl'){
                self.pageControl.qrcodeUrl = self.pageControl.inputUrl;
            }else{
                self.pageControl.qrcodeUrl = self.pageControl.H5Url;
            }
            if(!self.pageControl.qrcodeUrl){
                if(self.pageControl.chooseType == 'fromurl'){
                    Kdo.utils.messenger.error('请输入网址！');
                    return false;
                }else if(self.pageControl.chooseType == 'fromh5'){
                    Kdo.utils.messenger.error('请选择营销活动作品！');
                    return false;
                }else{
                    Kdo.utils.messenger.error('请输入网址或者选择营销活动作品！');
                    return false;
                }
            }else if(!/^http[s]?:\/\//i.test(self.pageControl.qrcodeUrl)){
                Kdo.utils.messenger.error('输入的域名错误，请重新输入以http://或https://开头的正确域名！');
                return false;
            }
            // 获取最新控件对象
            self.controlConfig = Kdo.box.utils.getControlConfigById(self.controlConfig.controlId);
            self.controlConfig.data.inputUrl = self.pageControl.inputUrl;
            self.controlConfig.data.qrcodeUrl = self.pageControl.qrcodeUrl;
            self.controlConfig.data.chooseType = self.pageControl.chooseType;
            self.controlConfig.data.H5Name = self.pageControl.H5Name;
            self.controlConfig.data.H5Url = self.pageControl.H5Url;
            Kdo.data.controls.update(self.controlConfig);
            //操作记录
            Kdo.featurer.actionLogs.log();
            //刷新选中模块
            Kdo.box.utils.refresh();
        }
    }
}
</script>
<style scoped>
.qrcode-setting .relative{
    position: relative;
}
.qrcode-setting .title {
    padding: 30px 0 15px 0;
}
.qrcode-setting p{
    height: 28px;
    line-height: 28px;
    margin-bottom: 10px;
}
.qrcode-setting .icon{
    float: left;
    width: 16px;
    height: 16px;
    background: url(/static/images/select_img.png)no-repeat;
    background-position: -16px 0px;
    margin: 6px 5px 0 0;
    cursor: pointer;
}
.qrcode-setting .icon.choose{
    background-position: -16px -16px;
}
.qrcode-setting label{
    font-weight: normal;
}
.qrcode-setting input {
    width: 100% !important;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    border-radius: 2px;
    border: 1px solid #c9d4df;
}

    .qrcode-setting input[name='choose-url']:focus {
        border-color: #82ccf8;
    }
.qrcode-setting .choose-tail{
    position: absolute;
    top: 1px;
    right: 0px;
    width: 26px;
    height: 26px;
    background-color: #8daac2;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
}
.qrcode-setting .choose-tail:before{
    position: absolute;
    content: '';
    top:10px;
    left: 8px;
    border: 6px solid transparent;
    border-top: 6px solid #213d54;
    cursor: pointer;
}
.qrcode-setting .btn_wrap{
    margin-top: 30px;
    text-align: center;
}
.qrcode-setting button{
    width: 240px;
    height: 40px;
    background-color: #00bad0;
    color: #fff;
    border-radius: 2px;
}
.tpl-table {
    height: 594px;
    overflow: hidden;
    margin-top: -30px;
}
</style>


