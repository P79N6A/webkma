import Vue from "vue"

(function (global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                return factory(w);
            };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function (window) {
    'use strict';
    /*
        消息提示
    */
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
    var _alert = function (message, callback) {
        Vue.prototype.$alert(message, '提示', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true
        }).then(() => {
            !!callback && callback(true)
        });
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

    $.extend(true, window.Kdo, {
        utils: {
            messenger: {
                success: _success,
                error: _error,
                info: _info,
                warn: _warning,
                confirm: _confirm,
                alert: _alert
            },
            notification: {
                success: (message) => { _notification(message, "success") },
                warning: (message) => { _notification(message, "warning") },
                error: (message) => { _notification(message, "error") },
                info: (message) => { _notification(message, "_info") }
            }
        }
    });
});