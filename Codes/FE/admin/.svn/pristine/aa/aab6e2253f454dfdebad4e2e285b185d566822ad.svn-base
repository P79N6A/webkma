const state = {
    isLogin: !!localStorage.sessionId,
    userInfo: localStorage.userInfo ? localStorage.userInfo : {}
}

const mutations = {
    loginStatus(state, status) {
        state.isLogin = status;
    },

    userInfo(state, _userInfo) {
        state.userInfo = _userInfo;
    }
}

const getters = {
    getUserInfo(state) {
        return typeof state.userInfo == "string" ? JSON.parse(state.userInfo) : state.userInfo
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
        localStorage.userFace = "";
        localStorage.businessId = '';
        localStorage.businessSecret = '';
        if (localStorage.isRemeber == "false") {
            localStorage.userPhone = "";
            localStorage.role = "";
        }
        localStorage.userInfo = "";

        commit('loginStatus', false);
    },
    saveUserInfo({ commit }, _userInfo) {
        localStorage.userInfo = JSON.stringify(_userInfo)
        commit('userInfo', _userInfo);
    }
}

export default {
    state, mutations, actions, getters
}