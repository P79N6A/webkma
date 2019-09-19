import Vue from 'vue';
//基础函数
var _baseMessenger = function (message, type) {
	Vue.prototype.$message({
		message: message,
		center: true,
		type: type,
		duration: 3000
	});
}

var _success = function (message) {
	_baseMessenger(message, "success");
}

var _error = function (message) {
	_baseMessenger(message, "error");
}

var _info = function (message) {
	_baseMessenger(message, "info");
}

var _warning = function (message) {
	_baseMessenger(message, "warning");
}

var _confirm = function (message, callback) {
	Vue.prototype.$confirm(message, "提示", {
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		type: "info",
		dangerouslyUseHTMLString: true
	}).then(() => {
		callback(true)
	}).catch(() => {
		callback(false)
	});
}
var _asyncConfirm = function (message, callback) {
	let loadingTimeout = true, loadingIsDone = true, loadingHandle;
	Vue.prototype.$msgbox({
		title: '提示',
		message: message,
		showClose: false,
		closeOnClickModal: false,
		closeOnPressEscape: false,
		showCancelButton: true,
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: "info",
		beforeClose: (action, instance, done) => {
			if (action === 'confirm') {
				instance.showCancelButton = false;
				instance.confirmButtonLoading = true;
				loadingTimeout = false;
				loadingIsDone = false;
				if (loadingHandle) clearTimeout(loadingHandle);
				loadingHandle = setTimeout(function () {
					loadingTimeout = true;
					if (loadingTimeout && loadingIsDone) done();
				}, 500);
				callback(true, (isClose) => {
					if (isClose) {
						loadingIsDone = true;
						if (loadingTimeout && loadingIsDone) done();
					} else {
						// 还原
						instance.showCancelButton = true;
						instance.confirmButtonLoading = false;
					}
				});
			} else {
				callback(false);
				done();
			}
		},
		callback: (action, instance) => {
			instance.showCancelButton = true;
			instance.confirmButtonLoading = false;
			if (loadingHandle) clearTimeout(loadingHandle);
			loadingTimeout = true;
			loadingIsDone = true;
		}
	});
}

var _alert = function (message, callback) {
	Vue.prototype.$alert(message, '提示', {
		confirmButtonText: '确定',
		dangerouslyUseHTMLString: true,
		callback: function () {
			!!callback && callback(true)
		}
	})
}

var _notification = function (message, type) {
	var opts = {}
	switch (type) {
		case "success":
			opts = {
				title: '成功',
				type: 'success'
			}
			break;
		case "warning":
			opts = {
				title: '警告',
				type: 'warning'
			}
			break;
		case "info":
			opts = {
				title: '消息',
				type: 'info'
			}
			break;
		case "error":
			opts = {
				title: '错误',
				type: 'error'
			}
			break;
	}
	opts.message = message;
	opts.offset = 40;
	opts.duration = 3000;
	Vue.prototype.$notify(opts);
}

Vue.prototype.messenger = {
	success: _success,
	error: _error,
	info: _info,
	warn: _warning,
	confirm: _confirm,
	asyncConfirm: _asyncConfirm,
	alert: _alert
}
Vue.prototype.notification = {
	success: (message) => { _notification(message, "success") },
	warning: (message) => { _notification(message, "warning") },
	error: (message) => { _notification(message, "error") },
	info: (message) => { _notification(message, "_info") }
}

window.messager = {
	success: _success,
	error: _error,
	info: _info,
	warn: _warning,
	confirm: _confirm,
	asyncConfirm: _asyncConfirm,
	alert: _alert
}