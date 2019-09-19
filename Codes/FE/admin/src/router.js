import Vue from 'vue'
import Router from 'vue-router'
import eventBus from './utils/eventBus.js'
Vue.use(Router)

import login from './views/login'
import main from './views/main'
import management from './views/management'
import bussinessList from './views/bussiness/list'
import bussinessManagement from './views/bussiness/detail'
import designerList from './views/designer/list'
import designerManagement from './views/designer/detail'
import materialList from './views/material/list.vue'
import materialLabel from './views/material/label.vue'
import opinion from './views/opinion/list'
import tag from './views/tag/list'
import activityList from './views/activity/list'
import posterList from './views/activity/poster'

import activity from './views/template/activity'
import poster from './views/template/poster'
import classify from './views/template/classify'
import weChatList from './views/extension/weChat'
import weChatAdv from './views/extension/weChat-adv'
import wechatDetail from './views/extension/weChat-detail'
import wechatPromote from './views/extension/weChat-promote'
import wechatPromoteEdit from './views/extension/weChat-promote-edit'
  
const router = new Router({
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
      path: '/management',
      name: 'management',
      component: management,
      children: [
        {
          path: '/main',
          name: 'main',
          component: main
        },
        {
          path: '/material-list',
          name: 'material-list',
          component: materialList
        },
        {
          path: '/material-label',
          name: 'material-label',
          component: materialLabel
        },
        {
          path: '/bussiness-management',
          name: 'bussiness-management',
          component: bussinessManagement
        },
        {
          path: '/bussiness-list',
          name: 'bussiness-list',
          component: bussinessList
        },
        {
          path: '/designer-management',
          name: 'designer-management',
          component: designerManagement
        },
        {
          path: '/designer-list',
          name: 'designer-list',
          component: designerList
        },
        {
          path: '/opinion',
          name: 'opinion',
          component: opinion
        },
        {
          path: '/tag',
          name: 'tag',
          component: tag
        },
        {
          path: '/activity-list',
          name: 'activityList',
          component: activityList
        },
        {
          path: '/poster-list',
          name: 'posterList',
          component: posterList
        },
        {
          path: '/activity-template',
          name: 'activity',
          component: activity
        },
        {
          path: '/poster-template',
          name: 'poster',
          component: poster
        },
        {
          path: '/classify',
          name: 'classify',
          component: classify
        },
        {
          path: '/weChatAcount-list',
          name: 'weChatAcount-list',
          component: weChatList
        },
        {
          path: '/wechat-adv',
          name: 'wechat-adv',
          component: weChatAdv
        },
        {
          path: '/wechat-detail',
          name: 'wechat-detail',
          component: wechatDetail
        },
        {
          path: '/wechat-promote',
          name: 'wechat-promote',
          component: wechatPromote
        },
        {
          path: '/wechat-promote-edit',
          name: 'wechat-promote-edit',
          component: wechatPromoteEdit
        }
      ]
    }
   
  ]
})
router.beforeEach((to, from, next) => {
  let isLogin = sessionStorage.getItem('sessionId');
  if (isLogin) {
    next();
    eventBus.$emit('initBreadCrumb');
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
