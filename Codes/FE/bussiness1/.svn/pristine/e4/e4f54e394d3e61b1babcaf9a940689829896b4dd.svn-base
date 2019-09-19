import Vue from 'vue'
import Vuex from 'vuex'

import login from './modules/login'

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        login
    },
    state:{ //右侧收缩框状态
        changShow: 0
    },
    getters:{
        isShow(state){
            return state.changShow
        }
    },
    mutations:{
        show(state){
            state.changShow = 1;
        },
        hide(state){
            state.changShow = 0;
        }
    }
})