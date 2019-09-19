<template>
  <div class="app-sidebar">
    <nav>
      <ul class="menu-list">
        <li v-for="(item, index) in menuList" :key="index" :class="{'active': item.active, 'open': item.open }">
          <div :class="$route.name==item.key?'active':''" v-if="!!item.key"><span class="title" :class="[item.children.length>0 ? 'w100': 'w125']" @click="switchPage(item)"><span :class="item.icon" style="margin-right:5px;"></span><span :title="item.title">{{item.title}}</span></span> <i class="iconfont" :class="[!item.open ? 'icon-next': 'icon-form-spread-false']"  v-if="item.children.length>0" @click="item.open = !item.open;"></i></div>
          <div v-else  @click="item.open = !item.open;"><span class="title" :class="[item.children.length>0 ? 'w100': 'w150']"><span :class="item.icon" style="margin-right:5px;"></span><span :title="item.title">{{item.title}}</span></span> <i class="iconfont spread" :class="[!item.open ? 'icon-next': 'icon-form-spread-false']"  v-if="item.children.length>0"></i></div>
          <ul v-if="!!item.children">
            <li class="child-li" v-for="itemChildren in item.children" :key="itemChildren.key">
              <div :class="$route.name==itemChildren.key?'active':''" @click="switchPage(itemChildren, item)" v-if="itemChildren.key != 'bussiness-info' || (itemChildren.key == 'bussiness-info' && userInfo.role == 1)">
                <span class="title"><span :class="itemChildren.icon"></span>{{itemChildren.title}}</span></div>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import menusConfig from '../config/sidebar'
export default {
  name: 'com-sidebar',
  data() {
    return {
      menuList: []
    }
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    getMenuList: function() {
      let self = this;
      _.each(menusConfig, (item) => {
          if(item.children.length > 0) {
              item.open = false;
              item.active = false;
              if(_.filter(item.children, (n) => { return self.$route.name == n.key; }).length > 0){
                  item.open = true;
                  item.active = true;
              } 
          }
      });
      this.menuList = menusConfig;
    },
    switchPage(item, parent) {
      let currentPage = this.$route.path, self = this;
      if (item.href != currentPage) {
        this.$router.push({
          path: item.href
        });
        _.each(self.menuList, (item1) => {
            if(item1.children.length > 0) {
                item1.active = false;
            }
        });
        if(!!parent) parent.active = true;
      }
      
    }
  }
}
</script>
<style scoped>
.app-sidebar {
  width: 235px;
  top: 50px;
  bottom: 0;
  background-color: #404652;
  position:absolute;
}
.menu-list li {
  list-style: none;
  width: 100%;
  color: #9eabb8;
  font-size: 14px;
  cursor: pointer;
  padding: 0px 10px 0 15px;
  box-sizing: border-box;
  overflow: hidden;
}
.menu-list li.open {
    height: auto;
}
.menu-list li.active {
    color: #fff;
}
.menu-list li>div{
    height: 50px;
    line-height: 49px;
}
.menu-list li>div.active {
    color: #00bad0;
}
.menu-list li .title{
    display: inline-block;
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 6px;
    float: left;
}
.menu-list li .title.w100{
    width: 105px;
}
.menu-list li .title.w125{
    width: 125px;
}
.menu-list li .title:hover{
    color: #fff;
}
.menu-list li .iconfont{
    font-size: 14px;
    float: left;
    margin: 1px 0;
}
.menu-list li .spread{
    font-size: 12px;
}
.menu-list > li > ul {
    width:100%;
    height: auto;
}
.menu-list li.child-li {
    padding-left:30px;
}
.menu-list li.child-li>div{
    height: 40px;
    line-height: 39px;
}
</style>
