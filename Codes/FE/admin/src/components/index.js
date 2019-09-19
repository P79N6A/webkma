import commonSearch from './com-search';
import smsContent from './sms-content';
import customScroll from './custom-scroll';
let CommonComponent = {
    // 安装全局插件
    install: function (Vue, options) {
        Vue.component(commonSearch.name, commonSearch);
        Vue.component(smsContent.name,smsContent);
        Vue.component(customScroll.name,customScroll);
    }
}

export default CommonComponent;