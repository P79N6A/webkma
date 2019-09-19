import httpConfig from '../config/http';
import api from "api";
function IEVersion() {
	//取得浏览器的userAgent字符串
	var userAgent = navigator.userAgent;
	//判断是否IE浏览器
	var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
	if (isIE) {
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		if (fIEVersion < 10 || !isSupportPlaceholder()) {
			return true;
		}
	} else {
		return false;
	}
}

let createPoster = (json, callback) => {
	if(IEVersion()){
		callback('');
		return false;
	} 
	let posterWrap = $('<div></div>');
	let str = `<canvas id="poster_canvas" width="375" height="720" style="position:absolute;top:0;left:0;z-index:-10;background-color:red;"></canvas><div id="poster_qrcode"></div>`;
	posterWrap.html(str);
	$("body").append(posterWrap);

	let canvas = posterWrap.find('#poster_canvas')[0];
	let ctx = canvas.getContext('2d');

	let img = new Image();
	img.setAttribute('crossOrigin', 'anonymous');
	img.src = httpConfig.apiHost + '/artical/recommand/proxyWxImage?url='+json.cover;
	img.onload = (a)=> {
		var timer = setInterval(function(){
			if(img.complete) {
				let cover_H = (img.height / img.width * 375); 
				ctx.drawImage(img,0,0,250 * 1.5,cover_H);
				clearInterval(timer);
			
				ctx.rect(0,400 * 1.5,250 * 1.5,80 * 1.5);
				ctx.fillStyle="#ffffff";
				ctx.fill();
			
				new QRCode(posterWrap.find('#poster_qrcode')[0], {
					text: httpConfig.posterQrcodeUrl.replace('{0}', json.id),
					width: 60*1.5,
					height: 60*1.5,
					colorDark: "#000000",
					colorLight: "#ffffff",
					correctLevel: QRCode.CorrectLevel.H
				});
				
				// 绘制标题、描述
				ctx.font = "400 16px Arial"; //设置字体
				ctx.textBaseline = 'top'; //在绘制文本时使用的当前文本基线
				ctx.fillStyle="#000000";
				if(ctx.measureText(json.name).width > 225 ){
					let maxLength = Math.floor(225 / ctx.measureText('啊').width);
					json.name = json.name.substring(0, maxLength-2) + '...';
				}
				ctx.fillText (json.name, 13 * 1.5, 420 * 1.5, 150 * 1.5);
				
				ctx.font = "400 14px Arial"; //设置字体
				ctx.textBaseline = 'top'; //在绘制文本时使用的当前文本基线
				ctx.fillStyle="#999999";
				ctx.fillText ('长按识别二维码有惊喜', 12 * 1.5, 440 * 1.5, 150 * 1.5);
				
				//绘制二维码
				posterWrap.find('#poster_qrcode').find('img').on('load', function(){
					ctx.drawImage(posterWrap.find('#poster_qrcode').find('img')[0],180 * 1.5,411 * 1.5,60 * 1.5,60 * 1.5);

					api.request("uploadImageForBase64", { base64Files: [{ content: canvas.toDataURL('image/png') }] }, result => {
						posterWrap.remove();
						callback(result.status == 0 ? result.data[0].file : "");
					});
				})
			}
		},50);
	}	
		
}

let createActiclePoster = (json, callback) => {
	if(IEVersion()){
		callback('');
		return false;
	} 
	let posterWrap = $('<div></div>');
	let str = `<canvas id="poster_canvas" width="375" height="720" style="position:absolute;top:0;left:300px;z-index:-10;background-color:red;"></canvas><div id="poster_qrcode"></div>`;
	posterWrap.html(str);
	$("body").append(posterWrap);

	let canvas = posterWrap.find('#poster_canvas')[0];
	let ctx = canvas.getContext('2d');

	ctx.fillStyle="white";
	ctx.fillRect(0,0, 375, 720);
	
	function fillText(str1, fontSize, color, x, y, line) {
		ctx.font = fontSize;
		ctx.textBaseline = 'top';
		ctx.textAlign = 'left';
		ctx.fillStyle = color;
		let line_length = (250 * 1.5 - x * 2) / ctx.measureText('已').width;
		if(ctx.measureText(str1).width > (250 * 1.5 - 2 * x) && !!line){//分行
			for(var i=0; i<line; i++){
				if(i == line-1){
					ctx.fillText(str1.substring(i * line_length, (i+1) * line_length - 2) + '...', x, y + i * 20);
				} else {
					ctx.fillText(str1.substring(i * line_length, (i+1) * line_length), x, y + i * 20);
				}
			}
		} else {
			ctx.fillText(str1, x, y);
		}
		ctx.fill();
	};
	fillText(json.title, '19.5px Arial', 'rgba(0,0,0,1)', 17 * 1.5, 17 * 1.5, 2);
	
	let img = new Image();
	img.setAttribute('crossOrigin', 'anonymous');
	img.src = httpConfig.apiHost + '/artical/recommand/proxyWxImage?url='+json.headImg;
	img.onload = (a)=> {
		ctx.drawImage(img, 17 * 1.5, 67 * 1.5, 24 * 1.5, 24 * 1.5);
	}	
	
	fillText('推小宝', '16.5px Arial', 'rgba(0,0,0,1)', 49 * 1.5, 74 * 1.5);
	fillText('推荐了文章', '16.5px Arial', 'rgba(153,153,153,1)', 89 * 1.5, 74 * 1.5);

	let cover = new Image();
	cover.setAttribute('crossOrigin', 'anonymous');
	cover.src = httpConfig.apiHost + '/artical/recommand/proxyWxImage?url='+json.cover;
	cover.onload = (a)=> {
		var timer = setInterval(function(){
			if(img.complete) {
				ctx.drawImage(cover, 8 * 1.5, 106 * 1.5, 235 * 1.5, 100 * 1.5);
				clearInterval(timer);

				fillText(json.desc, '18px Arial', 'rgba(153,153,153,1)', 17 * 1.5, 221 * 1.5, 3);

				new QRCode(posterWrap.find('#poster_qrcode')[0], {
					text: json.url,
					width: 100 * 1.5,
					height: 100 * 1.5,
					colorDark: "#000000",
					colorLight: "#ffffff",
					correctLevel: QRCode.CorrectLevel.H
				});
				
				fillText('让人欲罢不能的深度好文', '18px Arial', 'rgba(153,153,153,1)', 59 * 1.5, 419 * 1.5);
				fillText('你真的不点开看看吗', '18px Arial', 'rgba(153,153,153,1)', 71 * 1.5, 439 * 1.5);
				
				//绘制二维码
				posterWrap.find('#poster_qrcode').find('img').on('load', function(){
					ctx.drawImage(posterWrap.find('#poster_qrcode').find('img')[0], 76 * 1.5, 300 * 1.5, 100 * 1.5, 100 * 1.5);

					api.request("uploadImageForBase64", { base64Files: [{ content: canvas.toDataURL('image/png') }] }, result => {
						posterWrap.remove();
						callback(result.status == 0 ? result.data[0].file : "");
					});
				})
			}

		},50)
		
	}	

	
}


let createRedpackImg = (json, callback) => {
	var posterWrap = $('<div></div>');
	var str = `<canvas id="poster_canvas" width="610" height="917" style="position:absolute;top:0;left:300px;z-index:100000;background-color:red;"></canvas>`;
	posterWrap.html(str);
	$("body").append(posterWrap);

	var canvas = posterWrap.find('#poster_canvas')[0];
	var ctx = canvas.getContext('2d');

	function fillText(str1, fontSize, color, x, y) {
		ctx.textBaseline = 'top';
		ctx.textAlign = 'left';
		ctx.font = fontSize;
		ctx.fillStyle = color;
		ctx.fillText(str1, x, y);
		ctx.fill();
	};

	function drawHead(path, x, y, w, h) {
		ctx.save();
		ctx.arc( x + w/2, y + h/2, w/2, 0, 2 * Math.PI);
		ctx.clip();
		ctx.drawImage(path, x, y, w, h);
		ctx.restore();
	}

	var saveFile = function(data, filename){
		var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
		save_link.href = data;
		save_link.download = filename;
	   
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		save_link.dispatchEvent(event);
	};

	var _fixType = function(type) {
		type = type.toLowerCase().replace(/jpg/i, 'jpeg');
		var r = type.match(/png|jpeg|bmp|gif/)[0];
		return 'image/' + r;
	};

	let img = new Image();
	img.setAttribute('crossOrigin', 'anonymous');
	img.src = httpConfig.apiHost + '/artical/recommand/proxyWxImage?url='+json.bg;
	img.onload = function(a) {
		ctx.drawImage(img, 0, 0, 610, 917);
		ctx.font="76px Arial";
		var amount_width = ctx.measureText(json.mount).width;
		ctx.font="36px Arial";
		var amount_left = amount_width + ctx.measureText('元').width;

		fillText(json.mount, '76px Arial', 'rgba(251,211,146,1)', (610 - amount_left)/2, 117);
		fillText('元', '36px Arial', 'rgba(251,211,146,1)', (610 - amount_left)/2 + amount_width, 145);

		fillText('已经存到您的零钱奖励，快到小程序里提现吧~', '24px Arial', 'rgba(251,211,146,1)', 51, 238);

		// 人数
		var str = `${json.customer.length}/${json.customer.length}`;
		ctx.font="24px Arial";
		var str_left = (610 - ctx.measureText(str).width)/2;

		fillText(str, '24px Arial', 'white', str_left, 404);

		// 绘制头像
		var headArr = json.customer.reverse(), finalHeadArr = [], _left = (610 - (58 * json.customer.length + 14 * (json.customer.length - 1))) / 2;
		headArr.forEach(function (element, index) {
			((e, i) => {
				let head = new Image();
				head.setAttribute('crossOrigin', 'anonymous');
				head.src = httpConfig.apiHost + '/artical/recommand/proxyWxImage?url=' + e.headimg;
				head.onload = function(a){
					finalHeadArr.push({
						obj: head,
						_index: i
					});
				}
			})(element, index)
		});
		
		var timer = setInterval(function(){
			if(finalHeadArr.length == headArr.length){//加载完了，可以绘制了
				clearInterval(timer);
				finalHeadArr = finalHeadArr.sort((a, b) => { return a._index - b._index; });
				finalHeadArr.forEach(function(ele, index) {
					drawHead(ele.obj, _left + 58 * (headArr.length - 1 - index), 311, 72, 72);
				});
				
				var type = 'png';
				var imgData = canvas.toDataURL(type);
				imgData = imgData.replace(_fixType(type),'image/octet-stream');
				var filename = 'baidufe_' + (new Date()).getTime() + '.' + type;
				saveFile(imgData,filename);
				// api.request("uploadImageForBase64", { base64Files: [{ content: canvas.toDataURL('image/png') }] }, result => {
				//     callback(result.status == 0 ? result.data[0].file : "");
				// });
			}
		},1000);
	}
	
		
}
window.createPoster =  createPoster;
window.createActiclePoster =  createActiclePoster;
window.createRedpackImg =  createRedpackImg;