import httpConfig from './http.js'
import sysConfig from './system.js'
let { apiHost, kpaasApiHost } = httpConfig;
let api_list = {
    //登录
    login: {
        method: "post",
        api_url: apiHost + "business/logonbusiness"
    },
    //创建稿件
    createManuscript: {
        method: "post",
        api_url: apiHost + "manuscript/create"
    },
    //修改稿件
    updateManuscript: {
        method: "put",
        api_url: apiHost + "manuscript/update"
    },
    //获取稿件
    getManuscriptInfo: {
        method: "get",
        api_url: apiHost + "manuscript/detail"
    },
    //发布稿件
    releaseManuscript: {
        method: "post",
        api_url: apiHost + "manuscript/generate/release"
    },
    //预览稿件
    previewManuscript: {
        method: "post",
        api_url: apiHost + "manuscript/generate/preview"
    },
    //生成模板
    createTemplate: {
        method: "post",
        api_url: apiHost + "manuscript/generate/template"
    },
    //获取营销方案模板列表
    getManuscriptListOfTemplate: {
        method: "get",
        api_url: apiHost + "manuscript/list/template"
    },
    //获取营销方案模板列表
    getManuscriptListOfBusinessTemplate: {
        method: "get",
        api_url: apiHost + "manuscript/list/template/business"
    },
    getManuscriptListOfDraft: {
        method: "get",
        api_url: apiHost + "manuscript/list/draft"
    },
    getManuscriptListOfRelease: {
        method: "post",
        api_url: apiHost + "manuscript/list/release"
    },
    deleteManuscript: {
        method: "post",
        api_url: apiHost + "manuscript/delete"
    },
    createEmployee: {
        method: "post",
        api_url: apiHost + "employee/create"
    },
    removeEmployee: {
        method: "post",
        api_url: apiHost + "employee/delete"
    },
    getEmployeeInfo: {
        method: "get",
        api_url: apiHost + "employee/info/:id"
    },
    //获取人员列表
    getEmployeeList: {
        method: "post",
        api_url: apiHost + "employee/search"
    },
    //活动分派人员
    assignEmployee: {
        method: "post",
        api_url: apiHost + "employee/distribute"
    },
    //获取系统配置
    getSysConfig: {
        method: "get",
        api_url: apiHost + "sysconfig/getconfig"
    },
    //上传文件
    uploadFiles: {
        method: "post",
        api_url: "kpaasapi/assets_service/v1/assets/upload?secret_key=" + sysConfig.secret_key
    },
    //上传文件Base64
    uploadImageForBase64: {
        method: "post",
        api_url: "kpaasapi/assets_service/v1/assets/upload_base64?secret_key=" + sysConfig.secret_key
    },
    //获取素材列表
    getMaterialList: {
        method: "get",
        api_url: apiHost + "material/search"
    },
    //删除素材
    deleteMaterial: {
        method: "post",
        api_url: apiHost + "material/delete"
    },
    //统计分析服务 - 根据(所属模块,类型)聚合查询
    aggsTypeByBelongModule: {
        method: "post",
        api_url: 'kpaasapi/analysis_service/v1/analysis/aggsTypeByBelongModule?secret_key=' + sysConfig.secret_key
    },
    //统计分析服务 - 根据日期聚合分析
    aggsTime: {
        method: "post",
        api_url: 'kpaasapi/analysis_service/v1/analysis/aggsTime?secret_key=' + sysConfig.secret_key
    },
    //统计分析服务 - 根据(所属区域,类型)聚合查询
    aggsGeo: {
        method: "post",
        api_url: 'kpaasapi/analysis_service/v1/analysis/aggsGeo?secret_key=' + sysConfig.secret_key
    },
    //获取中奖信息列表
    drawprizedata: {
        method: "get",
        api_url: apiHost + "activity/plugin/drawprizedata/back"
    },
    //通用聚合查询
    aggsGeneral: {
        method: "post",
        api_url: 'kpaasapi/analysis_service/v1/analysis/aggsGeneral?secret_key=' + sysConfig.secret_key
    },
    //统计分析服务 - 浏览时间查询(定制)
    aggsAccessTime: {
        method: "post",
        api_url: 'kpaasapi/analysis_service/v1/analysis/aggsAccessTime?secret_key=' + sysConfig.secret_key
    },
    //修改密码接口
    modifyPwd: {
        method: "post",
        api_url: 'kpaasapi/identify_service/v1/user/change_password?secret_key=' + sysConfig.secret_key
    },
    //获取编辑界面菜单中标签
    getMaterialTagList: {
        method: "get",
        api_url: apiHost + "tag/list/usematerial"
    },
    //保存素材
    saveMaterial: {
        method: "post",
        api_url: apiHost + "user/material/save"
    },

    getSMSList: {
        method: '',
        api_url: apiHost + "user/material/save"
    },
    //批量修改员工状态，禁用、启用
    employeeModify: {
        method: "put",
        api_url: apiHost + "employee/modify"
    },
    //客户列表
    customerList: {
        method: "get",
        api_url: apiHost + "customer/search"
    },
    //客户删除
    customerDelete: {
        method: "post",
        api_url: apiHost + "customer/delete"
    },
    //批量修改客户信息
    customerModify: {
        method: "post",
        api_url: apiHost + "customer/modify"
    },
    //获取客户列表预留手机号信息
    leavePhoneList: {
        method: "get",
        api_url: apiHost + "customer/collect/list"
    },
    //获取客户信息
    getCustomerInfo: {
        method: "get",
        api_url: apiHost + "customer/info/:id"
    },
    //获取商家信息
    getBussinessInfo: {
        method: "get",
        api_url: apiHost + "business/getbusiness"
    },
    //保存商家信息
    saveBussinessInfo: {
        method: "post",
        api_url: apiHost + "business/savebusiness"
    }
    ,
    getSMSTemplate: {
        method: 'get',
        api_url: apiHost + "/template/sms/search"
    },
    getCustomerList: {
        method: 'get',
        api_url: apiHost + "/customer/search/simple"
    },
    getSingNameList: {
        method: 'get',
        api_url: "kpaasapi/communication_server/v1/sendcloud/searchsign?secret_key=" + sysConfig.secret_key
    },
    getBusinessSecret: {
        method: 'get',
        api_url: "kpaasapi/identify_service/v1/merchant/get_secret?project_id=KMA&secret_key=" + sysConfig.secret_key
    },
    sendSMS: {
        method: 'post',
        api_url: "kpaasapi/communication_server/v1/sms/send"
    },
    smsTplQuote: {
        method: 'get',
        api_url: apiHost + '/template/sms/quote'
    },
    smsQuery: {
        method: 'get',
        api_url: 'kpaasapi/communication_server/v1/sms/search'
    },
    deleteSMS: {
        method: 'post',
        api_url: 'kpaasapi/communication_server/v1/sms/delete'
    },
    copySMS: {
        method: 'post',
        api_url: 'kpaasapi/communication_server/v1/sms/copy'
    },
    //获取编辑器上传用户音乐列表
    getAudioList: {
        method: 'get',
        api_url: 'audio/search'
    },
    //保存编辑器上传用户音乐
    saveAudio: {
        method: 'post',
        api_url: 'audio/save'
    },
    //获取game主题列表
    getGameThemeList: {
        method: 'get',
        api_url: 'plugin_theme/list'
    },
    getPluginThemeDetail: {
        method: 'get',
        api_url: 'plugin_theme/detail'
    },
    //保存活动插件设置
    savePluginSetting: {
        method: 'post',
        api_url: 'activity/plugin/savesetting'
    },
    //保存活动插件设置
    saveFormSetting: {
        method: 'post',
        api_url: 'activity/plugin/saveFormSetting'
    },
    getGameRank: {//获取游戏排行榜
        method: 'get',
        api_url: 'activity/plugin/score/list'
    },
    getformData: {//获取表单数据列表
        method: 'get',
        api_url: 'activity/plugin/from/content/list'
    },
    getMomentsAdvList: {//获取朋友圈广告推广li
        method: 'get',
        api_url: 'promotion/business/list'
    },
    getPromotionOverview: {//获取朋友圈广告推广概览
        method: 'get',
        api_url: 'promotion/overview'
    },
    getMomentsAdvDataList: {//获取朋友圈广告推广数据报告列表
        method: 'get',
        api_url: 'promotion/report/list'
    },
    getMomentsAdvDataTotal: {//获取朋友圈广告推广数据报告总和
        method: 'get',
        api_url: 'promotion/report/total'
    },
    getWxSubscription: {
        method: 'get',
        api_url: 'wxsubscription/search/get'
    },
    saveWxSubscription: {
        method: 'post',
        api_url: 'wxsubscription/save'
    },
    //获取朋友圈广告添加推广配置
    getMomentsAdvConfigList:{
        method: 'get',
        api_url: 'promotion/config/list'
    },
    //编辑朋友圈广告推广
    editMomentsAdv:{
        method: 'post',
        api_url: '/promotion/create'
    },
    //获取朋友圈广告推广详情
    getMomentsAdvInfo:{
        method: 'get',
        api_url: '/promotion/edit/info'

    },
    //短信微服务 - 资源查询
    getSmsInfo: {
        method: 'get',
        api_url: "kpaasapi/communication_server/v1/resources/search?secret_key=" + sysConfig.secret_key

    },
    //获取朋友圈广告推广详情
    getInterestList:{
        method: 'get',
        api_url: '/promotion/interest/list'
    }
}

export default api_list