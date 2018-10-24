<template>
  <div class="upload-wrap">
    <input :id="upfileId" type="file" name="fileName" :accept="accept"/>
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    <span v-if="imageUrl" class="el-upload__tip">{{uploadTip}}</span>
  </div>
</template>
<script>
  import api from 'api'
  export default {
    name: 'com-upload',
    props: {
      'upfileId': {
          type:String,
          default:"upload"
      },
      'accept': {
          type:String,
          default:"image/*"
      },
      'size': {
          type:String,
          default: '3M'
      },
      'uploadTip': {
          type:String,
          default:"jpg/jpeg/gif/png"
      },
      'type': {
          type:String,
          default:"logo"
      },
      'fileType': {
          type:String,
          default:""
      },
      'imageUrl': {
          type:String,
          default:"logo"
      },
      'cb': {
          type:Function,
          default: function() {}
      }

    },
    data() {
      return {
        uploading: false,
        formValidations: true
      };
    },
    computed: {
      fileSize(){
        let tempSize = '';
        let mt = this.size.match(/^([\d\.]+)([^\d\.]*)$/i);
        if (!!mt) {
          let bit = mt[2].toLowerCase();
          if (bit === 'm' || bit === 'mb') {
            tempSize = mt[1] * 1024 * 1024;
          } else if (bit === 'kb' || bit === 'k' || bit === 'KB') {
            tempSize = mt[1] * 1024;
          }
        }
        return tempSize;
      }
    },
    mounted() {
      this.initUpload();
    },
    methods: {
      initUpload() {
        let _this = this;

        $('#' + _this.upfileId).unbind('change').bind('change', function () {
          console.log(111);
          var $this = $(this);
          var This = this;
          var len = This.files.length;

          if (!!_this.numMax &&　len > _this.numMax) {
            Kdo.utils.messenger.error('单次上传不能超过'+_this.numMax +'个文件!');
            $this.val("");
            return false;
          }
          for (var i = 0; i < len; i++) {
            if (!!_this.size && This.files.item(i).size > _this.fileSize) {
              _this.formValidations = false;
              Kdo.utils.messenger.error('文件大小不能超过'+_this.size+'！');
              $this.val("");
              return false;
            }
            //判断文件类型是否合格
            if (!!_this.fileType && !eval(_this.fileType).test(This.files.item(i).name)) {
              _this.formValidations = false;
              Kdo.utils.messenger.error('文件类型不正确！');
              $this.val("");
              return false;
            }
          
          }

          if(_this.uploading || !_this.formValidations){
            _this.formValidations = true;
            return false;
          }
          let formData = new FormData($this.parents('form')[0]);
          _this.uploading = true;
          api.request("uploadFiles", formData, result => {
            if (result.status == 0) {
              let obj = {};
              obj[_this.type] = result.data[0].file;
              !!_this.cb && _this.cb(obj);
            } else {
              Kdo.utils.messenger.error("图片上传失败！");
            }
            $this.val('');
            _this.uploading = false;
          });

        })
      }
    }
  }

</script>
<style scoped>
.upload-wrap {
  width: 140px;
  height: 140px;
  position: relative;
  border: 1px dotted #dfe5ec;
}
.upload-wrap input{
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  filter:alpha(opacity=0);/* 兼容IE */
  z-index: 9;
}
.upload-wrap .avatar-uploader-icon{
  position: absolute;
  top: 0px;
  left: 0px;
  font-size: 28px;
  color: #8c939d;
  width: 140px;
  height: 140px;
  line-height: 140px;
  text-align: center;
  z-index: 1;
}
.upload-wrap .avatar {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 138px;
  height: 138px;
  display: block;
  z-index: 1;
}
.upload-wrap .el-upload__tip{
  position: absolute;
  width: 100%;
  height: 40px;
  left: 0;
  bottom: 0;
  padding: 4px 15px 0;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  z-index: 1;
}
</style>


