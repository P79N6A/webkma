import Vue from 'vue'
import axios from './index'
import apiList from '../config/api-list'

let _requestFun = (apiMethod, option) => {
    let _api_list = Object.assign({}, apiList)
    return new Promise((resolve, reject) => {
        let _method = _api_list[apiMethod].method
        let _api_url = _api_list[apiMethod].api_url
        let _api_data = option
        let _api_params = _api_list[apiMethod].params

        switch (_method) {
            case "post":
            case "put":
                if (!!option && !!option.secret_key) {//登录后营销概览统计数据接口还不能获取到localStorage.businessSecret，暂时特殊处理，之后进行优化  12.13 mars
                    _api_url = _api_url + (_api_url.indexOf('?') > -1 ? '&' : '?') + 'secret_key=' + option.secret_key
                }
                _api_data = Object.assign(option, _api_params)
                break;
            case "get":
                if (_api_url.indexOf("/:") != -1) {
                    let temp = _api_url.split('/:');
                    _api_url = temp[0];
                    _api_url = _api_url + '/' + option[temp[1]];
                    delete option[temp[1]];
                }
                _api_params = !!_api_params ? Object.assign(_api_params, _api_data) : _api_data;
                _api_data = {};
        }

        axios({
            method: _method,
            url: _api_url,
            data: _api_data,
            params: _api_params
        }).then((result) => {
            resolve(result);
        }).catch((err) => {
            // 业务错误
            if (err.response.status == 400) {
                resolve(err.response.data)
            } else reject(err)
        })
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