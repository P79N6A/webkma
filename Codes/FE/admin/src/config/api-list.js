import sysConfig from '../config/system'
import httpConfig from './http'
let { apiHost, kpaasApiHost } = httpConfig;
let api_list = {
    //登录
    login: {
        method: "post",
        api_url: 'user/back/logon'
    },
    //退出登录 
    logout: {
        method: "post",
        api_url: 'session/logout'
    },
    //获取用户登录信息
    getLogonInfo: {
        method: "get",
        api_url: 'backuser/currentuserinfo'
    },
    //获取商家列表
    getBussinessList: {
        method: "get",
        api_url: 'business/searchbusiness'
    },
    //获取商家信息详情
    getBussinessInfo: {
        method: "get",
        api_url: 'business/getbusiness'
    },
    //添加修改商家信息
    savebusiness: {
        method: "post",
        api_url: 'business/savebusiness'
    },
    //重置密码
    resetPwd: {
        method: "post",
        api_url: 'business/reset/password'
    },
    //启用商家、设计师
    openbusiness: {
        method: "post",
        api_url: 'business/openbusiness'
    },
    //禁用商家、设计师
    disablebusiness: {
        method: "post",
        api_url: 'business/disablebusiness'
    },
    //删除商家、设计师
    deletebusiness: {
        method: "post",
        api_url: 'business/delete'
    },
    //获取标签列表 
    getList: {
        method: "get",
        api_url: 'tag/list/material'
    },
    //添加标签 
    addTag: {
        method: "post",
        api_url: 'tag/create'
    },
    //编辑标签 
    resetTag: {
        method: "put",
        api_url: 'tag/reset/material'
    },
    //关联标签 
    relateTag: {
        method: "post",
        api_url: 'tag/relation'
    },
    //删除标签卡片
    deleteTag: {
        method: "post",
        api_url: 'tag/delete'
    },
    //拖拽排序
    tagOrder: {
        method: "put",
        api_url: 'tag/sort'
    },
    //获取素材列表 
    getMaterialList: {
        method: "get",
        api_url: 'material/search'
    },
    //删除素材 
    deleteMaterial: {
        method: "post",
        api_url: 'material/delete'
    },
    //编辑素材 
    updateMaterial: {
        method: "post",
        api_url: 'material/update'
    },
    //添加素材 
    saveMaterail: {
        method: "post",
        api_url: 'material/save'
    },
    //上传图片
    uploadFiles: {
        method: "post",
        api_url: "kpaasapi/assets_service/v1/assets/upload",
        params: { "secret_key": sysConfig.secret_key }
    },
    //问题反馈
    getOpinionList: {
        method: "get",
        api_url: kpaasApiHost + "api/feedback_service/v1/feedback/search",
        params: { "secret_key": sysConfig.secret_key }
    },
    //获取标签库标签
    getTagList: {
        method: "get",
        api_url: "label/rank/list"
    },
    //新增标签库标签
    addTags: {
        method: "post",
        api_url: 'label/save'
    },
    //删除标签库标签
    deleteTags: {
        method: "post",
        api_url: 'label/delete'
    },
    //修改标签库标签状态
    updateTagStatus: {
        method: "post",
        api_url: '/label/state/update'
    },
    //分页列表(搜索) 
    getListSearch: {
        method: "get",
        api_url: "category/list/search"
    },
    //获取分类列表 
    getClassifyList: {
        method: "get",
        api_url: "category/list"
    },
    //分类编辑 
    editClassify: {
        method: "post",
        api_url: 'category/modify'
    },
    //删除分类 
    deleteClassify: {
        method: "post",
        api_url: 'category/delete'
    },
    //自定义排序 
    customSort: {
        method: "post",
        api_url: 'category/modify/sort'
    },
    //获取活动列表 
    getActivitiyList: {
        method: "post",
        api_url: 'manuscript/list/release'
    },
    //活动自定义排序 
    activitiySort: {
        method: "post",
        api_url: 'manuscript/sort'
    },
    //活动禁用和启用 
    activitiyEnable: {
        method: "post",
        api_url: 'manuscript/enable'
    },
    //获取活动模板列表 
    getTempList: {
        method: "get",
        api_url: "manuscript/list/template"
    },
    //获取活动分类tree
    getCategoryTree: {
        method: 'get',
        api_url: '/category/tree'
    },
    //模板上下架 
    shelvesTemplate: {
        method: "post",
        api_url: 'manuscript/offline'
    },
    //删除模板
    delTemplate: {
        method: "post",
        api_url: 'manuscript/delete'
    },
    //获取公众号账号信息列表 
    getweChatAcountList: {
        method: "get",
        api_url: 'wxsubscription/search/list'
    },
    //获取朋友圈推广列表
    getweChatAdvList: {
        method: "get",
        api_url: 'promotion/back/list'
    },
    //通过/驳回朋友圈推广
    isPass: {
        method: "post",
        api_url: 'promotion/audit'
    },
    //获取朋友圈详情信息 
    getPromotionDetail: {
        method: "get",
        api_url: 'promotion/show/info'
    },
    //获取数据报告列表 
    getPromotionDataList: {
        method: "get",
        api_url: 'promotion/report/list'
    },
    //新增和修改数据报告 
    savePromotionDataReport: {
        method: "post",
        api_url: 'promotion/report/save'
    },
    //获取报告详情  
    getPromotionDataDetail: {
        method: "get",
        api_url: 'promotion/report/get'
    }
}

export default api_list