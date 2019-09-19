<template>

  <el-tabs v-model="activeName" @tab-click="handleClick" class="comp-navigator">
    <el-tab-pane :label="item.title" :name="item.key" v-for="item in tabs" :key="item.key"></el-tab-pane>
  </el-tabs>

  <!-- <div class="comp-navigator">
        <p :class="{'on': index == crtIndex}" v-for="(item,index) in tabs" :key="item.key" @click="btnTransfer(index)">{{item.title}}</p>
    </div> -->
</template>
<script>
export default {
  name: "navigator",
  props: {
    tabs: {
      default: () => {
        return [];
        /**
         * [
         *   { key: "draft", title: "活动素材", selected: true },
         *   { key: "release", title: "已发布活动" }
         * ]
         */
      }
    },
  },
  data() {
    return {

    };
  },
  computed: {
    activeName:{
      set(){
        return this.setAcitve()
      },
      get(){
        return this.setAcitve()
      }
    }
  },
  mounted() {
    // var self = this;
    // if (self.tabs) {
    //   for (var i = 0; i < self.tabs.length; i++) {
    //     if (self.tabs[i].selected == true) {
    //       self.activeName = self.tabs[i].key;
    //     }
    //   }
    // }
  },
  methods: {
    setAcitve(){
      let self = this
      if (self.tabs) {
        for (var i = 0; i < self.tabs.length; i++) {
          if (self.tabs[i].selected == true) {
            return self.tabs[i].key;
          }
        }
      }
    },
    handleClick: function (tab, event) {
      var self = this;
      self.$emit("navigator-event", tab.$props.name);
    }
  }
};
</script>
<style>
.el-tabs__nav-wrap {
  height: 50px;
  line-height: 50px;
}
</style>

<style scoped>
.comp-navigator {
  height: 50px;
  /* border-bottom: 1px solid #ebf0fa; */
  margin: 0 20px;
}
/* .comp-navigator > p.on {
  background: #fff;
  height: 50px;
  border-bottom: 4px solid #24d0c6;
}
.comp-navigator > p {
  width: 100px;
  text-align: center;
  font: 400 14px/48px "Microsoft YaHei";
  float: left;
  color: #717d86;
  cursor: pointer;
  margin: 0px;
} */
</style>







