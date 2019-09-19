<template>
  <div class="page-box scroll-box">
    <comHeader></comHeader>
    <div class="detail_main_box">
      <div class="pull-left drtail_left">
        <div class="phone-header"></div>
        <div class="cover_box">
          <img :src="moduleDetail.cover" alt>
        </div>
        <div class="phone-footer">
          <button class="my-btn-green my-btn" @click="btnPreview(moduleDetail)">预览</button>
        </div>
      </div>
      <div class="pull-left det_content">
        <div class="dal_tit_txt">
          <div>
            <p>活动名称</p>
            <p v-text="moduleDetail.name"></p>
          </div>
          <div class="pop_time">
            <p>生成时间</p>
            <p v-text="moduleDetail.createTime"></p>
          </div>
          <div>
            <p>作品描述</p>
            <p v-text="moduleDetail.description"></p>
          </div>
        </div>
        
        <div class="tab-title" style="display:none;">
          <navigator :tabs="navigatorOpts.tabs" @navigator-event="transferTab"></navigator>
        </div>
        <div class="tab-content" style="display:none;">
          <div v-show="navigatorOpts.selectedKey == 'statisticalData'">
            <div class="source-switch">
              <button class="pull-right btn-source" :class="sourceSwitch=='weapp'?'activeSwitch':''" @click="clickSwitch('weapp')">小程序数据</button>
              <button class="pull-right btn-source" :class="sourceSwitch=='wx'?'activeSwitch':''" @click="clickSwitch('wx')">公众号数据</button>
              <button class="pull-right btn-source" :class="sourceSwitch==''?'activeSwitch':''" @click="clickSwitch('')">全部数据</button>
            </div>
            <div class="statisticsBlock">
              <div class="pull-left statisticsBlock-item">
                <div>总浏览数/pv</div>
                <div class="statisticsBlock-num" v-text="statisticalData.scan_access"></div>
                <div>
                  昨天&nbsp;&nbsp;
                  <span v-text="scan_access.yesterday" class="cl-orange"></span>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
                  今天&nbsp;&nbsp;
                  <span v-text="scan_access.today" class="cl-orange"></span>
                </div>
              </div>
              <div class="pull-left statisticsBlock-item">
                <div>总访客数/uv</div>
                <div class="statisticsBlock-num" v-text="statisticalData.scan_visitor"></div>
                <div>
                  昨天&nbsp;&nbsp;
                  <span v-text="scan_visitor.yesterday" class="cl-orange"></span>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
                  今天&nbsp;&nbsp;
                  <span v-text="scan_visitor.today" class="cl-orange"></span>
                </div>
              </div>
              <div class="pull-left statisticsBlock-item">
                <div>总分享数</div>
                <div class="statisticsBlock-num" v-text="statisticalData.scan_share"></div>
                <div>
                  昨天&nbsp;&nbsp;
                  <span v-text="scan_share.yesterday" class="cl-orange"></span>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
                  今天&nbsp;&nbsp;
                  <span v-text="scan_share.today" class="cl-orange"></span>
                </div>
              </div>
            </div>
            <div class="pull-left statisticsLeft">
              <div>
                <div class="statisticsTitle">
                  <span>数据统计</span>
                  <button class="pull-right btn-dayNum" :class="statisticalDays==30?'active':''" @click="clickDay(30)">30天</button>
                  <button class="pull-right btn-dayNum" :class="statisticalDays==15?'active':''" @click="clickDay(15)">15天</button>
                </div>
                <div id="dayDtatistics" ref="dayDtatistics"></div>
              </div>
              <div>
                <div class="statisticsTitle">停留时间</div>
                <div id="residenceTime" ref="residenceTime"></div>
              </div>
            </div>
            <div class="pull-left statisticsRight">
              <div class="mapCont">
                <div class="statisticsTitle">地域分布</div>
                <div id="areaDtatistics" ref="areaDtatistics"></div>
                <div class="areaScanAccess">
                  <div class="statisticsTitle">地域浏览前十名</div>
                  <div>
                    <div class="areaRanking" v-for="(item,index) in areaRanking" :key="item.id">
                      <div class="pull-left text-right" style="width:20px; margin-right: 4px;">
                        <span v-text="(index+1)+'.'" :class="index<3?'color-red':''"></span>
                      </div>
                      <div class="pull-left" style="width:40px;">
                        <span v-text="item.name"></span>
                      </div>
                      <!-- <div class="pull-left">
                        <span class="progressBar">
                          <span class="active" :style="{width:item.proportion}"></span>
                        </span>
                      </div> -->
                      <div class="clearfix"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="funnelCont" v-if="moduleDetail.goodsNumber!==0">
                <div class="statisticsTitle">商品购买行为漏斗</div>
                <div id="goodsBehavior" ref="goodsBehavior"></div>
                <div class="viewManu">
                  <span class="line" style="background-color:#2ec7c9;"></span>
                  <span>{{convertJoinCount(viewManu)}}</span>
                </div>
                <div class="viewGoods">
                  <span class="line" style="background-color:#b7a3df;"></span>
                  <span>{{convertJoinCount(viewGoods)}}</span>
                </div>
                <div class="buyGoods">
                  <span class="line" style="background-color:#5ab1ef;"></span>
                  <span>{{convertJoinCount(buyGoods)}}</span>
                </div>
                <!-- <div class="goodsAttract font-12">商品吸引率 : 50%</div> -->
                <div class="orderSuccess font-12">下单成功率 : {{orderSuccess.toFixed(2)}}%</div>
              </div>
            </div>
          </div>
          <div v-show="navigatorOpts.selectedKey == 'personnelAssignment'" style="position:relative;">
            <div class="table-top">
              <el-checkbox class="table-top-title" v-model="checkAll" :indeterminate="isIndeterminate" @change="toggleSelection">
                <span class="selectAll-btn">全选</span>
              </el-checkbox>
              <button class="table-top-AssignmentBtn" @click="multipleAssignmentMc">分派</button>
              <button class="table-top-RevokeBtn" @click="toggleClearSelection">撤销</button>
              <div class="search-wrap">
                <input type="text" placeholder="请输入员工姓名/手机号码进行查询" v-model="employeeKeyWords">
                <i class="icon iconfont icon-search" @click="clickSearch('employee')"></i>
              </div>
            </div>
            <div class="screen" :style="{'right':(manuscriptType==2?'216px':(!!hasThumbup?'80px':'90px'))}">
              <el-dropdown class="drop-box" style="text-align:left;padding-left: 8px;" @command="handleCommand" trigger="click">
                <span class="el-dropdown-link">
                  <i class="el-icon-caret-bottom" :style="{'color':(!!screenFlag?'#00bad0':'#c0c4cc')}"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="">全部</el-dropdown-item>
                    <el-dropdown-item command="already">已分派</el-dropdown-item>
                    <el-dropdown-item command="notyet">未分派</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div> 
            <!-- table1  人员分派 -->
            <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="employeeList" @sort-change="sortChangeHandler"
              tooltip-effect="dark" style="width: 100%" row-key="id" class="table" header-row-class-name="table-header"
              header-cell-class-name="table-header">
              <el-table-column type="selection" width="35"></el-table-column>
              <el-table-column label="姓名" width="80" align="center" prop="name" show-overflow-tooltip></el-table-column>
              <el-table-column label="手机" width="manuscriptType!=2?110:150" prop="phone" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column v-if="!!hasThumbup" label="点赞数" width="70" prop="thumbupCount" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column v-if="manuscriptType!=2" label="首次分享" show-overflow-tooltip width="!!hasThumbup?78:98" align="center" prop="firstShare"
                class-name="disable-color"></el-table-column>
              <el-table-column v-if="manuscriptType!=2" label="分享数/目标数" show-overflow-tooltip width="130" prop="totalShare" sortable="custom"
                align="center">
                <template slot-scope="scope">{{ scope.row.totalShare }}/{{ scope.row.targetShare }}</template>
              </el-table-column>
              <el-table-column v-if="manuscriptType!=2" label="访客数/目标数" show-overflow-tooltip width="130" prop="totalVisitor" sortable="custom"
                align="center">
                <template slot-scope="scope">{{ scope.row.totalVisitor }}/{{ scope.row.targetVisitor }}</template>
              </el-table-column>
              <el-table-column v-if="manuscriptType!=2" label="浏览数/目标数" show-overflow-tooltip width="130" prop="totalAccess" sortable="custom"
                align="center">
                <template slot-scope="scope">{{ scope.row.totalAccess }}/{{ scope.row.targetAccess }}</template>
              </el-table-column>
              <el-table-column label="分派状态" show-overflow-tooltip width="manuscriptType!=2?76:150" align="center">
                <template slot-scope="scope">{{scope.row.distribution==1?'已分派':'未分派'}}</template>
              </el-table-column>
              <el-table-column label="操作" show-overflow-tooltip width="80" align="center">
                <template slot-scope="scope">
                  <slideBtn :slideBtnOpt="scope.row" @click="employeeTargetSet(false)" active-text="分派" inactive-text="撤销"
                    :prop-value-map="{0:1,1:0}" prop-key="distribution" @slide-event="assignEmployee"></slideBtn>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-if="employeeList.length>0" class="pull-right" :paginationOpt="employeePagination" @switchPage="employeePagesFn" />
            <!-- table1  人员分派结束 -->
            <!-- 分派目标蒙层 滑动点击事件 -->
            <el-dialog title="分派任务" :visible.sync="AssignmentMc" :before-close="handleClose" width="500px" top="34vh"
              :center="true" class="AssignmentMc-box">
              <div class="AssignmentMc-form-text" v-if="this.rewardList.length==0?false:true">
                <span style="font-size:16px;color:#3c4a55;">推广奖励活动</span>
                <div class="AssignmentMc-select">
                  <el-checkbox-group v-model="checkedReward" @change="changeReward">
                    <el-checkbox v-for="item in rewardList" :disabled="item.distribution==1?true:false" :label="item"
                      :key="item.id">{{item.name}}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="totalMoney">
                  <span style="color:#3c4a55; margin-right:5px;">奖励金额 / 账户余额</span>
                  <span>{{totalMoney==0?0:parseFloat(totalMoney).toFixed(2)}}</span>/<span>{{balance==0?0:parseFloat(balance).toFixed(2)}}</span>
                </div>
              </div>
              <div v-else></div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="employeeTargetSet">分 派</el-button>
                <el-button @click="CancelMc">取 消</el-button>
              </span>
            </el-dialog>
            <el-dialog title="撤销任务" :visible.sync="revokeReward" :before-close="handleClose" width="500px" top="34vh"
              :center="true" class="AssignmentMc-box">
              <div class="AssignmentMc-form-text" v-if="this.rewardList.length==0?false:true">
                <span style="font-size:16px;color:#496076;">推广奖励活动</span>
                <div class="AssignmentMc-select">
                  <div class="selectName" v-for="item in rewardList" :key="item.id">{{item.name}}</div>
                </div>
                <div class="totalMoney">
                  <span style="color:#555555; margin-right:5px;">奖励金额 / 账户余额</span>
                  <span>{{totalMoney==0?0:parseFloat(totalMoney).toFixed(2)}}</span>/<span>{{balance==0?0:parseFloat(balance).toFixed(2)}}</span>
                </div>
              </div>
              <div v-else></div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="employeeRevokeSet">撤销</el-button>
                <el-button @click="CancelMc">取 消</el-button>
              </span>
            </el-dialog>
          </div>
          <div v-show="navigatorOpts.selectedKey == 'formData'">
            <!-- <select v-model="selctFormId">
              <option value="item.controlId" v-for="item in formDataList" :key="item.controlId">{{item.name}}</option>
            </select>-->
            <div style="height: 58px;line-height: 58px;margin-top: 13px;">
              <el-select v-model="selctFormId" placeholder="请选择" @change="selctForm" class="pull-left">
                <el-option v-for="item in formDataList" :key="item.controlId" :label="item.name" :value="item.controlId"></el-option>
              </el-select>
              <a target="_blank" :href="exportFormDataUrl" class="pull-right">
                <span class="btn-plain color-blue font-14">excel导出数据</span>
              </a>
            </div>
            <div class="table-top">
              <h3 class="table-top-title">表单数据</h3>
              <div class="search-wrap">
                <input type="text" placeholder="请输入用户信息进行查询" v-model="formDataKeyWords">
                <i class="icon iconfont icon-search" @click="clickSearch('formData')"></i>
              </div>
            </div>
            <el-table :data="formData" tooltip-effect="dark" style="overflow-x:auto;" class="table"
              header-row-class-name="table-header" header-cell-class-name="table-header">
              <el-table-column :label="title" v-for="(title,index) in formDataTitle" :key="index" show-overflow-tooltip
                min-width="150" style="width:100%;">
                <template slot-scope="scope">
                  <div v-if="index==0" class="userInfo">
                    <img :src="scope.row[index].face" class="userFace">
                    <span class="userName">{{scope.row[index].nickname}}</span>
                  </div>
                  <div v-else>
                    <div v-for="(value,idx) in scope.row[index].text" :key="idx">
                      <img :src="value.img" v-if="!!value.img" class="thumbnailImg" @click="scaleImg(value.img)">
                      <span v-text="value.text"></span>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-if="formData.length>0" class="pull-right" :paginationOpt="formDataPagination" @switchPage="formDataPagesFn" />
          </div>
          <div v-show="navigatorOpts.selectedKey == 'winningInfo'">
            <div class="table-top">
              <h3 class="table-top-title">中奖信息</h3>
              <div class="search-wrap">
                <input type="text" placeholder="请输入手机号进行查询" v-model="luckdrawKeyWords">
                <i class="icon iconfont icon-search" @click="clickSearch('luckdraw')"></i>
              </div>
            </div>
            <!-- table 2  中奖信息-->
            <!-- <el-table :data="luckdrawList" tooltip-effect="dark" style="width: 100%" row-key="id" class="table"
              header-row-class-name="table-header" header-cell-class-name="table-header">
              <el-table-column label="用户信息" width="200" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="userInfo">
                    <img :src="scope.row.face" class="userFace">
                    <span class="userName">{{scope.row.nickname}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="手机号码" show-overflow-tooltip align="center">
                <template slot-scope="scope">{{scope.row.phone==""?'-':scope.row.phone}}</template>
              </el-table-column>
              <el-table-column label="奖项" prop="optionName" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column label="奖品" prop="prizeName" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column label="奖品图片" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                  <img :src="scope.row.icon" style="width:25px;height:25px;" @click="scaleImg(scope.row.icon)" v-if="!!scope.row.icon">
                </template>
              </el-table-column>
              <el-table-column label="兑奖方式" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.exchangeType}}</span>
                </template>
              </el-table-column>
              <el-table-column label="兑奖状态" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.isProvide == 1 ? '已兑奖' : '未兑奖'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <div>
                    <span @click="queryDetail(scope.row)" style="cursor:pointer;">详情</span>
                    <span v-if="scope.row.userCashType == 1 && scope.row.isProvide != 1" style="margin:10px;cursor:pointer;"
                      @click="prividePrize(scope.row.id)">发放奖品</span>
                  </div>
                </template>
              </el-table-column>
            </el-table> -->
            <!-- <pagination v-if="luckdrawList.length>0" class="pull-right" :paginationOpt="luckdrawPagination" @switchPage="luckDrawPagesFn" /> -->
          </div>
          <div v-show="navigatorOpts.selectedKey == 'gameRank'">
            <div class="table-top">
              <h3 class="table-top-title">游戏排行榜</h3>
              <!-- <div class="search-wrap">
                        <input type="text" placeholder="请输入昵称进行查询" v-model="gameRankWords">
                        <i class="icon iconfont icon-search"></i>
              </div>-->
            </div>
            <!-- <el-table :data="gameRankList" tooltip-effect="dark" style="width: 100%" class="table"
              header-row-class-name="table-header" header-cell-class-name="table-header">
              <el-table-column label="用户信息" show-overflow-tooltip width="290">
                <template slot-scope="scope">
                  <div class="userInfo">
                    <img :src="scope.row.userFace" class="userFace">
                    <span class="userName">{{scope.row.userNickname}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="排名" prop="scoreIndex" width="290" show-overflow-tooltip align="center"></el-table-column>
              <el-table-column label="分数" prop="score" width="285" show-overflow-tooltip align="center"></el-table-column>
            </el-table>
            <pagination v-if="gameRankList.length>0" class="pull-right" :paginationOpt="gameRankPagination" @switchPage="gameRankPagesFn" /> -->
          </div>
          <div v-show="navigatorOpts.selectedKey == 'voteList'">
            <div style="height: 58px;line-height: 58px;margin-top: 13px;">
              <el-select v-model="votePlugin.selectId" placeholder="请选择" @change="selctVote" class="pull-left">
                <el-option v-for="item in votePlugin.idList" :key="item.controlId" :label="item.name" :value="item.controlId"></el-option>
              </el-select>
              <a target="_blank" :href="votePlugin.exportUrl" class="pull-right">
                <span class="btn-plain color-blue font-14">excel导出数据</span>
              </a>
            </div>
            <div class="table-top">
              <h3 class="table-top-title">投票数据</h3>
              <div class="search-wrap">
                <input type="text" placeholder="请输入投票项进行查询" v-model="votePlugin.keywords">
                <i class="icon iconfont icon-search" @click="clickSearch('voteData')"></i>
              </div>
            </div>

            <!-- <el-table :data="votePlugin.list" tooltip-effect="dark" style="overflow-x:auto;" class="table"
              header-row-class-name="table-header" header-cell-class-name="table-header">
              <el-table-column  label="投票项" show-overflow-tooltip min-width="150">
                <template slot-scope="scope">
                  <div class="userInfo">
                    <img :src="scope.row.image" class="userFace">
                    <span class="userName">{{scope.row.title}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="最新投票时间" prop="newTime" align="center">
              </el-table-column>
              <el-table-column label="投票数" prop="voteNum" align="center">
              </el-table-column>
            </el-table> -->
            <!-- <pagination v-if="votePlugin.list.length>0" class="pull-right" :paginationOpt="votePlugin.pagination" @switchPage="voteDataPagesFn" /> -->
          </div>
        </div>
      </div>
    </div>
    <!-- <el-dialog v-if="imgScale.visible" :visible.sync="imgScale.visible" :center="true" @close="imgScale.visible = false;">
      <el-row style="height:auto;text-align:center;">
        <img :src="imgScale.src" style="width:auto;max-width:600px;height:auto;">
      </el-row>
    </el-dialog>
    <el-dialog v-if="prizeDataDetail.visible" :visible.sync="prizeDataDetail.visible" :center="true" @close="prizeDataDetail.visible = false;">
      <el-row style="height:30px;text-align:left;font-weight:bold;">中奖信息</el-row>
      <el-row style="height:30px;text-align:left;">活动时间：{{prizeDataDetail.detail.name}}</el-row>
      <el-row style="height:30px;text-align:left;">奖项名称：{{prizeDataDetail.detail.optionName}}</el-row>
      <el-row style="height:30px;text-align:left;">奖品名称：{{prizeDataDetail.detail.prizeName}}</el-row>
      <el-row style="height:30px;text-align:left;">中奖时间：{{prizeDataDetail.detail.createtime}}</el-row>
      <el-row style="height:30px;text-align:left;font-weight:bold;" v-if="prizeDataDetail.detail.userCashType == 1 && prizeDataDetail.detail.exchangeState == 1">预留信息</el-row>
      <el-row style="height:30px;text-align:left;" v-for="(item,idx) in prizeDataDetail.detail.contents" :key="idx">{{item.name}}：{{item.content}}</el-row>

      <el-row style="height:30px;text-align:left;">兑奖状态：{{prizeDataDetail.detail.exchangestatusText}}</el-row>
      <el-row style="height:30px;text-align:left;" v-if="prizeDataDetail.detail.isProvide == 1 && prizeDataDetail.detail.userCashType == 2">兑奖人员：{{prizeDataDetail.detail.emplName}}</el-row>
      <el-row style="height:30px;text-align:left;" v-if="prizeDataDetail.detail.exchangeState == 1">兑奖时间：{{prizeDataDetail.detail.exchangetime}}</el-row>
      <el-row style="height:30px;text-align:left;" v-if="prizeDataDetail.detail.userCashType == 1 && prizeDataDetail.detail.isProvide == 0">
        <el-button class="pull-right" type="primary" size="small" @click="prividePrize(prizeDataDetail.detail.id)">发放</el-button>
      </el-row>
    </el-dialog> -->
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
import httpConfig from "config/http";

export default {
  components: {
    comHeader,
    navigator,
    slideBtn,
    pagination
  },
  name: "myPromotionDetail",
  data: function () {
    return {
      slideId: "", //滑动按钮获取员工ID
      employeeId: "", //选择框获取员工ID
      manuscriptId: "", //模板id
      moduleDetail: {}, //模板详细
      orderBys: [], //模板排序
      statisticalData: {}, //总浏览量,总访问量,总浏分享数
      scan_access: {}, //总浏览量昨天和今天
      scan_visitor: {}, //总访问量昨天和今天
      scan_share: {}, //总浏分享昨天和今天
      statisticalDays: 7, //数据统计默认7天
      sourceSwitch: '', //来源数据切换默认全部
      screenText: '', //员工分派筛选(已分派/未分派)
      screenFlag: false,//员工分派筛选状态
      AssignmentMc: false, //多选分派蒙层
      revokeReward: false, //撤销分派蒙层
      multipleSelection: [], //点击选择后将数据追加到该数组
      checkedReward: [], //选中的奖励追加到此数组
      rewardList: [], //奖励列表
      rewardId: [], //奖励id数组
      totalMoney: 0, //奖励总金额
      balance: "", //账户余额
      isIndeterminate: false, //全选默认
      checkAll: false, //全选默认
      distribution: 0, //滑动状态默认
      navigatorOpts: {
        //tab标签数据
        tabs: [
          { key: "statisticalData", title: "数据统计", selected: true },
          { key: "personnelAssignment", title: "人员分派" }
          // { key: "formData", title: "表单数据" },
          // { key: "winningInfo", title: "中奖信息" },
          // { key: "gameRank", title: "游戏排行榜" }
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
      formDataList: [], //表单列表
      selctFormId: "", //选中的表单id
      formData: [], //表单数据
      gameRankList: [], //游戏排行列表
      areaRanking: [], //地域分布排名前十
      votePlugin: { //投票插件
        idList: [], //插件id列表
        selectId: '', //选中的插件id
        list: [], //投票项数据列表
        pagination: { 
          pageIndex: 1,
          pageSize: 8,
          totalCount: 1,
          pageCount: 0
        },
        keywords: "",
        exportUrl: ''
      }, 
      imgScale: {
        //图片放大镜
        visible: false,
        src: ""
      },
      prizeDataDetail: {
        //中奖信息详情弹窗
        visible: false,
        detail: {}
      },
      exportFormDataUrl: "",
      buyGoods: 0, //购买商品次数
      viewManu: 0, //查看活动次数
      viewGoods: 0, //跳转商品次数
      orderSuccess: 0, //下单成功率
      hasThumbup: null, //是否存在点赞插件
      manuscriptType: 0 //插件类型
    };
  },
  mounted() {
    var self = this;
    self.manuscriptId = self.$route.query.id;
    self.exportFormDataUrl =
      httpConfig.apiHost +
      "activity/plugin/form/excel?relationId=" +
      self.manuscriptId +
      "&&session_id=" +
      localStorage.getItem("sessionId");
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
          self.manuscriptType = result.data.manuscriptType;
          if(self.manuscriptType==2){
            self.navigatorOpts.selectedKey = 'personnelAssignment';
            self.navigatorOpts.tabs = [{ key: "personnelAssignment", title: "人员分派", selected: true}]
            document.querySelector('.tab-title').style.display = 'block';
            document.querySelector('.tab-content').style.display = 'block';
          }else{
            self.navigatorOpts.tabs = [{ key: "statisticalData", title: "数据统计", selected: true },{ key: "personnelAssignment", title: "人员分派" }]
            document.querySelector('.tab-title').style.display = 'block';
            document.querySelector('.tab-content').style.display = 'block';
          }
          if (result.data.plugins.length > 0) {
            result.data.plugins.forEach(function (value, item) {
              switch (value.type) {
                case 1:
                  // self.formDataControlId = value.controlId;
                  if (
                    self.navigatorOpts.tabs.filter(item => {
                      return item.key == "formData";
                    }).length == 0
                  ) {
                    self.navigatorOpts.tabs.push({
                      key: "formData",
                      title: "表单数据"
                    });
                  }
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
                case 4:
                  // self.formDataControlId = value.controlId;
                  if (
                    self.navigatorOpts.tabs.filter(item => {
                      return item.key == "voteList";
                    }).length == 0
                  ) {
                    self.navigatorOpts.tabs.push({
                      key: "voteList",
                      title: "投票列表"
                    });
                  }
                  break;
              }
            });
          }
        }
      }
    );

    self.dayEcharts = echarts.init(self.$refs.dayDtatistics);
    self.areaDtatistics = echarts.init(self.$refs.areaDtatistics);
    self.residenceTime = echarts.init(self.$refs.residenceTime);
    self.goodsBehavior = echarts.init(self.$refs.goodsBehavior);
    self.modelData(self.sourceSwitch);
    self.aggsTime({ value: 7 });
    self.aggsGeo(self.sourceSwitch);
    self.aggsAccessTime(self.sourceSwitch);
    self.aggsGoods(self.sourceSwitch);    
    //获取员工信息
    self.employeeFn();
    self.getformList();
    self.getVoteList();
    //获取账户余额
    self.businessInfo();
  },
  methods: {
    //获取员工信息
    employeeFn(cb) {
      var self = this;
      api.request(
        "getEmployeeList",
        {
          pageIndex: self.employeePagination.pageIndex,
          pageSize: self.employeePagination.pageSize,
          keyWords: self.employeeKeyWords,
          orderBy: self.orderBys.length > 0 ? self.orderBys : null,
          state: 0,
          manuscriptId: self.manuscriptId,
          dispatch: self.screenText
        },
        result => {
          if (result.status == 0) {
            self.employeeList = result.data.list;
            self.hasThumbup = result.data.hasThumbup;
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
    //排序方法
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
    getformList: function () {
      var self = this;
      api.request(
        "getformList",
        {
          relationId: self.manuscriptId
        },
        result => {
          if (result.status == 0 && !!result.data) {
            self.formDataList = result.data;
            console.log("表单数据", self.formDataList)
            if (result.data.length > 0) {
              self.selctFormId = self.formDataList[0].controlId;
            }
          }
        }
      );
    },
    selctForm() {
      this.getFormData();
    },
    //获取表单信息接口
    getFormData: function (cb) {
      var self = this;
      api.request(
        "getformData",
        {
          pageIndex: self.formDataPagination.pageIndex,
          pageSize: self.formDataPagination.pageSize,
          controlId: self.selctFormId,
          keywords: self.formDataKeyWords,
          relationId: self.manuscriptId
        },
        result => {
          if (result.status == 0 && !!result.data) {
            var list = [];
            result.data.list.forEach(function (element, index) {
              var item = [
                {
                  face: element.face ? element.face : defaultHead,
                  nickname: element.nickname
                }
              ];
              element.content.forEach(function (formItem, i) {
                if (
                  formItem.type == "text_radio-option" ||
                  formItem.type == "text_checkbox-option" ||
                  formItem.type == "text_image-radio-option" ||
                  formItem.type == "text_image-checkbox-option" ||
                  formItem.type == "text_upload"
                ) {
                  formItem.text = JSON.parse(formItem.text);
                } else {
                  formItem.text = [
                    {
                      text: formItem.text
                    }
                  ];
                }
                item.push(formItem);
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
    //获取投票插件列表
    getVoteList: function () {
      var self = this;
      api.request(
        "getVoteList",
        {
          relationId: self.manuscriptId
        },
        result => {
          if (result.status == 0 && !!result.data) {
            self.votePlugin.idList = result.data;
            if (result.data.length > 0) {
              self.votePlugin.selectId = result.data[0].controlId;
              self.selctVote();
            }
          }
        }
      );
    },
    selctVote() {
      this.votePlugin.exportUrl = httpConfig.apiHost + '/activity/plugin/vote/excel?relationId=' + this.manuscriptId + '&controlId=' + this.votePlugin.selectId +'&session_id=' +
      localStorage.getItem("sessionId");
      this.votePlugin.keywords = '';
      this.getVoteData();
    },
    //获取投票项列表接口
    getVoteData: function (cb) {
      var self = this;
      api.request(
        "getVoteData",
        {
          pageIndex: self.votePlugin.pagination.pageIndex,
          pageSize: self.votePlugin.pagination.pageSize,
          controlId: self.votePlugin.selectId,
          searchName: self.votePlugin.keywords,
          relationId: self.manuscriptId
        },
        result => {
          if (result.status == 0 && !!result.data) {
            self.votePlugin.list = result.data.list;
            self.votePlugin.pagination.totalCount = result.data.total;
            self.votePlugin.pagination.pageCount = Math.ceil(
              self.votePlugin.pagination.totalCount /
              self.votePlugin.pagination.pageSize
            );
          }
          !!cb && cb();
        }
      );
    },
    //员工分派筛选切换
    handleCommand(command) {
      var self = this;
      self.screenFlag = true;
      self.screenText = command;
      self.employeeFn();
    },
    //全选事件
    toggleSelection(val) {
      let row = this.employeeList;
      if (
        this.multipleSelection.length > 0 &&
        this.multipleSelection.length != this.employeeList.length
      ) {
        row = this.employeeList.filter(
          item => !this.multipleSelection.some(ele => ele.id === item.id)
        );
      }
      row.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      });
    },
    //选择时，获取选中的数据对象
    handleSelectionChange(val) {
      this.multipleSelection = val;
      const checkedCount = val.length;
      this.checkAll = checkedCount === this.employeeList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.employeeList.length;
    },
    //获取当前所有的员工id数组
    getSelectIds() {
      let ids = [];
      if (!!this.employeeList && this.employeeList.length > 0) {
        ids = this.employeeList.map(item => item.id);
      }
      return ids;
    },
    //获取当前勾选单个员工的id
    getSelectId() {
      let id = "";
      if (!!this.multipleSelection && this.multipleSelection.length > 0) {
        id = this.multipleSelection.map(item => item.id);
      }
      return id;
    },
    //撤销事件
    toggleClearSelection() {
      let idd = this.getSelectId();
      if (this.employeeList.length > 0 && this.multipleSelection.length > 0) {
        this.revokeReward = true;
        this.single = false; //判断多选还是单选，弹层
        var staff = this.single ? this.slideId : this.getSelectId();
        if (this.multipleSelection.length == 1) {
          this.obtainReward(staff, 1);
        } else {
          this.obtainReward('', 1);
        }
      } else {
        this.$message({
          message: "未设置分派人员!",
          type: "warning"
        });
      }
    },
    //清除蒙层表单数据
    // closeDialog() {
    //   this.$refs.numberValidateForm.resetFields();
    // },
    //获取奖励列表
    obtainReward(staffid, state) {
      let relationId = this.$route.query.id;
      var self = this;
      // console.log("奖励活动id",staffid);
      api.request(
        "rewardDistribute",
        {
          relationId: relationId,
          employeeId: staffid,
          filter: state
        },
        result => {
          if (result.status == 0) {
            self.rewardList = result.data;
            self.checkedReward = self.rewardList.filter((item) => item.distribution == 1)
            let total = 0
            self.checkedReward.map((item) => { total += item.money })
            self.totalMoney = total
            // console.log("奖励列表",result.data);
          } else {
            self.$message.error(result.message);
          }
        }
      );
    },
    changeReward(rewards) {
      // this.checkedReward = rewards;
      let total = 0
      this.checkedReward.map((item) => { total += item.money })
      let multipleSelection = []
      if (this.multipleSelection.length > 0) {
        multipleSelection = this.multipleSelection.filter((item) => item.distribution == 0)
      }

      this.totalMoney = total * multipleSelection.length || total * this.changeReward.length
      // console.log("选中奖励后追加到数组",this.checkedReward,"显示选中的总金额",this.totalMoney)
    },
    //分派弹窗
    multipleAssignmentMc() {
      if (this.employeeList.length > 0 && this.multipleSelection.length > 0) {
        this.AssignmentMc = true;
        this.single = false; //判断多选还是单选，弹层
        var staff = this.single ? this.slideId : this.getSelectId();
        // console.log("员工id", staff)
        if (this.multipleSelection.length == 1) {
          this.obtainReward(staff[0], 0);
        } else {
          this.obtainReward('', 0);
        }
      } else {
        this.$message({
          message: "请勾选分派人员!",
          type: "warning"
        });
      }
    },
    //分派弹窗点击遮罩层时触发
    handleClose() {
      this.AssignmentMc = false;
      this.revokeReward = false;
    },
    //员工奖励分派
    assignment(eId) {
      let manuscriptId = this.$route.query.id;
      let self = this;
      //获取奖励id数组
      let rewardId = []
      this.checkedReward.forEach(row => {
        rewardId.push(row.id);
      });
      api.request(
        "assignEmployee",
        {
          manuscriptId: manuscriptId,
          distribution: 1,
          employeeId: eId,
          awardId: rewardId
        },
        result => {
          if (result.status == 0) {
            self.AssignmentMc = false;
            self.employeeFn();
            self.$message({
              type: "success",
              message: "分派成功!"
            });
            // console.log("result.data", result.data)
          } else {
            self.$message.error(result.message);
          }
        }
      );
    },
    employeeTargetSet() {
      var employeeId = this.single ? this.slideId : this.getSelectId();
      if (this.single) {
        this.assignment(employeeId);
      } else {
        if (this.totalMoney > this.balance) {
          this.$message({
            message: "账户金额不足，分派失败!",
            type: "warning"
          });
        } else {
          this.assignment(employeeId);
        }
      }
      // console.log("勾选金金",this.totalMoney,"余额金金",this.balance)
      self.AssignmentMc = false;
    },

    //员工取消分派
    CancelMc() {
      this.AssignmentMc = false;
      this.revokeReward = false;
    },
    //单个员工分派
    assignEmployee(data) {
      this.slideId = data.id;
      data.distribution = data.distribution == 1 ? 0 : 1;
      // var staff = this.single ? this.slideId : this.getSelectId();
      //操作单条数据触发
      if (data.distribution == 1) {
        this.revokeReward = true;
        this.single = true;
        this.obtainReward(this.slideId, 1);
      } else if (data.distribution == 0) {
        this.AssignmentMc = true;
        this.single = true;
        this.obtainReward(this.slideId, 0);
      }
    },
    //撤销分派请求
    revoke(id) {
      let self = this;
      let rewardId = []
      self.$refs.multipleTable.clearSelection();
      //获取奖励id数组
      this.checkedReward.forEach(row => {
        rewardId.push(row.id);
      });
      // let rewardId = self.rewardId;
      api.request(
        "assignEmployee",
        {
          manuscriptId: self.manuscriptId,
          distribution: 0,
          employeeId: id,
          awardId: rewardId
        },
        result => {
          if (result.status == 0) {
            self.employeeFn();
            self.$message({
              type: "success",
              message: "撤销成功!"
            });
          } else {
            self.$message.error(result.message);
          }
        }
      );

    },
    employeeRevokeSet() {
      // let slideId = this.slideId;
      var employeeId = this.single ? this.slideId : this.getSelectId();
      if (this.single) {
        this.revoke(employeeId);
      } else {
        this.revoke(employeeId);
      }
      this.revokeReward = false;
    },
    //获取商户余额 
    businessInfo() {
      var self = this;
      api.request(
        "businessAccount", {},
        result => {
          if (result.status == 0) {
            self.balance = result.data.balance;
            // console.log("查看余额", self.balance);
          } else {
            self.$message.error(result.message);
          }
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
            result.data.list.forEach(function (val, index) {
              val.nicknameFace = val.nicknameFace
                ? val.nicknameFace
                : defaultHead;
              val.exchangeType = !!val.userCashType
                ? val.userCashType == 1
                  ? "线上兑奖"
                  : "线下兑奖"
                : "";
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
    //图片放大镜
    scaleImg: function (img) {
      this.imgScale.src = img;
      this.imgScale.visible = true;
    },
    //中奖记录详情
    queryDetail: function (row) {
      let self = this;
      api.request(
        "getDrawprizeInfo",
        {
          id: row.id
        },
        result => {
          if (result.status == 0) {
            result.data.createtime = self.dateString(result.data.createtime);
            if (!!result.data.exchangetime)
              result.data.exchangetime = self.dateString(
                result.data.exchangetime
              );
            result.data.exchangestatusText =
              result.data.isProvide == 1
                ? "已兑奖-" +
                (result.data.userCashType == 1 ? "线上兑奖" : "线下兑奖")
                : "未兑奖";
            self.prizeDataDetail.detail = result.data;
          } else {
            self.$message.error(result.message);
          }
          self.prizeDataDetail.visible = true;
        }
      );
    },
    //发放奖品
    prividePrize: function (id) {
      let self = this;
      api.request(
        "provideOnline",
        {
          id: id
        },
        result => {
          if (result.status == 0) {
            switch (result.data) {
              case 1:
                self.$message.error("找不到中奖记录");
                break;
              case 2:
                self.$message.error("已经兑奖");
                break;
              case 3:
                self.$message.error("不支持线上兑奖方式");
                break;
              case 4:
                self.$message.error("商家不存在");
                break;
              case 5:
                self.$message.error("稿件不存在");
                break;
              case 6:
                self.$message.error("活动不属于此商家");
                break;
              case 200:
                Kdo.utils.messenger.success("兑奖成功");
                self.getLuckDrawList();
                self.prizeDataDetail.detail = {};
                self.prizeDataDetail.visible = false;
                break;
            }
          }
        }
      );
    },
    //获取游戏排行列表
    getGameRankList: function (cb) {
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
            result.data.list.forEach(function (val, index) {
              val.userFace = val.userFace ? val.userFace : defaultHead;
              val.scoreIndex =
                self.gameRankPagination.pageSize *
                (self.gameRankPagination.pageIndex - 1) +
                index +
                1;
            });

            self.gameRankList = result.data.list;
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
    //表单数据分页调取
    formDataPagesFn(pageIndex, cb) {
      let self = this;
      self.formDataPagination.pageIndex = pageIndex;
      self.getFormData(cb);
    },
    //投票列表数据分页调取
    voteDataPagesFn(pageIndex, cb) {
      let self = this;
      self.votePlugin.pagination.pageIndex = pageIndex;
      self.getVoteData(cb);
    },
    //点击预览
    btnPreview(item) {
      createPreviewWindow(item.url, item.relationId);
      // console.log("item.url", item.url, "item.relationId", item.relationId)
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
        case "voteData":
          self.votePlugin.pagination.pageIndex = 1;
          self.getVoteData();
          break;
      }
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
    //点击切换数据来源
    clickSwitch(source) {
      var self = this;
      self.sourceSwitch = source;
      self.modelData(self.sourceSwitch);
      self.aggsTime({
        as_belong_module: self.manuscriptId,
        secret_key: localStorage.businessSecret,
        as_from: self.sourceSwitch
      });
      self.aggsAccessTime(self.sourceSwitch);
      self.aggsGeo(self.sourceSwitch);
      self.aggsGoods(self.sourceSwitch);
    },
    //获取模板统计数据
    modelData(data) {
      var self = this;
      api.request(
        "aggsTypeByBelongModule",
        {
          as_belong_module: self.manuscriptId,
          as_from: data
        },
        result => {
          if (result.status == 0) {
            self.statisticalData = result.data.group[0];
            let buyGoods = result.data.group[0].scan_buy_goods, 
              viewManu = result.data.group[0].scan_access, 
              viewGoods = result.data.group[0].scan_view_goods;

            self.buyGoods = buyGoods; //购买商品次数
            self.viewManu = viewManu; //查看活动次数
            self.viewGoods = viewGoods; //跳转商品次数
            self.orderSuccess = !!isFinite((buyGoods/viewGoods) * 100)?(buyGoods/viewGoods) * 100:0;
            // console.log("购买下单率数据", self.orderSuccess)
          }
        }
      );
    },
    //点击切换统计天数
    clickDay(dayNum) {
      var self = this;
      self.statisticalDays = dayNum;
      self.aggsTime({
        as_belong_module: self.manuscriptId,
        as_from: self.sourceSwitch,
        value: dayNum
      });
    },
    //日期统计
    aggsTime(obj) {
      var self = this;
      obj.as_belong_module = self.manuscriptId;
      obj.secret_key = localStorage.businessSecret;
      obj.as_from = self.sourceSwitch;
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
              formatter: function (params) {
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
            color: ["#fddf44", "#b09bdb", "#41cbcd"],
            grid: {
              containLabel: true,
              left: 16,
              right: 60,
              bottom: 30,
              top: 38
            },
            legend: {
              data: ["浏览数", "访客数", "分享数"],
              top: 0,
              right: 23,
              textStyle: {
                fontSize: 12
              },
              itemWidth: 15,
              itemHeight: 8,
              itemGap: 20
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
                },
                show: false
              },
              axisLabel: {
                fontSize: 10,
                interval: 0
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#F0F0F0'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#1091cf',
                  width: 1
                }
              },
              axisLabel: {
                color: '#63717b',
                interval:
                  dataList.length > 7 ? (dataList.length > 15 ? 3 : 1) : 0
              },
            },
            yAxis: {
              name: "数量",
              nameTextStyle: {
                color: "#63717b"
              },
              nameGap: 10,
              type: "value",
              max: function (value) {
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
                },
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#1091cf',
                  width: 1
                }
              },
              axisLabel: {
                color: '#63717b'
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#F0F0F0'
                }
              },
              splitArea: {
                show: true,
                areaStyle: {
                  color: ['rgb(255,255,255)', 'rgb(249,249,249)']
                }
              },
              min: 0,
              splitNumber: 5
            },
            series: [
              {
                name: "浏览数",
                smooth: true,
                type: "line",
                data: scan_access.reverse(),
                // areaStyle: {
                //   normal: {
                //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //       {
                //         offset: 0,
                //         color: "rgba(253, 223, 68,.4)"
                //       },
                //       {
                //         offset: 1,
                //         color: "rgba(253, 223, 68,.4)"
                //       }
                //     ])
                //   }
                // }
              },
              {
                name: "访客数",
                smooth: true,
                type: "line",
                data: scan_visitor.reverse()
              },
              {
                name: "分享数",
                smooth: true,
                type: "line",
                data: scan_share.reverse()
              }
            ]
          };
          self.dayEcharts.setOption(option);
        }
      });
    },
    //停留时间
    aggsAccessTime(data) {
      var self = this;
      api.request(
        "aggsAccessTime",
        { as_belong_module: self.manuscriptId, as_from: data },
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
                  },
                  show: false
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#F0F0F0'
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#1091cf',
                    width: 1
                  }
                },
                axisLabel: {
                  color: '#63717b',
                },
                nameGap: 10,
                data: xAxisData
              },
              yAxis: {
                name: "数量",
                // show: false,
                nameTextStyle: {
                  color: "#63717b"
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#F0F0F0'
                  }
                },
                splitArea: {
                  show: true,
                  areaStyle: {
                    color: ['rgb(255,255,255)', 'rgb(249,249,249)']
                  }
                },
                axisTick: {
                  interval: 0,
                  lineStyle: {
                    color: "#63717b"
                  },
                  show: false
                },
                axisLine: {
                  lineStyle: {
                    color: '#1091cf',
                    width: 1
                  }
                },
                axisLabel: {
                  color: '#63717b'
                },
                nameGap: 10,
                type: "value",
                max: function (value) {
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
    aggsGeo(data) {
      var self = this;
      api.request(
        "aggsGeo",
        { secret_key: localStorage.businessSecret, as_belong_id: self.businessId, as_belong_module: self.manuscriptId, as_from: data },
        result => {
          if (result.status == 0) {
            var areaData = [],
              totalNum = 0,
              maxData =
                !!result.data.group.length > 0
                  ? result.data.group[0].doc_count
                  : 5;
            for (let i = 0; i < result.data.group.length; i++) {
              var name = result.data.group[i].key
                .replace("省", "")
                .replace("市", "")
                .replace("自治区", "");
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
            // console.log("地区前十名", self.areaRanking)
            for (let j = 0; j < self.areaRanking.length; j++) {
              self.areaRanking[j].proportion =
                (self.areaRanking[j].value / totalNum) * 100 + "%";
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
                type: "continuous",
                min: 0,
                max: maxData,
                // right: 20,
                right: 255,
                // top: "top",
                top: 250,
                itemHeight: 166,
                itemWidth: 13,
                hoverLink: true,
                text: ["高", "低"], // 文本，默认为数值文本
                calculable: false,
                inRange: {
                  color: ["#ddfdfe", "#167ce0"]
                }
              },
              series: [
                {
                  name: "地域浏览",
                  type: "map",
                  mapType: "china",
                  zoom: 0.9,
                  top: -10,
                  left: 24,
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
                // {
                //   name: "地域浏览",
                //   type: "pie",
                //   radius: [0, "30%"],
                //   center: [120, 320],
                //   data: areaData
                // }
              ]
            };
            self.areaDtatistics.setOption(option);
          }
        }
      );
    },
    //商品行为统计
    aggsGoods(data) {
      var self = this;
      var option = {
        // tooltip: {
        //   trigger: 'item',
        //   formatter: function (params) {
        //     switch (params.name) {
        //       case '浏览数':
        //         params.value = self.viewManu
        //         return params.name +":"+ params.value+"次";
        //         break;
        //       case '跳转立即购买':
        //         params.value = self.viewGoods
        //         return params.name +":"+ params.value+"次";
        //         break;
        //       case '下单支付成功':
        //         params.value = self.buyGoods
        //         return params.name +":"+ params.value+"次";
        //         break;
        //     }
        //   }
        // },
        color: ['#2ec7c9','#b7a3df','#5ab1ef'],
        series: [
          {
            name: '漏斗图',
            type: 'funnel',
            left: 15,
            top: 1,
            bottom: 0,
            width: '90%',
            min: 0,
            max: 100,
            minSize: '0%',
            maxSize: '170%',
            sort: 'descending',
            gap: 2,
            silent:true,
            label: {
              show: true,
              position: 'inside',
              fontSize: 12             
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            },
            data: [
              { value: 64, name: '浏览数' },
              { value: 43, name: '跳转立即购买' },
              { value: 22, name: '支付成功' },
            ]
          }
        ]
      };
      self.goodsBehavior.setOption(option);
    },
    //超过4位数字转为1w，并保留两位小数
    convertJoinCount (num) {
      num = Number(num);
      if (isNaN(num)) {
        return 0;
      }
      var w = num / 10000;
      w = w.toFixed(2);
      if (w > 99) {
        w = 99;
      }
      if (w >= 1) {
        return w + 'w';
      }
      return num;
    }
  }
};
</script>

<style>
/* element组件自定义样式 */
/* .el-dialog__body{
      padding-bottom: 10px!important; 
  } */
/* 取消第一行表格的选中框 */
.table .has-gutter .el-checkbox {
  display: none;
}
/* 修改选择框样式 */
.el-checkbox__inner {
  width: 16px;
  height: 16px;
}
.el-checkbox__label {
  font-size: 14px !important;
  color: #63717b !important;
}
.el-table .cell {
  padding-left: 14px;
}
.el-table .el-table-column--selection {
  padding-right: 5px;
}
.el-checkbox__inner::after {
  left: 5px;
  top: 2px;
}
/* 修改蒙层样式 */
.el-dialog {
  margin-top: 23vh !important;
}
.el-dialog__title {
  font-family: "Microsoft YaHei";
  color: #3c4a55;
}
.el-dialog__footer {
  padding-top: 0px;
  padding-bottom: 30px;
}
.el-button {
  width: 100px;
  height: 35px;
  line-height: 0px;
}
.el-table .cell {
  padding-left: 14px;
}
.el-checkbox:not(:last-child) {
  display: block;
  margin-bottom: 20px;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
</style>
<style scoped>
.line{
  display: inline-block;
  width: 34px;
  height: 1px;
  position: relative;
  top: -4px;
}
.page-box {
  height: 100vh;
  max-height: 100vh;
  background: #ecf0fb;
  color: #63717b;
  font-size: 14px;
  margin: auto;
  padding: 10px 0;
  overflow-y: auto;
  -webkit-text-size-adjust :none; 
}
.page-box >>> .el-table__body-wrapper {
  overflow-x: hidden !important;
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
  /* height: 542px; */
  height: 528px;
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
  /* width: 886px; */
  background: #fff;
  padding-bottom: 30px;
}
.detail_main_box .det_content .dal_tit_txt {
  height: 156px;
  padding: 50px 60px 40px 60px;
  font-size: 12px;
  color: #9eabb8;
  margin-bottom: 10px;
}
.detail_main_box .det_content .dal_tit_txt div {
  float: left;
  width: 33%;
  height: 62px;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
}
.dal_tit_txt div p:nth-of-type(1) {
  color: #9eabb8;
  margin-top: 12px;
}
.dal_tit_txt div p:nth-of-type(2) {
  color: #63717b;
  padding: 0 30px;
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; */
}
/* .detail_main_box .det_content .pop_name {
  margin: 0 0 30px 0;
  font-size: 16px;
  color: #3c4a55;
  word-break: break-all;
} */
.detail_main_box .det_content .pop_time {
  /* margin-bottom: 15px; */
  border-left: 1px solid #f1f3fc;
  border-right: 1px solid #f1f3fc;
}
/* .detail_main_box .det_content .pop_introduce {
  line-height: 22px;
  word-break: break-all;
} */
.detail_main_box .det_content .comp-navigator {
  margin: 0 20px;
}
.detail_main_box .det_content .statisticsBlock {
  margin: 20px 0px 64px;
  overflow: hidden;
}
.detail_main_box .det_content .statisticsBlock .statisticsBlock-item {
  height: 85px;
  width: 276px;
  border-right: 1px solid #fff;
  color: #9eabb8;
  font-size: 12px;
  padding-left: 74px;
  text-align: center;
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
  /* background: #f7fbfc; */
  padding-top: 20px;
  margin-top: 20px;
  /* 暂时 */
  width: 424px;
  border: 1px solid #f1f3fc;
}
.detail_main_box .det_content .statisticsTitle {
  border-left: 4px solid #00bad0;
  line-height: 16px;
  padding: 0 10px;
  margin-left: 20px;
  /* padding: 0 20px; */
  height: 16px;
  margin-bottom: 20px;
}
.detail_main_box .det_content #dayDtatistics {
  width: 438px;
  /* margin-left: 18px; */
  /* width: 479px; */
  height: 330px;
}
.detail_main_box .det_content .source-switch {
  width: 920px;
  height: 40px;
  margin: 14px 0px 70px;
  border: 1px solid #edf2f5;
  background-color: #edf2f5;
  font-size: 12px;
  color: #63717b;
  text-align: right;
}
.det_content .source-switch .btn-source {
  width: 100px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  background: none;
}
.det_content .source-switch .btn-source:hover {
  background: #ffffff;
}
.det_content .source-switch .btn-source.activeSwitch {
  background: #ffffff;
}
.detail_main_box .det_content .btn-dayNum {
  width: 52px;
  background: none;
  font-size: 12px;
  border: 1px solid #f1f3fc;
}
.detail_main_box .det_content .btn-dayNum:hover {
  background: #00bad0;
  color: #fff;
}
.detail_main_box .det_content .btn-dayNum.active {
  background: #00bad0;
  color: #fff;
}
.detail_main_box .det_content #residenceTime {
  /* width: 479px; */
  width: 425px;
  height: 310px;
}
.detail_main_box .det_content .statisticsRight {
  overflow: hidden;
}
.detail_main_box .det_content .statisticsRight .mapCont {
  /* width: 366px; */
  width: 475px;
  border: 1px solid #f1f3fc;
  /* background: #f7fbfc; */
  padding-top: 20px;
  padding-bottom: 30px;
  margin-top: 20px;
}
.detail_main_box .det_content .areaScanAccess {
  /* margin-left: 34px; */
  overflow: hidden;
}
/* .det_content .areaScanAccess div:nth-of-type(2){
  margin-left: 34px;  
} */
.detail_main_box .det_content #areaDtatistics {
  width: 450px;
  height: 340px;
  font-size: 12px;
  margin-left: 26px;
}
.detail_main_box .det_content .areaRanking {
  line-height: 20px;
  height: 20px;
  float: left;
  margin: 16px 0 0 22px;
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
.detail_main_box .det_content .statisticsRight .funnelCont {
  width: 475px;
  height: 256px;
  border: 1px solid #f1f3fc;
  margin-top: 20px;
  padding-top: 20px;
  position: relative;
}
.detail_main_box .statisticsRight .funnelCont .viewManu{
  width: 86px;
  color: #2ec7c9;
  position: absolute;
  top: 76px;
  right: 5px;
}
.detail_main_box .statisticsRight .funnelCont .viewGoods{
  width: 100px;
  color: #b7a3df;  
  position: absolute;
  top: 132px;
  right: 51px;
}
.detail_main_box .statisticsRight .funnelCont .buyGoods{
  width: 100px;
  color: #5ab1ef; 
  position: absolute;
  top: 190px;
  right: 119px;
}
.detail_main_box .det_content #goodsBehavior {
  width: 396px;
  height: 171px;
  font-size: 10px;
  margin-left: 20px;
}
/* .detail_main_box .det_content .statisticsRight .goodsAttract{
  color: #b7a3df;
  border: 1px solid #f1f3fc;
  padding: 2px 3px;
  position: absolute;
  top: 153px;
  right: 20px;
  z-index: 10;
} */
.detail_main_box .det_content .statisticsRight .orderSuccess{
  color: #5ab1ef;
  border: 1px solid #f1f3fc;
  padding: 2px 5px;
  position: absolute;
  top: 212px;
  right: 76px;
  z-index: 10;
}
/* .detail_main_box .det_content .areaRanking .color-red {
  color: #dc4637;
} */
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
  padding: 0 20px;
  box-sizing: border-box;
}
.table-top {
  background: #ecf0fb;
  overflow: hidden;
  line-height: 50px;
  height: 50px;
  padding: 0 14px;
  /* margin-top: 18px; */
  position: relative;
}
.table-top .table-top-title {
  float: left;
  font: 400 14px/48px "Microsoft YaHei";
  line-height: 50px;
  margin: 0;
}
.table-top .table-top-title .selectAll-btn {
  font: 400 14px/48px "Microsoft YaHei";
}
.table-top .table-top-AssignmentBtn,
.table-top .table-top-RevokeBtn {
  background-color: #ecf0fb;
}
.table-top .table-top-AssignmentBtn {
  color: #2578c0;
  margin: 0 14px 0 15px;
}
.table-top .table-top-RevokeBtn {
  color: #dc4437;
}
.screen{
  position: absolute;
  top: 62px;
  right: 66px;
  z-index: 5;
}
/* 蒙层表单样式*/
.AssignmentMc-box {
  font: 500 18px "微软雅黑 Regular";
}
.AssignmentMc-box .AssignmentMc-from .el-form-item__label {
  font-weight: 200;
  color: red;
}
.AssignmentMc-box .AssignmentMc-form-text {
  margin-left: 15px;
}
.AssignmentMc-box .AssignmentMc-form-text .AssignmentMc-select {
  height: auto;
  max-height: 290px;
  padding: 15px 25px;
  background-color: #fafbff;
  border: 1px solid #daebfe;
  margin: 15px 0 18px 0;
  overflow-y: auto;
  /* box-shadow:inset 5px -56px 78px -52px rgba(0,0,0,.3); */
}
.AssignmentMc-form-text .AssignmentMc-select .selectName {
  color: #63717b;
  margin-left: -10px;
}
.AssignmentMc-form-text .AssignmentMc-select .selectName:not(:last-child) {
  margin-bottom: 20px;
}
.AssignmentMc-box .AssignmentMc-form-text .totalMoney {
  font-size: 14px;
  color: #fa766b;
}
/*滚动条整体宽度*/
.AssignmentMc-select::-webkit-scrollbar {
  width: 5px;
}
/*轨道*/
.AssignmentMc-select::-webkit-scrollbar-track {
  background-color: #fafbff;
}
/*滑块*/
.AssignmentMc-select::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: #c3c3c3;
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
