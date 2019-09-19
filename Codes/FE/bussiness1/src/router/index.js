import Vue from 'vue'
import Router from 'vue-router'
import management from '@/view/management'
import dashbord from '@/view/data-overview/dashbord'
import marketingCampaign from '@/view/data-overview/marketing-campaign'
import marketingPlan from '@/view/marketing-plan/list'
import customerManagement from '@/view/customer/list'
import customerEdit from '@/view/customer/edit'
import customerDetails from '@/view/customer/details'
import employeeManagement from '@/view/employees/list'
import addEmployee from '@/view/employees/add'
import myPromotion from '@/view/my-promotion/index'
import myPromotionDetail from '@/view/my-promotion/detail'
import myPromotionGoods from '@/view/my-promotion/goods'
import myPromotionPlug from '@/view/my-promotion/plug-in'
import designWorkbench from '@/view/design-workbench/index'
import readme from '@/view/readme'
import login from '@/view/login'
import design from '@/view/design/design'
import preview from '@/view/design/preview'
import loading from '@/view/loading'
import bussinessInfo from '@/view/bussiness-info/index'
import modifyPwd from '@/view/bussiness-info/modifypwd'
import momentsAdv from '@/view/moments-adv/index'
import addMomentsAdv from '@/view/moments-adv/add'
import detailRewards from '@/view/achievements/detail'
import achievementsList from '@/view/achievements/list'
import addPromotionAwards from '@/view/achievements/add'
import awardsData from '@/view/achievements/data'
import cashManagement from '@/view/cash/management'
import cashRecharge from '@/view/cash/recharge'
import connectionsDetail from '@/view/connections/detail'
import activityList from '@/view/connections/list'
import cardMap from '@/view/connections/card-map'
import myTask from '@/view/my-task/index'
import wechatPush from '@/view/wechat-push/list'
import wechatPushDetails from '@/view/wechat-push/details'
import wechatPushAdd from '@/view/wechat-push/add'
import redPacket from '@/view/red-packet/list'
import redDetails from '@/view/red-packet/details'
import redAdd from '@/view/red-packet/add'
import connectionData from '@/view/my-task/connectionData'
import echartsDemo from '@/view/echarts-demo'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
      // redirect: '/dashbord'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/my-promotion/detail',
      name: 'my-promotion-detail',
      component: myPromotionDetail
    },
    {
      path: '/design',
      name: 'design',
      component: design
    },
    {
      path: '/preview',
      name: 'preview',
      component: preview
    },
    {
      path: '/loading',
      name: 'loading',
      component: loading
    },
    {
      path: '/my-promotion/goods',
      name: 'my-promotion-goods',
      component: myPromotionGoods
    },
    {
      path: '/management',
      name: 'management',
      component: management,
      children: [
        {
          path: '/dashbord',
          name: 'dashbord',
          component: dashbord
        },
        {
          path: '/marketing-campaign',
          name: 'marketingCampaign',
          component: marketingCampaign
        },
        {
          path: '/marketing-plan',
          name: 'marketing-plan',
          component: marketingPlan
        },
        {
          path: '/customer-management',
          name: 'customer-management',
          component: customerManagement
        },
        {
          path: '/customer-edit',
          name: 'customer-edit',
          component: customerEdit
        },
        {
          path: '/customer-details',
          name: 'customer-details',
          component: customerDetails
        },
        {
          path: '/employee-achievements',
          name: 'employee-achievements',
          component: achievementsList
        },
        {
          path: '/employee-management',
          name: 'employee-management',
          component: employeeManagement
        },
        {
          path: '/add-employee',
          name: 'add-employee',
          component: addEmployee
        },
        {
          path: '/my-promotion',
          name: 'my-promotion',
          component: myPromotion
        },
        {
          path: '/plug-in',
          name: 'my-promotion-plug',
          component: myPromotionPlug
        },
        {
          path: '/bussiness-info',
          name: 'bussiness-info',
          component: bussinessInfo
        },
        {
          path: '/modifyPwd',
          name: 'modifyPwd',
          component: modifyPwd
        }, {
          path: '/design-workbench',
          name: 'design-workbench',
          component: designWorkbench
        }, {
          path: '/moments-adv',
          name: 'moments-adv',
          component: momentsAdv
        }, {
          path: '/add-moments-adv',
          name: 'add-moments-adv',
          component: addMomentsAdv
        }, {
          path: '/detail-rewards/:id',
          name: 'detail-rewards',
          component: detailRewards
        }, {
          path: '/add-promotion-awards',
          name: 'add-promotion-awards',
          component: addPromotionAwards
        }, {
          path: '/awards-data',
          name: 'awards-data',
          component: awardsData
        }, {
          path: '/bussiness-wallet',
          name: 'bussiness-wallet',
          component: cashManagement
        }, {
          path: '/cash-recharge',
          name: 'cash-recharge',
          component: cashRecharge
        }, {
          path: '/connections-detail',
          name: 'connections-detail',
          component: connectionsDetail
        }, {
          path: '/activity-list',
          name: 'activity-list',
          component: activityList
        }, {
          path: '/card-map',
          name: 'card-map',
          component: cardMap
        },
        {
          path: '/my-task',
          name: 'my-task',
          component: myTask
        },
        // 营销激励
        {
          path: '/wechat-push',
          name: 'wechat-push',
          component: wechatPush
        },
        {
          path: '/wechat-push/details',
          name: 'wechatPushDetails',
          component: wechatPushDetails
        },
        {
          path: '/wechat-push/add',
          name: 'wechatPushAdd',
          component: wechatPushAdd
        },
        {
          path: '/red-packet',
          name: 'red-packet',
          component: redPacket
        },
        {
          path: '/red-add',
          name: 'red-add',
          component: redAdd
        },
        {
          path: '/red-details',
          name: 'red-details',
          component: redDetails
        },
        {
          path: '/connection-data',
          name: 'connection-data',
          component: connectionData
        },
        {
          path: '/echarts-demo',
          name: 'echarts-demo',
          component: echartsDemo
        }
      ]
    }
  ]
})
