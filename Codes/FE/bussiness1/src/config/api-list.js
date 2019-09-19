import httpConfig from './http.js'
import sysConfig from './system.js'
let { apiHost, kpaasApiHost } = httpConfig;
let api_list = {
    //登录
    login: {
        method: "post",
        api_url: apiHost + "business/logonbusiness"
    },
    //获取用户登录信息
    getLogonInfo: {
        method: "get",
        api_url: apiHost + "business/logoninfo"
    },
    //创建稿件
    createManuscript: {
        method: "post",
        api_url: apiHost + "manuscript/create"
    },
    //复制稿件
    copyManuscript: {
        method: "post",
        api_url: apiHost + "manuscript/copy"
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
    // 解锁模板
    unlockManuscript: {
        method: "post",
        api_url: apiHost + "manuscript/unlock"
    },
    createEmployee: {
        method: "post",
        api_url: "kpaasapi/department_service/v1/employee/save",
        params: { "data_emit": "sync" }
    },
    removeEmployee: {
        method: "post",
        api_url: "kpaasapi/department_service/v1/employee/delete",
        params: { "data_emit": "sync" }
    },
    getEmployeeInfo: {
        method: "get",
        api_url: "kpaasapi/department_service/v1/employee/info",
        params: { "data_emit": "sync" }
    },
     //设置主管BOSS
     setManager: {
        method: "post",
        api_url:  "kpaasapi/department_service/v1/department/setBoss?data_emit=sync",
    },
    //设置员工状态（启用禁用）
    setEmployeeState: {
        method: "post",
        api_url: "kpaasapi/department_service/v1/employee/state",
        params: { "data_emit": "sync" }
    },
    //获取人员列表
    getEmployeeList: {
        method: "post",
        api_url: apiHost + "employee/search"
    },
    //导入员工
    importEmployee: {
        method: "post",
        api_url: apiHost + "employee/upload"
    },
    //查看推广奖励
    detailExtensionReward: {
        method: "get",
        api_url: apiHost + "award/show/info"
    },
    //查看推广奖励-for编辑
    extensionRewardEetail: {
        method: "get",
        api_url: apiHost + "award/edit/info"
    },
    //修改推广奖励时间
    setRewardTime: {
        method: "post",
        api_url: apiHost + "award/update"
    },
    //奖励列表
    rewardDistribute: {
        method: "get",
        api_url: apiHost + "award/distribute/list"
    },
    //分派/撤销奖励
    assignEmployee: {
        method: "post",
        api_url: apiHost + "employee/distribute"
    },
    //商户余额
    businessAccount: {
        method: "get",
        api_url: apiHost + "wx/account/info"
    },
    //获取系统配置
    getSysConfig: {
        method: "get",
        api_url: apiHost + "sysconfig/getconfig"
    },
    //上传文件
    uploadFiles: {
        method: "post",
        api_url: "kpaasapi/assets_service/v1/assets/upload",
        params: { "secret_key": sysConfig.secret_key }
    },
    //上传文件Base64
    uploadImageForBase64: {
        method: "post",
        api_url: "kpaasapi/assets_service/v1/assets/upload_base64",
        params: { "secret_key": sysConfig.secret_key }
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
        api_url: 'kpaasapi/analysis_service/v1/analysis/aggsTypeByBelongModule',
        params: { "secret_key": localStorage.businessSecret }
    },
    //统计分析服务 - 根据日期聚合分析
    aggsTime: {
        method: "post",
        api_url: 'kpaasapi/analysis_service/v1/analysis/aggsTime'
    },
    //统计分析服务 - 根据(所属区域,类型)聚合查询
    aggsGeo: {
        method: "post",
        api_url: 'kpaasapi/analysis_service/v1/analysis/aggsGeo',
        // params:{"secret_key":localStorage.businessSecret}
    },
    //统计累计总数
    aggsType: {
        method: "post",
        api_url: 'kpaasapi/analysis_service/v1/analysis/aggsType'
    },
    //获取中奖信息列表
    drawprizedata: {
        method: "get",
        api_url: apiHost + "activity/plugin/drawprizedata/back"
    },
    //统计分析服务 - 浏览时间查询(定制)
    aggsAccessTime: {
        method: "post",
        api_url: 'kpaasapi/analysis_service/v1/analysis/aggsAccessTime',
        params: { "secret_key": localStorage.businessSecret }
    },
    //营销概览进行中的活动 
    getOverviewActivity: {
        method: "get",
        api_url: apiHost + "manuscript/overview/activity"
    },
    //员工推广排名 
    getOverviewEmployee: {
        method: "get",
        api_url: apiHost + "manuscript/overview/employee"
    },
    //修改密码接口
    modifyPwd: {
        method: "post",
        api_url: 'kpaasapi/identify_service/v1/user/change_password',
        params: { "secret_key": sysConfig.secret_key }
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
    // //批量修改员工状态，禁用、启用
    // employeeModify: {
    //     method: "put",
    //     api_url: apiHost + "employee/modify"
    // },
    //客户列表 (新)
    // customerList: {
    //     method: "get",
    //     api_url: apiHost + "customer/search"
    // },
    customerList: {
        method: "post",
        api_url: apiHost + "customer_business/list"
    },
    //客户删除 (新)
    // customerDelete: {
    //     method: "post",
    //     api_url: apiHost + "customer/delete"
    // },
    customerDelete: {
        method: "get",
        api_url: apiHost + "customer_business/delete"
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
    },
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
        api_url: "kpaasapi/communication_server/v1/sendcloud/searchsign"
    },
    getBusinessSecret: {
        method: 'get',
        api_url: "kpaasapi/identify_service/v1/merchant/get_secret",
        params: { "project_id": "KMA", "secret_key": sysConfig.secret_key }
    },
    //保存短信
    saveSMS: {
        method: 'post',
        api_url: "kpaasapi/communication_server/v1/sms/save"
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
    //获取活动的预约信息
    getAppointmentInfo:{
        method: 'get',
        api_url: 'activity/plugin/getAppointmentInfo'
    },
    //保存活动插件设置
    savePluginSetting: {
        method: 'post',
        api_url: 'activity/plugin/savesetting'
    },
    //保存活动插件设置
    saveFormSetting: {
        method: 'post',
        api_url: 'activity/plugin/saveFromSetting'
    },
    getGameRank: {//获取游戏排行榜
        method: 'get',
        api_url: 'activity/plugin/score/list'
    },
    getformData: {//获取表单数据列表
        method: 'get',
        api_url: 'activity/plugin/form/content/list'
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
    getMomentsAdvConfigList: {
        method: 'get',
        api_url: 'promotion/config/list'
    },
    //编辑朋友圈广告推广
    editMomentsAdv: {
        method: 'post',
        api_url: '/promotion/create'
    },
    //获取朋友圈广告推广详情
    getMomentsAdvInfo: {
        method: 'get',
        api_url: '/promotion/edit/info'
    },
    //短信微服务 - 资源查询
    getSmsInfo: {
        method: 'get',
        api_url: "kpaasapi/communication_server/v1/resources/search"

    },
    //获取朋友圈广告兴趣列表
    getInterestList: {
        method: 'get',
        api_url: '/promotion/interest/list'
    },
    //获取朋友圈广告城市列表
    getCityList: {
        method: 'get',
        api_url: '/promotion/city/list'
    },
    //获取活动分类tree
    getCategoryTree: {
        method: 'get',
        api_url: '/category/tree'
    },
    // 获取活动分类列表
    getCategoryList: {
        method: 'get',
        api_url: '/category/list'
    },
    //客户导入
    importCustomer: {
        method: 'post',
        api_url: 'customer/upload'
    },
    //获取抽奖记录详情
    getDrawprizeInfo: {
        method: 'get',
        api_url: 'activity/plugin/drawprize/info/business'
    },
    //线上发放奖品
    provideOnline: {
        method: 'post',
        api_url: 'activity/plugin/provide/online'
    },
    // 已发送邮件列表
    sentMailList: {
        method: 'get',
        api_url: 'kpaasapi/communication_server/v1/email/search'
    },
    // 删除邮件
    deleteMail: {
        method: 'post',
        api_url: 'kpaasapi/communication_server/v1/email/delete'
    },
    // 获取邮件详情
    getMailDetail: {
        method: 'get',
        api_url: 'kpaasapi/communication_server/v1/email/get'
    },
    //获取邮件模板
    getMailTemplate: {
        method: 'get',
        api_url: 'template/email/search'
    },
    //解锁邮件模板
    unlockMailTemplate: {
        method: 'post',
        api_url: 'template/email/unlock'
    },
    //保存邮件
    saveMail: {
        method: 'post',
        api_url: 'kpaasapi/communication_server/v1/email/save'
    },
    //发送邮件
    sendMail: {
        method: 'post',
        api_url: 'kpaasapi/communication_server/v1/email/send'
    },
    //邮件模板计数
    mailTplQuote: {
        method: 'get',
        api_url: apiHost + '/template/email/quote'
    },
    //获取邮件模板详情
    getMailTplDetail: {
        method: 'get',
        api_url: 'template/email/get'
    },
    //获取部门树（带员工数）
    getDepartmentTreeAll: {
        method: 'get',
        api_url: 'kpaasapi/department_service/v1/department/treeWithEmplCount'
    },
    //获取部门树（带推广奖励员工数）
    getDepartmentTreeAwards: {
        method: 'get',
        api_url: apiHost + '/award/dept/tree'
    },
    //编辑部门
    updateDepartment: {
        method: 'post',
        api_url: 'kpaasapi/department_service/v1/department/save',
        params: { "data_emit": "sync" }
    },
    //删除部门
    deleteDepartment: {
        method: 'post',
        api_url: 'kpaasapi/department_service/v1/department/delete',
        params: { "data_emit": "sync" }
    },
    // 获取企业所有员工
    getAllEmployeeByBiz: {
        method: 'get',
        api_url: 'kpaasapi/department_service/v1/employee/list'
    },
    // 员工转移
    transferEmployee: {
        method: 'post',
        api_url: 'kpaasapi/department_service/v1/employee/transfer',
        params: { "data_emit": "sync" }
    },
    //获取模板表单名称列表
    getformList: {
        method: 'get',
        api_url: apiHost + 'activity/plugin/form/name/list'
    },
    //添加活动奖励处获取推广活动列表
    getPromotionActivity: {
        method: 'get',
        api_url: apiHost + '/manuscript/activity/list/simple'
    },
    //获取活动奖励配置
    getAwardsConfig: {
        method: 'get',
        api_url: apiHost + 'award/config'
    },
    //添加活动奖励
    addAwards: {
        method: 'post',
        api_url: apiHost + 'award/create'
    },
    //获取推广奖励列表
    getAwardList: {
        method: 'get',
        api_url: apiHost + '/award/page/list'
    },
    //删除推广奖励
    deleteAward: {
        method: 'post',
        api_url: apiHost + '/award/delete'
    },
    //获取团队推广奖励
    getAwardTeamInfo: {
        method: 'get',
        api_url: apiHost + '/award/group/info'
    },
    //获取部门员工推广奖励
    getAwardEmployee: {
        method: 'post',
        api_url: apiHost + '/award/employee/page/list'
    },
    //获取部门员工推广奖励
    getActivityEmployeeCount: {
        method: 'get',
        api_url: apiHost + '/employee/manuscript/count'
    },
    //获取定额支付列表
    getFixedamount: {
        method: 'get',
        api_url: apiHost + '/wx/pay/native/fixedamount'
    },
    //下单接口获取微信支付链接
    createOrderByWx: {
        method: 'post',
        api_url: apiHost + '/wx/pay/native/2'
    },
    //查询支付状态
    getRechargeStatus: {
        method: 'get',
        api_url: apiHost + '/wx/pay/log/info'
    },
    //获取充值记录列表
    getRechargeList: {
        method: 'get',
        api_url: apiHost + 'capital_flow_log/list'
    },
    //获取商家账户详情
    getAccountDetail: {
        method: 'get',
        api_url: apiHost + '/wx/account/detail'
    },
    //获取充值记录列表
    getWithdrawalList: {
        method: 'get',
        api_url: apiHost + 'wx/pay/log/withdrawal/list'
    },
    //活动人脉图谱列表 
    getListRelation: {
        method: 'post',
        api_url: apiHost + '/manuscript/list/relation'
    },
    //获取活动人脉图谱脑图数据
    getManuscriptGraph: {
        method: 'get',
        api_url: apiHost + '/neo4j/graph/manuscript/search'
    },
    //获取名片人脉图谱脑图数据
    getCardGraph: {
        method: 'get',
        api_url: apiHost + '/neo4j/graph/business/search'
    },
    //获取活动人脉图谱表格数据 
    getManuscriptTable: {
        method: 'get',
        api_url: apiHost + '/neo4j/graph/manuscript/list/search'
    },
    //获取活动名片图谱列表 
    getCardTable: {
        method: 'get',
        api_url: apiHost + '/neo4j/graph/business/list/search'
    },
    //活动人脉列表名片查询 
    getCardInfo: {
        method: 'get',
        api_url: apiHost + '/user/card/info'
    },
    //获取商品信息
    getGoodsInfo: {
        method: 'get',
        api_url: apiHost + 'shop/goods/search'
    },
    //商品行为漏斗
    goodsBehaviorFunnel: {
        method: 'get',
        api_url: apiHost + '/user/behavior/manuscript/aggs'
    },
    //投票插件设置
    saveVoteSetting: {
        method: 'post',
        api_url: apiHost + '/activity/plugin/saveVoteSetting'
    },
    //详情-获取投票插件列表
    getVoteList: {
        method: 'get',
        api_url: apiHost + '/activity/plugin/vote/name/list'
    },
    //详情-获取投票项列表
    getVoteData: {
        method: 'get',
        api_url: apiHost + '/activity/plugin/vote/content/list'
    },
    //搜索文章
    searchArticle: {
        method: 'get',
        api_url: apiHost + '/artical/recommand/searArticleList'
    },
    //获取文章真实地址
    getArticleRealUrl: {
        method: 'get',
        api_url: apiHost + '/artical/recommand/getWxArtcleUrl'
    },
    //获取发布设置标签
    getTagRelease: {
        method: 'get',
        api_url: apiHost + 'label/recommend/list'
    },
    //预览微信文章
    previeWxArticle:{
        method: 'post',
        api_url: apiHost + '/artical/recommand/previewWxArtcle' 
    },
    //修改活动状态
    modifyActivityStatus:{
        method: 'post',
        api_url: apiHost + '/manuscript/update/status' 
    },
    //发布微信文章
    releaseWechatAticle:{
        method:'post',
        api_url: apiHost + 'artical/recommand/release'
    },
    //获取我的任务活动列表
    getMyManuscriptList: {
        method: "post",
        api_url: apiHost + "manuscript/list/business/job"
    },
	//获取我的客户列表
    getMyCustomerList: {
        method: "post",
        api_url: apiHost + "customer_business/list"
    },
    // 获取标签排行列表
    getlabelRnakList:{
        method: "get",
        api_url: apiHost + "label/rank/list"
    },
    // 添加微信推送
    addWxPush:{
        method: 'post',
        api_url: apiHost + "manuscript_push/add"
    },
    // 微信推送详情
    wxPushInfo:{
        method: 'get',
        api_url: apiHost + "manuscript_push/info"
    },
    // 微信推送详情-客户列表
    wxPushInfoCustomerList:{
        method: 'get',
        api_url: apiHost + "manuscript_push/customer_list"
    },
    // 微信推送任务列表
    wxPushlList:{
        method: 'get',
        api_url: apiHost + "manuscript_push/list"
    },
    // 获取任务分派详情
    getAssignmentInfo:{
        method: 'get',
        api_url: apiHost + "manuscript/info"
    },
    // 任务分派员工列表
    getEmployeearchList: {
        method: "post",
        api_url: apiHost + "employee/search"
    },
    // 获取客户详情
    getComsuterInfo: {
        method: 'get',
        api_url: apiHost + "customer_business/info"
    },
    // 查询openid
    getUserOpenID: {
        method: 'get',
        api_url: kpaasApiHost + "api/identify_service/v1/user/get_user_openid"
    },
    // 1v1红包发送
    sendRedpack: {
        method: 'post',
        api_url: apiHost + 'wx_red_envelopes/sendredpack'
    },
    // 红包裂变创建
    redpacketCreate: {
        method: 'post',
        api_url: apiHost + 'award/redpacket/create'
    },
     // 红包裂变列表
     redpacketList: {
        method: 'post',
        api_url: apiHost + 'award/redpacket/list'
    },
     // 红包裂变补发
     redpacketsendAgain: {
        method: 'post',
        api_url: apiHost + 'award/redpacket/sendAgain'
    },
     // 红包裂变详情
     redpacketdetails: {
        method: 'post',
        api_url: apiHost + 'award/redpacket/details'
    },
     // 红包裂变结束按钮
     redpacketclose: {
        method: 'post',
        api_url: apiHost + 'award/redpacket/close'
    },
     // 红包裂变统计信息---红包信息统计
     redpackstatistics: {
        method: 'post',
        api_url: apiHost + 'award/redpacket/redpackstatistics'
    },
     // 红包裂变统计信息---红包消耗
     openstatistics: {
        method: 'post',
        api_url: apiHost + 'award/redpacket/openstatistics'
    },
    // 获取人脉溯源
    getSourcePath: {
        method: 'post',
        api_url: apiHost + 'relationship/query/sourcePath'
    },
    // 获取插件列表
    plugsList: {
        method: 'get',
        api_url: apiHost + 'manuscript/plugin/name'
    },
    // 获取投票列表
    voteListData: {
        method: 'get',
        api_url: apiHost + 'activity/plugin/vote/user/list'
    },
    // 获取点赞列表
    statisticalCont: {
        method: 'get',
        api_url: apiHost + 'activity/plugin/statistical/data'
    },
    // 获取抽奖列表(中奖)获取小游戏列表
    pluginDrawprize: {
        method: 'get',
        api_url: apiHost + 'activity/plugin/drawprize/list'
    },
    // 获取商品列表
    pluginGoods: {
        method: 'post',
        api_url: apiHost + 'dashboard/plugins/goods/list'
    },
    // 获取营销力来源数据
    taskPowerList: {
        method: 'post',
        api_url: apiHost + 'dashboard/power/list'
    },
    // 获取任务或员工浏览统计
    taskBrowseList: {
        method: 'post',
        api_url: apiHost + 'dashboard/browse/list'
    },
    // 获取任务或员工浏览时间分布
    taskBrowseTimespan: {
        method: 'post',
        api_url: apiHost + 'dashboard/browse/timespan'
    },
     // 获取任务或员工浏览时间分布
     getInfoId: {
        method: 'get',
        api_url: apiHost + 'customer_employee/get_info'
    },
    // 获取任务或用户的转发获客统计
    taskForwardList: {
        method: 'post',
        api_url: apiHost + 'dashboard/forward/list'
    },
    // 获取指定任务的男女比例 
    taskSexList: {
        method: 'post',
        api_url: apiHost + 'dashboard/sex/list'
    },
    // 获取停留时长 
    taskTimesegList: {
        method: 'post',
        api_url: apiHost + 'dashboard/timeseg/list'
    },
    // 获取趋势统计
    getMarketingOverview: {
        method: 'post',
        api_url: kpaasApiHost + 'api/analysis_service/v1/statictis/queryMarketingOverview'
    },
    // 获取营销数据龙虎榜
    getMarketRank: {
        method: 'get',
        api_url: apiHost + 'analysis/market/rank'
    },
    // 获取员工详情
    getKmaEmployeeInfo: {
        method: "get",
        api_url: apiHost + "employee/info"
    },
    // 获取任务或用户的转发商品统计
    getForwardGoodsList: {
        method: "post",
        api_url: apiHost + "dashboard/forward/goods"
    },
    //获取地域分布统计
    getRegionStatistics:{
        method: "post",
        api_url: apiHost + "dashboard/region/list"
    },
    //获取任务人脉列表(树结构)
    getRelationshipList:{
        method: "post",
        api_url: apiHost + "dashboard/relationship/list"
    },
    //获取任务的人脉数据
    getTaskRelation:{
        method: "post",
        api_url: apiHost + "relationship/query/taskRelation"
    },
    //获取任务统计数据 
    getQueryTaskRelation: {
        method: "get",
        api_url: apiHost + "analysis/task/indicators"
    },
    //获进行中的任务 
    getOverviewTask: {
        method: "get",
        api_url: apiHost + "manuscript/overview/activity"
    },
    //生成二维码或小程序码（针对ie那坑货）
    creatQrcode: {
        method: "post",
        api_url: apiHost + "manuscript/wxqrcode/get"
    },
    //保存预约设置 
    saveAppointment: {
        method: "post",
        api_url: apiHost + "activity/plugin/saveAppointment"
    },
    //获取预约设置 
    getAppointmentByRelationId: {
        method: "get",
        api_url: apiHost + "activity/plugin/getAppointmentByRelationId"
    },
}
export default api_list