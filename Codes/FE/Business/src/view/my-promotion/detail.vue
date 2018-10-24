<template>
    <div class="page-box scroll-box">
        <comHeader></comHeader>
        <div class="detail_main_box">
            <div class="pull-left drtail_left">
                    <div class="phone-header"></div>
                    <div class="cover_box">
                        <img :src="moduleDetail.cover" alt="">
                    </div> 
                    <div class="phone-footer">
                      <button class="my-btn-green my-btn" @click="btnPreview(moduleDetail)">预览</button>
                    </div>
            </div>
            <div class="pull-left det_content">
              <div class=" dal_tit_txt"> 
                        <h3 class="pop_name" v-text="moduleDetail.name"></h3> 
                        <p class="pop_time">生成时间：<span v-text="moduleDetail.createTime"></span></p> 
                        <p class="pop_introduce">营销活动描述：<span v-text="moduleDetail.description"></span></p> 
              </div>
                <div><navigator :tabs="navigatorOpts.tabs" @navigator-event="transferTab"></navigator></div>
                <div class="tab-content">
                    <div  v-show="navigatorOpts.selectedKey == 'statisticalData'">
                      <div class="statisticsBlock">
                        <div class='pull-left statisticsBlock-item'>
                            <div>总浏览量/pv</div>
                            <div class="statisticsBlock-num" v-text="statisticalData.scan_access"></div>
                            <div>昨天&nbsp;&nbsp;<span v-text='scan_access.yesterday' class="cl-orange"></span>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; 今天&nbsp;&nbsp;<span v-text="scan_access.today" class="cl-orange"></span></div>
                        </div>
                        <div class='pull-left statisticsBlock-item'>
                          <div>总访客量/uv</div>
                          <div class="statisticsBlock-num" v-text="statisticalData.scan_visitor"></div>
                          <div>昨天&nbsp;&nbsp;<span v-text="scan_visitor.yesterday" class="cl-orange"></span>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; 今天&nbsp;&nbsp;<span v-text="scan_visitor.today" class="cl-orange"></span></div>
                        </div>
                        <div class='pull-left statisticsBlock-item'>
                          <div>总分享数</div>
                          <div class="statisticsBlock-num"  v-text="statisticalData.scan_share"></div>
                          <div>昨天&nbsp;&nbsp;<span v-text="scan_share.yesterday" class="cl-orange"></span>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; 今天&nbsp;&nbsp;<span v-text="scan_share.today" class="cl-orange"></span></div>
                        </div>
                      </div>
                      <div class='pull-left statisticsLeft'>
                        <div>
                          <div class="statisticsTitle"> 
                            <span>数据统计</span>
                            <button class="pull-right btn-dayNum " :class="statisticalDays==30?'active':''"  @click="clickDay(30)">30天</button>
                            <button class="pull-right btn-dayNum"  :class="statisticalDays==15?'active':''" @click="clickDay(15)">15天</button>
                          </div>
                          <div id="dayDtatistics" ref="dayDtatistics"></div>
                        </div>
                        <div>
                          <div class="statisticsTitle">停留时间</div>
                          <div id="residenceTime" ref="residenceTime"></div>
                        </div>
                      </div>
                      <div class='pull-left statisticsRight'>
                        <div class="statisticsTitle">地域分布</div>
                        <div id="areaDtatistics" ref="areaDtatistics"></div>
                        <div class='areaScanAccess'>
                          <div>地域浏览前10名</div>
                          <div>
                            <div class="areaRanking" v-for="(item,index) in areaRanking" :key="item.id">
                              <span v-text="(index+1)+'.'" :class="index<3?'color-red':''"></span>
                              <span  v-text="item.name"></span>
                              <span class="progressBar"><span class="active" :style="{width:item.proportion}"></span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-show="navigatorOpts.selectedKey == 'personnelAssignment'">
                      <div class="table-top">
                        <h3 class="table-top-title">人员分派</h3>
                        <div class="search-wrap">
                          <input type="text" placeholder="请输入员工姓名/手机号码进行查询" v-model="employeeKeyWords">
                          <i class="icon iconfont icon-search" @click="clickSearch('employee')"></i>
                        </div>
                      </div>
                      <el-table :data="employeeList" @sort-change="sortChangeHandler" tooltip-effect="dark" style="width: 100%" row-key="id" class="table" header-row-class-name="table-header" header-cell-class-name="table-header"> 
                        <el-table-column label="人员姓名"  width="120" prop="name" show-overflow-tooltip ></el-table-column>
                        <el-table-column label="手机号码"  width="119" prop="phone" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column label="首次分享时间" show-overflow-tooltip width="110" align="center" class-name="disable-color">
                           <template slot-scope="scope">{{ scope.row.firstShare==null?'-':scope.row.firstShare}}</template>
                        </el-table-column>
                        <el-table-column label="贡献分享数" show-overflow-tooltip width="120" prop="totalShare" sortable='custom' align="center"></el-table-column>
                        <el-table-column label="贡献访客数" show-overflow-tooltip width="120" prop="totalVisitor" sortable='custom' align="center"></el-table-column>
                        <el-table-column label="贡献浏览数" show-overflow-tooltip width="120" prop="totalAccess" sortable='custom' align="center"></el-table-column>
                        <el-table-column label="分派状态" show-overflow-tooltip width="76" align="center">
                           <template slot-scope="scope">{{scope.row.distribution==1?'已分派':'未分派'}}</template>
                        </el-table-column>
                        <el-table-column label="操作" show-overflow-tooltip width="80" align="center">
                           <template slot-scope="scope">
                               <slideBtn :slideBtnOpt="scope.row" active-text="分发" inactive-text="撤销" :prop-value-map="{0:1,1:0}" prop-key="distribution"
                        @slide-event="assignEmployee"></slideBtn>
                           </template>
                        </el-table-column>
                      </el-table>
                      <pagination  v-if="employeeList.length>0" class="pull-right" :paginationOpt="employeePagination"  @switchPage="employeePagesFn" />
                    </div>
                    <div v-show="navigatorOpts.selectedKey == 'formData'">
                       <div class="table-top">
                        <h3 class="table-top-title">表单数据</h3>
                        <div class="search-wrap">
                          <input type="text" placeholder="请输入用户信息进行查询" v-model="formDataKeyWords">
                          <i class="icon iconfont icon-search"  @click="clickSearch('formData')"></i>
                        </div>
                      </div>
                      <el-table :data="formData" tooltip-effect="dark" style="width: 100%" class="table" header-row-class-name="table-header" header-cell-class-name="table-header">
                          <el-table-column :label="title" v-for="(title,index) in formDataTitle" :key="index" show-overflow-tooltip min-width="80">
                            <template slot-scope="scope">
                              <div v-if="index==0" class="userInfo">
                                <img :src="scope.row[index].face" class="userFace"/>
                                <span class="userName">{{scope.row[index].nickname}}</span>
                              </div>
                              <div v-else>
                                <div v-for="(value,idx) in scope.row[index].text" :key="idx" >
                                      <img :src="value.img" v-if="!!value.img" class="thumbnailImg"><span v-text="value.text" :title="value.text"></span></div>
                                </div>  
                            </template>
                          </el-table-column>
                      </el-table>
                       <pagination  v-if="formData.length>0" class="pull-right" :paginationOpt="formDataPagination" @switchPage="formDataPagesFn"/>
                    </div>
                    <div v-show="navigatorOpts.selectedKey == 'winningInfo'">
                      <div class="table-top">
                        <h3 class="table-top-title">中奖信息</h3>
                        <div class="search-wrap">
                          <input type="text" placeholder="请输入手机号进行查询"  v-model="luckdrawKeyWords">
                          <i class="icon iconfont icon-search" @click="clickSearch('luckdraw')"></i>
                        </div>
                      </div>
                      <el-table :data="luckdrawList" tooltip-effect="dark" style="width: 100%" row-key="id" class="table" header-row-class-name="table-header" header-cell-class-name="table-header">
                        <el-table-column label="用户信息"  width="288" prop="" show-overflow-tooltip >
                          <template slot-scope="scope">
                            <div class="userInfo">
                              <img :src="scope.row.face"  class="userFace">
                              <span class="userName">{{scope.row.nickname}}</span>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="手机号码"  width="288"  show-overflow-tooltip align="center">
                          <template slot-scope="scope">{{scope.row.phone==""?'-':scope.row.phone}}</template>
                        </el-table-column>
                        <el-table-column label="奖项"  width="289" prop="prizeName" show-overflow-tooltip align="center"></el-table-column>
                      </el-table>
                      <pagination  v-if="luckdrawList.length>0" class="pull-right" :paginationOpt="luckdrawPagination" @switchPage="luckDrawPagesFn"/>
                    </div>
                    <div v-show="navigatorOpts.selectedKey == 'gameRank'">
                      <div class="table-top">
                        <h3 class="table-top-title">游戏排行榜</h3>
                        <!-- <div class="search-wrap">
                          <input type="text" placeholder="请输入昵称进行查询" v-model="gameRankWords">
                          <i class="icon iconfont icon-search"></i>
                        </div> -->
                      </div>
                        <el-table :data="gameRankList"  tooltip-effect="dark" style="width: 100%" class="table" header-row-class-name="table-header" header-cell-class-name="table-header">
                        <el-table-column label="用户信息" show-overflow-tooltip width="290">
                          <template slot-scope="scope">
                            <div class="userInfo">
                            <img :src="scope.row.userFace" class="userFace">
                            <span class="userName">{{scope.row.userNickname}}</span>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="排名"  type="index"  width="290" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column label="分数" prop="score" width="285" show-overflow-tooltip align="center"></el-table-column>
                        </el-table>
                         <pagination  v-if="gameRankList.length>0" class="pull-right" :paginationOpt="gameRankPagination" @switchPage="gameRankPagesFn"/>
                    </div>
                </div>
            </div>     
        </div>     
    </div>
</template>

<script>
import comHeader from "components/com-header";
import navigator from "components/navigator";
import slideBtn from "components/slide-btn";
import pagination from "components/ui-pagination";
import api from "api";
import echarts from "bdcharts";
import { createPreviewWindow } from "../../utils";
import defaultHead from "../../assets/images/default-headImg.png";

export default {
  components: {
    comHeader,
    navigator,
    slideBtn,
    pagination
  },
  name: "myPromotionDetail",
  data: function() {
    return {
      manuscriptId: "", //模板id
      moduleDetail: {}, //模板详细
      orderBys: [], //模板排序
      statisticalData: {}, //总浏览量,总访问量,总浏分享数
      scan_access: {}, //总浏览量昨天和今天
      scan_visitor: {}, //总访问量昨天和今天
      scan_share: {}, //总浏分享昨天和今天
      statisticalDays: 7, //数据统计默认7天
      navigatorOpts: {
        //tab标签数据
        tabs: [
          { key: "statisticalData", title: "数据统计", selected: true },
          { key: "personnelAssignment", title: "人员分派" }
        ],
        selectedKey: "statisticalData"
      },
      employeePagination: {
        //人员分派分页
        pageIndex: 1,
        pageSize: 8,
        totalCount: 1,
        pageCount: 0
      },
      luckdrawPagination: {
        //中奖信息分页
        pageIndex: 1,
        pageSize: 8,
        totalCount: 1,
        pageCount: 0
      },
      formDataPagination: {
        //表单信息分页
        pageIndex: 1,
        pageSize: 8,
        totalCount: 1,
        pageCount: 0
      },
      gameRankPagination: {
        //游戏排行分页
        pageIndex: 1,
        pageSize: 8,
        totalCount: 1,
        pageCount: 0
      },
      employeeKeyWords: "", //人员分派搜索关键词
      luckdrawKeyWords: "", //中奖信息搜索关键词
      formDataKeyWords: "", //表单数据搜索关键词
      //gameRankWords:'',//游戏排名搜索关键词
      employeeList: [], //人员分派列表
      luckdrawList: [], //中奖信息列表
      formDataTitle: [], //表单数据标题
      formData: [], //表单数据
      gameRankList: [], //游戏排行列表
      areaRanking: [] //地域分布排名前十
    };
  },
  mounted() {
    var self = this;
    self.manuscriptId = self.$route.query.id;
    //获取活动详情
    api.request(
      "getManuscriptInfo",
      {
        id: self.manuscriptId
      },
      result => {
        if (result.status == 0) {
          result.data.createTime = self.dateString(result.data.createTime);
          self.moduleDetail = result.data;
          if (result.data.plugins.length > 0) {
            result.data.plugins.forEach(function(value, item) {
              switch (value.type) {
                case 1:
                  // self.formDataControlId = value.controlId;
                  self.navigatorOpts.tabs.push({
                    key: "formData." + value.controlId,
                    title: "表单数据"
                  });
                  break;
                case 2:
                  self.navigatorOpts.tabs.push({
                    key: "winningInfo",
                    title: "中奖信息"
                  });
                  break;
                case 3:
                  self.gameControlId = value.controlId;
                  self.navigatorOpts.tabs.push(
                    { key: "winningInfo", title: "中奖信息" },
                    { key: "gameRank", title: "游戏排行榜" }
                  );
                  break;
              }
            });
          }
        }
      }
    );
    //获取模板统计数据
    api.request(
      "aggsTypeByBelongModule",
      {
        as_belong_module: self.manuscriptId
      },
      result => {
        if (result.status == 0) {
          self.statisticalData = result.data.group[0];
        }
      }
    );
    self.dayEcharts = echarts.init(self.$refs.dayDtatistics);
    self.areaDtatistics = echarts.init(self.$refs.areaDtatistics);
    self.residenceTime = echarts.init(self.$refs.residenceTime);
    self.aggsTime({ value: 7 });
    self.aggsGeo();
    self.aggsAccessTime();
  },
  methods: {
    employeeFn(cb) {
      //获取员工信息
      var self = this;
      api.request(
        "getEmployeeList",
        {
          pageIndex: self.employeePagination.pageIndex,
          pageSize: self.employeePagination.pageSize,
          keyWord: self.employeeKeyWords,
          orderBys: self.orderBys,
          state: 0,
          manuscriptId: self.manuscriptId
        },
        result => {
          if (result.status == 0) {
            self.employeeList = result.data.list;
            self.employeePagination.totalCount = result.data.total;
            self.employeePagination.pageCount = Math.ceil(
              self.employeePagination.totalCount /
                self.employeePagination.pageSize
            );
          }
          !!cb && cb();
        }
      );
    },
    sortChangeHandler(orderBy) {
      let { order, prop } = orderBy;
      if (!!order) {
        this.orderBys = [
          {
            [prop]: order === "descending" ? "desc" : "asc"
          }
        ];
      } else {
        this.orderBys = [];
      }
      this.employeeFn();
    },
    //获取表单信息接口
    getFormData: function(cb) {
      var self = this;
      api.request(
        "getformData",
        {
          pageIndex: self.formDataPagination.pageIndex,
          pageSize: self.formDataPagination.pageSize,
          controlId: self.formDataControlId,
          keywords: self.formDataKeyWords,
          relationId: self.manuscriptId
        },
        result => {
          if (result.status == 0 && !!result.data) {
            var list = [];
            result.data.list.forEach(function(element, index) {
              var item = [
                {
                  face: element.face ? element.face : defaultHead,
                  nickname: element.nickname
                }
              ];
              element.content.forEach(function(value, i) {
                if (
                  value.type == "radio_text" ||
                  value.type == "checkbox_text" ||
                  value.type == "radio_image" ||
                  value.type == "checkbox_image"
                ) {
                  value.text = JSON.parse(value.text);
                } else {
                  value.text = [
                    {
                      text: value.text
                    }
                  ];
                }
                item.push(value);
              });
              list.push(item);
            });
            self.formData = list;
            self.formDataTitle = result.data.title;
            self.formDataPagination.totalCount = result.data.total;
            self.formDataPagination.pageCount = Math.ceil(
              self.formDataPagination.totalCount /
                self.formDataPagination.pageSize
            );
          }
          !!cb && cb();
        }
      );
    },
    //获取中奖信息接口
    getLuckDrawList(cb) {
      var self = this;
      api.request(
        "drawprizedata",
        {
          pageIndex: self.luckdrawPagination.pageIndex,
          pageSize: self.luckdrawPagination.pageSize,
          keywords: self.luckdrawKeyWords,
          relationId: self.manuscriptId
        },
        result => {
          if (result.status == 0) {
            result.data.list.forEach(function(val, index) {
              val.nicknameFace = val.nicknameFace
                ? val.nicknameFace
                : defaultHead;
            });
            self.luckdrawList = result.data.list;
            self.luckdrawPagination.totalCount = result.data.total;
            self.luckdrawPagination.pageCount = Math.ceil(
              self.luckdrawPagination.totalCount /
                self.luckdrawPagination.pageSize
            );
          }
          !!cb && cb();
        }
      );
    },
    //获取游戏排行列表
    getGameRankList: function(cb) {
      var self = this;
      api.request(
        "getGameRank",
        {
          pageIndex: self.gameRankPagination.pageIndex,
          pageSize: self.gameRankPagination.pageSize,
          //keyword:self.gameRankWords,
          relationId: self.manuscriptId,
          controlId: self.gameControlId
        },
        result => {
          if (result.status == 0) {
            self.gameRankList = result.data.list;
            result.data.list.forEach(function(val, index) {
              val.userFace = val.userFace ? val.userFace : defaultHead;
            });
            self.gameRankPagination.totalCount = result.data.total;
            self.gameRankPagination.pageCount = Math.ceil(
              self.gameRankPagination.totalCount /
                self.gameRankPagination.pageSize
            );
          }
          !!cb && cb();
        }
      );
    },
    //员工列表分页调取方法
    employeePagesFn(pageIndex, cb) {
      let self = this;
      self.employeePagination.pageIndex = pageIndex;
      self.employeeFn(cb);
    },
    //中奖信息分页调取方法
    luckDrawPagesFn(pageIndex, cb) {
      let self = this;
      self.luckdrawPagination.pageIndex = pageIndex;
      self.getLuckDrawList(cb);
    },
    //游戏排行榜分页调取方法
    gameRankPagesFn(pageIndex, cb) {
      let self = this;
      self.gameRankPagination.pageIndex = pageIndex;
      self.getGameRankList(cb);
    },
    // 表单数据分页调取
    formDataPagesFn(pageIndex, cb) {
      let self = this;
      self.formDataPagination.pageIndex = pageIndex;
      self.getFormData(cb);
    },
    //点击预览
    btnPreview(item) {
      createPreviewWindow(item.url, item.relationId);
    },
    //点击切换tab标签
    transferTab(tab) {
      var self = this;
      self.navigatorOpts.selectedKey = tab.split(".")[0];
      switch (tab.split(".")[0]) {
        case "statisticalData":
          break;
        case "personnelAssignment":
          self.employeeKeyWords = "";
          self.employeePagination.pageIndex = 1;
          self.employeeFn();
          break;
        case "formData":
          self.formDataControlId = tab.split(".")[1];
          self.formDataKeyWords = "";
          self.formDataPagination.pageIndex = 1;
          self.getFormData();
          break;
        case "winningInfo":
          self.luckdrawPagination.pageIndex = 1;
          self.luckdrawKeyWords = "";
          self.getLuckDrawList();
          break;
        case "gameRank":
          self.gameRankPagination.pageIndex = 1;
          //self.gameRankWords = "";
          self.getGameRankList();
          break;
      }
    },
    //点击搜索按钮
    clickSearch(type) {
      var self = this;
      switch (type) {
        case "employee":
          self.employeePagination.pageIndex = 1;
          self.employeeFn();
          break;
        case "luckdraw":
          self.luckdrawPagination.pageIndex = 1;
          self.getLuckDrawList();
          break;
        case "formData":
          self.formDataPagination.pageIndex = 1;
          self.getFormData();
          break;
      }
    },
    //员工分派
    assignEmployee(data) {
      var self = this;
      api.request(
        "assignEmployee",
        {
          manuscriptId: self.manuscriptId,
          distribution: data.distribution,
          range: 1,
          employeeId: data.id
        },
        result => {
          if (result.status == 0) {
            self.employeeFn();
          } else {
            self.myMessage.error(result.message);
          }
        }
      );
    },
    //返回数组的最大值
    arrayMax(arrayName) {
      var max = arrayName[0];
      for (let i = 0; i < arrayName.length; i++) {
        max = arrayName[i] > max ? arrayName[i] : max;
      }
      return max;
    },
    //时间转换
    dateString(str) {
      if (!str) {
        return "";
      }
      var date = new Date(str);
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      var time = date.toTimeString().split(" ")[0];
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate =
        year + seperator1 + month + seperator1 + strDate + " " + time;
      return currentdate;
    },
    //点击切换统计天数
    clickDay(dayNum) {
      var self = this;
      self.statisticalDays = dayNum;
      self.aggsTime({
        as_belong_module: self.manuscriptId,
        value: dayNum
      });
    },
    //日期统计
    aggsTime(obj) {
      var self = this;
      obj.as_belong_module = self.manuscriptId;
      api.request("aggsTime", obj, result => {
        if (result.status == 0) {
          var dataList = [],
            scan_access = [],
            scan_visitor = [],
            scan_share = [],
            year = "";
          for (let i = 0; i < result.data.group.length; i++) {
            let item = result.data.group[i];
            switch (item.key) {
              case "scan_access":
                for (let j in item) {
                  if (j != "count" && j != "key") {
                    let dataArray = j.split("-");
                    dataList.push(dataArray[1] + "/" + dataArray[2]);
                    scan_access.push(item[j]);
                    year = dataArray[0];
                  }
                }
                break;
              case "scan_visitor":
                for (let j in item) {
                  if (j != "count" && j != "key") {
                    scan_visitor.push(item[j]);
                  }
                }
                break;
              case "scan_share":
                for (let j in item) {
                  if (j != "count" && j != "key") {
                    scan_share.push(item[j]);
                  }
                }
                break;
            }
          }
          self.scan_access = {
            today: scan_access[0],
            yesterday: scan_access[1]
          };
          self.scan_visitor = {
            today: scan_visitor[0],
            yesterday: scan_visitor[1]
          };
          self.scan_share = {
            today: scan_share[0],
            yesterday: scan_share[1]
          };
          var scanArray = scan_access.concat(scan_visitor, scan_share);
          var maxData = self.arrayMax(scanArray);
          var option = {
            title: {
              text: ""
            },
            tooltip: {
              trigger: "axis",
              textStyle: {
                fontSize: 12
              },
              formatter: function(params) {
                return (
                  year +
                  "-" +
                  params[0].axisValue.replace("/", "-") +
                  "<br>" +
                  params[0].marker +
                  params[0].seriesName +
                  ":" +
                  params[0].data +
                  "<br>" +
                  params[1].marker +
                  params[1].seriesName +
                  ":" +
                  params[1].data +
                  "<br>" +
                  params[2].marker +
                  params[2].seriesName +
                  ":" +
                  params[2].data
                );
              }
            },
            color: ["#3898ec", "#e96300", "#ed5564"],
            grid: {
              containLabel: true,
              left: 16,
              right: 60,
              bottom: 30,
              top: 38
            },
            legend: {
              data: ["浏览量", "访客量", "分享量"],
              top: 0,
              right: 20
            },
            xAxis: {
              name: "月/日",
              nameTextStyle: {
                color: "#63717b"
              },
              nameGap: 10,
              position: "bottom",
              type: "category",
              boundaryGap: false,
              data: dataList.reverse(),
              axisTick: {
                interval: 0,
                lineStyle: {
                  color: "#63717b"
                }
              },
              axisLabel: {
                fontSize: 10,
                interval: 0
              },
              axisLabel: {
                interval:
                  dataList.length > 7 ? (dataList.length > 15 ? 3 : 1) : 0
              }
            },
            yAxis: {
              name: "数量",
              nameTextStyle: {
                color: "#63717b"
              },
              nameGap: 10,
              type: "value",
              max: function(value) {
                maxData = maxData != 0 ? maxData : 5;
                for (let i = 0; i < 10; i++) {
                  if ((maxData + i) % 5 == 0) {
                    return maxData + i;
                  }
                }
              },
              axisTick: {
                interval: 0,
                lineStyle: {
                  color: "#63717b"
                }
              },
              min: 0,
              splitNumber: 5
            },
            series: [
              {
                name: "浏览量",
                type: "line",
                data: scan_access.reverse(),
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgba(56, 152, 236,.4)"
                      },
                      {
                        offset: 1,
                        color: "rgba(56, 152, 236,.4)"
                      }
                    ])
                  }
                }
              },
              {
                name: "访客量",
                type: "line",
                data: scan_visitor.reverse(),
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgba(23, 99, 0,.4)"
                      },
                      {
                        offset: 1,
                        color: "rgba(23, 99, 0,.4)"
                      }
                    ])
                  }
                }
              },
              {
                name: "分享量",
                type: "line",
                data: scan_share.reverse(),
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: "rgba(237, 85, 100,.4)"
                      },
                      {
                        offset: 1,
                        color: "rgba(237, 85, 100,.4)"
                      }
                    ])
                  }
                }
              }
            ]
          };
          self.dayEcharts.setOption(option);
        }
      });
    },
    //停留时间
    aggsAccessTime() {
      var self = this;
      api.request(
        "aggsAccessTime",
        { as_belong_module: self.manuscriptId },
        result => {
          if (result.status == 0) {
            let xAxisData = [],
              yMaxData = 5,
              dataList = [];
            for (let i in result.data.obj) {
              xAxisData.push(i);
              dataList.push(result.data.obj[i]);
              yMaxData =
                yMaxData < result.data.obj[i] ? result.data.obj[i] : yMaxData;
            }
            var option = {
              grid: {
                containLabel: true,
                left: 16,
                right: 60,
                bottom: 20,
                top: 26
              },
              xAxis: {
                type: "category",
                name: "时间(s)",
                nameTextStyle: {
                  color: "#63717b"
                },
                axisTick: {
                  interval: 0,
                  lineStyle: {
                    color: "#63717b"
                  }
                },
                nameGap: 10,
                data: xAxisData
              },
              yAxis: {
                name: "数量",
                nameTextStyle: {
                  color: "#63717b"
                },
                axisTick: {
                  interval: 0,
                  lineStyle: {
                    color: "#63717b"
                  }
                },
                nameGap: 10,
                type: "value",
                max: function(value) {
                  for (let i = 0; i < 10; i++) {
                    if ((yMaxData + i) % 5 == 0) {
                      return yMaxData + i;
                    }
                  }
                },
                min: 0,
                splitNumber: 5
              },
              series: [
                {
                  data: dataList,
                  type: "bar",
                  itemStyle: {
                    color: "#4bd6eb"
                  },
                  label: {
                    normal: {
                      show: true,
                      position: "top",
                      color: "#555555"
                    }
                  }
                }
              ]
            };
            self.residenceTime.setOption(option);
          }
        }
      );
    },
    //地区统计
    aggsGeo() {
      var self = this;
      api.request(
        "aggsGeo",
        { as_belong_module: self.manuscriptId },
        result => {
          if (result.status == 0) {
            var areaData = [],
              totalNum = 0,
              maxData =
                !!result.data.group.length > 0
                  ? result.data.group[0].doc_count
                  : 5;
            for (let i = 0; i < result.data.group.length; i++) {
              var name = result.data.group[i].key.replace("省", "");
              areaData.push({
                name: name,
                value: result.data.group[i].doc_count
              });
              maxData =
                maxData < result.data.group[i].doc_count
                  ? result.data.group[i].doc_count
                  : maxData;
              totalNum += result.data.group[i].doc_count;
            }
            self.areaRanking = areaData;
            for (let j = 0; j < self.areaRanking.length; j++) {
              self.areaRanking[j].proportion =
                self.areaRanking[j].value / totalNum * 100 + "%";
            }
            var option = {
              tooltip: {
                trigger: "item",
                textStyle: {
                  fontSize: 12
                }
              },
              visualMap: {
                orient: "horizontal",
                type: "piecewise",
                min: 0,
                max: maxData,
                right: 20,
                top: "top",
                text: ["高", "低"], // 文本，默认为数值文本
                calculable: false,
                inRange: {
                  color: ["#e8eced", "#005c80"]
                }
              },
              series: [
                {
                  name: "地域浏览",
                  type: "map",
                  mapType: "china",
                  top: 40,
                  left: 34,
                  roam: false,
                  label: {
                    normal: {
                      show: false
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: areaData
                },
                {
                  name: "地域浏览",
                  type: "pie",
                  radius: [0, "30%"],
                  center: [120, 320],
                  data: areaData
                }
              ]
            };
            self.areaDtatistics.setOption(option);
          }
        }
      );
    }
  }
};
</script>
<style scoped>
.page-box {
  height: 100vh;
  max-height: 100vh;
  background: #ecf0fb;
  color: #63717b;
  font-size: 14px;
  margin: auto;
  padding: 10px 0;
  overflow-y: auto;
}
.detail_main_box {
  width: 1400px;
  min-height: calc(100vh - 65px);
  margin: 50px auto 0px;
  background: #f7fbfc;
  overflow: hidden;
  box-sizing: border-box;
}
.detail_main_box .drtail_left {
  margin: 50px;
  width: 340px;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: -4px 4px 18px 0px rgba(95, 107, 116, 0.3);
}
.detail_main_box .drtail_left .phone-header {
  height: 39px;
}
.detail_main_box .drtail_left .cover_box {
  border-left: 10px solid #fff;
  border-right: 10px solid #fff;
  width: 100%;
  box-sizing: border-box;
  height: 542px;
  overflow-y: auto;
  background: #f1f1f1;
}
.detail_main_box .drtail_left .cover_box > img {
  width: 100%;
}
.detail_main_box .drtail_left .phone-footer {
  height: 71px;
  padding-top: 22px;
  box-sizing: border-box;
  text-align: center;
}
.detail_main_box .det_content {
  width: 960px;
  background: #fff;
  padding-bottom: 30px;
}
.detail_main_box .det_content .dal_tit_txt {
  padding: 50px 60px 40px 60px;
  font-size: 12px;
  color: #9eabb8;
  margin-bottom: 10px;
}
.detail_main_box .det_content .pop_name {
  margin: 0 0 30px 0;
  font-size: 16px;
  color: #3c4a55;
  word-break: break-all;
}
.detail_main_box .det_content .pop_time {
  margin-bottom: 15px;
}
.detail_main_box .det_content .pop_introduce {
  line-height: 22px;
  word-break: break-all;
}
.detail_main_box .det_content .comp-navigator {
  margin: 0 20px;
}
.detail_main_box .det_content .statisticsBlock {
  margin: 20px 0px;
  overflow: hidden;
}
.detail_main_box .det_content .statisticsBlock .statisticsBlock-item {
  height: 85px;
  width: 286px;
  border-right: 1px solid #fff;
  color: #9eabb8;
  font-size: 12px;
  padding-left: 60px;
}
.detail_main_box .det_content .statisticsBlock .statisticsBlock-num {
  font-size: 36px;
  color: #fa766b;
}
.detail_main_box .det_content .statisticsBlock .cl-orange {
  color: #fa766b;
}
.detail_main_box .det_content .statisticsLeft {
  overflow: hidden;
  margin-right: 20px;
}
.detail_main_box .det_content .statisticsLeft > div {
  background: #f7fbfc;
  padding-top: 20px;
  margin-top: 20px;
}
.detail_main_box .det_content .statisticsTitle {
  border-left: 4px solid #00bad0;
  line-height: 20px;
  padding: 0 20px;
  height: 20px;
  margin-bottom: 20px;
}
.detail_main_box .det_content #dayDtatistics {
  width: 479px;
  height: 270px;
}
.detail_main_box .det_content .btn-dayNum {
  width: 60px;
  background: none;
}
.detail_main_box .det_content .btn-dayNum:hover {
  background: #24d0c6;
  color: #fff;
}
.detail_main_box .det_content .btn-dayNum.active {
  background: #24d0c6;
  color: #fff;
}
.detail_main_box .det_content #residenceTime {
  width: 479px;
  height: 300px;
}
.detail_main_box .det_content .statisticsRight {
  width: 366px;
  background: #f7fbfc;
  padding-top: 20px;
  padding-bottom: 30px;
  margin-top: 20px;
}
.detail_main_box .det_content .areaScanAccess {
  margin-left: 34px;
  overflow: hidden;
}
.detail_main_box .det_content #areaDtatistics {
  width: 100%;
  height: 400px;
  font-size: 12px;
}
.detail_main_box .det_content .areaRanking {
  line-height: 20px;
  height: 20px;
  float: left;
  margin-right: 10px;
  margin-top: 16px;
}
.detail_main_box .det_content .areaRanking .progressBar {
  width: 98px;
  display: inline-block;
  height: 12px;
  background: #e0e4e5;
  position: relative;
  margin-top: 4px;
  margin-left: 10px;
}
.detail_main_box .det_content .areaRanking .color-red {
  color: #dc4637;
}
.detail_main_box .det_content .areaRanking .progressBar > .active {
  background: #dc4637;
  position: absolute;
  top: 0;
  left: 0;
  display: inline;
  display: inline-block;
  height: 12px;
}
.tab-content {
  padding: 0 22px;
  box-sizing: border-box;
}
.table-top {
  background: #ecf0fb;
  overflow: hidden;
  line-height: 50px;
  height: 50px;
  padding: 0 18px;
  margin-top: 18px;
}
.table-top .table-top-title {
  float: left;
  font: 400 14px/48px "Microsoft YaHei";
  margin: 0;
}
/* 搜索框样式 begin*/
.search-wrap {
  position: relative;
  width: 272px;
  height: 32px;
  float: right;
}
.search-wrap input {
  width: 272px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #ececec;
  border-radius: 32px;
  padding-left: 10px;
}
.search-wrap .icon {
  position: absolute;
  z-index: 1;
  top: 3px;
  right: 10px;
}
.sort {
  position: relative;
}
.sort .triangle {
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  right: 9px;
  cursor: pointer;
}
.sort .triangle.upIcon {
  top: 13px;
  border-bottom: 5px solid #aaa;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
}
.sort .triangle.downIcon {
  bottom: 13px;
  border-top: 5px solid #aaa;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
}
.sort .triangle.upIcon.active,
.sort .triangle.downIcon.active {
  border-bottom-color: #555;
}
/* 搜索框样式 end*/
/* 用户信息样式 */
.userInfo {
  width: 100%;
  overflow: hidden;
}
.userInfo .userFace {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}
.userInfo .userName {
  line-height: 25px;
}
.thumbnailImg {
  height: 25px;
  margin-right: 2px;
  margin-top: 2px;
}
</style>
