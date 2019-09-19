import Vue from 'vue';
import axios from 'axios';
import httpConfig from '../config/http';
import store from '../vuex/store';
import api from './api-service';
import apiList from '../config/api-list';
let { apiHost, kpaasApiHost } = httpConfig;

let axiosRequset = axios.create({
    timeout: 30 * 1000
})

axiosRequset.interceptors.request.use((config) => {
    var sessionId = localStorage.sessionId || "";
    config.headers["session_id"] = sessionId;
    
    var queryString = "";
    if (!config.params || (!!config.params && !config.params["session_id"])) {
        !!sessionId ? queryString = "?session_id=" + sessionId + "&" : "";
    }
    if (config.url.lastIndexOf("?") != -1) {
        config.url = config.url.replace("?", queryString);
    } else {
        config.url += queryString;
    }

    let url = config.url;
    if (/^(http|https):\/\//i.test(url)) {
        return config;
    }
    if (/^kpaasapi/i.test(url)) {
        config.url = url.replace(/^kpaasapi/i, `${kpaasApiHost}api`);
    } else {
        config.url = `${apiHost}${url}`;
    }
    return config;
})

axiosRequset.interceptors.response.use((result) => {
    switch (result.status) {
        case 200:
            break;
        default:
            return Promise.reject(result)
    }

    switch (result.data.status) {
        default:
            return Promise.resolve(result.data)
    }
}, result => {
    console.log("请求响应异常:", result, JSON.stringify(result));
    if (!!result.response) {
        switch (result.response.status) {
            case 401:
                store.dispatch('setLogout');
                // 对IE做特殊处理
                if (!!/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i.test(navigator.userAgent)
                    || !!/(?:ms|\()(ie)\s([\w\.]+)/i.test(navigator.userAgent)) {
                    location.href = (location.origin || (location.protocol + '//' + location.host)) + '/';
                    //#/login //401 错误，重定向到登录页一定不要加hash，会导致ie下面不重定向页面
                } else {
                    location.href = location.origin + '/#/login';
                }
                // router.push({ path: "/login" });
                return Promise.resolve(result.response.data)
                break;
            default:
                return Promise.reject(result)
                break;
        }
    } else {
        //兼容ie10 401状态
        if (navigator.userAgent.indexOf("MSIE 10") != -1) {
            store.dispatch('setLogout');
            location.href = (location.origin || (location.protocol + '//' + location.host)) + '/';
            return Promise.resolve(result.response.data)
        } else {
            return Promise.reject(result)
        }
    }
});

['get', 'post', 'put', 'delete'].forEach(m => {
    let originFunc = axiosRequset[m];
    axiosRequset[m] = (url, ...args) => {
        let apiObj = apiList[url];
        if (!!apiObj) {
            return api.request.apply(api, [url, ...args]);
        } else {
            return originFunc.apply(axiosRequset, [url, ...args]);
        }
    }
});

Vue.prototype.$axios = axiosRequset;

// export default ({});
export default axiosRequset