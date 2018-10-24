const state = {
    isLogin: !!localStorage.sessionId,
    userInfo:{}
}

const mutations = {
    loginStatus(state, status) {
        state.isLogin = status;
    },

    userInfo(state,userInfo){
        state.userInfo ={...userInfo};
    }
}

const actions = {
    setLoginStatus({ commit }, sessionInfo) {
        localStorage.sessionId = sessionInfo.sessionId;
        localStorage.userId = sessionInfo.userId;
        localStorage.userName = sessionInfo.userName;
        localStorage.role = sessionInfo.role;
        localStorage.userFace = sessionInfo.userFace;
        localStorage.userPhone = sessionInfo.userPhone;
        localStorage.isRemeber = sessionInfo.isRemeber;
        localStorage.businessId = sessionInfo.businessId;
        localStorage.businessSecret = sessionInfo.businessSecret;
        commit('loginStatus', true)
    },
    setLogout({ commit }) {
        localStorage.sessionId = "";
        localStorage.userId = "";
        localStorage.userName = "";
        localStorage.role = "";
        localStorage.userFace = "";
        localStorage.businessId='';
        localStorage.businessSecret= '';
        if (localStorage.isRemeber == "false") {
            localStorage.userPhone = "";
        }

        commit('loginStatus', false);
    },
    saveUserInfo({commit},userInfo){
        commit('userInfo',userInfo);
    }
}

export default {
    state, mutations, actions
}