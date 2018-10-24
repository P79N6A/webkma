<template>
  <div class="block">

    <div class="app-heading app-heading-small">
      <div class="title text-right">
        <h2>{{ title }}</h2>
      </div>
    </div>
    <form class="form-horizontal">
      <div class="form-group" v-if="!edit">
        <label class="col-md-2 control-label text-right">注册方式</label>
        <div class="col-md-10">
          <div class="app-radio inline"> 
              <label><input type="radio" name="reg-style" value="new" v-model="type" @click="type = 'new'"> 新建<span></span></label>                                         
          </div>
          <div class="app-radio inline"> 
              <label><input type="radio" name="reg-style" value="info" v-model="type" @click="getBaseList"> 关联<span></span></label>                                         
          </div>
        </div>
      </div>
      <div class="form-group" v-if="type == 'info' && !edit">
        <label class="col-md-2 control-label text-right"><span class="star">*</span>服务名</label>
        <div class="col-md-10 ">
          <div class="col-md-12 col-padding-clear">
              <select class="form-control" v-model="baseId">
                  <option v-for="item in baseList" :key="item.baseId" :value="item.baseId">{{ item.name }}</option>                                       
              </select>
          </div>
        </div>
      </div>
      <div class="form-group" v-if="!(type == 'info' && !edit)">
        <label class="col-md-2 control-label text-right"><span class="star">*</span>服务key</label>
        <div class="col-md-10">
          <input id="key" v-model="formData.key" type="text" class="form-control" placeholder="服务key" v-if="!(type == 'info' && edit)">
          <input id="key" v-model="formData.key" type="text" class="form-control" placeholder="服务key" v-if="type == 'info' && edit" disabled>
          <span class="error"></span>
        </div>
      </div>
      <div class="form-group" v-if="!(type == 'info' && !edit)">
        <label class="col-md-2 control-label text-right"><span class="star">*</span>服务名</label>
        <div class="col-md-10">
          <input id="name" v-model="formData.name" type="text" class="form-control" placeholder="服务名" v-if="!(type == 'info' && edit)">
          <input id="name" v-model="formData.name" type="text" class="form-control" placeholder="服务名" v-if="type == 'info' && edit" disabled>
          <span class="error"></span>
        </div>
      </div>
      <div class="form-group" v-if="type != 'base'">
        <label class="col-md-2 control-label text-right"><span class="star">*</span>服务地址</label>
        <div class="col-md-10">
          <input id="address" v-model="formData.address" type="text" class="form-control" placeholder="服务地址">
          <span class="error"></span>
        </div>
      </div>
      <div class="form-group"  v-if="type != 'base'">
        <label class="col-md-2 control-label text-right"><span class="star">*</span>服务端口</label>
        <div class="col-md-10">
          <input id="port" v-model="formData.port" type="text" class="form-control" placeholder="端口为数字">
          <span class="error"></span>
        </div>
      </div>
      <div class="form-group" v-if="!(type == 'info' && !edit)">
        <label class="col-md-2 control-label text-right"><span class="star"></span>服务描述</label>
        <div class="col-md-10">
          <input id="desc" v-model="formData.desc" type="text" class="form-control" placeholder="服务描述" v-if="!(type == 'info' && edit)">
          <input id="desc" v-model="formData.desc" type="text" class="form-control" placeholder="服务描述" v-if="type == 'info' && edit" disabled>
          <span class="error"></span>
        </div>
      </div>
      <div class="form-group" v-if="type != 'base'">
        <label class="col-md-2 control-label text-right"><span class="star"></span>version</label>
        <div class="col-md-10">
          <input id="version" v-model="formData.version" type="text" class="form-control" placeholder="version">
          <span class="error"></span>
        </div>
      </div>
      <div class="form-group" v-if="type != 'base'">
        <label class="col-md-2 control-label text-right">自定义标签</label>
        <div class="col-md-10">
          <span class="tag" v-for="(tag1, index) in formData.tags" :key="tag1">
            <span class="fa fa-times-circle" v-on:click="removeTag(index)"></span>
            <span type="text" class="btn btn-default">{{ tag1 }}</span>
            <input type="text" class="tagObj" placeholder="编辑标签" v-model.lazy="formData.tags[index]" v-on:blur="editTag(formData.tags[index],index)" maxlength="20">
          </span>
          <input type="text" class="form-control replace-tag" placeholder="添加标签" v-model="tag" v-on:blur="addTag" maxlength="20">
        </div>
      </div>
      <div class="form-group margin-top-20">
        <label class="col-md-2 control-label text-right"></label>
        <div class="col-md-10">
          <button class="btn btn-primary" type="button" @click="subumitReg">提交</button>
          <a href="#/service-list"><button class="btn btn-primary" type="button">返回</button></a>
        </div>
      </div>
    </form>

  </div>
</template>
<script>
let data = {
    tag: '', //新加自定义标签
    title: '', //页面标题
    edit: false, //是否编辑 
    type: 'new', //注册方式  "new" --- //注册服务, "base" --- // 修改服务基本信息, "info" --- // 关联及修改 服务详细信息
    baseList: [], //下拉服务列表
    baseId: '', //baseId
    id: '', //修改服务基本信息时需要
    formData: {
      key: '', //服务key
      name: '', //String	服务名
      desc: '', //服务描述
      address: '', //	String	服务地址
      port: '', //	Number	端口
      tags: [], //tags 可选	Array	标签, String[]
      version: '' //版本
    }
};
export default {
  name: 'EmailModule',
  data () {
      return data
  },
  mounted () {
    this.getEventData();
  },
  methods: {
    getEventData () {//获取来自列表的数据
      let id = this.$route.query.id || '';
      let baseId = this.$route.query.baseId || ''; 
      let _data = '';
      if ( !!id ) _data = 'id=' + id;
      if ( !!baseId ) _data = 'baseId=' + baseId;

      //重置数据
      this.resetData();

      if( !_data ) return false;
      this.id = id;
      this.baseId = baseId;
      this.edit = true;
      this.type = !!id ? 'info' : 'base';
      this.title = '编辑服务';

      // 调取接口获取服务信息
      this.getServiceInfo (_data, (result) => {
        this.formData = Object.assign(this.formData, result);
        if( !!result.baseId ) this.baseId = result.baseId;
        this.$set(data, 'formData', this.formData);
      });
    },
    getServiceInfo (opt, cb) {//修改服务时，根据id或baseId获取服务基本信息
      let _this = this;
      this.$axios.get('consul/service?' + opt)
      .then(function (result) {
        if(result.status == 0){
          cb( result.data );
        }
      })
      .catch(function (error) {
        _this.myMessage.error(error.message);
      });
    },
    getBaseList () {//服务基本信息列表(关联服务界面-下拉框) 
      let _this = this;
      this.$axios.get('consul/service/base/list')
      .then(function (result) {
        if(result.status == 0){
          _this.baseList = result.data;
          _this.baseId = _this.baseList[0].baseId;
          _this.type = 'info';
          _this.$set(data, 'baseList', _this.baseList);
        }
      })
      .catch(function (error) {
        _this. myMessage.error(error.message);
      });
    },
    checkTagExistence (tag) {//检查标签是否存在
      if(!this.formData.tags || this.formData.tags.length == 0) return -1;
      return this.formData.tags.indexOf(tag);
    },
    addTag () {//添加标签
      if(!this.tag) return false;
      if(this.checkTagExistence(this.tag) != -1) {
        this.myMessage.warning('标签已存在!');
        this.tag = '';
        return false;
      }
      this.formData.tags.push(this.tag);
      this.tag = '';
    },
    editTag (item,index) {
      if(!item || (this.checkTagExistence(item) != -1 && this.checkTagExistence(item) != index) ){
        this.formData.tags.splice(index, 1);
        return false;
      } 
      this.formData.tags.splice(index, 1, item);
    },
    removeTag ( index ) {//移除标签
      this.formData.tags.splice(index, 1);
    },
    infoFormValidate () {//关联 or 修改 服务详细信息
      let objArr1 = [$('#address'),$('#port'),$('#version')];
      let _address = window.formValidation({
          obj: objArr1[0],
          reg: /^(\d|[1-9]\d|1\d{2}|2[0-4]\d{1}|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d{1}|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d{1}|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d{1}|25[0-5])$/,
          empty: '请输入服务地址',
          error: '服务地址不正确'
      });
      let _port = window.formValidation({
          obj: objArr1[1],
          maxValue: 65535,
          empty: '请输入服务端口',
          lengthError: '服务端口为0~65535之间的数字',
          reg: /^[\d]{1,5}$/,
          error: '服务端口为0~65535之间的数字'
      });
      let _version = window.formValidation({
          obj: objArr1[2],
          reg: /^v\d{1,2}.\d{1,2}.\d{1,2}(|-[a-zA-Z]{1,9})$/,
          notNeedFill: true,
          error: '版本号不正确,格式应为v1.0.0'
      });
      objArr1.forEach(function(element){
        element.blur();
      })
      return _address.tag && _port.tag && _version.tag;
    },
    baseFormValidate () {//修改服务基本信息
       let objArr2 = [$('#key'),$('#name'),$('#desc')];
       let _key = window.formValidation({
          obj: objArr2[0],
          valueLength: 50,
          minLength: 1,
          empty: '请输入服务key',
          lengthError: '服务key为1~50个字符',
          reg: /^[a-zA-Z0-9_]+$/,
          error: '服务key为1~50个字符，且只允许输入字母、数字、下划线'
      });
      let _name = window.formValidation({
          obj: objArr2[1],
          valueLength: 50,
          minLength: 1,
          empty: '请输入服务名',
          lengthError: '服务名称为1~50个字符',
          reg: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
          error: '服务名称为1~50个字符，且只允许输入字母、数字、下划线、中文'
      });
      let _desc = window.formValidation({
          obj: objArr2[2],
          valueLength: 100,
          lengthError: '服务描述为0~100个字符',
          notNeedFill: true,
          error: '服务描述为0~100个字符'
      });
      objArr2.forEach(function(element){
        element.blur();
      })
      return _key.tag && _name.tag && _desc.tag;
    },
    subumitReg () {//提交注册
      let _this = this;
      if(_this.type == 'new' && !(_this.baseFormValidate() && _this.infoFormValidate())) { //注册表单验证验证
        return false;
      } else if (_this.type == 'info' && !_this.infoFormValidate()) {//关联或者修改服务详细信息 表单验证
        return false;
      } else if (_this.type == 'base' && !_this.baseFormValidate()) {//修改服务基本信息 表单验证
        return false;
      }
      // 数据组装
      let _data = { type: _this.type };
      switch ( _this.type ) {
        case 'new':
          _data = Object.assign(_this.formData, _data);
          _data.port = parseInt(this.formData.port);
          break;
        case 'base':
          _data.key = _this.formData.key,
          _data.name = _this.formData.name,
          _data.desc = _this.formData.desc,
          _data.baseId = _this.baseId;
          break;
        case 'info':
          _data = Object.assign( _data, {
            key: _this.formData.key, // 这个参数如果能获取到就给
            address: _this.formData.address,
            port: _this.formData.port,
            version: _this.formData.version,
            tags: _this.formData.tags,
            id: _this.id,
            baseId: _this.baseId // 必传
          });
          _data.port = parseInt(this.formData.port);
          break;
      }
      this.$axios.post('consul/reg', _data)
      .then(function (result) {
        if(result.status == 0){//
          _this.myMessage.success('操作成功!');
          _this.resetData();
          _this.$router.push({name: 'service-list'});
        }
      })
      .catch(function (error) {
        _this.myMessage.error(error.message);
      });
    },
    resetData () {
      let formData = {
        key: '', //服务key
        name: '', //String	服务名
        desc: '', //服务描述
        address: '', //	String	服务地址
        port: '', //	Number	端口
        tags: [], //tags 可选	Array	标签, String[]
        version: '' //版本
      }
      this.edit = false;
      this.type = 'new';
      this.title = '注册服务';
      this.baseId = '';
      this.id = '';
      this.$set(data, 'formData', formData);
      this.$set(data, 'baseList', []);
    }
  },
  beforeDestroy () {
    this.resetData();
  }

}
</script>
<style scoped>
.star {
  color: #F04E51;
  margin-right: 10px;
}
.title {
  width: 80px;
}
.tag {
  position: relative;
  margin: 0 20px 20px 0;
  float: left;
  cursor: default;
}
.tag .fa-times-circle {
  position: absolute;
  right: -5px;
  top: -7px;
  background-color: #fff;
  color: rgb(230, 87, 80);
  font-size: 18px;
  cursor: pointer;
  z-index: 2;
}
.tag .btn{
  position: relative;
}
.tag .tagObj {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 40px;
  color: #454545;
  background: #FFF;
  border-radius: 3px;
  text-align: center;
  box-shadow: none;
  z-index: 1;
  border:1px solid #DBE0E4;
  outline:none;
}
.replace-tag {
  width: 150px;
  display: inline-block;
  text-align: center;
  float: left;

}
.mt0 {
  margin-top: 0px;
}
.form-control.error {
  border-color: #F04E51 !important;
}
.help-block {
  margin-top: 0;
  color: #F04E51;
}
.btn-primary {
  margin-right: 10px;
}
.col-padding-clear {
  padding: 0;
}
</style>
