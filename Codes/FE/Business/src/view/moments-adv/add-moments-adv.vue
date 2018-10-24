<template>
<div>
    <div class="top">
        {{isAdd?"添加":"编辑"}}推广计划 <span v-if="!!data.reason" style="color:red;font-size:14px;">（审核失败原因：{{data.reason}}）</span>
    </div>
    <div class="contain paddingitem">
        <div class="progressbar">
          <el-steps :active="pageStep" align-center>
            <el-step title="添加推广目标"></el-step>
            <el-step title="添加广告用户群"></el-step>
            <el-step title="创意设置"></el-step>
            <el-step title="预览提交"></el-step>
          </el-steps>
        </div>
        <div class="content">
            <div class="page-one clearfix" v-show="pageStep==1">
                <div class="pull-left">
                    <div class="target module-item">
                        <div class="title">推广目标</div>
                        <div>选择广告推广目标，实现你的推广目的</div>
                        <div class="options clearfix">
                            <div class="option" v-for="item in configData.target" :key="item.id" @click="chooseTaget(item)" :class="{ active: item.active, 'pull-left': item.isEven, 'pull-right':!item.isEven}">
                                <i class="el-icon-circle-check" v-if="item.active"></i>
                               <img  :src="'/static/images/moments/'+item.logo"/>{{item.name}}
                            </div>
                        </div>
                    </div>
                    <div class="mode module-item">
                        <div class="title">购买方式</div>
                        <div>
                            <div v-for="item in configData.buyway" :key="item.id">
                                <el-radio  v-model="data.buyWayCode" :label="item.code">{{item.name}}</el-radio>
                                <div class="detail">{{item.detail}}</div>
                            </div> 
                        </div>
                    </div> 
               </div>
                <div class="diagram module-item pull-left">
                    <div class="title">广告位示意</div>
                    <div class="pic"><img src="../../assets/images/moments/diagram.jpg" alt=""></div>
                    <div>
                        <div class="title">朋友圈信息流</div>
                        <div>向浏览微信朋友圈的用户，精准展现你的广告</div>
                    </div>
                </div>
            </div>
            <div class="page-two clearfix" v-show="pageStep==2">
              <el-form ref="form-step2" label-width="140px" :rules="rules" :model="data">
                <div class="date module-item">
                    <div class="title">投放时间</div>
                    <div class="form-div">
                            <el-form-item label="投放时间：">
                                <el-radio v-model="data.timeType" label="0" >全天投放</el-radio>
                                <el-radio v-model="data.timeType" label="1" >自定义投放</el-radio>
                            </el-form-item>
                            <el-form-item label="投放日期：" prop="timeOnline">
                                 <div class="block">
                                   <el-date-picker
                                      format="yyyy/MM/dd"
                                      v-model="actTime"
                                      type="daterange"
                                      @change="chooseDate"
                                      :default-time="['00:00:00', '23:59:59']"
                                      range-separator="-"
                                      start-placeholder="开始日期"
                                      end-placeholder="结束日期"
                                      :picker-options=" { disabledDate(time) { return time.getTime() < Date.now() - 8.64e7; } }">
                                    </el-date-picker>
                                  </div>
                            </el-form-item>
                             <el-form-item label="每天投放时段：" prop="timeDayEnd">
                                <el-time-select
                                  placeholder="起始时间"
                                  v-model="data.timeDayBegin"
                                  :disabled="data.timeType==0"
                                  :picker-options="{
                                    start: '00:00',
                                    step: '01:00',
                                    end: '24:00',
                                  }">
                                </el-time-select>
                                -
                                <el-time-select
                                  placeholder="结束时间"
                                  v-model="data.timeDayEnd"
                                  :disabled="data.timeType==0"
                                  :picker-options="{
                                    start: '00:00',
                                    step: '01:00',
                                    end: '24:00',
                                    minTime: data.timeDayBegin
                                  }">
                                </el-time-select>
                                <i class="el-icon-question" title="每天至少投放6小时"></i>
                            </el-form-item>
                    </div>
                </div>
                <div class="custom module-item">
                    <div class="title">定向人群</div>
                    <div class="des">选择合适的用户人群投放广告</div>
                    <div class="form-div">
                            <el-form-item label="地域：">
                                <el-select v-model="data.cityCodes" placeholder="请选择">
                                  <el-option
                                    v-for="item in addressList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                                <div>请选择起投出价相同的城市。若投放不同价格的城市，请新增广告。<a @click="showPriceDialog">查询定价策略</a></div>
                            </el-form-item>
                            <el-form-item label="年龄：" prop="ageEnd">
                               <el-select v-model="data.ageBegin" placeholder="请选择">
                                  <el-option v-for="item in agesData" :key="item" :value="item">{{item}}</el-option>
                                </el-select>
                                -
                                <el-select v-model="data.ageEnd" placeholder="请选择">
                                  <el-option v-for="item in agesData" :key="item" :value="item">{{item}}</el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="性别：">
                                <el-radio v-model="data.sex" label="0" >全部</el-radio>
                                <el-radio v-model="data.sex" label="1" >男</el-radio>
                                <el-radio v-model="data.sex" label="2" >女</el-radio>
                            </el-form-item>
                             <el-form-item label="兴趣：">
                                <el-select v-model="data.interestCodes" placeholder="请选择">
                                  <el-option>
                                    <!-- <el-input ></el-input> -->
                                    <el-tree
                                      :data="interestList"
                                      show-checkbox
                                      node-key="id"
                                      :props="interestList">
                                    </el-tree>
                                  </el-option>
                                </el-select>
                            </el-form-item>
                    </div>
                     <el-dialog title="定价策略说明" :visible.sync="dialogOptionPrice.visible" width="825px" center :close-on-click-modal="false">
                       <div>灵活设置目标人群和广告投放时间，通过调整广告曝光单价和设计优质广告创意，与其他客户竞争广告展现机会，根据广告表现最大程度提升广告效果。</div>
                       <div><img src="../../assets/images/moments/price.jpg"/></div>
                       <div>备注说明</div>
                       <div>核心城市：包含北京和上海。</div>
                       <div>重点城市：包含广州、成都、深圳、杭州、武汉、苏州、重庆、南京、天津、西安、沈阳、长沙、青岛、宁波、郑州、大连、厦门、济南、哈尔滨、福州等 20 个高活跃城市。</div>
                       <div>其他城市：包含除以上22个城市之外的其他城市。</div>
                    </el-dialog>
                </div>
                <div class="pay module-item">
                    <div class="title">预算花费</div>
                    <div class="form-div">
                          <el-form-item label="每日预算：" prop="budget">
                                 <el-input v-model.number="data.budget"></el-input>
                                 <span>日预算范围1000-10000000元/天</span>
                            </el-form-item>
                            <el-form-item label="出价方式：">
                              <el-radio v-model="data.bidCode" :label="item.code"  v-for="item in configData.bid" :key="item.id">{{item.name}}</el-radio>
                            </el-form-item>
                           <el-form-item label="出价：" prop="bidPrice">
                                 <el-input v-model="data.bidPrice"></el-input>
                                 <span>出价范围{{priceRange[0]}}-{{priceRange[1]}}元/千次曝光</span>
                            </el-form-item>
          
                    </div>
                </div>
              </el-form>
            </div>
             <div class="page-three clearfix" v-show="pageStep==3">
                <el-form ref="form-step3" label-width="140px" :rules="rules" :model="data">
                <div class="setting module-item">
                    <div class="title">创意内容设置</div>
                    <div class="form-div">
                            <el-form-item label="样式：">
                                <el-radio v-model="data.styleCode" :label="item.code"  v-for="item in configData.style" :key="item.id">{{item.name}}</el-radio>
                            <div>
                              <img  src="../../assets/images/moments/style01.jpg" v-if="data.styleCode==configData.style[0].code" alt=""/>
                               <img  src="../../assets/images/moments/style02.jpg" v-if="data.styleCode==configData.style[1].code" alt=""/>
                            </div>
                            </el-form-item>
                            <el-form-item label="外层文案：" prop="outerContent">
                                <el-input
                                    type="textarea"
                                    v-model="data.outerContent"
                                    :rows="4">
                                </el-input>
                            </el-form-item>
                            <el-form-item label="外层素材跳转：" prop="relationId">
                                <el-button type="primary" size="small" @click="showManuscriptDialog()">选择原生推广页</el-button>
                                <span>{{previewData_relationName}}</span>
                            </el-form-item>
                             <el-form-item label="分享缩略图：" prop="shareImage">
                                <form>
                                 <comupload type="shareImage" class="upload-com" upfileId="upfileId1" size="10KB" uploadTip="jpg/jpeg/png <10KB" :imageUrl="data.shareImage" fileType="/\.(jpg|jpeg|png|JPG|PNG)$/" :cb="setShareImage"></comupload>
                                </form>
                            </el-form-item>
                            <el-form-item label="分享标题：" prop="shareTitle">
                                <el-input v-model="data.shareTitle"></el-input>
                            </el-form-item>
                            <el-form-item label="分享描述：" prop="shareDesc">
                                <el-input
                                    type="textarea"
                                    v-model="data.shareDesc"
                                    :rows="4">
                                </el-input>
                            </el-form-item>
                    </div>
                    <el-dialog title="选择活动推广素材" :visible.sync="dialogOptions.visible" width="600px" center :close-on-click-modal="false">
                        <div class="clearfix">
                         <el-table
                            ref="promotionTable"
                            :data="ManuscriptList"
                            tooltip-effect="dark"
                            style="width: 100%"
                            row-key="id"
                            class="table"
                            header-row-class-name="table-header"
                            header-cell-class-name="table-header">
                            <el-table-column
                            prop="name"
                            label="活动名称"
                            align="center"
                            class-name="number_color"
                            width="450">
                            </el-table-column>
                            <el-table-column
                            label="操作"
                            align="center"
                            width="100"
                            show-overflow-tooltip>
                            <template slot-scope="scope">
                                <i class="btn-plain" @click="chooseManuscript(scope.row)">选择</i>
                            </template>
                            </el-table-column>
                          </el-table>
                          <pagination  v-if="paginationOpt.pageCount > 1" class="pull-right" :paginationOpt="paginationOpt" @switchPage="pagesFn" />
                  </div>
                    </el-dialog>
                </div>
                </el-form>
            </div> 
           <div class="page-four clearfix" v-show="pageStep==4">
              <div class="preview module-item">
                <div class="title">预览提交</div>
                <div class="preview-text">
                  <div class="module-item">
                    <div class="title">投放计划</div>
                    <div class="text">
                      <el-row>
                        <el-col :span="6" class="col-title"><div>推广目标</div></el-col>
                        <el-col :span="18"><div>{{previewData_targetName}}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="col-title"><div>广告位</div></el-col>
                        <el-col :span="18"><div>{{previewData_advertName}}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="col-title"><div>购买方式</div></el-col>
                        <el-col :span="18"><div>{{previewData_buywayName}}</div></el-col>
                      </el-row>
                    </div>
                  </div>
                  <div class="module-item">
                    <div class="title">广告</div>
                     <div class="text">
                      <el-row>
                        <el-col :span="6" class="col-title"><div>定向人群</div></el-col>
                        <el-col :span="18">
                          <div><span>地域：</span>{{data.cityCodes}}<span>&nbsp;&nbsp;年龄：</span>{{data.ageBegin}}-{{data.ageEnd}}岁<span>&nbsp;&nbsp;性别：</span>{{previewData_sexName}}<span>&nbsp;&nbsp;兴趣：</span>{{data.interestCodes}}</div>
                          </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="col-title"><div>投放时间</div></el-col>
                        <el-col :span="18"><div>{{data.timeOnline.split(' ')[0]}} 至 {{data.timeOffline.split(' ')[0]}}&nbsp;&nbsp;{{data.timeDayBegin}} - {{data.timeDayEnd}}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="col-title"><div>预算花费</div></el-col>
                        <el-col :span="18"><div><span>出价：</span>{{data.bidPrice}}元/千次曝光<span>&nbsp;&nbsp;每日预算：</span>{{data.budget}}元</div></el-col>
                      </el-row>
                    </div>
                  </div>
                  <div class="module-item">
                    <div class="title">创意</div>
                     <div class="text">
                      <el-row>
                        <el-col :span="6" class="col-title"><div>外层样式</div></el-col>
                        <el-col :span="18"><div>{{previewData_style}}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="col-title"><div>外层素材跳转</div></el-col>
                        <el-col :span="18"><div>{{previewData_relationName}}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="col-title"><div>文字链跳转</div></el-col>
                        <el-col :span="18"><div>{{previewData_relationName}}</div></el-col>
                      </el-row>
                       <el-row>
                        <el-col :span="6" class="col-title"><div>外层文案</div></el-col>
                        <el-col :span="18"><div>{{data.outerContent}}</div></el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="6" class="col-title"><div>点击文案</div></el-col>
                        <el-col :span="18"><div>了解更多</div></el-col>
                      </el-row>
                    </div>
                  </div>
                  <div class="des">
                    <el-checkbox v-model="isCheckedDes">我方同意并确认遵守广告投放须知，确保广告真实、合法、有效，否则可能被监管机关处罚并面临被处广告3-5倍罚款等后果，并且我方须独立承担全部责任。</el-checkbox>
                  </div>
                </div>
                </div>
              </div> 
            <div class="btn-div">
                <el-button  type="primary" size="small" v-if="pageStep>1" @click="setPageStepPre()">上一步</el-button>
                <el-button  type="primary" size="small" v-if="pageStep!=4" @click="setPageStepNext()">下一步</el-button>
                <el-button  type="primary" size="small" v-if="pageStep==4" @click="addMomentsAdv()">提交</el-button>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import api from "api";
import pagination from "components/ui-pagination";
import comupload from "components/com-upload";
export default {
  components: {
    pagination,
    comupload
  },
  data() {
    var validateAge = (rule, value, callback) => {
      if (value < this.data.ageBegin) {
        callback(new Error("请选择正确的年龄区间！"));
      } else {
        callback();
      }
    };
    var validateBudget = (rule, value, callback) => {
      if (parseInt(value) < 1000 || parseInt(value) > 10000000) {
        callback(new Error("请输入范围1000-10000000元/天预算！"));
      } else {
        callback();
      }
    };
    var validatePrice = (rule, value, callback) => {
      if (
        parseInt(value) < this.priceRange[0] ||
        parseInt(value) > this.priceRange[1]
      ) {
        callback(
          new Error(
            "请输入范围" +
              this.priceRange[0] +
              "-" +
              this.priceRange[1] +
              "元出价！"
          )
        );
      } else {
        callback();
      }
    };
    var validateTime = (rule, value, callback) => {
      if (parseInt(value) - parseInt(this.data.timeDayBegin) < 6) {
        callback(new Error("每天至少投放6小时！"));
      } else {
        callback();
      }
    };
    return {
      configData: [], //表单配置数据
      agesData: [], //年龄范围
      data: {
        //推广提交数据
        mainId: "",
        targetCode: "", //推广目标编码
        advertCode: "", //广告位编码
        buyWayCode: "", //购买方式编码
        timeType: "0", //投放时间类型
        timeOnline: "", //投放上线时间
        timeOffline: "", //投放结束时间
        timeDayBegin: "00:00", //投放每天开始时间
        timeDayEnd: "24:00", //投放每天结束时间
        cityCodes: "1", //投放城市编码
        ageBegin: "14", //目标人群最小年龄
        ageEnd: "60", //目标人群最大年龄
        sex: "0", //目标人群性别 eg: 0 全部 1男 2女
        interestCodes: "10102", //目标人群兴趣
        budget: "", //预算
        bidCode: "", //出价方式
        bidPrice: "", //竞价
        styleCode: "", //内容样式编码
        outerContent: "", //外层内容
        shareImage: "", //分享缩略图
        shareTitle: "", //分享标题
        shareDesc: "", //分享描述
        relationId: "" ,//活动id
        reason:"",//审核失败原因
      },
      rules: {
        timeOnline: [
          { required: true, message: "请选择投放日期", trigger: "change" }
        ], //投放上线时间
        timeDayEnd: [{ validator: validateTime, trigger: "blur" }], //投放每天结束时间
        cityCodes: [
          { required: true, message: "请选择投放上线时间", trigger: "change" }
        ], //投放城市编码
        ageEnd: [{ validator: validateAge, trigger: "blur" }], //目标人群最大年龄
        interestCodes: [
          { required: true, message: "请选择投放上线时间", trigger: "change" }
        ], //目标人群兴趣
        budget: [
          { required: true, message: "请输入每日预算", trigger: "blur" },
          { type: "number", message: "每日预算为数值", trigger: "blur" },
          { validator: validateBudget, trigger: "blur" }
        ], //预算
        bidPrice: [
          { required: true, message: "请输入出价", trigger: "blur" },
          { validator: validatePrice, trigger: "blur" }
        ], //竞价
        outerContent: [
          { required: true, message: "请输入外层文案", trigger: "blur" },
          {
            min: 1,
            max: 40,
            message: "请输入1-40字符外层文案",
            trigger: "blur"
          }
        ], //外层内容
        shareImage: [
          { required: true, message: "请选择分享缩略图", trigger: "change" }
        ], //分享缩略图
        shareTitle: [
          { required: true, message: "请输入分享标题", trigger: "blur" },
          {
            min: 1,
            max: 14,
            message: "请输入1-14字符分享标题",
            trigger: "blur"
          }
        ], //分享标题
        shareDesc: [
          { required: true, message: "请输入分享描述", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "请输入1-20字符分享描述",
            trigger: "blur"
          }
        ], //分享描述
        relationId: [
          { required: true, message: "请选择原生推广页", trigger: "change" }
        ] //活动id
      },
      paginationOpt: {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 1,
        pageCount: 0
      },
      ManuscriptList: [], //活动推广列表
      addressList: [
        // 城市列表
        { label: "核心城市", value: "1" },
        { label: "重点城市", value: "2" },
        { label: "其它城市", value: "3" }
      ],
      interestList: [], // 兴趣列表
      dialogOptions: {
        //活动推广弹框
        visible: false
      },
      dialogOptionPrice: {
        //定价说明弹框
        visible: false
      },
      isAdd: true, //是否为新增推广，false为编辑推广
      isCheckedDes: false, //预览页是否同意条款
      pageStep: 1, //步骤页数
      actTime: [] //时间选择器数组
    };
  },
  created() {
    this.getMomentsAdvConfigList();
  },
  mounted() {
    if (!!this.$route.query.id) {
      //编辑
      this.isAdd = false;
      this.data.mainId = this.$route.query.id;
      this.actTime = [this.data.timeOnline, this.data.timeOffline];
      this.getMomentsAdvInfo();
    }
    this.getManuscriptList();
    this.getInterestList();
  },
  computed: {
    previewData_sexName: function() {
      switch (this.data.sex) {
        case "0":
          return "全部";
          break;
        case "1":
          return "男";
          break;
        case "2":
          return "女";
          break;
      }
    },
    previewData_style: function() {
      return this.configData.style.find(
        item => item.code == this.data.styleCode
      ).name;
    },
    previewData_relationName: function() {
      if (this.ManuscriptList.length > 0) {
        let _item = this.ManuscriptList.find(
          item => item.id == this.data.relationId
        );
        // debugger
        return !!_item ? _item.name : "";
      } else {
        return "";
      }
    },
    previewData_targetName: function() {
      return this.configData.target.find(
        item => item.code == this.data.targetCode
      ).name;
    },
    previewData_advertName: function() {
      return this.configData.advert.find(
        item => item.code == this.data.advertCode
      ).name;
    },
    previewData_buywayName: function() {
      return this.configData.buyway.find(
        item => item.code == this.data.buyWayCode
      ).name;
    },
    priceRange: function() {
      //出价范围
      switch (this.data.cityCodes) {
        case "1":
          return [100, 300];
          break;
        case "2":
          return [60, 200];
          break;
        case "3":
          return [30, 200];
          break;
      }
    }
  },
  methods: {
    //获取选项配置数据
    getMomentsAdvConfigList() {
      let _this = this;
      api.request("getMomentsAdvConfigList", {}, result => {
        if (result.status == 0) {
          _this.configData = result.data;
          $.each(_this.configData.target, (index, item) => {
            if (index % 2 == 0) item.isEven = true;
            if (!_this.data.targetCode && index == 0) {
              item.active = true;
            } else if (_this.data.targetCode == item.code) {
              item.active = true;
            }
          });

          _this.data.targetCode = _this.configData.target[0].code;
          _this.data.advertCode = _this.configData.advert[0].code;
          _this.data.buyWayCode = _this.configData.buyway[0].code;
          _this.data.bidCode = _this.configData.bid[0].code;
          _this.data.styleCode = _this.configData.style[0].code;
        } else {
          _this.myMessage.error(result.message);
        }
      });
      //设置年龄范围
      let _agesData = [];
      for (let i = 14; i <= 60; i++) {
        _agesData.push(i);
      }
      _this.agesData = _agesData;
    },
    //获取详情
    getMomentsAdvInfo() {
      let _this = this;
      api.request(
        "getMomentsAdvInfo",
        { id: _this.$route.query.id },
        result => {
          if (result.status == 0) {
            _this.data = result.data;
            if (!!_this.configData.target) {
              $.each(_this.configData.target, (index, item) => {
                if (_this.data.targetCode == item.code) {
                  item.active = true;
                } else {
                  item.active = false;
                }
              });
            }
          } else {
            _this.myMessage.error(result.message);
          }
        }
      );
    },
    //获取活动推广素材
    getManuscriptList(cb) {
      let _this = this,
        _option = {
          pageIndex: _this.paginationOpt.pageIndex,
          pageSize: _this.paginationOpt.pageSize,
          businessId: localStorage.businessId
        };
      api.request("getManuscriptListOfRelease", _option, result => {
        if (result.status == 0) {
          _this.ManuscriptList = result.data.list;
          _this.paginationOpt.totalCount = result.data.total;
          _this.paginationOpt.pageCount = Math.ceil(
            _this.paginationOpt.totalCount / _this.paginationOpt.pageSize
          );
        } else {
          _this.myMessage.error(result.message);
        }
        !!cb && cb();
      });
    },
    //分页调用方法
    pagesFn(pageIndex, cb) {
      let _this = this;
      _this.pagination = pageIndex;
      _this.getManuscriptList(cb);
    },
    //获取兴趣
    getInterestList(cb) {
      let _this = this;
      api.request("getInterestList", {}, result => {
        if (result.status == 0) {
          _this.interestList = result.data;
          // Demo
          // _this.interestList = [{ label: "语言启蒙", value: "10102" }];
        } else {
          Kdo.utils.messenger.error(result.message);
        }
        !!cb && cb();
      });
    },
    //点击选择推广目标
    chooseTaget(item) {
      this.data.targetCode = item.code;
      $.each(this.configData.target, (index, itemData) => {
        this.configData.target[index].active =
          itemData.code != item.code ? false : true;
      });
    },
    //点击选择活动推广
    chooseManuscript(item) {
      this.data.relationId = item.id;
      this.dialogOptions.visible = false;
    },
    //弹出活动推广列表弹框
    showManuscriptDialog() {
      this.dialogOptions.visible = true;
    },
    //弹出定价说明弹框
    showPriceDialog() {
      this.dialogOptionPrice.visible = true;
    },
    //保存
    addMomentsAdv() {
      if (!this.isCheckedDes) {
        this.$message.error("请确认广告投放协议！");
        return false;
      }
      api.request("editMomentsAdv", this.data, result => {
        if (result.status == 0) {
          location.href =
            (location.origin || location.protocol + "//" + location.host) +
            "/#/moments-adv?selectKey=advPromotionManagement";
        } else {
          _this.myMessage.error(result.message);
        }
      });
    },
    //验证
    validateData(cb) {
      this.$refs["form-step" + this.pageStep].validate(valid => {
        // debugger;
        if (valid) {
          cb();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //步骤页数跳转
    setPageStepNext() {
      if (this.pageStep == 2 || this.pageStep == 3) {
        this.validateData(() => this.pageStep++);
      } else {
        this.pageStep++;
      }
    },
    setPageStepPre() {
      this.pageStep--;
    },
    //设置分享缩略图
    setShareImage(data) {
      this.data.shareImage = data.shareImage;
    },
    //选择时间
    chooseDate() {
      let _this = this;
      this.data.timeOnline = !!_this.actTime
        ? window.timeFormdate(_this.actTime[0])
        : "";
      this.data.timeOffline = !!_this.actTime
        ? window.timeFormdate(_this.actTime[1])
        : "";
    }
  }
};
</script>

<style scoped>
.top {
  height: 60px;
  line-height: 60px;
  color: #555;
  font-size: 16px;
  padding-left: 30px;
  border-bottom: 2px solid #ebf0fa;
}

.contain {
  padding: 30px;
}
.contain .progressbar {
  margin-bottom: 30px;
}
.contain .progressbar .el-steps .el-step{
  width: 25%;
}

.contain .module-item {
  padding: 30px;
  border: 1px solid #ebf0fa;
}
.contain .module-item .title {
  font-size: 14px;
  margin-bottom: 15px;
}

.contain .content .target {
  width: 700px;
}
.contain .content .target .options {
  position: relative;
}
.contain .content .target .options .option {
  width: 310px;
  height: 120px;
  line-height: 120px;
  margin-top: 30px;
  font-size: 14px;
  text-align: center;
  position: relative;
  border: 1px solid #ebf0fa;
}
.contain .content .target .options .option.active {
  border: 2px solid #00bad0;
}
.contain .content .target .options .option i {
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  color: #00bad0;
}
.contain .content .target .options .option img {
margin-right: 20px;
}

.contain .content .mode {
  width: 700px;
  height: 230px;
  margin-top: 20px;
}

.contain .content .detail {
  padding-left: 24px;
}

.contain .content .form-div {
  width: 600px;
}
.contain .content .el-date-editor--time-select {
  width: 150px;
}
.contain .content .diagram {
  width: calc(100% - 720px);
  margin-left: 20px;
}
.contain .content .diagram .pic {
  text-align: center;
  margin-bottom: 40px;
}

.contain .content .custom {
  position: relative;
}
.contain .content .custom .des {
  position: absolute;
  top: 32px;
  left: 100px;
}

.contain .content .custom,
.contain .content .pay {
  margin-top: 20px;
}

.contain .content .setting .form-div .el-button--primary {
  font-size: 14px;
  color: #00bad0 !important;
  background-color: #fff !important;
  border-color: #00bad0 !important;
}

 .upload-com /deep/ .el-upload__tip{
  padding: 0 !important;
  padding-left: 10px !important;
}

.contain .content .preview .preview-text {
  padding-left: 165px;
}
.contain .content .preview .preview-text .module-item {
  width: 800px;
  margin-top: 15px;
}
.contain .content .preview .preview-text .text {
  font-size: 14px;
}
.contain .content .preview .preview-text .text .el-row {
  height: 36px;
  line-height: 36px;
}
.contain .content .preview .preview-text .text .el-row .col-title {
  text-align: right;
  padding-right: 20px;
}
.contain .content .preview .preview-text .text .el-row span {
  color: #65737e;
}
.contain .content .preview .preview-text .des {
  margin-top: 15px;
}

.contain .content .btn-div {
  text-align: center;
  margin-top: 30px;
}


</style>

