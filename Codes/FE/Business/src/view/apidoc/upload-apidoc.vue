<template>
    <div class="block block-condensed" style="padding: 10px 0 0;">
        <div class="wrap">
            <form class="form-horizontal" :class="[uploadComponentConfig.upfileId + 'form']" style="overflow:hidden;"
                enctype="multipart/form-data">
                <div class="form-group">
                <label class="col-md-3 control-label">apidoc文件</label>
                <div class="col-md-9">
                    <comupload :uploadComponentConfig="uploadComponentConfig" ref="childMethod"></comupload>
                </div>
                </div>
            </form>
            <div class="form-group margin-top-20">
                <button class="btn btn-primary" type="button" @click="subumitReg">提交</button>
            </div>
        </div>
    </div>
</template>
<script>
import comupload from '../../components/com-upload';
export default {
     components: {
      comupload
    },
    data () {
        return {
            uploadComponentConfig: {//上传文件组件配置项
                upfileId: 'upfile' + new Date().getTime(), //上传input框id
                fileType: '/.apidoc$/',//强制定义文件类型  -- 验证用
                accept: '*', //接受文件类型  ---  默认'image/*'
                uploadTip: '请上传.apidoc类型的文件',//提示上传类型的文字描述
                // size: '', //单个文件大小限制  ---  默认 3M
                // numMax: 10,//单次最多上传个数  number 类型
                // single: true,//是否只能选择单个文件上传  ----  默认  可以上传多个文件
                // imgpreview: true,//是否要预览 ---- 上传图片类型才传这个   默认不预览
                // autoUpload: true,//是否自动上传，选择完文件后自动上传
                // autoUploadUrl: 'apidoc/upload',//上传文件地址，自动上传时配置
                // anotherParam: {},//需要附加到formdata里面参数，自动上传时可配
                // seccessCb: function(){//上传成功回调，自动上传可配
                // console.log('success');
                // },
                // errorCb: function(){//上传失败回调，自动上传可配
                // console.log('error');
                // }
            }
        }
    },
    methods: {
        subumitReg () {
            let _this = this
            , inputobj = $('#' + this.uploadComponentConfig.upfileId);
            let formData = new FormData(inputobj.parents('.' + _this.uploadComponentConfig.upfileId + 'form')[0]);

            this.myUploadFn({
                inputobj: inputobj,
                formData: formData,
                url: 'apidoc/upload',
                successCb: () => {
                    _this.myMessage.success('上传成功！');
                    _this.$refs.childMethod.reset();
                },
                errorCb: () => {
                    _this.myMessage.error('上传失败！');
                }
            })
        }
    },
    beforeDestroy () {
        this.$refs.childMethod.reset();
    }
}
</script>
<style scoped>
.wrap {
    width: 500px;
    height: auto;
    margin: 50px;
}
.btn-primary {
    margin: 40px 126px;
}
</style>


