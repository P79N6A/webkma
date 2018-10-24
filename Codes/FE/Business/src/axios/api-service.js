import Vue from 'vue'
import axios from './index'
import httpConfig from '../config/http'
import apiList from '../config/api-list'

let _requestFun = (apiMethod, option) => {
    let _api_list = Object.assign({}, apiList)
    return new Promise((resolve, reject) => {
        let _method = _api_list[apiMethod].method
        let _api_url = _api_list[apiMethod].api_url
        switch (_method) {
            case "post":
            case "put":
                axios[_method](_api_url, option).then((result) => {
                    resolve(result);
                }).catch(err => {
                    // 业务错误
                    if (err.response.status == 400) {
                        resolve(err.response.data)
                    } else reject(err)
                })
                break;
            case "get":
                var array = []
                    , temp = _api_url.split('/:');

                _api_url = temp[0];
                if (temp.length > 1) {
                    _api_url = _api_url + '/' + option[temp[1]];
                    delete option[temp[1]];
                }

                for (var _key in option) {
                    array.push(_key + "=" + encodeURIComponent(option[_key]));
                }
                let url = _api_url + (_api_url.indexOf('?') > -1 ? '&' : '?') + array.join("&")
                axios[_method](url).then((result) => {
                    resolve(result);
                }).catch(err => {
                    // 业务错误
                    if (err.response.status == 400) {
                        resolve(err.response.data)
                    } else reject(err)
                })
                break;
        }
    })
}

let _requestApi = (apiMethod, option, scb, ecb) => {
    return _requestFun(apiMethod, option).then(result => {
        if (!!scb) {
            scb(result)
        }
        return result;
    }).catch(function (err) {
        if (!ecb) {
            return Vue.prototype.$message.error((err.message || '').indexOf('401') > -1 ? '访问未授权' : err.message);
        } else {
            ecb(err)
        }
        return Promise.reject(err);
    })
}


export default { request: _requestApi }