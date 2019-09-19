<template>
    <div class="comp-category">
        <div class="pull-left">模板分类：</div>
        <div class="pull-left">
          <div class="pull-left category-item"></div>
        </div>
    </div>
</template>
<script>
export default {
  name: "category",
  props: {
    tabs: {
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      crtIndex: 0
    };
  },
  mounted() {
    var self = this;
    if (self.tabs) {
      for (var i = 0; i < self.tabs.length; i++) {
        if (self.tabs[i].selected == true) {
          self.crtIndex = i;
        }
      }
    }
  },
  methods: {
    btnTransfer: function(index) {
      var self = this;
      self.crtIndex = index;
      self.$emit("category-event", self.tabs[self.crtIndex].key);
    }
  }
};
</script>
<style scoped>
.comp-category {
  height: 50px;
  margin: 0 40px;
}
.comp-category .category-item {

}
</style>