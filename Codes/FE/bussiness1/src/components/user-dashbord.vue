<template>
  <div class="user-dashbord">
    <div v-show="!loading">
      <div class="user-head" style="margin: 31px auto 15px;">
        <img :src="UserInfo.face">
        <span class="tag font-12" v-if="parseInt($route.query.indexType) == 1">{{ UserInfo.is_koc==0?levelList[UserInfo.level]:'KOC' }}</span>
        <!-- 为员工详情并且为boss时 -->
        <!-- <span class="tag font-12" v-if="$route.query.indexType == 2">BOSS</span> -->
      </div>
      <div class="font-14 black-deep">{{ UserInfo.nickname }}</div>
      <div class="font-12 black-light" v-if="!!UserInfo.name && !!UserInfo.phone">
        <span style="margin-right: 10px;">{{ UserInfo.name }}</span>
        {{ UserInfo.phone }}
      </div>
      <div class="font-12 black-light" style=" margin-bottom: 6px;margin-top: 15px;">
        <div class="outside_box">
          <span style="margin-right: 13px; margin-bottom: 6px; width: 50px;">累计奖励</span> <span
            class="red-deep">￥{{ UserInfo.reward_amount || UserInfo.rewardAmount  || 0}}</span>
        </div>
      </div>
      <!-- <div class="font-12 black-light" style=" margin-bottom: 6px;">
        <div class="outside_box">
          <span style="margin-right: 13px;">奖励提现</span> <span class="red-deep">￥{{ UserInfo.cash_withdrawal || UserInfo.withdrawalAmount || 0}}</span>
        </div>
      </div> -->
      <div class="font-12 black-light" v-if="$route.query.indexType == 1">
        <div class="outside_box">
          <span style="margin-right: 13px; width: 50px;">成交金额</span>
          <span class="red-deep">￥{{ UserInfo.transaction_amount }}</span>
        </div>
      </div>
      <div class="font-12 black-light" style="margin: 5px 0px 4px 0;">
        <div class="outside_box">
          <span style="display: inline-block;margin-right: 13px; width: 50px; text-align: left">营&nbsp;销&nbsp;力</span>
          <span class="" style="color: #F68411">{{ UserInfo.marketingForce || UserInfo.marketing_power  || 0}}</span>
        </div>
      </div>
      <div class="font-12 black-light">
        <div class="outside_box">
          <span
            style="display: inline-block;letter-spacing:2px;width: 50px; margin-right: 13px; text-align: left">排&emsp;名</span>
          <span class="" style="color: #F68411">{{ UserInfo.ranking == -1 ? '暂无排名' : UserInfo.ranking}}</span>
        </div>
      </div>
      <!-- 柱状图 -->
      <div ref="bar" class="bar" style="width:200px;height:160px;margin:20px auto 0;">

      </div>

      <el-row class="text-center" style="margin:-30px auto 26px;">
        <el-button type="danger" size="small" style="width:170px;height:30px;" @click="payRedPack"
          :disabled="this.re_openid === 0">给TA发红包</el-button>
      </el-row>

      <el-row class="tag-list">
        <span class="tag" v-for="(item, index) in tagList" :key="index"
          :style="{'border-color': item.color,'color': item.color}">{{item.name}}</span>
      </el-row>
      <redpack-dialog ref="redPackDialog"></redpack-dialog>
    </div>
  </div>
</template>
<script>
import redpackDialog from 'components/redpack-dialog'
import defaultHead from "../assets/images/default-headImg.png"
import api from 'api'

export default {
  name: "userDashbord",
  components: {
    redpackDialog
  },
  props: {
    userData: {
      default: () => {
        return {
          id: 0,
          keyID: 0
        };
      }
    },
    type: '',
    taskId: ''
  },
  data() {
    return {
      re_openid: 0,
      //柱状图
      BarOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '0%',
          containLabel: true
        },
        color: '#00BAD0',
        xAxis: {
          type: 'value',
          minInterval: 1,
          min: 0,
          max: function(value){
            return value.max > 5 ? value.max : 5;
          }
        },
        yAxis: {
          type: 'category',
          data: ['成交', '咨询', '访客', '曝光'],
          boundaryGap: ['20%', '20%']
        },
        series: [
          {
            type: 'bar',
            data: []
          }
        ]
      },
      UserInfo: {
        name: '',
        nickname: '',
        phone: '',
        // 头像
        face: '',
        level: 0,
        // 成交金额
        transaction_amount: '',
        // 累计奖励
        reward_amount: '',
        // 奖励提现
        cash_withdrawal: '',
        // 营销力
        marketing_power: '',
        // 排名
        ranking: '',
      },
      tagList: [],
      levelList: ['KOC', '普通用户', '一般用户', '重要用户'],
      colorArr: ['#5DA1FF', '#9C97FF', '#766BFF', '#B678FF', '#5DA1FF'],
      loading: true
    };
  },
  mounted() {
    if(!!this.userData.id){
      api.request('getUserOpenID', {
        secret_key: localStorage.businessSecret,
        otype: 'wx',
        userUuid: this.userData.id
      }, result => {
        if (result.status === 0) {
          this.re_openid = result.data.userOpenId
        } else {
          this.re_openid = 0
        }
      })
    }
    
    this.getInfo()
  },
  methods: {
    //初始化图表
    initChart(dom, option) {
      this.$echarts.init(dom).setOption(option);
    },
    // 发送红包
    payRedPack() {
      this.$refs.redPackDialog.open(this.userData.id, this.re_openid)
    },
    // 获取客户员工信息
    getInfo() {
      // 获取客户信息
      let self = this;
      if (this.type === 'customer') {
        api.request('getComsuterInfo', {
          id: Number(this.userData.keyID),
          taskId: this.taskId
        }, result => {
          if (result.status === 0) {
            self.UserInfo = result.data
            self.UserInfo.face = self.UserInfo.face || defaultHead;
            self.BarOption.series[0].data[0] = result.data.orderNum
            self.BarOption.series[0].data[1] = result.data.consultNum
            self.BarOption.series[0].data[2] = result.data.visitorNum
            self.BarOption.series[0].data[3] = result.data.exposureNum

            self.initChart(self.$refs.bar,self.BarOption)
            if (!!result.data.label) {
              result.data.label.forEach(ele => {
                self.tagList.push({
                  name: ele,
                  color: self.colorArr[Math.floor(Math.random() * 5)]
                })
              })
            }
          } else {
            self.$message({
              type: 'warining',
              message: result.message
            })
          }
          self.loading = false;
        })
      } else {
        // 获取员工信息
        api.request('getKmaEmployeeInfo', {
          id: self.$route.query.employId || self.userData.keyID,
          taskId: self.taskId
        }, result => {
          if (result.status === 0) {
            self.UserInfo = result.data;
            self.UserInfo.face = self.UserInfo.face || defaultHead;
            self.BarOption.series[0].data[0] = result.data.orderNum
            self.BarOption.series[0].data[1] = result.data.consultNum
            self.BarOption.series[0].data[2] = result.data.visitorNum
            self.BarOption.series[0].data[3] = result.data.exposureNum
            self.initChart(self.$refs.bar,self.BarOption)
            if (!!result.data.label) {
              result.data.label.forEach(ele => {
                self.tagList.push({
                  name: ele,
                  color: self.colorArr[Math.floor(Math.random() * 5)]
                })
              })
            }
          } else {
            self.$message({
              type: 'warining',
              message: result.message
            })
          }
          self.loading = false;
        })
      }
    }
  }
};
</script>
<style scoped>
.user-dashbord {
  width: 100%;
  height: 100%;
  background-color: #ccc;
  text-align: center;
  overflow: hidden;
}
.user-head {
  width: 110px;
  position: relative;
  margin: 31px auto 15px;
}
.user-head img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.user-head .tag {
  width: 60px;
  height: 18px;
  line-height: 18px;
  position: absolute;
  bottom: 0;
  right: -5px;
  background: rgba(246, 132, 17, 1);
  border-radius: 8px;
  color: #fff;
}
.user-head .text-lebal {
  display: inline-block;
  width: 126px;
}
.tag-list {
  padding: 0 21px;
  text-align: left;
}
.tag-list .tag {
  display: inline-block;
  padding: 0px 8px 1px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 12px;
  margin: 9px 9px 0 0;
}
.outside_box {
  width: 120px;
  text-align: left;
  margin: 0 auto;
}
</style>