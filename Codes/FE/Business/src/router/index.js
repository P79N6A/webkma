import Vue from 'vue'
import Router from 'vue-router'
import home from '@/view/home'
import management from '@/view/management'
import dashbord from '@/view/dashbord'
import marketingCampaign from '@/view/marketing-campaign'
import marketingPlan from '@/view/marketing-plan/list'
import customerManagement from '@/view/customer-management/customer-list'
import customerDetail from '@/view/customer-management/customer-detail'
import employeeManagement from '@/view/employees/employee-management'
import addEmployee from '@/view/employees/add-employee'
import myPromotion from '@/view/my-promotion/index'
import myPromotionDetail from '@/view/my-promotion/detail'
import designWorkbench from '@/view/design-workbench/index'
import readme from '@/view/readme'
import login from '@/view/login'
import design from '@/view/design/design'
import preview from '@/view/design/preview'
import loading from '@/view/loading'
import bussinessInfo from '@/view/bussiness-info/index'
import modifyPwd from '@/view/bussiness-info/modifypwd'
import momentsAdv from '@/view/moments-adv/moments-adv'
import addMomentsAdv from '@/view/moments-adv/add-moments-adv'

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
          path: '/customer-detail',
          name: 'customer-detail',
          component: customerDetail
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
        },{
          path: '/moments-adv',
          name: 'moments-adv',
          component: momentsAdv
        },{
          path: '/add-moments-adv',
          name: 'add-moments-adv',
          component: addMomentsAdv
        }

      ]
    }
  ]
})
