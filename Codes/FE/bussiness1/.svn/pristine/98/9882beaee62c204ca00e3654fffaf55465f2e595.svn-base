<template>
  <div class="plug-box">
    <div class="plug-table" style="display:none;">
      <div class="header">
        <navigator :tabs="navigatorOpts.tabs" @navigator-event="transferTab"></navigator>
      </div>
      <div class="plug-cont">
        <plugInEnroll v-if="navigatorOpts.selectedKey == 'formData'"></plugInEnroll>
        <div v-if="navigatorOpts.selectedKey == 'vote'">
          <div class="search">
            <search ref="searchRef" placeholder="请输入投票项进行查询" @searchHandler="searchHander" :style="{ width: '320px'}">
            </search>
          </div>
          <!-- <div class="export">
            <el-button
              @click="importExcel" 
              type="primary" 
              size="small" 
              style="width:130px;height:30px;margin-left: 4px; line-height:10px;"
              >
              <a target="_blank" style="color:#ffffff">
                <i class="iconfont icon-excel-out" style="color:#ffffff"></i>excel导出数据
              </a>   
            </el-button>
          </div> -->
          <div class="table">
            <el-table :header-cell-style="getRowClass" :data="votePlugin.list" stripe
              :default-sort="{prop: 'sumNum', order: 'descending'}" style="width: 100%">
              <el-table-column type="index" label="序号" align="center" width="180">
              </el-table-column>
              <el-table-column prop="title" label="投票项" align="center">
                <template slot-scope="scope">
                  <img :src="scope.row.image"
                    style="width:40px;height:40px;vertical-align:-16px;border-radius:20px;margin:5px;" />
                  <span>{{scope.row.title}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="newTime" align="center" label="投票时间">
                <template slot-scope="scope">
                  {{scope.row.newTime || '-'}}
                </template>
              </el-table-column>
              <el-table-column prop="voteNum" align="center" sortable label="总投票数">
              </el-table-column>
            </el-table>
            <pagination v-if="votePlugin.pagination.totalCount>votePlugin.pagination.pageSize" class="pull-right"
              :paginationOpt="votePlugin.pagination" @switchPage="voteDataPagesFn" />
          </div>
        </div>
        <plugInThumbup v-if="navigatorOpts.selectedKey == 'thumbup'"></plugInThumbup>
        <plugInReward v-if="navigatorOpts.selectedKey == 'reward'"></plugInReward>
        <plugInReward v-if="navigatorOpts.selectedKey == 'game'"></plugInReward>
        <plugInGoods v-if="navigatorOpts.selectedKey == 'goods'"></plugInGoods>
        <subscribe v-if="navigatorOpts.selectedKey == 'yuyue'"></subscribe>
      </div>
    </div>
    <div class="chatu" style="display:none;text-align:center;">暂无数据</div>
  </div>
</template>

<script>
import api from "api";
import navigator from "components/navigator";
import search from "components/com-search";
import pagination from "components/ui-pagination";
import httpConfig from "config/http";
import plugInGoods from "./plug-in-components/goods";
import plugInThumbup from "./plug-in-components/thumbup";
import plugInReward from "./plug-in-components/reward";
import plugInEnroll from "./plug-in-components/enroll";
import subscribe from "./plug-in-components/subscribe";

export default {
  components: {
    search,
    navigator,
    pagination,
    plugInGoods,
    plugInThumbup,
    plugInReward,
    plugInEnroll,
    subscribe
  },
  name: "marketing-plan",
  data: function () {
    return {
      relationId: this.$route.query.id,
      manuscriptId: "", //活动Id
      keyWords: "", //搜索关键词
      votePlugin: {
        selectId: "", //投票插件id
        list: [], //投票项列表
        pagination: {
          pageIndex: 1,
          pageSize: 10,
          totalCount: 1,
          pageCount: 0
        },
        exportUrl: ""
      },
      navigatorOpts: { //切换
        tabs: [],
        selectedKey: ""
      },
      plugins: [], //插件列表
      pluginsFlag: false
    }
  },
  mounted() {
    this.manuscriptId = this.$route.query.id;
    this.getVoteList()
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background:#fafbff;"
      } else {
        return ""
      }
    },
    //获取投票插件列表
    getVoteList: function () {
      var self = this;
      api.request(
        "plugsList",
        {
          taskId: self.manuscriptId,
          source: 2
        }, result => {
          $('.plug-table').show();
          $('.chatu').hide();
          let arrNav = [
            { key: 'formData', title: "报名", isShow: false },
            { key: 'goods', title: "商品", isShow: false },
            { key: 'reward', title: "中奖", isShow: false },
            { key: 'thumbup', title: "点赞", isShow: false },
            { key: 'vote', title: "投票", isShow: false },
            { key: 'yuyue', title: "预约", isShow: false }
          ]
          let navigatorData = []
          if (result.status == 0 && !!result.data) {
            if (result.data.length > 0) {
              self.votePlugin.selectId = result.data[0].controlId;
              result.data.forEach(item => {
                switch (item.type) {
                  case 1:
                    self.navigatorOpts.tabs.push({
                      key: "card",
                      title: "名片"
                    });
                    break;
                  case 2:
                    arrNav[0].isShow = true
                    break;
                  case 3:
                    arrNav[1].isShow = true
                    break;
                  case 5:
                    arrNav[3].isShow = true
                    break;
                  case 6:
                    arrNav[4].isShow = true
                    self.getVoteDataList()
                    break;
                  case 7:
                    arrNav[2].isShow = true
                    break;
                  case 9:
                    arrNav[2].isShow = true
                    self.getVoteDataList()
                    break;
                  case 10:
                    arrNav[5].isShow = true
                }
              })
              arrNav.forEach(it => {
                if (it.isShow) {
                  self.navigatorOpts.tabs.push(it)
                }
              })
              if (self.navigatorOpts.tabs[0]) {
                self.navigatorOpts.selectedKey = self.navigatorOpts.tabs[0].key
                self.navigatorOpts.tabs[0].selected = true
              }
            } else {
              $('.plug-table').hide();
              $('.chatu').show();
            }
          }
        }
      );
    },
    //获取投票项列表
    getVoteDataList(cb) {
      var self = this;
      api.request("getVoteData", {
        relationId: self.manuscriptId,
        searchName: self.keyWords,
        pageSize: self.votePlugin.pagination.pageSize,
        pageIndex: self.votePlugin.pagination.pageIndex
      }, result => {
        if (result.status == 0) {
          self.votePlugin.list = result.data.list;
          self.votePlugin.pagination.totalCount = result.data.total;
          self.votePlugin.pagination.pageCount = Math.ceil(
            self.votePlugin.pagination.totalCount /
            self.votePlugin.pagination.pageSize
          );
        }
        !!cb && cb()
      })
    },
    //tab切换
    transferTab(tab) {
      var self = this;
      self.navigatorOpts.selectedKey = tab.split(".")[0];
      switch (tab.split(".")[0]) {
        case "formData":
          break;
        case "vote":
          self.getVoteDataList()
          break;
        case "thumbup":
          break;
        case "reward":
          break;
        case "game":
          break;
        case "card":
          break;
        case "goods":
          break;
      }
    },
    //搜索
    searchHander(data) {
      this.keyWords = data;
      this.getVoteDataList()
    },
    //投票列表数据分页调取
    voteDataPagesFn(pageIndex, cb) {
      let self = this;
      self.votePlugin.pagination.pageIndex = pageIndex;
      self.getVoteDataList(cb);
    },
    // 导出表格数据
    importExcel() {
      this.importExcelUrl = httpConfig.apiHost +
        "activity/plugin/vote/excel?relationId=" +
        this.relationId +
        "&&session_id=" +
        localStorage.getItem("sessionId");
      location.href = this.importExcelUrl
    }
  }
}
</script>
<style scope>
.export {
  height: 34px;
  padding-right: 10px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.export a:hover,
a:focus {
  text-decoration: none;
}
.plug-box .search {
  text-align: right;
  padding: 20px 0px;
}
.plug-box .table {
  padding: 0 20px;
}
</style>
