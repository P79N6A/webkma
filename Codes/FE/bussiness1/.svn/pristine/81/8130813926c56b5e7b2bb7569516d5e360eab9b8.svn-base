<template>
  <div class="custom-form-setting">
    <div style="height: calc(100vh - 500px);overflow-x: hidden;" class="scroll-box">
      <div style="position:relative;">
        <span>新增字段</span>
        <span
          style="position:absolute;left:64px;top:14px;display:block;width:304px;height:1px;border-bottom:1px solid #ccc;"
        ></span>
      </div>
      <div class="form-type-section">
        <span
          class="type-item"
          v-for="(item, index) in formType"
          :key="index"
          @click="addSettingData(item)"
        >
          <i class="icon" :class="item.icon"></i>
          {{item.title.text}}
        </span>
      </div>
      <div style="position:relative;margin-bottom:20px;">
        <span>样式及规则</span>
        <span
          style="position:absolute;left:75px;top:14px;display:block;width:290px;height:1px;border-bottom:1px solid #ccc;"
        ></span>
      </div>
      <div class="setting-data-wrap" style="overflow:hidden;">
        <div
          class="setting-item-wrap"
          v-for="(item, index) in settingData"
          :key="item.dataKey"
          :data-key="item.dataKey"
          v-if="!!item.category"
        >
          <div class="setting-item-title fz14">
            <span class="pull-left acs-drag" style="display:block;width:235px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.title.text}}</span>
            <span class="pull-right">
              <span @click="itemSpread(index)" style="cursor:pointer;">
                <span class="pull-left black-light">{{item.categoryText}}</span>
                <i
                  class="pull-left icon black-light iconfont"
                  :class="item.spread ? 'icon-zhankai1':'icon-arrow-right-copy'"
                ></i>
              </span>
              <i
                class="pull-left icon black-light iconfont icon-delete"
                @click="deleteSettingData(index)"
              ></i>
            </span>
          </div>
          <div class="setting-item-body" v-show="item.spread">
            <div class="form-row">
              <span class="pull-left">标题</span>
              <span class="pull-right" style="margin-right:10px;">
                <i
                  class="icon pull-left iconfont"
                  style="margin-right:0;"
                  :class="!!item.title.hide ? 'icon-radio-checkded':'icon-radio'"
                  @click="item.title.hide = !item.title.hide;"
                ></i>
                不显示当前标题
              </span>
            </div>
            <div class="form-row input-row">
              <input
                class="form-control"
                type="text"
                style="width:326px;padding-right:30px;"
                v-if="item.title.canModify"
                v-model="item.title.text"
                maxlength="100"
              >
              <input
                class="form-control"
                type="text"
                style="width:326px;padding-right:30px;"
                v-model="item.title.text"
                readonly
                v-else
              >
              <i
                class="iconfont icon-wrong"
                v-if="item.title.canModify && !!item.title.text"
                @click="item.title.text = ''"
              ></i>
            </div>
            <div v-if="item.placeholder !== undefined">
              <div class="form-row">编辑提示语</div>
              <div class="form-row input-row">
                <input
                  class="form-control black-light"
                  :class="[!!item.focus ? 'focus' : 'unfocus']"
                  type="text"
                  style="width:326px;"
                  maxlength="200"
                  v-model="item.placeholder"
                  @focus="showInputTip(item)"
                  @blur="hideInputTip(item)"
                >
                <span v-show="item.focus == false" class="black-light" style="position:absolute;right:16px;top:0px;"> {{item.placeholder.length}}/200</span>
                <i
                  class="iconfont icon-wrong"
                  v-show="!!item.placeholder && item.focus"
                  @click="item.placeholder = '';"
                ></i>
              </div>
            </div>
            <!-- 选项编辑start -->
            <div
              style="height:auto;"
              v-if="item.category == 'radio-option' || item.category == 'checkbox-option' || item.category == 'image-radio-option' || item.category == 'image-checkbox-option' || item.category == 'select'"
            >
              <div class="form-row">选项编辑</div>
              <div class="section_sortable" :index="index">
                <div
                  class="form-row"
                  v-for="(optionItem, index) in item.option"
                  :data-key="optionItem.dataKey"
                  :key="optionItem.dataKey"
                  v-if="item.category != 'image-radio-option' && item.category != 'image-checkbox-option'"
                >
                  <input
                    class="form-control pull-left"
                    type="text"
                    style="width:246px;margin:2px 0px 0 0;"
                    placeholder="选项名称"
                    v-model="optionItem.value"
                  >
                  <div
                    class="form-group text-center pull-left"
                    style="width:22px;height:30px;margin:2px 0 0 5px; cursor:pointer;"
                    @click="addOption(item.option, item.category, index)"
                  >
                    <i class="iconfont icon-add" style="font-size:16px;color:#cedbeb;"></i>
                  </div>
                  <div
                    class="form-group text-center pull-left"
                    style="width:22px;height:30px;margin:2px 0 0 5px; cursor:pointer;"
                    @click="deleteOption(item.option, index)"
                    v-if="item.option.length > 1"
                  >
                    <i class="iconfont icon-delete" style="font-size:16px;color:#cedbeb;"></i>
                  </div>
                  <div
                    class="form-group text-center pull-left act-drag"
                    style="width:22px;height:30px;margin:2px 0 0 5px; cursor:pointer;"
                    v-if="item.option.length > 1"
                  >
                    <i class="iconfont icon-move" style="font-size:16px;color:#cedbeb;"></i>
                  </div>
                </div>
                <div
                  class="form-row"
                  v-for="(optionItem, index) in item.option"
                  :data-key="optionItem.dataKey"
                  :key="optionItem.dataKey"
                  v-if="item.category == 'image-radio-option' || item.category == 'image-checkbox-option'"
                >
                  <div
                    class="form-group text-center pull-left"
                    style="position:relative; width:30px; height: 30px;background-color:#fff;top:2px;"
                  >
                    <img
                      class="icon-image-option"
                      style="position:absolute;width:30px; height:30px;vertical-align: inherit;z-index:0;top:0;left:0;"
                      :src="optionItem.src"
                      v-if="!!optionItem.src"
                    >
                    <i
                      class="iconfont icon-image icon-image-option"
                      style="font-size:22px;color:#c9d0d8;"
                      v-if="!optionItem.src"
                    ></i>
                    <p
                      style="position:absolute;width:30px;height:30px;line-height:30px;background-color:rgba(0,0,0,.3);text-align:center;color:#fff;font-size:12px;z-index:1"
                      v-if="!!optionItem.src"
                    >更换</p>
                    <form
                      class="imgUploadForm"
                      enctype="multipart/form-data"
                      style="width: 30px; overflow:hidden;"
                    >
                      <input
                        type="file"
                        class="imgUpload"
                        name="img"
                        @change="uploadImg($event, optionItem, 'src')"
                      >
                    </form>
                  </div>
                  <input
                    class="form-control pull-left"
                    type="text"
                    style="width:206px;margin:2px 0px 0 10px;"
                    placeholder="选项名称"
                    v-model="optionItem.value"
                  >
                  <div
                    class="form-group text-center pull-left"
                    style="width:22px;height:30px;margin:2px 0 0 5px; cursor:pointer;"
                    @click="addOption(item.option, item.category, index)"
                  >
                    <i class="iconfont icon-add" style="font-size:16px;color:#cedbeb;"></i>
                  </div>
                  <div
                    class="form-group text-center pull-left"
                    style="width:22px;height:30px;margin:2px 0 0 5px; cursor:pointer;"
                    @click="deleteOption(item.option, index)"
                    v-if="item.option.length > 1"
                  >
                    <i class="iconfont icon-delete" style="font-size:16px;color:#cedbeb;"></i>
                  </div>
                  <div
                    class="form-group text-center pull-left act-drag"
                    style="width:22px;height:30px;margin:2px 0 0 5px; cursor:pointer;"
                    v-if="item.option.length > 1"
                  >
                    <i class="iconfont icon-move" style="font-size:16px;color:#cedbeb;"></i>
                  </div>
                </div>
              </div>
            </div>
            <!-- 选项编辑end -->
            <!-- 排列方式start -->
            <div v-if="item.arrangement !== undefined" style="height:auto;">
              <div class="form-row">排列方式</div>
              <div class="form-row" v-if="!!item.arrangement.type">
                <div class="form-group pull-left" style="margin-right:20px;">
                  <i
                    class="icon pull-left iconfont"
                    :class="item.arrangement.type == 'v' ? 'icon-radio-checkded':'icon-radio'"
                    @click="item.arrangement.type = 'v';"
                    style="margin-right:0;"
                  ></i>
                  <span class="pull-left">纵向</span>
                </div>
                <div class="form-group pull-left">
                  <i
                    class="icon pull-left iconfont"
                    :class="item.arrangement.type == 'h' ? 'icon-radio-checkded':'icon-radio'"
                    @click="item.arrangement.type = 'h';"
                    style="margin-right:0;"
                  ></i>
                  <span class="pull-left">横向</span>
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="form-row" v-if="!!item.arrangement.singleNum">
                <div class="form-group pull-left" style="margin-right:15px;">
                  <i
                    class="icon pull-left iconfont"
                    :class="item.arrangement.singleNum == '1' ? 'icon-radio-checkded':'icon-radio'"
                    @click="item.arrangement.singleNum = '1';"
                    style="margin-right:0;"
                  ></i>
                  <span class="pull-left">每行1项</span>
                </div>
                <div class="form-group pull-left" style="margin-right:15px;">
                  <i
                    class="icon pull-left iconfont"
                    :class="item.arrangement.singleNum == '2' ? 'icon-radio-checkded':'icon-radio'"
                    @click="item.arrangement.singleNum = '2';"
                    style="margin-right:0;"
                  ></i>
                  <span class="pull-left">每行2项</span>
                </div>
                <div class="form-group pull-left" style="margin-right:15px;">
                  <i
                    class="icon pull-left iconfont"
                    :class="item.arrangement.singleNum == '3' ? 'icon-radio-checkded':'icon-radio'"
                    @click="item.arrangement.singleNum = '3';"
                    style="margin-right:0;"
                  ></i>
                  <span class="pull-left">每行3项</span>
                </div>
                <div class="form-group pull-left">
                  <i
                    class="icon pull-left iconfont"
                    :class="item.arrangement.singleNum == '4' ? 'icon-radio-checkded':'icon-radio'"
                    @click="item.arrangement.singleNum = '4';"
                    style="margin-right:0;"
                  ></i>
                  <span class="pull-left">每行4项</span>
                </div>
                <div class="clearfix"></div>
              </div>
            </div>
            <!-- 排列方式endstart -->
            <div
              v-if="!!item.minLength || !!item.maxLength || !!item.province || item.minNum !== undefined || item.category == 'date' || item.checkFormat !== undefined"
            >
              <div class="form-row">校验</div>
              <!-- 长度校验start -->
              <div class="form-row input-row" v-if="!!item.minLength">
                <div class="form-group pull-left">
                  <i
                    class="icon pull-left iconfont"
                    :class="!!item.minLength.need ? 'icon-checkbox-checked':'icon-checkbox'"
                    @click="item.minLength.need = !item.minLength.need;"
                  ></i>
                  <span class="pull-left">最少填</span>
                  <input
                    class="form-control pull-left"
                    type="text"
                    style="width: 60px;margin:0px 5px;"
                    v-model="item.minLength.value"
                  >
                  <span>字</span>
                </div>
                <div class="form-group pull-left" v-if="!!item.maxLength" style="margin-left:40px;">
                  <i
                    class="icon pull-left iconfont"
                    :class="!!item.maxLength.need ? 'icon-checkbox-checked':'icon-checkbox'"
                    @click="item.maxLength.need = !item.maxLength.need;"
                  ></i>
                  <span class="pull-left">最多填</span>
                  <input
                    class="form-control pull-left"
                    type="text"
                    style="width: 60px;margin:0px 5px;"
                    v-model="item.maxLength.value"
                  >
                  <span>字</span>
                </div>
              </div>
              <!-- 长度校验end -->
              <!-- 地址选择start -->
              <div class="form-row" v-if="!!item.province">
                <i
                  class="icon pull-left iconfont"
                  :class="!!item.province.need ? 'icon-radio-checkded':'icon-radio'"
                  @click="addresschoose(item, 'province')"
                ></i>
                <select
                  class="form-control pull-left"
                  style="width:299px;border:1px solid #ccc;margin: 2px 0 0 0px;"
                >
                  <option value>省/自治区/直辖市</option>
                </select>
              </div>
              <div class="form-row" v-if="!!item.city">
                <i
                  class="icon pull-left iconfont"
                  :class="!!item.city.need ? 'icon-radio-checkded':'icon-radio'"
                  @click="addresschoose(item, 'city')"
                ></i>
                <select
                  class="form-control pull-left"
                  style="width:299px;border:1px solid #ccc;margin: 2px 0 0 0px;"
                >
                  <option value>市</option>
                </select>
              </div>
              <div class="form-row" v-if="!!item.district">
                <i
                  class="icon pull-left iconfont"
                  :class="!!item.district.need ? 'icon-radio-checkded':'icon-radio'"
                  @click="addresschoose(item, 'district')"
                ></i>
                <select
                  class="form-control pull-left"
                  style="width:299px;border:1px solid #ccc;margin: 2px 0 0 0px;"
                >
                  <option value>区/县</option>
                </select>
              </div>
              <div class="form-row" v-if="!!item.detailAdress">
                <i
                  class="icon pull-left iconfont"
                  :class="!!item.detailAdress.need ? 'icon-radio-checkded':'icon-radio'"
                  @click="item.detailAdress.need = !item.detailAdress.need;"
                ></i>
                <span class="pull-left">详细地址</span>
              </div>
              <!-- 地址选择end -->
              <div class="form-row" v-if="item.checkFormat !== undefined">
                <i
                  class="icon pull-left iconfont"
                  :class="!!item.checkFormat ? 'icon-radio-checkded':'icon-radio'"
                  @click="item.checkFormat = !item.checkFormat;"
                  style="margin:8px 0 0 0;"
                ></i>
                <span class="pull-left">检查{{item.categoryText}}格式</span>
              </div>
              <!-- 数字start -->
              <!-- 日期start -->
              <div class="form-row" v-if="item.category == 'date'">
                <i
                  class="icon pull-left iconfont"
                  :class="!!item.startTime.need ? 'icon-radio-checkded':'icon-radio'"
                  @click="item.startTime.need = !item.startTime.need;"
                ></i>
                <span class="pull-left">设置日期</span>
                <div class="form-group pull-left" style="width: 236px;margin-left:8px;">
                  <el-date-picker
                    format="yyyy/MM/dd"
                    size="small"
                    type="daterange"
                    v-model="item.dateArr"
                    @change="chooseDate(item)"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="起始日期(含)"
                    end-placeholder="结束日期(含)"
                  ></el-date-picker>
                </div>
              </div>
              <!-- 日期end -->
              <!-- 长度校验start -->
              <div class="form-row input-row" v-if="item.category == 'upload'">
                <div class="form-group pull-left">
                  <i
                    class="icon pull-left iconfont"
                    :class="!!item.minNum.need ? 'icon-checkbox-checked':'icon-checkbox'"
                    @click="item.minNum.need = !item.minNum.need;"
                  ></i>
                  <span class="pull-left">最少上传</span>
                  <input
                    class="form-control pull-left"
                    type="text"
                    style="width: 47px;margin:0px 5px;"
                    v-model="item.minNum.value"
                  >
                  <span>张</span>
                </div>
                <div class="form-group pull-left" style="margin-left:26px;">
                  <i
                    class="icon pull-left iconfont"
                    :class="!!item.maxNum.need ? 'icon-checkbox-checked':'icon-checkbox'"
                    @click="item.maxNum.need = !item.maxNum.need;"
                  ></i>
                  <span class="pull-left">最多上传</span>
                  <input
                    class="form-control pull-left"
                    type="text"
                    style="width: 47px;margin:0px 5px;"
                    v-model="item.maxNum.value"
                  >
                  <span>张</span>
                </div>
              </div>
              <div
                class="form-row input-row"
                v-if="item.category == 'checkbox-option' || item.category == 'image-checkbox-option'"
              >
                <div class="form-group pull-left">
                  <i
                    class="icon pull-left iconfont"
                    :class="!!item.minNum.need ? 'icon-checkbox-checked':'icon-checkbox'"
                    @click="item.minNum.need = !item.minNum.need;"
                  ></i>
                  <span class="pull-left">最少选</span>
                  <input
                    class="form-control pull-left"
                    type="text"
                    style="width: 47px;margin:0px 5px;"
                    v-model="item.minNum.value"
                  >
                  <span>个选项</span>
                </div>
                <div class="form-group pull-left" style="margin-left:26px;">
                  <i
                    class="icon pull-left iconfont"
                    :class="!!item.maxNum.need ? 'icon-checkbox-checked':'icon-checkbox'"
                    @click="item.maxNum.need = !item.maxNum.need;"
                  ></i>
                  <span class="pull-left">最多选</span>
                  <input
                    class="form-control pull-left"
                    type="text"
                    style="width: 47px;margin:0px 5px;"
                    v-model="item.maxNum.value"
                  >
                  <span>个选项</span>
                </div>
              </div>
            </div>
            <div class="form-row form-row-tail">
              <span class="pull-left" v-if="item.require !== undefined">
                <i
                  class="icon pull-left iconfont"
                  :class="!!item.require ? 'icon-radio-checkded':'icon-radio'"
                  @click="item.require = !item.require;"
                ></i>
                必填
              </span>
              <span class="pull-right" style="display:block;width:auto;">
                <span class="pull-left" @click="itemSpread(index-1)">
                  <i class="icon pull-left iconfont icon-form-spread-true"></i>
                  前一项
                </span>
                <span class="pull-left" style="margin:0 24px 0 10px;" @click="itemSpread(index+1)">
                  <i class="icon pull-left iconfont icon-form-spread-false"></i>
                  后一项
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div style="height:auto; overflow:hidden;margin-left:266px;margin-top:5px;">
        <div style="display:inline-block;">
          <el-switch
            style="display: block"
            v-model="smsFeedback"
            active-color="#00bad0"
            inactive-color="#bdbdbd"
          ></el-switch>
        </div>
        <span>短信反馈</span>
      </div>
      <!-- 短信反馈 -->
      <div class="option-block" style="margin-top:10px;" v-if="!!smsFeedback">
        <div
          class="section-row"
          style="overflow:hidden;margin-bottom:10px;"
          v-for="(single, index) in feedBackformList"
          :key="'Feedbackform'+index"
        >
          <input
            class="form-control pull-left"
            type="text"
            style="width:334px;"
            placeholder="联系电话"
            v-model="single.value"
          >
          <div
            class="form-group text-center pull-left"
            style="width:25px; height: 30px; padding-top:2px; margin-left:5px; cursor:pointer;"
            @click="feedbackformRemove(index)"
          >
            <i
              class="iconfont icon-delete-second btn-del-option"
              style="font-size:16px;color:#cedbeb;"
            ></i>
          </div>
        </div>
        <div v-if="feedBackformList.length < 10">
          <button
            type="button"
            class="btn btn-xs btn-setting white"
            style="width: 70px; height: 30px;"
            @click="feedbackformAdd"
          >
            <i class="iconfont icon-plus" style="font-size:14px;"></i>
          </button>
        </div>
      </div>
      <!-- 颜色皮肤 -->
      <div style="position:relative;margin-top:20px;">
        <span>提交按钮</span>
        <span
          style="position:absolute;left:64px;top:14px;display:block;width:304px;height:1px;border-bottom:1px solid #ccc;"
        ></span>
      </div>
      <div class="clearfix"></div>
      <div class="form-row" style="line-height:29px;">
        <span class="pull-left title">按钮文字</span>
        <div class="pull-left form-input">
          <input
            class="form-control"
            type="text"
            maxlength="8"
            v-model="data.submit.text"
            style="width:138px;"
          >
        </div>

        <div class="pull-right" style="font-size:12px;margin-right:16px;">
          <i class="pull-left iconfont icon-font-family" style="width:20px;" title="字体颜色"></i>
          <div class="pull-left chooseColor" title="字体颜色">
            <input
              name="fontColor"
              class="fontColor chooseColor"
              v-model="data.fontColor"
              @blur="txtChangeColor('fontColor')"
            >
          </div>
          <i
            class="pull-left iconfont icon-font-background-color"
            style="width:20px; margin-left: 20px;"
            title="字体背景色"
          ></i>
          <div class="pull-left chooseColor" title="字体背景色">
            <input
              class="backColor chooseColor"
              name="backColor"
              v-model="data.backColor"
              @blur="txtChangeColor('backColor')"
            >
          </div>
        </div>
      </div>
      <div class="clearfix" style="margin-bottom: 10px;"></div>
      <div class="form-row">
        <span class="pull-left title">提交反馈</span>
        <div class="pull-left form-input">
          <input
            class="form-control"
            type="text"
            maxlength="20"
            v-model="data.submit.feedback"
            style="width:138px;"
          >
        </div>
      </div>
    </div>
    <button class="btn btn-submit blue_bg white" @click="btnSubmit()">提 交</button>
  </div>
</template>

<script>
import api from "api";
import eventBus from "../../../utils/eventBus.js";
import defaultImg from "../../../assets/images/design/default_image.png";
import formTypeJson from "../../../config/design/form-type-setting.js";
export default {
  name: "form-setting",
  data() {
    return {
      formType: formTypeJson,
      settingData: [],
      uploading: null,
      controlConfig: { data: "" },
      data: {
        rows: [],
        fontColor: "#ffffff",
        backColor: "#3898EC",
        submit: {
          text: "提交",
          feedback: "感谢您的填写"
        }
      },
      feedBackform: {
        type: "text",
        category: "phone",
        name: "联系电话",
        value: ""
      },
      smsFeedback: false, //短信反馈开关
      feedBackformList: []
    };
  },
  created() {
    eventBus.$on("settingRefresh", this.init);
  },
  beforeDestroy() {
    eventBus.$off("settingRefresh");
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let self = this;
      let _currentBox = Kdo.box.utils.getCurrentBox(),
        _$box = _currentBox.$focusSingleBox;
      if (_currentBox.focusLevel == "single") {
        let _controlConfigs = Kdo.data.controls.get(
          Kdo.box.utils.getBoxControlId(_$box)
        );
        if (_controlConfigs.length > 0) self.controlConfig = _controlConfigs[0];
      }

      // //配置增加1.3属性及数据
      if (!self.controlConfig.data.newAttribute) {
        self.controlConfig.data.newAttribute = {
          smsFeedback: false, //短信反馈开关
          feedBackformList: [
            {
              type: "text",
              category: "phone",
              name: "联系电话",
              value: ""
            }
          ]
        };
      }

      self.data = Object.assign({}, self.controlConfig.data);
      self.smsFeedback = self.data.newAttribute.smsFeedback;
      self.feedBackformList = self.data.newAttribute.feedBackformList;

      if (self.data.newSetting) {
        self.settingData = self.data.rows;
      } else {
        self.dataConvert("toSettingData");
      }

      setTimeout(() => {
        self.sortByHandle();
      });

      self.init_color();
    },
    dataConvert(type) {
      let self = this,
        tempArr = [];
      if (type == "toSettingData") {
        self.data.rows.forEach((item, index) => {
          let category = "",
            _config = {};
          switch (item.type) {
            case "text":
              category =
                item.category == "default" ? "single-lines" : item.category;
              break;
            case "textarea":
              category = "multiple-lines";
              break;
            case "radio":
              category =
                item.category == "text" ? "radio-option" : "image-radio-option";
              break;
            case "checkbox":
              category =
                item.category == "text"
                  ? "checkbox-option"
                  : "image-checkbox-option";
              break;
          }
          _config = JSON.parse(JSON.stringify( self.formType.filter(n => {
              return n.category == category;
            })[0]));
          _config.require =
            item.require !== undefined
              ? item.require
              : _config.require !== undefined
              ? true
              : undefined;
          _config.categoryText = _config.title.text;
          _config.title.text = item.name;
          if(_config.placeholder !== undefined){
            _config.placeholder = item.name;
            _config.focus = false;
          } 
          _config.title.hide = true;
          _config.spread = false;
          _config.dataKey = self.creatDataKey(_config.category);

          tempArr.push(_config);
        });
        self.settingData = tempArr;

      }
    },
    //选择时间
    chooseDate(item) {
      let self = this;
      item.startTime.value = !!item.dateArr
        ? window.timeFormdate(item.dateArr[0]).split(' ')[0].replace(/\//g,'-')
        : "";
      item.endTime.value = !!item.dateArr
        ? window.timeFormdate(item.dateArr[1]).split(' ')[0].replace(/\//g,'-')
        : "";
    },
    //生成对象Key,key唯一
    creatDataKey (type) {
        return type + new Date().getTime();
    },
    //新增表单配置项
    addSettingData(item) {
      let self = this,
        newItem = JSON.parse(JSON.stringify(item));
      newItem.spread = false;
      newItem.categoryText = newItem.title.text;
      if(newItem.placeholder !== undefined) newItem.focus = false;
      newItem.dataKey = self.creatDataKey(newItem.category);
      if (newItem.category.indexOf("image") != -1) {
        newItem.option.forEach(item => {
          item.src = defaultImg;
        });
      }
      self.settingData.push(newItem);
      setTimeout(() => {
        self.sortByHandle();
      });
    },
    // 删除表单配置项
    deleteSettingData(index) {
      let self = this;
      self.settingData.splice(index, 1);
    },
    //添加选项
    addOption(optionArr, category, index) {
      let config = { value: `选项` };
      if (category.indexOf("image") != -1) config.src = defaultImg;
      config.dataKey = this.creatDataKey(category);
      optionArr.splice(index + 1, 0, config);
    },
    // 删除选项
    deleteOption(optionArr, index) {
      optionArr.splice(index, 1);
    },
    //展开关闭
    itemSpread(index) {
      let self = this;
      if (index < 0 || index > self.settingData.length - 1) return false;
      self.settingData.forEach((item, index1) => {
        if (index1 != index) item.spread = false;
      });
      self.settingData[index].spread = !self.settingData[index].spread;
    },
    //图片上传
    uploadImg(event, item, type) {
      var file = event.currentTarget.files[0];
      if (!file || item.uploading) return;
      if (!/^image\/.+$/i.test(event.currentTarget.files[0].type)) {
        Kdo.utils.notification.error("请选择图片文件");
        return false;
      }
      if (event.currentTarget.files[0].size > 1024 * 1024) {
        Kdo.utils.notification.error("图片文件大小不能超过1M噢");
        return false;
      }

      var formData = new FormData($(event.currentTarget).parent()[0]);
      // 加锁
      item.uploading = true;
      api.request("uploadFiles", formData, result => {
        if (result.status == 0) {
          item[type] = result.data[0].file;
        } else {
          Kdo.utils.notification.error("图片上传失败！");
        }
        // 解锁
        delete item.uploading;
      });
    },
    addresschoose(item, type) {
      item[type].need = !item[type].need;
      if (type == "province" && !item[type].need) {
        item.city.need = false;
        item.district.need = false;
      }
      if (type == "city") {
        if (item[type].need) {
          item.province.need = true;
        } else {
          item.district.need = false;
        }
      }
      if (type == "district" && item[type].need) {
        item.province.need = true;
        item.city.need = true;
      }
    },
    showInputTip(item) {
      let self = this;
      if(!!self.$setTime) window.clearTimeout(self.$setTime);
      this.$setTime = setTimeout(function(){
        item.focus = true;
      },500);
    },
    hideInputTip(item) {
      let self = this;
      if(!!self.$setTime) window.clearTimeout(self.$setTime);
      this.$setTime = setTimeout(function(){
        item.focus = false;
      },500);
    },
    //表单项排序功能
    sortByHandle() {
      var self = this;
      var $el = $(".section_sortable");
      var $$el = $(".setting-data-wrap");
      $el.sortable({
        axis: "y",
        handle: ".act-drag",
        stop: function(event, ui) {
          Kdo.events.on();
        },
        sort: function(event, ui) {
          Kdo.events.off("mouse");
        },
        update: function(event, ui) {
          var rows = [];
          var index = parseInt($(this).attr("index"));
          $.each($(this).children(".form-row"), function(i, el) {
            rows.push(
              _.findWhere(self.settingData[index].option, {
                dataKey: $(el).attr("data-key")
              })
            );
          });
          self.settingData[index].option = rows;
        }
      });
      $$el.sortable({
        axis: "y",
        handle: ".acs-drag",
        stop: function(event, ui) {
          Kdo.events.on();
        },
        sort: function(event, ui) {
          Kdo.events.off("mouse");
        },
        update: function(event, ui) {
          var rows = [];
          $.each($(this).children('.setting-item-wrap'), function(i, el) {
            rows.push(
              _.findWhere(self.settingData, {
                dataKey: $(el).attr("data-key")
              })
            );
          });
          self.settingData = rows;
        }
      });
    },
    //短信反馈表单增加
    feedbackformAdd() {
      this.feedBackformList.push(Object.assign({}, this.feedBackform));
    },
    //短信反馈表单删除
    feedbackformRemove(index) {
      this.feedBackformList.splice(index, 1);
    },
    //初始化颜色选择器
    init_color() {
      var self = this;
      var _init_color = function($el, key) {
        $el.spectrum({
          allowEmpty: true,
          color: self.data[key],
          showInput: true,
          showPalette: true,
          showSelectionPalette: false,
          showAlpha: false,
          showButtons: false,
          maxPaletteSize: 10,
          preferredFormat: "hex",
          localStorageKey: "spectrum.demo",
          move: function(color) {
            self.data[key] = color ? color.toHexString() : "none";
          },
          beforeShow: function() {},
          hide: function(color) {
            self.txtChangeColor(key, color);
          },
          palette: $.spectrum.customOptions.palette
        });
      };
      _init_color($("input.fontColor"), "fontColor");
      _init_color($("input.backColor"), "backColor");
    },
    txtChangeColor(key, color) {
      var self = this;
      var hexColor = "transparent";
      if (color) {
        hexColor = color.toHexString();
      }
      self.data[key] = hexColor;
    },
    //保存设置
    btnSubmit() {
      let self = this;
      this.data.fontColor = $("input[name=fontColor]").val();
      this.data.backColor = $("input[name=backColor]").val();
      
      let tempRows = [],
        go = true;
      if(self.isSubmitting) return false;
      
      if (self.settingData.length < 1) {
        Kdo.utils.notification.error("请添加表单项！");
        return false;
      }
      self.settingData.forEach((item, index) => {
        if (!item.title.text && go) {
          Kdo.utils.notification.error(
            "第" + (index + 1) + "项表单标题不能为空哦！"
          );
          go = false;
        } else if (item.title.text.length > 100 && go) {
          Kdo.utils.notification.error(
            "第" + (index + 1) + "项表单标题不能为超过100个字哦！"
          );
          go = false;
        }
        if (item.placeholder !== undefined && !item.placeholder && go) {
          Kdo.utils.notification.error(
            "第" + (index + 1) + "项表单提示语不能为空！"
          );
          go = false;
        }
        if (
          !!item.maxLength &&
          item.maxLength.need &&
          !item.maxLength.value &&
          go
        ) {
          Kdo.utils.notification.error(
            "请输入第" + (index + 1) + "项表单最大字数限制！"
          );
          go = false;
        }
        if (
          !!item.minLength &&
          item.minLength.need &&
          !item.minLength.value &&
          go
        ) {
          Kdo.utils.notification.error(
            "请输入第" + (index + 1) + "项表单最小字数限制！"
          );
          go = false;
        }
        if (
          item.category == "date" &&
          !!item.startTime &&
          item.startTime.need &&
          !item.startTime.value &&
          go
        ) {
          Kdo.utils.notification.error(
            "请选择第" + (index + 1) + "项表单起始时间！"
          );
          go = false;
        }
        if (
          item.category == "date" &&
          !!item.endTime &&
          item.endTime.need &&
          !item.endTime.value &&
          go
        ) {
          Kdo.utils.notification.error(
            "请选择第" + (index + 1) + "项表单结束时间！"
          );
          go = false;
        }
        if (
          item.category == "address" &&
          !item.province.need &&
          !item.city.need &&
          !item.district.need &&
          !item.detailAdress &&
          go
        ) {
          Kdo.utils.notification.error(
            "第" + (index + 1) + "项表单至少需要选择一个选项！"
          );
          go = false;
        }
        if (
          item.category.indexOf("checkbox-option") != -1 &&
          item.minNum.need &&
          !item.minNum.value &&
          go
        ) {
          Kdo.utils.notification.error(
            "请输入第" + (index + 1) + "项表单最少选择选项的个数！"
          );
          go = false;
        }
        if (
          item.category.indexOf("checkbox-option") != -1 &&
          item.maxNum.need &&
          !item.maxNum.value &&
          go
        ) {
          Kdo.utils.notification.error(
            "请输入第" + (index + 1) + "项表单最多选择选项的个数！"
          );
          go = false;
        } else if (
          item.category.indexOf("checkbox-option") != -1 &&
          parseInt(item.maxNum.value) > item.option.length &&
          go
        ) {
          Kdo.utils.notification.error(
            "第" + (index + 1) + "项表单最多选择选项的个数不能超过选项个数！"
          );
          go = false;
        }
        if (
          item.category == "upload" &&
          item.minNum.need &&
          !item.minNum.value &&
          go
        ) {
          Kdo.utils.notification.error(
            "请输入第" + (index + 1) + "项表单图片附件最少上传张数！"
          );
          go = false;
        }
        if (
          item.category == "upload" &&
          item.maxNum.need &&
          !item.maxNum.value &&
          go
        ) {
          Kdo.utils.notification.error(
            "请输入第" + (index + 1) + "项表单图片附件最多上传张数！"
          );
          go = false;
        }
        if (!!item.option && item.option.length == 0 && go) {
          Kdo.utils.notification.error(
            "第" + (index + 1) + "项表单至少需要添加一条选项！"
          );
          go = false;
        }
        tempRows.push({
          type: "txt_" + item.category,
          name: item.title.text,
          sort: index
        });
      });

      if (!!self.smsFeedback) {
        //短信反馈
        var obj = {};
        if (self.feedBackformList.length < 1 && go) {
          Kdo.utils.notification.error("至少需要填写一个短信反馈的手机号码！");
          go = false;
        } else if (go) {
          $.each(self.feedBackformList, function(index, item) {
            if (!item.value && go) {
              Kdo.utils.notification.error(
                "短信反馈第" + (index + 1) + "项,手机号码不能为空！"
              );
              go = false;
            } else if (!/^1[0-9]{10}$/.test(item.value) && go) {
              Kdo.utils.notification.error(
                "短信反馈第" + (index + 1) + "项,手机号码格式不正确！"
              );
              go = false;
            }
            if (!obj[item.value] && go) {
              obj[item.value] = 1;
            } else if (go) {
              Kdo.utils.notification.error(
                "短信反馈第" + (index + 1) + "项,手机号码重复,请仔细检查！"
              );
              go = false;
            }
          });
        }
      }

      if (!go) return false;

      let phoneList = [];
      if (!!self.smsFeedback) {
        self.feedBackformList.forEach((item, index) => {
          phoneList.push(item.value);
        });
      }

      let _data = {
        relationId: self.$route.query.id,
        fromSettingList: [
          {
            controlId: self.controlConfig.controlId,
            fromSetting: tempRows,
            smsFeedback: phoneList
          }
        ]
      };
      // 获取最新控件对象
      self.controlConfig = Kdo.box.utils.getControlConfigById(
        self.controlConfig.controlId
      );

      self.isSubmitting = true;
      api.request("saveFormSetting", _data, result => {
        if (result.status == 0) {
          self.data.rows = self.settingData;
          self.data.newSetting = true;
          // self.dataConvert('toData');
          var newArr = [];
          self.data.rows.forEach(item => {
            item.spread = false;
            item.name = item.title.text;
            var tempItem = JSON.parse(JSON.stringify(item));
            if (tempItem.category.indexOf("image") != -1) {
              tempItem.option.forEach(i => {
                i.src = "";
              });
            }
            newArr.push(tempItem);
          });
          Kdo.utils.notification.success("设置成功！");
          self.data.rowsStr = JSON.stringify(newArr);
          self.data.controlId = self.controlConfig.controlId;
          self.controlConfig.data = Object.assign({}, self.data);
          self.controlConfig.data.newAttribute.smsFeedback = self.smsFeedback;
          self.controlConfig.data.newAttribute.feedBackformList =
            self.feedBackformList;

          //操作记录
          Kdo.featurer.actionLogs.log();

          Kdo.page.create.load(
            self.controlConfig,
            function(config) {
              Kdo.data.controls.update(self.controlConfig);
              Kdo.box.utils.refresh();
            },
            true
          );
        } else {
          Kdo.utils.notification.error(result.message);
        }
        self.isSubmitting = false;
      });
    }
  }
};
</script>

<style>
.custom-form-setting .fz14 {
  font-size: 14px;
}
.custom-form-setting .input-row {
  height: 30px !important;
  line-height: 30px !important;
}
.custom-form-setting .el-date-editor--daterange.el-input__inner {
  width: 244px;
}
.custom-form-setting .el-range-editor--small .el-range-input {
  width: 90px !important;
}
.custom-form-setting .el-date-editor .el-range__close-icon {
  color: #c0c4cc;
}
.custom-form-setting {
  width: 406px;
  padding-left: 20px;
  margin-top: -50px;
}
.custom-form-setting .form-type-section {
  width: 370px;
  height: auto;
  overflow: hidden;
  padding-top: 10px;
}
.custom-form-setting .type-item {
  display: block;
  width: 110px;
  height: 34px;
  line-height: 34px;
  float: left;
  border: 1px solid #c9d5df;
  margin: 0px 10px 10px 0px;
  cursor: pointer;
  font-size: 12px;
}
.custom-form-setting .type-item .icon {
  float: left;
  display: block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 17px;
  margin: 8px 5px 0 5px;
  color: #213a50;
}
.custom-form-setting .setting-item-wrap {
  width: 370px;
  height: auto;
  padding-left: 3px;
  background-color: #f1f3fc;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.custom-form-setting .setting-item-title {
  background-color: #ffffff;
  height: 30px;
  line-height: 30px;
  padding-left: 5px;
}
.custom-form-setting .setting-item-wrap .icon {
  display: block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  margin: 7px 6px 0 0;
  cursor: pointer;
  font-size: 14px;
}
.custom-form-setting .setting-item-wrap .input-row .icon,
.custom-form-setting .setting-item-title .icon {
  margin: 6px 6px 0 0;
}
.custom-form-setting .setting-item-body {
  padding-top: 5px;
  font-size: 12px;
}
.custom-form-setting .form-row {
  position: relative;
  width: 353px;
  height: 34px;
  line-height: 34px;
  padding-left: 17px;
}
.custom-form-setting .iconfont.icon-wrong {
  position: absolute;
  left: 320px;
  top: 1px;
  font-size: 14px;
  color: #becfd9 !important;
  cursor: pointer;
}
.custom-form-setting .iconfont.icon-wrong:hover,
.custom-form-setting .setting-item-wrap .icon.icon-delete:hover {
  color: #ff595a !important;
}
.design .propertybar .property-body .custom-form-setting input {
  height: 30px;
  line-height: 30px;
  line-height: 1.628 \9;
  border-radius: 0;
  box-shadow: none;
  padding: 2px 0 0 5px \9;
  vertical-align: middle;
  font-size: 12px;
}
.design .propertybar .property-body .custom-form-setting input.focus {
  padding-right:30px;
}
.design .propertybar .property-body .custom-form-setting input.unfocus {
  padding-right:55px;
}
.custom-form-setting .form-row-tail {
  margin-top: 10px;
  border-top: 1px solid #ffffff;
  margin-left: -5px;
  padding-left: 22px;
  width: 370px;
}
.custom-form-setting .form-row-tail span {
  cursor: pointer;
}
.custom-form-setting .acs-drag:hover {
  cursor: move;
}
.custom-form-setting .form-row-tail .icon {
  margin-right: 0px;
  margin-top: 8px;
}
.custom-form-setting .black-light {
  color: #bec0cd !important;
}

.custom-form-setting .setting-item-wrap .icon-radio,
.custom-form-setting .setting-item-wrap .icon-checkbox {
  color: #c7c9d5 !important;
}
.custom-form-setting .setting-item-wrap .icon-radio-checkded,
.custom-form-setting .setting-item-wrap .icon-checkbox-checked {
  color: #00b5d1 !important;
}
.custom-form-setting .icon-checkbox,
.custom-form-setting .icon-checkbox-checked {
  font-size: 14px !important;
  margin-right: 2px !important;
  margin-left: 2px !important;
}
.design .propertybar .property-body select {
  height: 30px;
  border-radius: 0;
  box-shadow: none;
}
.custom-form-setting .imgUpload {
  position: absolute;
  width: 30px !important;
  height: 30px !important;
  display: block;
  top: 0px;
  left: 0px;
  opacity: 0;
  padding-left: 0 !important;
  filter: alpha(opacity=0);
  z-index: 2;
}
.custom-form-setting .form-group {
  margin-bottom: 0;
}
.custom-form-setting .btn-setting {
  margin-top: 10px;
  background-color: #c3d4e8;
}

.custom-form-setting .btn-setting.white,
.custom-form-setting .btn-setting.white i,
.custom-form-setting .btn-setting.white:hover,
.custom-form-setting .btn-setting.white:focus {
  color: #fff;
}

.custom-form-setting .btn-setting,
.custom-form-setting .btn-setting i,
.custom-form-setting .btn-setting:hover,
.custom-form-setting .btn-setting:focus {
  color: #2c3d4f;
}
.custom-form-setting .color-input {
  width: 65px !important;
}

.custom-form-setting .form-row {
  /* padding-bottom: 10px; */
}

.custom-form-setting .btn-submit {
  background-color: #00bad0;
  width: 370px;
  height: 40px;
  margin: 30px 0 0 0px;
}

.custom-form-setting .btn-submit,
.custom-form-setting .btn-submit.white i,
.custom-form-setting .btn-submit:hover,
.custom-form-setting .btn-submit:focus {
  color: #fff;
}

.custom-form-setting .btn-setting {
  margin-top: 10px;
  background-color: #c3d4e8;
}

.custom-form-setting .btn-setting.white,
.custom-form-setting .btn-setting.white i,
.custom-form-setting .btn-setting.white:hover,
.custom-form-setting .btn-setting.white:focus {
  color: #fff;
}

.custom-form-setting .btn-setting,
.custom-form-setting .btn-setting i,
.custom-form-setting .btn-setting:hover,
.custom-form-setting .btn-setting:focus {
  color: #2c3d4f;
}
.custom-form-setting .type-item .icon.icon-shijian{
    font-size: 14px;
}
.ie11 .design .propertybar .property-body input {
    line-height: 15px;
}
</style>