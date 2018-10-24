import multilineTextClip from './multiline-text-clip';
export default {
    // 安装全局插件
    install: function (Vue, options) {
        Vue.directive(multilineTextClip.name, multilineTextClip);
    }
}
