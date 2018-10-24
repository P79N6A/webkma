<template>
  <div class="app-sidebar">
    <nav>
      <ul class="menu-list">
        <li :class="$route.name==item.key?'active':''" v-for="item in menuList" :key="item.key" @click="switchPage(item)">
          <el-row class="text-center">
            <i :class="item.icon" class="menu-icon"></i>
          </el-row>
          <el-row class="text-center">{{item.title}}</el-row>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import menusConfig from "../config/sidebar";
export default {
  name: "com-sidebar",
  data() {
    return {
      menuList: []
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    getMenuList: function() {
      this.menuList = menusConfig;
    },
    switchPage(item) {
      let currentPage = this.$route.path;
      if (item.href != currentPage) {
        this.$router.push({
          path: item.href
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-sidebar {
  width: 150px;
  top: 0px;
  bottom: 0;
  background-color: #404652;
  position:absolute;
}
.menu-list > li {
  list-style: none;
  width: 100%;
  height: 100px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  border-bottom: 1px solid #494f5d;
  padding: 13px 0;
  box-sizing: border-box;
}
.menu-list > li:last-child {
  border: none;
}
.menu-list > li.active {
  background-color: #475061;
  color: #00BAD0;
}
.app-sidebar .menu-icon{
  font-size: 35px;
}
</style>
