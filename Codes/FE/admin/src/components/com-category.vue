<template>
  <!-- 模板分类 -->
  <div class="filter_bar">
    <el-row class="filter_row" v-for="item in filter.list" :key="item.id">
      <div class="text-right" style="width: 98px; display:table-cell;">
        <span class="black-deep font-14" style="line-height: 32px;">{{item.label}}：</span>
      </div>
      <div style="display:table-cell;">
        <div class="filter_columns" :class="{'expand': !!item._expand}">
          <el-checkbox
            size="small"
            class="text-center"
            fill="#00bad0"
            style="margin-left: 30px; width:87px;"
            v-model="item._selected"
            :label="item.id"
            @change="categoryFilter(item)"
          >全部</el-checkbox>
          <el-checkbox
            size="small"
            class="text-center"
            style="width:87px;"
            v-for="child in item.children"
            :key="child.id"
            v-model="child._selected"
            :label="child.id"
            @change="categoryFilter(item, child)"
          >{{child.label}}</el-checkbox>
        </div>
      </div>
      <div class="" style="width:50px;display:table-cell;">
        <el-button
          size="small"
          style="width:14px; padding:0;border: 0;"
          v-if="item.children.length >= 10"
          @click="item._expand = !item._expand;"
        >更多<i :class="!!item._expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" style="margin-left: 3px;border: 1px solid #dcdfe6;"></i></el-button>
      </div>
    </el-row>
  </div>
</template>
<script>
import api from "../axios/api-service";

export default {
  name: "com-category",
  props: {},
  data() {
    return {
      filter: {
        list: []
      }
    };
  },
  mounted() {
    var self = this;
    self.getCategory();
  },
  methods: {
    getCategory() {
      let self = this;
      api.request("getCategoryTree", {}, result => {
        if (result.status != 0)
          return self.messenger.error(result.message);
        self.filter.list = result.data.map(item => {
          item._selected = false;
          item._expand = false;
          item.children.map(child => {
            child._selected = false;
          });
          return item;
        });
      });
    },
    categoryFilter(item, child) {
      let self = this;
      if (!child) {
        // 选择全选
        item.children.forEach(_child => {
          _child._selected = false;
        });
      } else {
        // 选择二级
        item._selected = false;
        item.children.forEach(_child => {
          if (child.id != _child.id) _child._selected = false;
        });
      }

      let categories = [];
      self.filter.list.forEach(item => {
        let row;
        if (item._selected) {
          row = item.children.map(child => {
            return child.id;
          });
        } else {
          let selectedChild = item.children.find(child => {
            return child._selected;
          });
          if (selectedChild) {
            row = [selectedChild.id];
          }
        }
        if (row) {
          row.unshift(item.id);
          categories.push(row);
        }
      });
      // 固定格式: 1级分类,2级分类...|1级分类,2级分类...
      this.$emit(
        "trigger-event",
        categories
          .map(row => {
            return row.join(",");
          })
          .join("|")
      );
    }
  }
};
</script>
<style>
.filter_bar {
  margin: 20px 40px;
}
.filter_bar .filter_row {
  margin-bottom: 2px;
}
.filter_bar .filter_row .filter_columns {
  height: 34px;
  overflow: hidden;
}
.filter_bar .filter_row .filter_columns.expand {
  height: auto;
}
.filter_bar .filter_row .el-checkbox{
  height: 24px;
  line-height: 24px;
  margin-bottom: 10px;
}
.filter_bar .filter_row .el-checkbox.is-bordered.el-checkbox--small {
  padding-left: 10px;
  padding-right: 10px;
}
/* .filter_bar .filter_row .el-checkbox__input {
  position: absolute;
  right: -1px;
  top: -1px;
} */
.filter_bar .filter_row .el-checkbox__inner {
  border: none;
  display: none;
}
.filter_bar .filter_row .el-checkbox__input.is-checked .el-checkbox__inner,
.filter_bar
  .filter_row
  .el-checkbox__input.is-indeterminate
  .el-checkbox__inner {
  /* background: url(../assets/images/angle-selected.png) no-repeat right top;
  display: inline-block; */
}

.filter_bar .filter_row .el-checkbox__input.is-checked {
    width: 100%;
    height: 24px;
    border-radius: 12px;
    /* border: 1px #00bad0 solid; */
    position: absolute;
    left: 0;
}
.filter_bar
  .filter_row
  .el-checkbox.is-bordered.el-checkbox--small
  .el-checkbox__inner {
  width: 20px;
  height: 20px;
}
.filter_bar .filter_row .el-checkbox__inner::after {
  display: none;
}
.filter_bar .filter_row .el-checkbox__label {
  padding-left: 0px;
}
.filter_bar .filter_row .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #00BAD0;
}
/* .filter_bar .filter_row .filter_columns .el-radio__inner {
  display: none;
}
.filter_bar .filter_row .filter_columns .el-radio__label {
  padding-left: 5px;
} */
</style>