<template>
    <div class="audio-form-setting">
        <div>
            <el-checkbox v-model="autoPlayChecked" @change="refreshControl">
                自动播放
                <span style="color: #ff8c05;">（正式访问时生效）</span>
            </el-checkbox>
        </div>
        <div class="audio_source">
            <div :hidden="uploadingStatus">
                <div class="col-md-9 audio_title" :title="selectItem.title">{{selectItem.title || "未选择音乐"}}</div>
                <div class="col-md-3" style="text-align:right;">
                    <span v-if="selectItem.src" @click="deleteAudioSetting">
                        <i class="iconfont icon-delete-second"></i>清除</span>
                </div>
            </div>
            <div class="col-md-12" v-if="uploadingStatus">
                <i class="el-icon-loading" style="color: #333;"></i><span style="color: #333;">正在上传中</span>
            </div>
        </div>
        <div class="audio_btn clearfix">
            <button class=" pull-left" @click="choose">从音乐素材中选择</button>
            <form enctype="multipart/form-data">
                <input id="uploadAudio" type="file" name="fileName" multiple="multiple" accept="audio/*" class="pull-left input-upload" />
                <button class="pull-right">上传音乐</button>
            </form>
        </div>
        <div class="remarks">注：上传格式mp3，大小不超过2M</div>

        <el-dialog title="选择音乐" :visible.sync="dialogIsShow" :append-to-body="true" width="600px" center>
            <el-form v-model="audioList" ref="manuscript" label-width="100px" class="manuscriptForm">
                <div class="music_modal_content">
                    <div class="music_modal_body">
                        <table class="table" style="font-size:14px; margin-bottom: 0px;">
                            <tbody>
                                <tr v-for="(item,index) in audioList" :key="index" @click="chooseItem(item)" :class="{'on':item.audioPath == tempSelectItem.src}" role="button">
                                    <td>
                                        {{item.audioName}}
                                        <!-- <i class="el-icon-check" v-if="item.audioPath == tempSelectItem.src"></i> -->
                                    </td>
                                    <td style="text-align: right;">
                                        <i class="el-icon-delete" style="color: #ed5564; font-size:16px;" title="删除" @click="deleteAudio(item)"></i>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <pagination v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
                    </div>
                    <emptyTpl v-if="paginationOpt.totalCount == 0 " />
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="selectedAudio">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import api from 'api'
import pagination from "components/ui-pagination";
import eventBus from '../../../utils/eventBus.js'

export default {
    components: {
        pagination
    },
    data() {
        return {
            uploadingStatus: false,
            autoPlayChecked: false,
            selectItem: {},
            tempSelectItem: {},
            dialogIsShow: false,
            audioList: [],
            paginationOpt: {
                pageIndex: 1,
                pageSize: 8,
                totalCount: 1,
                pageCount: 0
            },
            currentControlId: null
        }
    },
    computed: {
    },
    mounted() {
        var _currentBox = Kdo.box.utils.getCurrentBox(),
            _$box = _currentBox.$focusSingleBox;
        if (_currentBox.focusLevel == "single") {
            var _controlConfigs = Kdo.data.controls.get(Kdo.box.utils.getBoxControlId(_$box));
            if (_controlConfigs.length > 0) {
                this.currentControlId = _controlConfigs[0].controlId;
            }
        }
        var self = this;
        self.bindUploadAudio();
        self.getAudioList();
        self.refreshSetting();

        eventBus.$on('settingRefresh', self.refreshSetting);
    },
    beforeDestroy(){
        eventBus.$off('settingRefresh');
    },
    methods: {
        getAudioList(cb) {
            let self = this;
            api.request("getAudioList", {
                pageIndex: self.paginationOpt.pageIndex,
                pageSize: self.paginationOpt.pageSize
            }, result => {
                if (result.status == 0) {
                    self.audioList = result.data.list;
                    self.paginationOpt.totalCount = result.data.total;
                    self.paginationOpt.pageCount = Math.ceil(self.paginationOpt.totalCount / self.paginationOpt.pageSize)
                } else {
                    Kdo.utils.messenger.error(result.message);
                }
                !!cb && cb();
            });
        },
        //分页调用方法
        pagesFn(pageIndex, cb) {
            let self = this;
            self.pagination = pageIndex;
            self.getAudioList(cb);
        },
        choose() {
            let self = this;
            self.tempSelectItem = Kdo.utils.copy(self.selectItem);
            this.getAudioList();
            this.dialogIsShow = true;
        },
        chooseItem(item) {
            let self = this;
            self.tempSelectItem = { title: item.audioName, src: item.audioPath };
        },
        closeDialog() {
            this.tempSelectItem = {};
            this.dialogIsShow = false;
        },
        selectedAudio() {
            this.selectItem = Kdo.utils.copy(this.tempSelectItem);
            this.refreshControl()
            this.dialogIsShow = false;
        },
        bindUploadAudio() {
            let self = this;
            setTimeout(() => {
                $("#uploadAudio").off("change").on("change", function() {
                    var $this = $(this);
                    var This = this;
                    var formData = new FormData($this.parent()[0]);
                    if (This.files.length > 1) {
                        Kdo.utils.notification.warning("单次请上传一个音源文件");
                        $this.val("");
                        return;
                    }
                    if (This.files[0].size > 2 * 1024 * 1024) {
                        Kdo.utils.notification.warning("音源文件大小不超过2M");
                        $this.val("");
                        return;
                    }
                    self.uploadingStatus = true;
                    api.request("uploadFiles", formData, result => {
                        if (result.status == 0) {
                            self.saveAudio(result.data[0]);
                        } else {
                            Kdo.utils.notification.error("音源文件上传失败！");
                            self.uploadingStatus = false;
                        }
                        $this.val("");
                    });
                });
            });
        },
        saveAudio(file) {
            let self = this;
            api.request("saveAudio", {
                audioName: file.title,
                audioPath: file.file
            }, result => {
                if (result.status == 0) {
                    self.tempSelectItem = { title: file.title, src: file.file };
                    this.selectedAudio();
                    self.uploadingStatus = false;
                } else {
                    Kdo.utils.notification.error(result.message);
                    self.uploadingStatus = false;
                }
            });
        },
        deleteAudio(item) {
            var self = this;
            Kdo.utils.messenger.confirm("确定要删除音乐吗？<br/>删除后不会影响已使用该音乐资源的模块", function (ok) {
                if(ok) {
                    api.request("saveAudio", { audioId: item.audioId, state: 1 }, result => {
                        if (result.status == 0) {
                            if(item.audioPath == self.tempSelectItem.src) self.tempSelectItem = {};
                            self.getAudioList();
                        } else {
                            Kdo.utils.messenger.error(result.message);
                        }
                    });
                }
            });
        },
        refreshSetting(){
            var controlConfig = Kdo.box.utils.getControlConfigById(this.currentControlId);
            this.autoPlayChecked = controlConfig.data.autoplay == "autoplay";
            this.$set(this, "selectItem", { title: controlConfig.data.title, src: controlConfig.data.src });
        },
        deleteAudioSetting() {
            this.selectItem = {};
            this.refreshControl();
        },
        refreshControl() {
            // 获取最新控件对象
            var controlConfig = Kdo.box.utils.getControlConfigById(this.currentControlId);
            controlConfig.data.autoplay = this.autoPlayChecked ? "autoplay" : "";
            controlConfig.data.title = this.selectItem.title;
            controlConfig.data.src = this.selectItem.src;
            // 更新对象
            Kdo.data.controls.update(controlConfig);
            //操作记录
            Kdo.featurer.actionLogs.log();
            //刷新选中模块
            Kdo.box.utils.refresh();
        }
    }
}
</script>
<style scoped>
.audio-form-setting .title {
    padding-top: 15px;
}

.audio-form-setting .audio_section{
    margin-bottom: 40px;
}

.audio-form-setting .audio_source {
    height: 40px;
    line-height: 40px;
    margin-bottom: 20px;
    background-color: #e3eaf4;
}

.music_modal_body .on {
    color: #fff;
    background-color: #00bad0;
}

.music_modal_body tr {
    height: 39px;
    border: 1px #cccccc solid;
}

.audio-form-setting .audio_source .audio_title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.audio-form-setting .audio_source span {
    color: #ed5564;
    cursor: pointer;
    padding-left: 10px;
}

.audio-form-setting .audio_source i {
    color: #ed5564;
    padding-right: 3px;
}

.audio-form-setting .audio_btn button {
    width: 49%;
    min-width: 100px;
    height: 34px;
    font: normal 14px/33px 'Microsoft YaHei';
    color: #fff;
    background-color: #00bad0;
    cursor: pointer;
    border-radius: 2px;
}

.audio-form-setting .audio_btn .input-upload {
    float: left;
    width: 49%;
    opacity: 0;
    position: absolute;
    width: 49%;
    height: 34px;
    opacity: 0;
    left: 49%;
    cursor: pointer;
}

.audio-form-setting .remarks {
    margin-top: 5px;
    color: #ff8c05;
}
</style>

