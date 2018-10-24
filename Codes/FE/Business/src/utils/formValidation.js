//简易版表单验证-----
// 调用方法
// $.formValidation({
//    'obj':,  //需验证的input对象,类型为jq对象
//    'type':, //(选填)，验证类型，目前支持，phone   telphone   email  内置正则匹配,传它则不传reg
//    'reg':,  //(选填)，正则表达式,传它则不传type
//    'valueLength':, //长度
//    'empty':, //为空时的错误提示
//    'error':, //正则验证失败时的错误提示
//    'lengthError':, //长度验证失败时的错误提示
//    'errorObj': //(选传)指定的错误提示容器，jq对象,可省略，省略时默认为obj.next(),
//    'notNeedFill':true //失去焦点时无需验证(需要时才传，针对常景：本来不是必填项，但是填了格式又错了，之后又清空)
// })
(function($){
    var regObj = {'phone':/^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/,
                   'number': /^\d+$/i,
                   'email' : /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                   'identitycard': /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i
                 };
    $.validation = function(){}
    $.validation.prototype.init = function(json){
        var _this = this;
        this.obj = json.obj;
        this.repeatObj = json.repeatObj;
        this.reg = json.reg;
        this.type = json.type;
        this.minLength = json.minLength;
        this.valueLength = json.valueLength;
        this.maxValue = json.maxValue;
        this.errorObj = !!json.errorObj ? json.errorObj:this.obj.next();
        this.error1 = json.empty;
        this.error2 = json.error;
        this.error3 = json.lengthError;
        this.notNeedFill = json.notNeedFill;
        this.infoType = json.infoType;
        this.infoName = json.infoName;
        this.isName = json.isName || '';
        this.isPhone = json.isPhone || '';
        this.nextPrevValue = json.nextPrevValue || '';
        this.repeatError = json.repeatError;
        
        if(!!this.type){
            switch( this.type ){
                case 'number':
                    this.reg = regObj.number;
                    break;
                case 'phone':
                    this.reg = regObj.phone;
                    break;
                case 'email':
                    this.reg = regObj.email;
                    break;
                case 'identitycard':
                    this.reg = regObj.identitycard;
                    break;   
            }
        }
        _this.obj.focus(function(){
            _this.errorObj.html(_this.nextPrevValue).removeClass('help-block form_error');
            _this.obj.removeClass('error');
        })
        _this.obj.blur(function(){
            if((_this.obj.val() == '' || _this.obj.val() == null) && !_this.notNeedFill ){//必填项才验证是否为空
                if(!!_this.error1){
                    _this.errorObj.html('*'+_this.error1+'！').addClass('help-block form_error');
                }
                _this.obj.addClass('error');
                _this.tag = false;
            }else if(!!_this.reg && !_this.reg.test(_this.obj.val())){
                if(!!_this.error2){
                    _this.errorObj.html('*'+_this.error2+'！').addClass('help-block form_error');
                }
                _this.obj.addClass('error');
                _this.tag = false;
            }else if((!!_this.valueLength && _this.obj.val().length>_this.valueLength) || (!!_this.minLength && _this.obj.val().length<_this.minLength)){
                if(!!_this.error3){
                    _this.errorObj.html('*'+_this.error3+'！').addClass('help-block form_error');
                }
                _this.obj.addClass('error');
                _this.tag = false;
            }else if( _this.type == 'identitycard' ){
                if(!window['idCardValidate '](_this.obj.val())){
                    if(!!_this.error2){
                        _this.errorObj.html('*'+_this.error2+'！').addClass('help-block form_error');
                    }
                    _this.obj.addClass('error');
                    _this.tag = false;
                }else{
                    _this.errorObj.html(_this.nextPrevValue);
                    _this.obj.removeClass('error');
                    _this.tag = true;
                }
            }else if( !!_this.maxValue && !!parseInt(_this.obj.val()) && parseInt(_this.obj.val()) > _this.maxValue ){
                if(!!_this.error3){
                    _this.errorObj.html('*'+_this.error3+'！').addClass('help-block form_error');
                }
                _this.obj.addClass('error');
                _this.tag = false;
            }else if(!!_this.repeatObj && _this.repeatObj.val() != _this.obj.val()){
                _this.errorObj.html('*'+_this.repeatError+'！').addClass('help-block form_error');
                _this.obj.addClass('error');
                _this.tag = false;
            }else{
                _this.errorObj.html(_this.nextPrevValue);
                _this.obj.removeClass('error');
                _this.tag = true;
            }
            if(_this.notNeedFill && (_this.obj.val() == '' || _this.obj.val() == null)){
                _this.errorObj.html(_this.nextPrevValue);
                _this.obj.removeClass('error');
                _this.tag = true;
            }
            
        })
    }
    
})($);
window.formValidation = function(json){
    var d1 = new $.validation();
    d1.init(json);
    return d1;
}