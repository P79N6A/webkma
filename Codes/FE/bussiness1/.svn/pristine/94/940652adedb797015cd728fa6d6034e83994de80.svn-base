<template>
  <div style="height:auto;">
    <headerTitle :myTitle="myTitle" goBack="components" @goBackFunction="goBackFunction"></headerTitle>
    <div class="choice-box">
      <div class="addRuleTitle">选择内容：</div>
      <div class="h5-conten">
        <MyLibrary @getmanuscript="getmanuscript"></MyLibrary>
      </div>
    </div>
    <div class="redPacket-box">
      <div class="addRuleTitle">红包封面：</div>
      <div style="width:90%">
        <el-radio v-model="radio" label="1" @change='getchange()' :disabled="this.$route.query.main_id?true:false">红包裂变
        </el-radio>
        <el-radio v-model="radio" label="2" @change='getchange()' :disabled="this.$route.query.main_id?true:false">阶梯红包
        </el-radio>
        <el-tooltip content="ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd" placement="top"
          effect="light">
          <el-button class="tips_box iconfont icon-prompt"></el-button>
        </el-tooltip>
        <div class="content" v-if="radio==1">
          <div class="img-box">
            <div class="name">
              <img :src="userInfo.img?userInfo.img:defaultHead" alt />
              <p>{{userInfo.name}}</p>
            </div>
            <div class="activity-name">
              <el-input v-model="formData[0].title" maxlength="10" placeholder=" 请输入活动标题"></el-input>
              <span>{{formData[0].title.length}}/10</span>
            </div>
            <div class="textarea-box">
              <el-input v-model="formData[0].content" maxlength="20" type="textarea" placeholder=" 请输入红包问候语"></el-input>
              <span>{{formData[0].content.length}}/20</span>
            </div>
          </div>
          <div class="right-form">
            <div v-for="(item,index) in formData" :key="index">
              <el-form :ref="'form'+index" :model="item" label-width="100px" size="mini">
                <el-form-item label="红包总额：" style="margin-top:35px;">
                  <div class="display-flex">
                    <el-input placeholder=" 建议每次活动金额在3000元左右" v-model="item.money" style="width: 225px;"
                      v-if="item.type==2" maxlength="8">
                      <i slot="prefix" class="iconfont icon-pin" style="color:#ff9420;" v-if="item.type==2"></i>
                      <span slot="prefix" style="color:#FA766B;font-size:12px">￥</span>
                    </el-input>
                    <el-input placeholder="建议每次活动金额在3000元左右" v-model="item.money" style="width: 225px;"
                      v-if="item.type==1" maxlength="8"></el-input>
                    <span style="color:#FA766B;position:absolute;left:3px;font-size:12px" v-if="item.type==1">￥</span>
                    <p>
                      账户余额：
                      <span style="color:#FA766B">￥{{balance}}</span>
                    </p>
                  </div>
                </el-form-item>
                <el-form-item label="红包个数：">
                  <div class="display-flex">
                    <el-input v-model="item.count" style="width: 100px" maxlength="6"></el-input>
                    <p>
                      当前为{{item.type==1?'普通红包':'拼手气红包'}}，改为
                      <span @click="switchChang()">{{redType}}</span>
                    </p>
                  </div>
                </el-form-item>
                <el-form-item label="领取人员：">
                  <el-select v-model="item.user_type" placeholder="全部" style="width: 100px">
                    <el-option label="全部" value="1"></el-option>
                    <el-option label="客户" value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="带来客户数：">
                  <el-input v-model="item.targetVisitor" placeholder="最小值为1，建议3以上" maxlength="6" style="width:75%">
                  </el-input>
                </el-form-item>
                <el-form-item label="活动时间：" style="padding-bottom:10px">
                  <span style="color:#ACACAC">{{createTime}}</span>
                </el-form-item>
              </el-form>
            </div>

          </div>
        </div>
        <div class="content" v-if="radio==2">
          <div class="img-box">
            <div class="name">
              <img :src="userInfo.img?userInfo.img:defaultHead" alt />
              <p>{{userInfo.name}}</p>
            </div>
            <div class="activity-name">
              <el-input v-model="formData[0].title" maxlength="10" placeholder=" 请输入活动标题"></el-input>
              <span>{{formData[0].title.length}}/10</span>
            </div>
            <div class="textarea-box">
              <el-input v-model="formData[0].content" maxlength="20" type="textarea" placeholder=" 请输入红包问候语"></el-input>
              <span>{{formData[0].content.length}}/20</span>
            </div>
          </div>
          <div class="right-form">
            <p>红包规则:</p>
            <div v-for="(item,index) in formData" :key="index">
              <el-form :ref="'form'+index" :model="item" size="mini">
                <el-form-item>
                  <div class="addDom">
                    <div class="iconfont icon-wrong addIcon" @click.prevent="removeDomain(item)"></div>
                    <div class="addInput">
                      <p>共设置 <el-input v-model="item.count" style="width:10%"></el-input> 个红包 <span
                          style="padding-left:10px">共：<span
                            style="color:#FA766B">￥{{item.money*item.count?item.money*item.count:'-'}}</span></span></p>
                      <p>每带来
                        <el-select v-model="item.type" placeholder="请选择" style="width:14%" @change='gettype()'>
                          <el-option label="一个访客" value="11" style="width:100%"></el-option>
                          <el-option label="一个预约" value="12" style="width:100%"></el-option>
                        </el-select>
                        <el-select v-model="item.appointment_ids" v-if="item.type==12" multiple filterable allow-create
                          :multiple-limit=2 @change='getids(item.appointment_ids)' @remove-tag="removeTag"
                          style="width:20%;" default-first-option placeholder="请选择文章标题">
                          <el-option v-for="item in options" :key="item.id" :label="item.title" :value="item.id"
                            :disabled="item.disabled">
                          </el-option>
                        </el-select>
                        <span style="padding-left:15px">奖励</span>
                        <el-input v-model="item.money" style="width:10%" class="prefixI" @change="getPrice()">
                          <span slot="prefix" style="color:#FA766B;font-size:12px">￥</span>
                        </el-input> 每人最多领<el-input v-model="item.maximumReceiveAllowed" style="width:10%">
                        </el-input> 个;
                      </p>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="addDomain">
              <p @click="addDomain" v-if="formData.length<3"><i class="iconfont icon-plus"
                  style="font-size:12px;margin-right:5px"></i>新增红包规则</p>
              <p v-if="formData.length>=3" style="color:#B1BFCD">红包规则仅能添加三个</p>
            </div>
            <p class="priceTotal">红包总计： <span>￥{{totalPrice}}</span></p>
          </div>
        </div>
      </div>
    </div>

    <div class="btn-box">
      <el-button type="primary" @click="onSubmit" size="mini">完成</el-button>
      <el-button size="mini" @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import api from "api";
import headerTitle from "components/header-title";
import MyLibrary from "@/components/my-library.vue";
export default {
  components: {
    MyLibrary,
    headerTitle
  },
  data() {
    return {
      active: 1,
      defaultHead: "../../assets/images/default-headImg.png",
      userInfo: {
        name: "",
        img: ""
      }, //商家信息
      radio: "1",
      options: [],//预约列表
      redType: "普通红包", //红包类型
      myTitle: this.$route.query.main_id ? "修改红包" : "添加红包",
      createTime: "",
      formData: [{
        title: "", //标题
        content: "", //祝福语
        money: "", //总额
        count: "", //个数
        type: 2, //红包类型 1. 普通红包 2. 随机红包 11. 阶梯红包---根据访客 12. 阶梯红包---根据预定
        user_type: "1", //领取人员范围 1.员工+客户 2.仅客户（不包含员工）
        targetVisitor: "", //带来客户数量目标
        manuscript_id: "",//绑定活动的活动ID
        appointment_ids: [],//关联预约的数组  [aaa] 或 [bbb] 或 [aaa, bbb]
        maximumReceiveAllowed: ""
      }],
      balance: "0", //商家账户余额
      totalPrice: 0
    };
  },
  mounted() {
    var self = this;
    self.balanceData();
    if (self.$route.query.main_id) {
      //判断是否是修改
      self.details();
    }
    setTimeout(function () {
      self.userInfo = {
        name: JSON.parse(localStorage.getItem('userInfo')).businessInfo.businessName,
        img: JSON.parse(localStorage.getItem('userInfo')).businessInfo.businessLogo
      }
    }, 1000)
  },
  methods: {
    // 上一步
    goBackFunction() {
      if (this.active < 2) {
        this.$router.go(-1);
      } else {
        this.active--
      }
    },
    //选择
    getids(item) {
      this.options.map(it => {
        if (!it.disabled) {
          item.find(item => {
            if (item == it.id) {
              it.disabled = true
            } else {
              it.disabled = false
            }
          })
        }
      })
    },
    // //清楚选择
    removeTag(item) {
      this.options.map(it => {
        if (item == it.id) {
          it.disabled = false
        }
      })
    },
    //添加阶梯红包时 选择类型 //一个访客 或是一个预约
    gettype() {
      var self = this
      if (self.formData.length == 2) {
        if (self.formData[0].type == 11 && self.formData[1].type == 11) {
          self.$message.error("不能添加两个访客规则");
          return
        }
      }
      else if (self.formData.length == 3) {
        if (self.formData[0].type == 11 && (self.formData[1].type == 11 || self.formData[2].type == 11)) {
          self.$message.error("不能添加两个访客规则");
          return
        }
        if (self.formData[0].type == 12 && self.formData[1].type == 12 && self.formData[2].type == 12) {
          self.$message.error("不能添加三个预约规则");
          return
        }
      }
    },
    getPrice() {
      var self = this;
      self.totalPrice = 0
      for (var i = 0; i < self.formData.length; i++) {
        self.totalPrice += parseFloat(self.formData[i].money * self.formData[i].count)
      }
    },
    //删除阶梯红包规则
    removeDomain(item) {
      var index = this.formData.indexOf(item)
      if (index !== 0) {
        this.formData.splice(index, 1)
      }
    },
    //添加阶梯红包规则
    addDomain() {
      var self = this
      if (self.formData.length == 2) {
        if (self.formData[0].type == 11 && self.formData[1].type == 11) {
          self.$message.error("不能添加两个访客规则");
          return
        }
      }
      else if (self.formData.length == 3) {
        if (self.formData[0].type == 11 && (self.formData[1].type == 11 || self.formData[2].type == 11)) {
          self.$message.error("不能添加两个访客规则");
          return
        }
        if (self.formData[0].type == 12 && self.formData[1].type == 12 && self.formData[2].type == 12) {
          self.$message.error("不能添加三个预约规则");
          return
        }
      }
      if (self.formData.length < 3) {
        self.formData.push({
          title: "", //标题
          content: "", //祝福语
          money: "", //总额
          count: "", //个数
          type: "", //红包类型 1. 普通红包 2. 随机红包 11. 阶梯红包---根据访客 12. 阶梯红包---根据预定
          user_type: "1", //领取人员范围 1.员工+客户 2.仅客户（不包含员工）
          targetVisitor: "", //带来客户数量目标
          manuscript_id: self.formData[0].manuscript_id,//绑定活动的活动ID
          appointment_ids: [],//关联预约的数组  [aaa] 或 [bbb] 或 [aaa, bbb]
          maximumReceiveAllowed: "",
        });
      }
    },
    //选择活动内容
    getmanuscript(data) {
      var self = this;
      self.formData[0].manuscript_id = data.id;
      data.taskStartDate = (data.taskStartDate || "").replace(/-/gi, "/");
      data.taskEndDate = (data.taskEndDate || "").replace(/-/gi, "/");
      self.createTime = data.taskStartDate + " - " + data.taskEndDate;
      api.request(
        "getAppointmentInfo",
        Object.assign({ relationId: data.id }),
        result => {
          if (result.status == 0) {
            self.options = result.data
            for (var i = 0; i < self.options.length; i++) {
              this.options[i].disabled = false
            }
          } else {
            self.$message.error(result.message);
          }
        }
      )
    },
    //查询商加余额
    balanceData() {
      var self = this;
      api.request(
        "getAccountDetail",
        Object.assign({ id: self.$store.state.login.userInfo.userUuid }),
        result => {
          if (result.status == 0) {
            self.balance = result.data.balance;
          } else {
            self.$message.error(result.message);
          }
        }
      );
    },
    //提交
    onSubmit() {
      let self = this;
      let reg = /^\+?[1-9]\d*$/;//1-9的数字
      let reg1 = /^\d+(\.\d{1,2})?$/;//金额
      let reg2 = /^-?\d+$/;
      if (self.formData.length == 2) {
        if (self.formData[0].type == 11 && self.formData[1].type == 11) {
          self.$message.error("不能添加两个访客规则");
          return
        }
      }
      else if (self.formData.length == 3) {
        if (self.formData[0].type == 11 && (self.formData[1].type == 11 || self.formData[2].type == 11)) {
          self.$message.error("不能添加两个访客规则");
          return
        }
        if (self.formData[0].type == 12 && self.formData[1].type == 12 && self.formData[2].type == 12) {
          self.$message.error("不能添加三个预约规则");
          return
        }
      }
      for (var i = 0; i < this.formData.length; i++) {
        if (!self.formData[0].manuscript_id) {
          self.$message.error("请选择任务内容");
          return;
        }
        if (!self.formData[0].title) {
          self.$message.error("红包标题不能为空");
          return;
        }
        if (self.formData[i].type == 12) {
          if (self.formData[i].appointment_ids.length == 0) {
            self.$message.error("预约标题不能为空");
            return;
          }
        }
        if (!self.formData[0].content) {
          self.$message.error("红包标题祝福语不能为空");
          return;
        }
        if (!self.formData[i].money) {
          self.$message.error("红包总金额不能为空");
          return;
        }
        if (parseFloat(self.formData[i].money) > self.balance) {
          self.$message.error("红包总金额不能超出用户余额");
          return;
        }

        if (!self.formData[i].count) {
          self.$message.error("红包个数不能为空");
          return;
        }
        if (!reg.test(self.formData[i].count)) {
          self.$message.error(`红包个数必须为整数`);
          return;
        }
        if (self.formData[i].type == 1 || self.formData[i].type == 2) {
          if (!reg1.test(self.formData[i].money)) {
            self.$message.error(`请填写正确的红包总金额`);
            return;
          }
          if (!self.formData[i].targetVisitor) {
            self.$message.error("带来客户数不能为空");
            return;
          }
          if (!reg.test(self.formData[i].targetVisitor)) {
            self.$message.error(`带来客户数必须为整数`);
            return;
          }
          self.formData[i].money = parseFloat(self.formData[i].money);
        } else {
          if (!reg1.test(self.formData[i].money)) {
            self.$message.error(`请填写正确的红包金额`);
            return;
          }
          if (self.formData[i].money > 200) {
            self.$message.error(`红包金额不能大于200`);
            return;
          }
          if (!self.formData[i].maximumReceiveAllowed) {
            self.$message.error("领取上限不能为空");
            return;
          }
          if (!reg2.test(self.formData[i].maximumReceiveAllowed)) {
            self.$message.error(`请填写正确领取上限`);
            return;
          }
          self.formData[i].money = parseFloat(self.formData[i].money * self.formData[i].count);
        }
        self.formData[i].count = parseInt(self.formData[i].count);
      }
      if (!this.$route.query.main_id) {
        api.request("redpacketCreate", Object.assign(self.formData), result => {
          if (result.status == 0) {
            self.$message.success("添加成功");
            self.$router.go(-1);
          } else {
            self.$message.error(result.message);
          }
        });
      } else {
        self.formData[0].modify = true;
        api.request("redpacketCreate", Object.assign(self.formData), result => {
          if (result.status == 0) {
            self.$message.success("修改成功");
            self.$router.go(-1);
          } else {
            self.$message.error(result.message);
          }
        });
      }
    },
    //修改先查询详情赋值给页面 进行修改
    details() {
      var self = this;
      api.request(
        "redpacketdetails",
        Object.assign({ main_id: self.$route.query.main_id }),
        result => {
          if (result.status == 0) {
            if (result.data[0].red_packet_type != 1 && result.data[0].red_packet_type != 2) {
              self.radio = "2";
              new Promise((resolve, reject) => {
                api.request(
                  "getAppointmentInfo",
                  Object.assign({ relationId: result.data[0].m_id }),
                  result => {
                    if (result.status == 0) {
                      self.options = result.data;
                      resolve(result)
                    } else {
                      self.$message.error(result.message);
                    }
                  }
                );
              }).then(cont => {
                self.formData = []
                let arr = []
                let res = result.data
                for (var i = 0; i < res.length; i++) {
                  self.formData.push({
                    title: res[i].red_packet_title, //标题
                    content: res[i].red_packet_content, //祝福语
                    money: res[i].red_packet_premoney, //总额
                    count: res[i].red_packet_num, //个数
                    type: res[i].red_packet_type + '',//红包类型 1. 普通红包 2. 随机红包 11. 阶梯红包---根据访客 12. 阶梯红包---根据预定
                    user_type: res[i].red_packet_user_type + "", //领取人员范围 1.员工+客户 2.仅客户（不包含员工）
                    targetVisitor: res[i].target_visitor, //带来客户数量目标
                    manuscript_id: res[i].m_id,//绑定活动的活动ID
                    appointment_ids: res[i].appointment,//关联预约的数组  [aaa] 或 [bbb] 或 [aaa, bbb]
                    maximumReceiveAllowed: res[i].maximum_receive_allowed,
                  });
                  arr = arr.concat(res[i].appointment)
                  self.totalPrice += parseFloat(res[i].original_money)
                }
                arr.map(it => {
                  self.options.find(item => {
                    if (item.id == it.id) {
                      item.disabled = true
                    }
                  })
                })
              })
            } else {
              self.formData = [{
                title: result.data[0].red_packet_title, //标题
                content: result.data[0].red_packet_content, //祝福语
                money: result.data[0].original_money, //总额
                count: result.data[0].red_packet_num, //个数
                type: result.data[0].red_packet_type, //红包类型 1. 普通红包 2. 随机红包 11. 阶梯红包---根据访客 12. 阶梯红包---根据预定
                user_type: result.data[0].red_packet_user_type + "", //领取人员范围 1.员工+客户 2.仅客户（不包含员工）
                targetVisitor: result.data[0].target_visitor, //带来客户数量目标
                manuscript_id: result.data[0].m_id //绑定活动的活动ID
              }]
              result.data[0].active_start_date = (
                result.data[0].active_start_date || ""
              ).replace(/-/gi, "/");
              result.data[0].active_end_date = (
                result.data[0].active_end_date || ""
              ).replace(/-/gi, "/");
              self.createTime =
                result.data[0].active_start_date +
                " - " +
                result.data[0].active_end_date;
              self.redType =
                result.data[0].red_packet_type == 1 ? "拼手气红包" : "普通红包";
            }
          } else {
            self.$message.error(result.message);
          }
        }
      );
    },
    getchange() {
      this.formData = [{
        title: "", //标题
        content: "", //祝福语
        money: "", //总额
        count: "", //个数
        type: 2, //红包类型 1. 普通红包 2. 随机红包 11. 阶梯红包---根据访客 12. 阶梯红包---根据预定
        user_type: "1", //领取人员范围 1.员工+客户 2.仅客户（不包含员工）
        targetVisitor: "", //带来客户数量目标
        manuscript_id: this.formData[0].manuscript_id,//绑定活动的活动ID
        appointment_ids: [],//关联预约的数组  [aaa] 或 [bbb] 或 [aaa, bbb]
        maximumReceiveAllowed: ""
      }]
      if (this.radio == 1) {
        this.formData[0].type = 2 //红包类型 1. 普通红包 2. 随机红包 11. 阶梯红包---根据访客 12. 阶梯红包---根据预定
      } else {
        this.formData[0].type = '' //红包类型 1. 普通红包 2. 随机红包 11. 阶梯红包---根据访客 12. 阶梯红包---根据预定
      }
    },
    //切换普通红包和拼手气
    switchChang() {
      this.formData[0].money = ""; //总额
      this.formData[0].count = ""; //个数
      if (this.formData[0].type == 1) {
        this.formData[0].type = 2;
        this.redType = "普通红包";
      } else {
        this.formData[0].type = 1;
        this.redType = "拼手气红包";
      }
    },
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.tips_box {
  border: none;
  outline: none;
  padding: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  color: rgba(177, 191, 205, 1);
}
.addDom >>> .el-input__inner {
  padding-left: 15px;
}
.priceTotal {
  font-size: 14px;
  color: #63717b;
  margin-top: 17px;
}
.priceTotal span {
  color: #fa766b;
}
.addIcon {
  margin-top: 30px;
  color: #b1bfcd;
}
.addDom {
  overflow: hidden;
  display: flex;
  width: 90%;
  height: 95px;
  justify-content: space-between;
  margin-top: 10px;
}
.addInput > p {
  display: flex;
  margin-top: 10px;
  margin-left: 10px;
  color: #63717b;
}
.addInput > p >>> .el-input--mini {
  /* width: 100px; */
  margin: 0 5px 0 5px;
}
.addInput >>> .el-input--mini .el-input__inner {
  border-radius: 0;
}
.addDom > .addInput {
  background: rgba(247, 251, 252, 1);
  width: 95%;
}
.addDomain {
  width: 85%;
  height: 40px;
  line-height: 40px;
  background: rgba(247, 251, 252, 1);
  padding-left: 12px;
  font-size: 12px;
  color: #3898ec;
  margin-left: 5%;
  margin-top: 10px;
}
.btn-box {
  padding-bottom: 40px;
  margin-top: 40px;
  padding-left: 100px;
}
.btn-box > button {
  width: 100px;
  height: 34px;
  border-radius: 4px;
  text-align: center;
}
.h5-conten {
  width: 82%;
  /* margin: 0 auto; */
}
.choice-box {
  display: flex;
  width: 95%;
  margin: 0 auto;
  margin-top: 20px;
}
.right-form {
  width: 75%;
  margin-left: 50px;
  margin-top: 32px;
}
.display-flex {
  display: flex;
}
.display-flex p {
  margin-left: 17px;
  color: #b1bfcd;
  font-size: 12px;
}
.display-flex p > span {
  color: #3898ec;
  cursor: pointer;
}
.form-box {
  width: 95%;
  background: #f7fbfc;
  overflow: hidden;
  margin-top: -10px;
}

.content {
  display: flex;
  border: 1px solid rgba(227, 230, 235, 1);
  height: 540px;
  width: 95%;
  margin-top: 15px;
}
.redPacket-box {
  width: 95%;
  margin: 0 auto;
  display: flex;
  margin-top: 33px;
}
.activity-name {
  width: 90%;
  margin: 0 auto;
  position: relative;
  margin-top: 18px;
  height: 40px;
}
.textarea-box {
  width: 90%;
  margin: 0 auto;
  position: relative;
  margin-top: 28px;
}
.textarea-box span {
  position: absolute;
  right: 5px;
  top: 30px;
  color: #b1bfcd;
}
.activity-name span {
  position: absolute;
  right: 5px;
  top: 10px;
  color: #b1bfcd;
}
.img-box .name {
  display: flex;
  height: 30px;
  margin: 0 auto;
  margin-top: 30px;
  width: auto;
  justify-content: center;
}
.img-box .name p {
  line-height: 30px;
  font-size: 18px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(251, 211, 146, 1);
  line-height: 22px;
}
.img-box .name > img {
  width: 30px;
  height: 30px;
  /* border: 1px solid #b1bfcd; */
  border-radius: 50%;
  margin-right: 8px;
}

.addRuleTitle {
  font-size: 14px;
  text-align: right;
  color: rgba(60, 74, 85, 1);
}

.img-box {
  width: 232px;
  height: 349px;
  overflow: hidden;
  background: url("../../assets/images/red-packet.png") no-repeat;
  background-size: contain;
  margin: 40px 0 43px 60px;
}
</style>
