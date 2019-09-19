<template>
  <div class="select-tree">
    <el-autocomplete
      id="showInput"
        v-model="previewData_Name"
        :trigger-on-focus="false"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        :readonly="isReadonly"
        @select="handleSelect" 
        @focus="showTree">
          <template slot-scope="{ item }">
            <div class="name">{{ item.label }}</div>
          </template> 
      </el-autocomplete>
      <div v-show="isShowTree" class="listTree" id="showTree">
        <el-tree
          :data="dataOfLevel"
          show-checkbox
          node-key="id"
          ref="tree"
          :props="dataOfLevel"
          @check="setCode">
        </el-tree>
      </div>
  </div> 
</template>
<script>
export default {
  name: "select-tree",
  props: {
    dataOfLevel: {
      type: Array
    },
    dataOfAll: {
      type: Array
    },
    type: {
      type: String,
      default: ""
    },
    checkedNodesKeys: {
      type: String,
      default: ""
    },
    cb: {
      type: Function,
      default: function() {}
    },
    isReadonly:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      inputValue: [],
      isShowTree: false,
      checkedData: [],
      topNode: null,
      cbData: {
        keys: []
      }
    };
  },
  computed: {
    previewData_Name: function() {
      let _name = "";
        if (this.inputValue.length > 0 && this.dataOfAll.length > 0) {
          $.each(this.inputValue, (index, itemCode) => {
            if(index==10){
              return false
            }
            _name =
              _name +
              this.dataOfAll.find(item => item.id == itemCode).label +
              ",";
          });
        }
      //   // debugger
      return _name;
    }
  },
  mounted() {
    let _this = this;

    setTimeout(() => {
      this.initChecked();
    }, 500);
    $(document).bind("click", function(e) {
      var e = e || window.event;
      var elem = e.target || e.srcElement;
      while (elem) {
        if ((elem.id && elem.id == "showTree") || elem.id == "showInput") {
          return;
        }
        elem = elem.parentNode;
      }
      _this.isShowTree = false;
      if (_this.cbData.keys.length == 0 && !!_this.checkedNodesKeys) {
        _this.inputValue = _this.checkedNodesKeys.split(",");
      } else if (_this.cbData.keys.length > 0) {
        _this.inputValue = _this.cbData.keys;
      }
    });
  },
  methods: {
    //初始化已选择节点
    initChecked() {
      let _this = this;
      if (!!this.checkedNodesKeys) {
        this.cbData.keys = _this.checkedNodesKeys.split(",");
        this.inputValue = this.checkedNodesKeys.split(",");
      }
      _this.$refs.tree.setCheckedKeys(_this.checkedNodesKeys.split(","));
    },
    //搜索查询
    querySearch(queryString, cb) {
      var _list = this.dataOfAll;
      var results = queryString
        ? _list.filter(this.createFilter(queryString))
        : _list;
      cb(results);
    },
    createFilter(queryString) {
      return item => {
        return (
          item.label.toLowerCase().indexOf(queryString.toLowerCase()) != -1
        );
      };
    },

    //显示Tree
    showTree() {
      this.inputValue = [];
      this.isShowTree = true;
    },
    //选择搜索结果
    handleSelect(item) {
      let _selectArr = [];
      if (this.isTargetNode(item)) {
        _selectArr = this.$refs.tree.getCheckedKeys();
        this.checkedData.push(item);
      } else {
        this.checkedData = item;
      }
      _selectArr.push(item.id);
      this.$refs.tree.setCheckedKeys(_selectArr);
      this.cbData.keys = this.$refs.tree.getCheckedKeys();
      this.inputValue = this.cbData.keys;
      this.cb(this.cbData);
    },
    //选择tree节点
    setCode(targetData, checkedData) {
      let self = this, keyStr = '';
      if (this.isTargetNode(targetData)) {
        this.checkedData = checkedData.checkedNodes;
      } else {
        if(!!this.$route.query.id && parseInt(self.cbData.keys[0]) > 3 && parseInt(targetData.id) > 3) {
          if($.inArray(targetData.id, self.cbData.keys) != -1){//存在
            keyStr = _.filter(self.cbData.keys, (n) => {
              return n != targetData.id;
            }).join(',');
          } else {
            keyStr = self.cbData.keys.join(',') + "," + targetData.id;
          }
        } else {
          keyStr = targetData.id;
        }
        this.$refs.tree.setCheckedKeys((keyStr).split(","));
        this.checkedData = this.$refs.tree.getCheckedNodes();
      }
      this.cbData.keys = this.$refs.tree.getCheckedKeys();
      this.inputValue = this.cbData.keys;
      this.cb(this.cbData);
    },
    //当前节点是否和已选择节点为同一top节点
    isTargetNode(itemNode) {
      let _this = this;
      if (this.type != "city") {
        //插件是否为城市选择
        return true;
      } else if (this.checkedData.length == 0) {
        return false;
      } else {
        let _nowNodeId = "",
          _oldNodeId = "";
        _nowNodeId = this.dataOfAll.find(item => item.id == itemNode.id)
          .top;

        _oldNodeId = this.dataOfAll.find(
          item => item.id == this.checkedData[0].id
        ).top;

        return _nowNodeId == _oldNodeId ? true : false;
      }
    },
  }
};
</script>
<style scoped>
.select-tree .el-autocomplete {
  width: 100%;
}
.select-tree .listTree {
  width: 100%;
  height: 260px;
  overflow-y: scroll;
  border: 1px #dcdfe6 solid;
  position: absolute;
  top: 53px;
  z-index: 1;
  background-color: #fff;
}
</style>


