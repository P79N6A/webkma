(function ($element) {
	var _plugin_qrcode = $element.find('.plugin_qrcode'),
		_code_url = _plugin_qrcode.attr('data-url');

	if(!!_code_url){
		setTimeout(function(){
			var qrcode = new QRCode(_plugin_qrcode[0], {
				text: encodeURI(_code_url),
				width: parseFloat($(_plugin_qrcode).width()),
		      	height: parseFloat($(_plugin_qrcode).height())
			  });
		},100)
	}
	
})($("div[id='_panelId_']"));