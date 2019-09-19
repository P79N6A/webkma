<template>
  <div>
    <div class="app">
      <com-header />
      <div class="app-container-wrap">
        <div class="app-container">
          <com-sidebar v-if="role == 1" />
          <div class="container" :class="{'design-panel': role == 2}" style="margin-left:70px;"
            :style="{'height':winHeight}">
            <div id="app" class="container-content scroll-box">
              <router-view />
            </div>
            <div class="module-des" style="display:none;">
               <div class="move-btn" @click="moveDesModule()" :style="{top:moveBtnHeight}">
                <i class="iconfont icon-arrow-right-copy"></i>
              </div>
              <div class="des-div"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import comSidebar from "components/com-sidebar";
import comHeader from "components/com-header";
import comFooter from "components/com-footer";
import eventBus from '../utils/eventBus'
import api from "api";

export default {
  name: "App",
  data() {
    return {
      role: localStorage.getItem("role"),
      isLogin: this.$store.state.login.isLogin,
      desOpenStatus: false,//是否展开右侧说明栏
      subMenuStatus: false//是否有二级菜单
    };
  },
  created() {
  },
  mounted() {

  },
  computed: {
    winHeight: function () {
      return ($(window).height() - 70) + "px"
    },
    moveBtnHeight: function () {
      return (($(window).height() - 70) / 2 - 50) + "px"
    }
  },
  components: { comSidebar, comHeader, comFooter },
  methods: {
    moveDesModule() {
      if (!!this.desOpenStatus) {
        $(".module-des .move-btn").css("right", "10px")
        $(".module-des .des-div").css("width", "5px")
        $(".container-content").css("width", "calc(100% - 10px)")
        this.desOpenStatus = false;
        this.$store.commit("show");
      } else {
        $(".module-des .move-btn").css("right", "250px")
        $(".module-des .des-div").css("width", "250px")
        $(".container-content").css("width", "calc(100% - 260px)")
        this.desOpenStatus = true;
        this.$store.commit("hide");
      }
      eventBus.$emit('getPageSize');
      eventBus.$emit('chart-resize');
    },
    moveSubMenu(subMenuStatus) {
      if (!!subMenuStatus) {
        $(".container").css("width", "calc(100% - 200px)");
        $(".container").css("margin-left", "200px");
      } else {
        $(".container").css("margin-left", "70px");
        $(".container").css("width", "calc(100% - 70px)");
      }
    }
  }
};
</script>


<style>
html {
  background-color: #f1f3fc;
}

.app {
  height: 100%;
  padding-top: 50px;
}

.app-container-wrap {
  width: 100%;
  min-width: 1300px;
  background-color: #f1f3fc;
  overflow-y: auto;
  height: calc(100vh - 50px);
  max-height: calc(100vh - 50px);
}

.app-container {
  /* width: 1400px; */
  width: 100%;
  height: 100%;
  min-height: 100%;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.app-content {
  height: 100% !important;
}

.container {
  width: calc(100% - 70px);
  min-height: calc(100vh - 50px);
  margin-left: 160px;
  margin-top: 10px;
  /* background-color: #fff; */
  padding: 0;
  position: relative;
}

.container .container-content {
  width: calc(100% );
  min-width: 1100px;
  overflow: scroll;
  height: calc(100vh - 70px);
  position: absolute;
  background-color: #fff;
}
.container .module-des {
  height: 100%;
  position: absolute;
  right: 0;
}

.container .module-des .move-btn {
  width: 10px;
  height: 100px;
  background-color: #9eabb8;
  position: absolute;
  right: 250px;
}
.container .module-des .move-btn .iconfont {
  position: absolute;
  top: 35px;
  left: -7px;
  font-size: 23px;
  color: #fff;
}
.container .module-des .des-div {
  width: 250px;
  height: 100%;
  background-color: #fff;
}

.container.design-panel {
  margin-left: auto;
  margin-right: auto;
  /* width: 1400px; */
  min-width: 1400px;
}

#app > div {
  height: 100%;
  overflow-y: auto;
}
</style>
