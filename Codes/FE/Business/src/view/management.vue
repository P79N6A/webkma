<template>
  <div>
    <div class="app">
      <com-header/>
      <div class="app-container-wrap scroll-box">
        <div class="app-container">
          <com-sidebar v-if="role == 1"/>
          <div class="container" :class="{'design-panel': role == 2}">
            <div id="app">
              <router-view/>
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

export default {
  name: "App",
  data() {
    return {
      role: localStorage.getItem("role"),
      isLogin: this.$store.state.login.isLogin,
    };
  },
  beforeCreate(){
  },
  mounted() {

  },
  computed: {
  },
  components: { comSidebar, comHeader, comFooter }
};
</script>


<style>


html {
  background-color: #eff7fa;
}

.app {
  height: 100%;
  padding-top: 50px;
}

.app-container-wrap {
    width: 100%;
    min-width: 1400px;
    background-color: #eff7fa;
    overflow-y: auto;
    height: calc(100vh - 50px);
    max-height: calc(100vh - 50px);
}

.app-container {
  width: 1400px;
  min-height: 100%;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

.app-content {
  height: 100% !important;
}

.container {
  min-height: calc(100vh - 50px);
  margin-left: 160px;
  margin-top: 10px;
  background-color: #fff;
  padding: 0;
}

.container.design-panel {
  margin-left: auto;
  margin-right: auto;
  width: 1400px;
}

#app > div {
  height: 100%;
  overflow-y: auto;
}
</style>
