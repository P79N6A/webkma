<template>
    <el-dialog title="发红包" @close="close" :visible.sync="centerDialogVisible" width="640px" center append-to-body>
      <div class="redpack_container">
        <div class="redpack_top">
          <div class="redpack_money">
            <span class="redpack_money_label">红包金额:</span>
            <div class="redpack_money_value">
              <span class="money_rmb">¥</span>
              <input type="text" placeholder="请输入金额" :maxlength="10" class="redpack_money_input"
                v-model="sendData.total_amount" @blur="trimNum">
            </div>
          </div>
          <div class="redpack_count">
            <span class="redpack_count_label">账户余额:</span>
            <span class="redpack_count_value">{{`¥ ${balance}`}}</span>
          </div>
        </div>
        <div class="redpack_content">
          <div class="img_box">
            <img :src="defaultUrl" alt="" class="redpack_img">
            <div class="shop_name">
              <el-input style="height:30px; width: 220px; font-size: 12px" placeholder="商家名称" :maxlength="10"
                v-model="sendData.send_name"></el-input>
              <span class="shop_name_num">{{ sendData.send_name.length }}/10</span>
            </div>
            <div class="blessing_talk">
              <el-input type="textarea" :rows="3" style="width: 220px; font-size: 12px" :maxlength="20"
                placeholder="留下祝福的话语吧~" v-model="sendData.wishing">
              </el-input>
              <span class="blessing_num">{{ sendData.wishing.length }}/20</span>
            </div>
          </div>
          <div class="active_form">
            <div class="active_name">
              <span class="active_name_label">活动标题</span>
              <el-input class="active_name_value" placeholder="红包任务名称" style="width: 254px; font-size: 12px;"
                :maxlength="10" v-model="sendData.act_name"></el-input>
              <span class="active_name_num">{{ sendData.act_name.length }}/10</span>
            </div>
            <div class="message_prew">
              <div class="message_prew_title">消息预览</div>
              <div class="message_prew_content">
                <div class="prew_content_title">
                  <img :src="headerUrl" alt="" style="width: 24px; height: 24px; border-radius: 50%;" />
                  <span class="prew_title_label">推小宝</span>
                </div>
                <div class="prew_content_top">你收到一个现金红包</div>
                <div class="prew_content_date">{{nowDate.month}}月{{nowDate.day}}日</div>
                <div class="prew_content_desc">
                  你参与<span class="gray_name">{{ sendData.act_name }}</span>，成功获得<span class="gray_name"
                    style="margin-right: 3px;">{{ sendData.send_name }}</span>赠送的红包，点击消息打开，一起抢红包、拼手气吧！<br>点击消息拆开红包即可获得现金
                </div>
                <div class="prew_content_detail">详情</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendForm">确定</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import api from 'api'

export default {
  name: 'redpack-dialog',
  data() {
    return {
      headerUrl: require('../assets/images/redpack-header.png'),
      defaultUrl: require('../assets/images/redpack-bg.png'),
      centerDialogVisible: false,
      balance: 0,
      isCom: true,
      sendData: {
        receive_user_id: 0,
        re_openid: 0,
        total_amount: '',
        wishing: '',
        act_name: '',
        remark: '',
        send_name: ''
      }
    }
  },
  methods: {
    open(receive_user_id, re_openid) {
      let businessId = 0
      if (typeof this.$store.state.login.userInfo === 'object') {
        businessId = this.$store.state.login.userInfo.userUuid
      } else {
        businessId = JSON.parse(this.$store.state.login.userInfo).userUuid
      }
      api.request('getAccountDetail', {
        id: businessId
      }, result => {
        this.balance = result.data.balance
      })
      this.sendData.receive_user_id = receive_user_id
      this.sendData.re_openid = re_openid
      this.centerDialogVisible = true
      console.log(2)
    },
    close() {
      this.isCom = true
      this.sendData = {
        receive_user_id: 0,
        re_openid: 0,
        total_amount: '',
        wishing: '',
        act_name: '',
        remark: '',
        send_name: ''
      }
      this.centerDialogVisible = false
    },
    errorToast(message) {
      this.$message({
        message,
        type: 'warning'
      })
      this.isCom = false
    },
    // 格式化输入框
    trimNum() {
      this.sendData.total_amount = this.sendData.total_amount.replace(/[^(\d).]/g, '')
    },
    sendForm() {
      this.isCom = true
      if (!this.sendData.total_amount && this.sendData.total_amount < 0.01) {
        this.errorToast('请填写红包金额且红包金额不能少于1分钱')
      } else if (!!this.sendData.total_amount && Number(this.sendData.total_amount) > this.balance) {
        this.errorToast('红包金额不能大于商家余额')
      } else if (this.sendData.total_amount < 0.3 || this.sendData.total_amount > 499) {
        this.errorToast('每个红包的平均金额必须在0.30元到499元之间')
      } else if (!this.sendData.send_name) {
        this.errorToast('请填写商家名称')
      } else if (!this.sendData.wishing) {
        this.errorToast('请填写祝福语')
      } else if (!this.sendData.act_name) {
        this.errorToast('请填写活动标题')
      }
      if (this.isCom) {
        this.sendData.total_amount = Number(this.sendData.total_amount)
        api.request('sendRedpack', this.sendData, result => {
          if (result.data.code === 200) {
            this.$message({
              type: 'success',
              message: '发送成功'
            })
            this.close()
          } else {
            this.$message({
              type: 'warning',
              message: result.data.message
            })
          }
        })
      }
    }
  },
  computed: {
    nowDate() {
      let nowTime = new Date()
      return {
        month: nowTime.getMonth() + 1,
        day: nowTime.getDate()
      }
    }
  }
}
</script>
<style scoped>
.redpack_container .redpack_content .el-input__inner {
  height: 30px;
  line-height: 30px;
  padding-right: 40px;
}
</style>
<style scoped>
.redpack_container {
  min-height: 450px;
  font-size: 12px;
  color: #3c4a55;
  position: relative;
}
.el-dialog__wrapper >>>.el-dialog__headerbtn {
  width: 40px;
  height: 40px;
  background: #fa766b;
  display: inline-block;
  right: 0;
  top: 0;
  position: absolute;
}
.el-dialog__wrapper >>> .el-dialog__headerbtn > i {
  color: #ffffff;
}
.dialog-footer {
  margin-top: 30px;
}
.redpack_top {
  padding-left: 30px;
  display: flex;
  align-items: center;
}
.redpack_money {
  margin-right: 20px;
  display: flex;
  align-items: center;
}
.redpack_money_label {
  margin-right: 5px;
}
/* 输入框 */
.redpack_money_value {
  width: 100px;
  height: 30px;
  padding: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #e3e6eb;
}
.money_rmb {
  font-size: 12px;
  color: #fa766b;
  margin-right: 5px;
}
.redpack_money_input {
  font-size: 12px;
  width: 70px;
  height: 18px;
  color: #fa766b;
}
/* 账户余额 */
.redpack_count_label {
  margin-right: 5px;
}
.redpack_count_value {
  color: #fa766b;
}
.redpack_content {
  display: flex;
  background: #f7fbfc;
  width: 624px;
  height: 427px;
  padding-top: 20px;
  align-items: flex-start;
  position: absolute;
  left: -20px;
  top: 50px;
  padding-left: 20px;
}
.message_prew {
  text-align: left;
}
/* 红包 */
.img_box {
  width: 250px;
  height: 376px;
  position: relative;
  padding-top: 88px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
}
.redpack_img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
/* 红包输入框 */
.shop_name {
  position: relative;
  width: 220px;
  margin-bottom: 50px;
}
.shop_name_num {
  position: absolute;
  top: 7px;
  right: 7px;
}
.shop_name >>> .el-input__inner{
  height: 30px;
}
.blessing_talk {
  position: relative;
  width: 220px;
  z-index: 999;
}
.blessing_num {
  position: absolute;
  bottom: 9px;
  right: 7px;
}
/* 活动标题 */
.active_name {
  position: relative;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.active_name_label {
  margin-right: 8px;
}
.active_name_num {
  position: absolute;
  top: 7px;
  right: 7px;
}
/* 消息预览 */
.message_prew_title {
  margin-bottom: 10px;
}
.message_prew_content {
  width: 310px;
  min-height: 280px;
  padding: 10px 10px 15px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid rgba(227, 230, 235, 1);
}
.prew_content_title {
  padding-bottom: 7px;
  border-bottom: 1px solid rgb(227, 230, 235);
  margin-bottom: 17px;
}
.prew_title_label {
  color: #999;
}
.prew_content_top {
  margin-bottom: 4px;
}
.prew_content_date {
  margin-bottom: 58px;
}
.prew_content_desc {
  width: 280px;
  font-size: 14px;
  padding-bottom: 18px;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(227, 230, 235, 1);
}
.gray_name {
  color: #b1bfcd;
}
.prew_content_detail {
  color: #b1bfcd;
}
.active_name_value {
  font-size: 12px;
}
</style>