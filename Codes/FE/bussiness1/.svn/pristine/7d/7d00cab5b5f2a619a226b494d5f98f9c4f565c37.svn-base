
<template>
<div class="content-wrap">
  <div id="content" class="content">
    <!--我是分割线-->
    <div class="readBox">
      <p id="district-select" class="readTit">modal弹窗</p>
      <span class="heading">调用方法</span>
      <div class="fnBox">
        &lt;vdialog&nbsp;:isShow="showDialog"&nbsp;:options="dialogOptions"&nbsp;v-on:modalResponse="modalResponse"&gt;<br>
          &emsp;&emsp;&lt;div&nbsp;style="overflow:hidden;"&gt;<br>
            &emsp;&emsp;&emsp;&emsp;&lt;p&gt;sdfdsjfsfdgmsgksgklsmgmlksklg&lt;/p&gt;<br>
          &emsp;&emsp;&lt;/div&gt;<br>
        &emsp;&lt;/vdialog&gt;&nbsp;&nbsp;
      </div>
      <span class="heading">参数说明</span>
      <ul>
        <li class="descTit">
          <div class="pull-left" style="width: 150px">参数</div>
          <div class="pull-left" style="width: 150px">必选</div>
          <div class="pull-left" style="width: 150px">类型</div>
          <div class="pull-left" style="width: 650px">说明</div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">width</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">String</div>
          <div class="pull-left" style="width: 650px">自定义弹窗宽度，不传默认'400'</div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">title</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">String</div>
          <div class="pull-left" style="width: 650px">传了此参数,就会显示title</div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">hasBtn</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">Boolean</div>
          <div class="pull-left" style="width: 650px">是否有确定按钮，默认false</div>
        </li>
      </ul>
      <span class="heading">使用实例</span>
      <pre>
        页面组件script中
        1、import导入组件
        2、components 中引入
        3、data 中配置弹窗参数 dialogOptions
        4、methods中加入弹窗响应的接收方法 modalResponse
        5、定义控制弹窗显隐状态变量 showDialog

        具体实例如下

        import vdialog from "../components/com-dialog";
        export default {
          name: 'home',
          data() {
            return {
              msg: 'Welcome to KPaas (*╹▽╹*)',
              dialogOptions: {//弹窗配置项
                width: '600',//弹窗宽度
                // title: '啥子东东',
                hasBtn: false //是否需要确定按钮，默认没有确认按钮
              },
              showDialog: false
            }
          },
          components: {
            vdialog
          },
          methods: {
            showPromp () {
              this.showDialog = true;
              this.myMessage.warning('修改成功！')
            },
            modalResponse (json) {
              if(json.type === 'close'){
                this.showDialog = false;
              } else {//有表单等要操作的内容

              }
            }
          }
        }

        页面组件template中

        引入弹窗组件，绑定showDialog，dialogOptions，modalResponse，
        弹窗主题内容写在标签内

        实例代码如下

        &lt;vdialog&nbsp;:isShow="showDialog"&nbsp;:options="dialogOptions"&nbsp;v-on:modalResponse="modalResponse"&gt;<br>
          &emsp;&emsp;&lt;div&nbsp;style="overflow:hidden;"&gt;<br>
            &emsp;&emsp;&emsp;&emsp;&lt;p&gt;sdfdsjfsfdgmsgksgklsmgmlksklg&lt;/p&gt;<br>
          &emsp;&emsp;&lt;/div&gt;<br>
        &emsp;&lt;/vdialog&gt;&nbsp;&nbsp;
      </pre>
    </div>
    <!--我是分割线-->
    <div class="readBox">
      <p id="recharge" class="readTit">弱提示弹窗</p>
      <span class="heading">调用方法</span>
      <div class="fnBox" style="overflow:hidden;">
        <p>this.myMessage.info('修改成功！')</p>
        <p>this.myMessage.success('修改成功！')</p>
        <p>this.myMessage.warning('修改成功！')</p>
        <p>this.myMessage.error('修改成功！')</p>
        <p>其中 this 为Vue实例对象</p>
      </div>
    </div>
    <!--我是分割线-->
    <!--我是分割线-->
    <div class="readBox">
      <p id="loading" class="readTit">上传文件组件</p>
      <span class="heading">调用方法</span>
      <div class="fnBox">
        &lt;form class="form-horizontal" :class="[uploadComponentConfig.upfileId + 'form']" style="overflow:hidden;" enctype="multipart/form-data"&gt;<br>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;comupload :uploadComponentConfig="uploadComponentConfig" ref="childMethod"&gt;&lt;/comupload&gt;<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;form&gt;
      </div>
      <span class="heading">参数说明</span>
      <ul>
        <li class="descTit">
          <div class="pull-left" style="width: 150px">参数</div>
          <div class="pull-left" style="width: 150px">必选</div>
          <div class="pull-left" style="width: 150px">类型</div>
          <div class="pull-left" style="width: 650px">说明</div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">upfileId</div>
          <div class="pull-left" style="width: 150px">yes</div>
          <div class="pull-left" style="width: 150px">string</div>
          <div class="pull-left" style="width: 650px"> 上组组件input框 id</div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">fileType</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">string</div>
          <div class="pull-left" style="width: 650px"> 强制定义文件类型  -- 验证用，格式如:'/.thrift$/'</div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">accept</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">string</div>
          <div class="pull-left" style="width: 650px"> 接受文件类型  ---  默认'image/*'</div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">uploadTip</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">string</div>
          <div class="pull-left" style="width: 650px"> 提示上传类型的文字描述 </div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">size</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">Number/表达式</div>
          <div class="pull-left" style="width: 650px"> 单个文件大小限制  ---  默认 3M,  </div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">numMax</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">Number</div>
          <div class="pull-left" style="width: 650px"> 单次最多上传个数  number 类型 </div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">single</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">String</div>
          <div class="pull-left" style="width: 650px"> 是否只能选择单个文件上传  ----  默认  可以上传多个文件 </div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">imgpreview</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">Boolean</div>
          <div class="pull-left" style="width: 650px"> 是否要预览 ---- 上传图片类型才传这个   默认false </div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">autoUpload</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">Boolean</div>
          <div class="pull-left" style="width: 650px"> 是否自动上传，选择完文件后自动上传 </div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">autoUploadUrl</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">String</div>
          <div class="pull-left" style="width: 650px"> 上传文件地址，自动上传时配置,如 'thrift/upload' </div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">anotherParam</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">object</div>
          <div class="pull-left" style="width: 650px"> 需要附加到formdata里面参数，自动上传时可配 </div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">seccessCb</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">function</div>
          <div class="pull-left" style="width: 650px"> 上传成功回调，自动上传可配 </div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">errorCb</div>
          <div class="pull-left" style="width: 150px">no</div>
          <div class="pull-left" style="width: 150px">function</div>
          <div class="pull-left" style="width: 650px"> 上传失败回调，自动上传可配 </div>
        </li>
      </ul>
      <span class="heading">使用实例</span>
      <pre>
        页面组件script中
        1、import导入组件
        2、components 中引入
        3、data 中配置上传组件参数 uploadComponentConfig
        4、手动上传则需在 methods 中加入上传方法 upload

        具体实例如下

        import comupload from '../../components/com-upload';
        export default {
          name: 'home',
          data() {
            return {
              msg: 'Welcome to KPaas (*╹▽╹*)',
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
              }
            }
          },
          components: {
            comupload
          },
          methods: {
            upload () {
              let inputobj = $('#' + this.uploadComponentConfig.upfileId);
              let formData = new FormData(inputobj.parents('.' + this.uploadComponentConfig.upfileId + 'form')[0]);
              formData.append('name', '这是附加到formData的name数据');

              this.myUploadFn({
                inputobj: inputobj,
                formData: formData,
                url: 'thrift/upload',
                successCb: () => {
                  _this.myMessage.success('上传成功！');
                  _this.showDialog = false;
                  this.getInitData();
                },
                errorCb: () => {
                  _this.myMessage.error('上传失败！');
                }
              })
            }
          }
        }

        页面组件template中

        引入弹窗组件，绑定uploadComponentConfig，
        弹窗主题内容写在标签内

        实例代码如下

        &lt;form class="form-horizontal" :class="[uploadComponentConfig.upfileId + 'form']" style="overflow:hidden;" enctype="multipart/form-data"&gt;<br>
         &nbsp;&nbsp;&nbsp;&lt;comupload :uploadComponentConfig="uploadComponentConfig" ref="childMethod"&gt;&lt;/comupload&gt;<br>
        &lt;form&gt;
      </pre>
    </div>
    <!--我是分割线-->
    <!--我是分割线-->
    <div class="readBox">
      <p id="recharge" class="readTit">表单验证</p>
      <span class="heading">使用实例</span>
      <pre>
        页面组件script中
        // window.formValidation({
        //    'obj':,  //需验证的input对象,类型为jq对象
        //    'type':, //(选填)，验证类型，目前支持，phone   telphone   email  内置正则匹配,传它则不传reg
        //    'reg':,  //(选填)，正则表达式,传它则不传type
        //    'valueLength':, //最大长度
        //    'minLength':, //最小长度
        //    'maxValue':, //最大值，number
        //    'empty':, //为空时的错误提示
        //    'error':, //正则验证失败时的错误提示
        //    'lengthError':, //长度验证失败时的错误提示
        //    'errorObj': //(选传)指定的错误提示容器，jq对象,可省略，省略时默认为obj.next(),
        //    'notNeedFill':true //失去焦点时无需验证(需要时才传，针对常景：本来不是必填项，但是填了格式又错了，之后又清空)
        // })

        具体实例如下

        export default {
          name: 'regServiceModule',
          data () {
              return {}
          },
          methods: {
            formValidate (){
              let objArr = [$('#name'),$('#address'),$('#port')];
              let _name = window.formValidation({
                  obj: objArr[0],
                  valueLength: 50,
                  minLength: 1,
                  empty: '请输入服务名',
                  lengthError: '服务名称为1~50个字符',
                  error: '服务名称为1~50个字符'
              });
              let _address = window.formValidation({
                  obj: objArr[1],
                  reg: /^(\d|[1-9]\d|1\d{2}|2[0-4]\d{1}|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d{1}|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d{1}|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d{1}|25[0-5])$/,
                  empty: '请输入服务地址',
                  error: '服务地址不正确'
              });
              let _port = window.formValidation({
                  obj: objArr[2],
                  maxValue: 65536,
                  empty: '请输入服务端口',
                  lengthError: '服务端口为0~65535之间的数字',
                  reg: /^[\d]{1,5}$/,
                  error: '服务端口为0~65535之间的数字'
              });
              objArr.forEach(function(element){
                element.blur();
              })
              return _name.tag && _address.tag && _port.tag;
            },
            subumitReg () {//提交注册
              let _this = this;

              if(!this.formValidate()){
                  return false;
              }
              this.formData.port = parseInt(this.formData.port);
              this.$axios.post('consul/reg', this.formData)
              .then(function (result) {
                  _this.myMessage.success('操作成功!');
                  _this.$router.push({name: 'service-list'});
                }
              })
              .catch(function (error) {
                _this.myMessage.error(error.message);
              });
            }
          }

        }

        页面组件template中

        实例代码如下

        &lt;div class="form-group"&gt;
          &lt;label class="col-md-2 control-label text-right"&gt;&lt;span class="star"&gt;*&lt;/span&gt;服务名&lt;/label&gt;
          &lt;div class="col-md-10"&gt;
            &lt;input id="name" v-model="formData.name" type="text" class="form-control" placeholder="服务名"&gt;
            &lt;span class="error hidden-phone"&gt;&lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="form-group"&gt;
          &lt;label class="col-md-2 control-label text-right"&gt;&lt;span class="star"&gt;*&lt;/span&gt;服务地址&lt;/label&gt;
          &lt;div class="col-md-10"&gt;
            &lt;input id="address" v-model="formData.address" type="text" class="form-control" placeholder="服务地址"&gt;
            &lt;span class="error"&gt;&lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="form-group"&gt;
          &lt;label class="col-md-2 control-label text-right"&gt;&lt;span class="star"&gt;*&lt;/span&gt;服务端口&lt;/label&gt;
          &lt;div class="col-md-10"&gt;
            &lt;input id="port" v-model="formData.port" type="text" class="form-control" placeholder="端口为数字"&gt;
            &lt;span class="error"&gt;&lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      </pre>
    </div>
    <!--我是分割线-->
    <!--我是分割线-->
    <div class="readBox">
      <p id="pagination" class="readTit">分页插件</p>
      <span class="heading">调用方法</span>
      <div class="fnBox" v-text="'<pageBox :pagination=\'pagination\' v-on:setPageData=\'pagesFn($event)\'><\/pageBox>'">

      </div>
      <span class="heading">参数说明</span>
      <ul>
        <li class="descTit">
          <div class="pull-left" style="width: 150px">参数</div>
          <div class="pull-left" style="width: 150px">必选</div>
          <div class="pull-left" style="width: 150px">类型</div>
          <div class="pull-left" style="width: 650px">说明</div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">pageIndex</div>
          <div class="pull-left" style="width: 150px">yes</div>
          <div class="pull-left" style="width: 150px">int</div>
          <div class="pull-left" style="width: 650px">当前页数</div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">pageSize</div>
          <div class="pull-left" style="width: 150px">yes</div>
          <div class="pull-left" style="width: 150px">int</div>
          <div class="pull-left" style="width: 650px">每页获取多少条</div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">startCount</div>
          <div class="pull-left" style="width: 150px">yes</div>
          <div class="pull-left" style="width: 150px">Boolean</div>
          <div class="pull-left" style="width: 650px">从第几条开始获取</div>
        </li>
        <li>
          <div class="pull-left" style="width: 150px">totalCount</div>
          <div class="pull-left" style="width: 150px">yes</div>
          <div class="pull-left" style="width: 150px">Boolean</div>
          <div class="pull-left" style="width: 650px">数据总条数</div>
        </li>
      </ul>
      <span class="heading">使用说明</span>
      <pre>
        页面组件script中
        1、import导入组件
        2、components 中引入
        3、data 中配置分页参数 pagination
        4、methods中加入分页点击处理方法 setPageData 调用的当前组件中自定义方法，其中$event对象是整个已经被计算了的pagination分页数据对象。
      </pre>
    </div>
    <!--我是分割线-->

  </div>
</div>
</template>
<script>
export default {
  name: 'readme',
  data () {
    return {}
  }
}
</script>
<style scoped>
  body{
    overflow-x:auto;
  }
  .content-wrap{
    width: 100%;
    /*min-width: 1400px;*/
    height: 1000px;
    position: relative;
  }
  .content{
    width: 100%;
    height: auto;
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .nav-wrap{
    position: fixed;
    right: 0;
    top: 10px;
    width: 15%;
    font-size: 16px;
  }
  .nav{
    width: 200px;
    float: left;
    margin-left: 20px;
  }
  .nav li{
    list-style: none;
    height: 50px;
    line-height: 30px;
    cursor: pointer;
    border-left: 1px solid transparent;
  }
  .nav li a{
    display: inline-block;
    width: 200px;
    height: 100%;
    font-weight: 500;
    color: #767676;
  }
  .nav li:hover,.nav li.choose{
    border-color: #563d7c;
  }
  .nav li:hover a,.nav li.choose a{
    color: #563d7c;
    font-weight: 700;
  }
  .readBox{
    width: 100%;
    margin: 25px auto 0;
    background: #fff;
    text-indent: 20px;
    border-bottom: 1px solid #cfcfcf;
    overflow: hidden;
    padding: 0 0 20px;
  }
  .readBox .readTit{
    background: #F0F3F9;
    font: normal 20px/35px 'Microsoft YaHei';
    color: #f24730;
  }
  .readBox .heading{
    font: normal 16px/35px 'Microsoft YaHei';
    display: list-item;
    margin: 0 0 0 20px;
    text-indent: 0;
  }
  .readBox .fnBox{
    padding: 20px 0;
    border: 1px dashed #cfcfcf;
    font: normal 14px/35px 'Microsoft YaHei';
  }
  .readBox .descTit{
    font: normal 12px/30px 'Microsoft YaHei';
    overflow: hidden;
    font-weight: 600;
  }
  .readBox ul{
    overflow: hidden;
  }
  .readBox ul li{
    font: normal 12px/25px 'Microsoft YaHei';
  }
  .readBox .pre{
    padding: 9.5px;
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857143;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    min-height: 60px;
  }
  .readBox .pre>button{
    margin: 0 10px 0 0;
  }
  @media screen and (max-width:1450px){
     .content-wrap{
        width: 100%;
     }
     .content{
        width: 100%;
     }
     .nav-wrap{
        display: none;
     }
  }
</style>
