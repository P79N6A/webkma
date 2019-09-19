<template>
  <div class="bussiness-list">
    <el-row class="operation">
      <search
        :placeholder="searchOpt.placeholder"
        @searchHandler="searchHander"
        :style="{ width: (searchOpt.size || '300px')}"
      ></search>
    </el-row>
    <el-table
      ref="bussinessTable"
      :data="bussinessList"
      tooltip-effect="dark"
      row-key="id"
      class="table"
      header-row-class-name="table-header"
      header-cell-class-name="table-header"
    >
      <el-table-column
        show-overflow-tooltip
        prop="appName"
        label="公众号名称"
        align="center"
        class-name="number_color"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="appId"
        label="原始ID"
        align="center"
        class-name="number_color"
        width="280"
      ></el-table-column>
      <el-table-column
        prop="createtime"
        label="创建时间"
        align="center"
        class-name="number_color"
        width="280"
      ></el-table-column>
      <el-table-column
        prop="businessName"
        label="商家信息"
        align="center"
        class-name="number_color"
        show-overflow-tooltip
        width="280"
      ></el-table-column>
      <el-table-column prop label="操作" align="center" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="btn-plain" @click="detail(scope.row)">投放详情</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px 10px;">
      <pagination
        v-if="paginationOpt.pageCount > 1"
        class="pull-right"
        :paginationOpt="paginationOpt"
        @switchPage="pagesFn"
      />
    </div>
  </div>
</template>
<script scope>
import api from "../../axios/api-service";
import search from "../../components/com-search";
import pagination from "../../components/ui-pagination";
import slideBtn from "../../components/slide-btn";

export default {
  name: "designer-list",
  components: { search, pagination, slideBtn },
  data() {
    return {
      bussinessList: [], //商家列表数据
      key_word: "", //关键词
      searchOpt: {
        placeholder: "请输入公众号名称/商家名称进行搜索"
      },
      paginationOpt: {
        pageIndex: 1,
        pageCount: "",
        pageSize: 15
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList(cb) {
      let _this = this;
      let _option = {
        searchStr: this.key_word,
        pageIndex: this.paginationOpt.pageIndex, //开始条数，不可空，正整数
        pageSize: this.paginationOpt.pageSize //取用条数，不可空，正整数
      };
      api.request("getweChatAcountList", _option, result => {
        if (result.status == 0) {
          _this.bussinessList = result.data.list;
          _this.paginationOpt.totalCount = result.data.total;
          _this.paginationOpt.pageCount = Math.ceil(
            _this.paginationOpt.totalCount / _this.paginationOpt.pageSize
          );
        } else {
          _this.messenger.error("获取微信公众号列表失败");
        }
        !!cb && cb();
      });
    },
    pagesFn(pageIndex, cb) {
      this.paginationOpt.pageIndex = pageIndex;
      this.getList(cb);
    },
    //搜索
    searchHander(data) {
      this.key_word = data;
      this.paginationOpt.pageIndex = 1;
      this.getList();
    },
    detail(item){
      this.$router.push({
        path: `/weChat-adv?appid=${item.appId}`
      });
    }
  }
};
</script>
<style scope>
.operation {
  height: 60px;
  line-height: 60px;
  padding: 0 10px;
}
</style>


