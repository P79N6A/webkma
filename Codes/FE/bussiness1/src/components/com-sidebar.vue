<template>
  <div>
    <div class="app-sidebar">
      <nav>
        <ul class="menu-list">
          <li v-for="(item, index) in menuList" :key="index" :class="item.active?'active':''">
            <div class="title" @click="switchPage(item)">
              <div class="imgBox">
                <img :src="item.image" alt="">
              </div>
              <div :title="item.title" class="titleStyle">{{item.title}}</div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
    <div class="sub-menu" v-if="!!menuItem&&!!menuItem.children&&menuItem.children.length>0">
      <ul class="sub-menu-list">
        <li v-for="(item, index) in menuItem.children" :key="index" :class="$route.name==item.key||item.include.indexOf($route.name)!=-1?'active':''">
          <div class="title" @click="switchPage(item,menuItem)">
            <div>{{item.title}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import menusConfig from '../config/sidebar'
export default {
  name: 'com-sidebar',
  data() {
    return {
      menuList: [],
      menuItem: null,
      userInfo: {
        role: localStorage.getItem("role")
      }
    }
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    getMenuList: function () {
      let self = this;
      _.each(menusConfig, (item) => {
        if (item.children.length > 0) {
          item.active = false;
          if (_.filter(item.children, (n) => { return (self.$route.name == n.key||n.include.indexOf(self.$route.name)!=-1)}).length > 0) {
            item.active = true;
            this.menuItem = item;
            this.$parent.moveSubMenu(true);
          }
        } else {
          if (self.$route.name == item.key||(!!item.include&&item.include.indexOf(self.$route.name)!=-1)) {
            item.active = true;
          }
        }
      });
      this.menuList = menusConfig;
    },

    switchPage(item, parent) {
      this.menuItem = !!parent ? parent : item;
      let currentPage = this.$route.path, self = this;
      if (item.href != currentPage) {
        this.$router.push({
          path: item.href
        });
        if (!parent) {
          _.each(this.menuList, (parentItem) => {
            parentItem.active = false;
          });
        }
        item.active = true;
      }
      if (!!parent || (!!item.children && item.children.length > 0)) {
        this.$parent.moveSubMenu(true);
      } else {
        this.$parent.moveSubMenu(false);
      }
    }
  },
  destroyed() {
    _.each(menusConfig, (item) => {
      item.active = false;
    });
    this.menuList = menusConfig;
  }
}
</script>
<style scoped>
.app-sidebar {
  width: 60px;
  top: 0px;
  bottom: 0;
  background-color: #404652;
  position: absolute;
}
.menu-list li {
  list-style: none;
  width: 100%;
  height: 80px;
  color: #fefefe;
  font-size: 14px;
  cursor: pointer;
  /* padding: 0px 10px 0 15px; */
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
}
.menu-list li.open {
  height: auto;
}
.menu-list li.active {
  /* color: #fff; */
  background-image: linear-gradient(to bottom, #29ade6, #25dccd);
}
/* .menu-list li > div {
  height: 50px;
  line-height: 49px;
} */
/* .menu-list li > div.active {
  color: #00bad0;
} */
.menu-list li .title {
  display: inline-block;
  /* width: 100px; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 18px;
  /* margin-right: 6px; */
  /* float: left; */
}
.menu-list li .titleStyle {
  margin-top: 10px;
  font-size: 12px;
}

.menu-list li .title.w100 {
  width: 105px;
}
.menu-list li .title.w125 {
  width: 125px;
}
.menu-list li .title:hover {
  color: #fff;
}
.menu-list li .imgBox {
  width: 30px;
  height: 30px;
  /* font-size: 36px; */
  /* float: left; */
  /* margin: 1px 0; */
  margin: 0 auto;
}
.menu-list li .imgBox img {
  width: 100%;
  height: 100%;
}
.menu-list li .spread {
  font-size: 12px;
}
.menu-list > li > ul {
  width: 100%;
  height: auto;
}
.menu-list li.child-li {
  padding-left: 30px;
}
.menu-list li.child-li > div {
  height: 40px;
  line-height: 39px;
}
.sub-menu {
  width: 130px;
  height: 100%;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 60px;
}
.sub-menu .sub-menu-list li {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  color: #3c4a55;
  text-align: center;
}
.sub-menu .sub-menu-list li:hover {
  cursor: pointer;
}
.sub-menu .sub-menu-list li.active {
  background-color: #f1f3fc;
}
</style>
