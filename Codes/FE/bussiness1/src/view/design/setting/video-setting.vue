<template>
    <div class="video-setting">
        <div class="title">视频地址</div>
        <div><textarea class="videoHtmlTxt" v-model="html" placeholder="把视频通用代码复制到框中即可，只支持腾讯、优酷、爱奇艺视频"></textarea></div>
        <div class="blue" style="cursor: pointer;"><i class="iconfont icon-question" style="font-size: 12px;padding-right: 2px;"></i><span @click="dialogOptions.visible = true">什么是视频通用代码？</span></div>
        <div style="margin-top:10px;"><button class="blue_light_btn" @click="saveSetting()">保存</button></div>
        <el-dialog title="什么是视频通用代码" :append-to-body="true" :lock-scroll="false" :top="'5vh'" :visible.sync="dialogOptions.visible" width="650px" center>
            <div style='margin: 30px;border: 1px #c4ced8 solid;padding: 20px;padding-left: 37px;'>
                <div style='font-size: 14px;padding-bottom: 15px;'>以腾讯视频为例：</div>
                    <div style='padding-bottom: 10px;'>1.点击视频下方的分享按钮，展开弹出框：   </div>
                    <img src='../../../assets/images/plugin/vedio-info01.png' />
                    <div style='padding-top: 10px;padding-bottom: 8px;'>2.点击弹出框的“复制通用代码”即可：</div>
                    <img src='../../../assets/images/plugin/vedio-info02.png' />
                </div>
            <div>

            <div style='width: 100px;margin: 0 auto;margin-bottom: 30px;'>
                <el-button type="primary" @click="dialogOptions.visible = false;">知道了</el-button></div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import api from 'api'
import pagination from "components/ui-pagination";
import eventBus from '../../../utils/eventBus.js'

export default {
    name: 'video-setting',
    components: {
        pagination
    },
    data() {
        return {
            html: '',
            controlConfig: null,
            dialogOptions: {
                visible: false
            }
        }
    },
    computed: {
    },
    mounted() {
        this.init();
        eventBus.$on("settingRefresh", this.init);
    },
    beforeDestroy(){
        eventBus.$off('settingRefresh');
    },
    methods: {
        init(){
            var _currentBox = Kdo.box.utils.getCurrentBox(),
            _$box = _currentBox.$focusSingleBox;

            if (_currentBox.focusLevel == "single") {
                var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
                if (_controlConfigs.length > 0) {
                    this.controlConfig = _controlConfigs[0];
                    this.html = this.controlConfig.html;
                }
            }
        },
        validation(url) {
            let Agents = ["//player.youku.com/", "//open.iqiyi.com/", "https://v.qq.com/"];
            var flag = false;
            for (var v = 0, len = Agents.length; v < len; v++) {
                if (url.indexOf(Agents[v]) > 0) {
                    flag = true;
                    break;
                }
            }
            return flag;
        },
        saveSetting(){
            let self = this;
            if(!self.html){
                Kdo.utils.notification.error('请粘贴通用代码！');
                return false;
            } else if (!self.validation(self.html)) {
                Kdo.utils.notification.error('只支持来自爱奇艺、优酷、腾讯的通用代码噢！');
                return false;
            }
            self.html = self.html.replace('http://', 'https://');

            self.controlConfig.data.html = self.html;
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
.video-setting .title {
    padding: 5px 0 3px 0;
}

.video-setting textarea {
    width: 100%;
    height: 86px;
    background-color: #e3eaf4;
}

    .video-setting textarea:focus {
        border: 1px #82ccf8 solid;
        background-color: #fff;
    }
.video-setting .blue_light_btn {
    background-color: #00bad0;
    width: 370px;
    height: 40px;
    margin: 10px 0 0 0px;
    color: #fff;
}
</style>

