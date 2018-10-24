<template>
  <div class="block block-condensed" style="padding: 10px 0 0;">
    <vdialog :isShow="showDialog" :options="dialogOptions" v-on:modalResponse="modalResponse">
      <form class="form-horizontal" :class="[uploadComponentConfig.upfileId + 'form']" style="overflow:hidden;"
            enctype="multipart/form-data">
        <div class="form-group">
          <label class="col-md-3 control-label">接口描述文件</label>
          <div class="col-md-9">
            <comupload :uploadComponentConfig="uploadComponentConfig" ref="childMethod"></comupload>
          </div>
        </div>
      </form>
      <div class="form-group">
        <button style="margin-left:143px;" class="btn btn-default" type="button" @click="emptyFiles">清空已上传文件</button>
      </div>
    </vdialog>
    <div class="block-content">
      <div class="col-md-12" style="padding: 0">
        <a href="#/service-reg">
          <button type="button" class="btn btn-primary pull-left">注册服务</button>
        </a>
        <div class="col-md-3 pull-right">
          <div class="input-group pull-right">
            <input type="text" class="form-control" v-model="name" @keyup.delete="getInitData()"
                   placeholder="Key、服务名、描述">
            <span class="input-group-btn">
              <button class="btn btn-default" type="button" @click="getInitData()">查询</button>
            </span>
          </div>
        </div>
      </div>
      <div class="tabBox">
        <ul class="table-head-custom-ul">
          <li class="tabHead">
            <div class="headSpan"><span>Key</span></div>
            <div class="headSpan"><span>服务名</span></div>
            <div class="headSpan"><span>描述</span></div>
            <div class="headSpan"><span>操作</span></div>
            <div class="headSpan" style="width: 2%;"><span>&nbsp;</span></div>
          </li>
          <li v-for="item in dataList" :key="item.index">
            <div class="sevList">{{item.key || '-'}}</div>
            <div class="sevList">{{item.name || '-'}}</div>
            <div class="sevList">
              <div class="desc">
                <p>
                  {{item.desc || '-'}}
                </p>
                <div v-if="!!item.desc" class="test">
                  <span class="bot"></span>
                  {{item.desc}}
                </div>
              </div>
            </div>
            <div class="sevList">
              <button class="btn btn-default btn-icon" title="编辑" @click="editSerFn(item,'base')">
                <span class="fa fa-pencil"></span>
              </button>
              <!--<button class="btn btn-default btn-icon" v-if="item.status != 'testing'"-->
                      <!--:title="item.maintenance ? '启用' : '禁用'" @click="disableSerFn(item)">-->
                <!--<span class="fa" :class="item.maintenance ? 'fa-unlock':'fa-unlock-alt'"></span>-->
              <!--</button>-->
              <button class="btn btn-default btn-icon" title="删除" @click="deleteSerFn(item)">
                <span class="fa fa-times" style="color: #CD0000;"></span>
              </button>
              <button class="btn btn-default btn-icon" title="下载" @click="downSerFn(item)">
                <span class="icon-download2"></span>
              </button>
            </div>
            <div class="unfoldBox">
              <span v-show="item.unfold == 0" @click="selectListFn(item);item.unfold = 1" class="icon-chevron-down-circle"></span>
              <span v-show="item.unfold == 1" @click="selectListFn(item);item.unfold = 0" class="icon-chevron-up-circle"></span>
            </div>
            <ul v-show="item.unfold == 1">
              <li>
                <div class="versionListHead">Ip</div>
                <div class="versionListHead">端口</div>
                <div class="versionListHead">版本号</div>
                <div class="versionListHead">状态</div>
                <div class="versionListHead">操作</div>
              </li>
              <li v-for="list in item.info" :key="list.index">
                <div class="versionList">{{list.address}}</div>
                <div class="versionList">{{list.port}}</div>
                <div class="versionList">{{list.version}}</div>
                <div class="versionList" :style="{color:list.color}">{{list.stateName}}</div>
                <div class="versionList">
                  <button class="btn btn-default btn-icon" title="编辑" @click="editSerFn(list,'detail')">
                    <span class="fa fa-pencil"></span>
                  </button>
                  <button class="btn btn-default btn-icon" v-if="list.status != 'testing'"
                          :title="list.status == 'maintenance' ? '启用' : '禁用'" @click="disableSerFn(list)">
                    <span class="fa" :class="list.status == 'maintenance' ? 'fa-unlock':'fa-unlock-alt'"></span>
                  </button>
                  <button class="btn btn-default btn-icon" title="删除" @click="deleteSerFn(list)">
                    <span class="fa fa-times" style="color: #CD0000;"></span>
                  </button>
                  <button class="btn btn-default btn-icon" title="上传" @click="uploadSerFn(list)">
                    <span class="icon-upload2"></span>
                  </button>
                </div>
              </li>
              <li v-if="item.info.length <= 0">
                <div style="width: 100%;">未获取到当前API服务信息</div>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <pageBox class="pull-right" :pagination="pagination" v-on:setPageData="pagesFn($event)"></pageBox>
    </div>
    <vdialog :isShow="showDownLog" :options="dialogDownOptions" v-on:modalResponse="DownModalResponse">
      <div class="downBox">
        <table class="table">
          <tbody>
          <tr>
            <td width="20%">服务名称</td>
            <td>{{downSerDetail.name_show}}</td>
          </tr>
          <tr>
            <td>Key</td>
            <td>{{downSerDetail.key_show}}</td>
          </tr>
          <tr>
            <td>当前版本</td>
            <td>{{downSerDetail.verData.version}}</td>
          </tr>
          <tr>
            <td>文件下载：</td>
            <td>
              <button class="downListBox btn btn-default" v-for="(val,key,index) in downSerDetail.verData" :key="index"
                      v-show="key != 'version'">
                <a target="_blank"
                   :href="downApiUrl+'thrift/download?name='+ key +'&path='+val + '&sessionid=' + sessionid">下载
                  {{key}}</a>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </vdialog>

    <vdialog :isShow="showDelLog" :options="deleteOptions" v-on:modalResponse="deleteResponse">
      <div>
        <span>您确定要删除该服务接口吗？</span>
      </div>
    </vdialog>
  </div>
</template>

<script>
  import vdialog from "../../components/com-dialog";
  // import '../../../static/boooya/js/app_plugins.js';
  import eventBus from '../../utils/eventBus';
  import pageBox from '../../components/com-pagination';
  import comupload from '../../components/com-upload';
  import httpConfig from '../../config/http'

  export default {
    components: {
      pageBox,
      vdialog,
      comupload
    },
    name: 'service-list',
    data: function () {
      return {
        dataList: [],
        name: '',
        pagination: {
          pageIndex: 1,
          pageSize: 10,
          startCount: 0,
          totalCount: 0,
          pageCount: 0
        },
        delItem: '',
        downSerDetail: {
          verData: {}
        }, //下载时接口版本信息详情
        downApiUrl: httpConfig.apiHost, //下载时接口路径
        showDialog: false,
        showDownLog: false,//下载弹窗
        showDelLog: false,//删除弹窗
        dialogOptions: { //弹窗配置项
          width: '600', //弹窗宽度
          title: '上传接口描述文件',
          hasBtn: true, //是否需要确定按钮，默认没有确认按钮
          closeBtnTxt: '取消', //关闭弹窗按钮自定义文本
          closeBtn: true, //是否需要关闭按钮，默认没有确认按钮
        },
        dialogDownOptions: { //下载弹窗配置项
          width: '600', //弹窗宽度
          title: '下载接口描述文件',
          hasBtn: false //是否需要确定按钮，默认没有确认按钮
        },
        currenItem: {}, //保存当前操作的那条数据
        uploadComponentConfig: {//上传文件组件配置项
          upfileId: 'upfile' + new Date().getTime(), //上传input框id
          fileType: '/.thrift$/',//强制定义文件类型  -- 验证用
          accept: '*', //接受文件类型  ---  默认'image/*'
          uploadTip: '请上传.thrift类型的文件',//提示上传类型的文字描述
          // size: '', //单个文件大小限制  ---  默认 3M
          // numMax: 10,//单次最多上传个数  number 类型
          // single: true,//是否只能选择单个文件上传  ----  默认  可以上传多个文件
          // imgpreview: true,//是否要预览 ---- 上传图片类型才传这个   默认不预览
          // autoUpload: true,//是否自动上传，选择完文件后自动上传
          // autoUploadUrl: 'thrift/upload',//上传文件地址，自动上传时配置
          // anotherParam: {},//需要附加到formdata里面参数，自动上传时可配
          // seccessCb: function(){//上传成功回调，自动上传可配
          //   console.log('success');
          // },
          // errorCb: function(){//上传失败回调，自动上传可配
          //   console.log('error');
          // }
        },
        deleteOptions: { //下载弹窗配置项
          width: '500', //弹窗宽度
          title: '确认删除该服务接口',
          hasBtn: true, //是否需要确定按钮，默认没有确认按钮
          hasBtnTxt: '删除', //确认按钮自定义文本
          closeBtnTxt: '取消', //关闭弹窗按钮自定义文本
          closeBtn: true, //是否需要关闭按钮，默认没有确认按钮
        },
        sessionid: ''
      }
    },
    mounted() {
      this.getInitData();
      this.sessionid = localStorage.getItem('sessionId') || '';
    },
    methods: {
      getInitData: function () {
        let _this = this;
        _this.$axios.get('consul/getList?name=' + _this.name + "&pageIndex=" + _this.pagination.pageIndex + "&pageSize=" + _this.pagination.pageSize).then(function (result) {
          if (result.status == 0) {
            _this.dataList = result.data.list.map(item => {
              item['unfold'] = 0;
              item.info = item.info.map(items => {
                console.log(items);
                switch (items.status){
                  case 'testing':
                    items['stateName'] = '检测中';
                    items['color'] = '#AAAAAA';
                    break;
                  case 'maintenance':
                    items['stateName'] = '维护';
                    items['color'] = 'orange';
                    break;
                  case 'passing':
                    items['stateName'] = '正常';
                    items['color'] = 'green';
                    break;
                  case 'critical':
                    items['stateName'] = '异常';
                    items['color'] = 'red';
                    break;
                }
                return items;
              });
              return item;
            });
            _this.pagination.totalCount = result.data.total;
            _this.pagination.pageCount = Math.ceil(_this.pagination.totalCount / _this.pagination.pageSize);
          } else {
            _this.myMessage.error(result.message);
          }
        }).catch(function (err) {
          console.log(err);
        })
      },
      editSerFn: function (item, type) { //编辑
        let _param = type == 'detail' ? '&id='+ item.id : '&baseId=' + item.baseId;
        //触发来自列表的数据
        this.$router.push({
          path: '/service-edit?' + _param
        });
      },
      disableSerFn: function (item) { //禁(启)用当前服务
        let _this = this;
        debugger
        let obj = {
          id: item.id,
          enable: item.status == 'maintenance' ? false : true
        };
        _this.$axios.post('consul/maintenance', obj).then(function (result) {
          if (result.status == 0) {
            _this.getInitData();
            _this.myMessage.success('修改成功！')
          } else {
            _this.myMessage.error(result.message);
          }
        }).catch(function (err) {
          console.log(err);
        })
      },
      deleteSerFn: function (item) { //删除当前服务
        let _this = this;
        _this.delItem = item;
        _this.showDelLog = true;
      },
      pagesFn: function (e) { //分页调用方法
        let _this = this;
        _this.pagination = e;
        _this.getInitData();
      },
      downSerFn: function (e) { //下载文件方法
        let _this = this;
        _this.$axios.get('consul/kv/get/' + e.id).then(function (result) {
          if (result.status == 0) {
            if (!result.data) {
              _this.myMessage.error('该服务未上传接口描述文件！');
              return false;
            }
            let datas = result.data[0];
            let jsons = JSON.parse(result.data[0].Value);
            datas['verData'] = jsons;
            datas.name_show = e.name;
            datas.key_show = e.key;
            _this.downSerDetail = datas;
            _this.showDownLog = true;
          } else {
            _this.myMessage.error(result.message);
          }
        }).catch(function (err) {
          console.log(err);
        })
      },
      emptyFiles: function () {//清空已上传文件
        let _this = this;
        this.$axios.get('thrift/clean?name='+ _this.currenItem.id + '&version=' + _this.currenItem.version)
        .then(function (result) {
          if(result.status == 0){
            _this.myMessage.success('清空成功!');
          }
        })
        .catch(function (error) {
          _this.myMessage.error(error.message);
        });
      },
      uploadSerFn: function (item) {//弹出上传文件弹窗
        this.currenItem = item;
        this.showDialog = true;
      },
      modalResponse: function (json) {//上传文件弹窗响应
        let _this = this;
        let inputobj = $('#' + this.uploadComponentConfig.upfileId);
        if (json.type === 'close') {
          _this.showDialog = false;
          this.$refs.childMethod.reset();
        } else { //有表单等要操作的内容
          let formData = new FormData(inputobj.parents('.' + _this.uploadComponentConfig.upfileId + 'form')[0]);
          formData.append('name', _this.currenItem.id);
          formData.append('baseId', _this.currenItem.baseId);
          formData.append('version', _this.currenItem.version);
          _this.myUploadFn({
            inputobj: inputobj,
            formData: formData,
            url: 'thrift/upload',
            successCb: () => {
              _this.myMessage.success('上传成功！');
              _this.showDialog = false;
              this.getInitData();
            },
            errorCb: (err) => {
              let msg = '上传失败！';
              if ( err.status == -101 ){
                msg = '编译失败,请检查文件'+ err.message + '内容,看看是否缺少关联文件!'
              } 
              _this.myMessage.error(msg);
            }
          })
        }
      },
      DownModalResponse: function (json) {//下载弹窗关闭事件
        let _this = this;
        if (json.type === 'close') {
          _this.showDownLog = false;
        } else {
        }
      },
      deleteResponse: function (json) {//删除弹窗处理事件
        let _this = this;
        if (json.type === 'close') {
          _this.showDelLog = false;
          _this.delItem = '';
        } else {
          let _this = this;
          let _data = !!_this.delItem.id ? '?id=' + _this.delItem.id : '?baseId=' + _this.delItem.baseId;
          _this.$axios.delete('consul/destroy/' + _data).then(function (result) {
            if (result.status == 0) {
              _this.getInitData();
              _this.myMessage.success('删除成功！');
              _this.showDelLog = false;
            } else {
              _this.myMessage.error(result.message);
            }
          }).catch(function (err) {
            console.log(err);
          })
        }
      },
      selectListFn:function (item) {
        let _this = this;
        _this.dataList = _this.dataList.map(item => {
          item.unfold = 0;
          return item;
        });
      }
    }
  }
</script>

<style scoped>
  .table-head-custom {
    margin-bottom: 10px;
    /* margin-bottom: 0 !important;*/
  }

  .table {
    border-bottom: 1px solid #DBE0E4;
  }

  .col-md-3 {
    padding-right: 0 !important;
  }

  .table-head-custom-ul {
    display: block;
    width: 100%;
    min-height: 500px;
    border: 1px solid #cfcfcf;
    padding: 0;
  }

  .table-head-custom-ul ul{
    display: block;
    width: 100%;
    float: right;
    background: #F5FFFA;
    /*border: 1px dotted #cfcfcf;*/
    border-bottom: none;
    padding: 0;
  }
  .table-head-custom-ul ul li{
    display: inline-block;
    line-height: 35px;
    font-size: 12px;
    border-top: 1px dotted #cfcfcf;
  }

  .table-head-custom-ul > li {
    display: inline-block;
    line-height: 50px;
    font-size: 13px;
    border-bottom: 1px solid #cfcfcf;
  }

  .table-head-custom-ul li .headSpan {
    float: left;
    width: 24.5%;
    text-align: center;
    font-weight: 600;
    background: #F2F2F2;
  }

  .table-head-custom-ul li .sevList {
    float: left;
    width: 24.5%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    /*overflow: hidden;*/
  }

  .table-head-custom-ul li .versionList {
    float: left;
    width: 20%;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .table-head-custom-ul li .versionListHead{
    float: left;
    width: 20%;
    text-align: center;
    font-weight: 600;
    background: #F8F8FF;
    overflow: hidden;
  }

  .table-head-custom-ul > li .unfoldBox {
    float: left;
    width: 2%;
    cursor: pointer;
  }

  .desc p{
    padding: 0 10px;
    overflow: hidden;
    word-break:break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    margin: 0 !important;
  }
  .desc .test {
    display: none;
    border-radius: 6px;
    position: absolute;
    width: 100%;
    left: 75%;
    top: -60px;
    background: #f1f1f1;
    padding: 10px 15px;
    box-shadow: 1px 1px 10px 2px rgba(0, 0, 0, .2);
    min-height: 90px;
    text-align: left;
    white-space: normal;
    line-height: 18px;
  }

  .test span {
    width: 0;
    height: 0;
    font-size: 0;
    overflow: hidden;
    position: absolute;
  }

  .test span.bot {
    border-width: 12px;
    border-style: solid;
    border-color: transparent #f1f1f1 #f1f1f1 transparent;
    left: -24px;
    top: 60px;
  }

  .icon-download2:before, .icon-upload2:before {
    font-size: 15px;
  }

  .desc {
    position: relative;
    width: 100%;
    height: 43px;
  }

  .desc:hover .test {
    display: block !important;
  }

  .downBox {
    width: 98%;
    min-height: 180px;
  }

  .downListBox {
    margin-right: 10px;
    width: 100px;
    padding: 0;
    height: 40px;
  }

  .downListBox a {
    display: block;
  }

  /*按钮样式*/
  .table-head-custom-ul .btn.btn-icon{
    width: 25px;
    height: 25px;
  }
  .table-head-custom-ul .btn.btn-icon span{
      line-height: 14px;
      font-size: 15px;
  }
</style>
